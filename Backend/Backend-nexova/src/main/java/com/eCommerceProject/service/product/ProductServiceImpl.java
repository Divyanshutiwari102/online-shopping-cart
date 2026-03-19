package com.eCommerceProject.service.product;

import com.eCommerceProject.exception.NotFoundException;
import com.eCommerceProject.model.*;
import com.eCommerceProject.repository.*;
import com.eCommerceProject.dto.createDto.ProductCreateDto;
import com.eCommerceProject.dto.viewDto.ProductViewDto;
import com.eCommerceProject.request.ConfirmCartRequest;
import com.eCommerceProject.service.SendEmailService;
import com.eCommerceProject.service.cart.CartService;
import com.eCommerceProject.service.CreditCardService;
import com.eCommerceProject.shared.ECommerceMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CartService cartService;
    private final CreditCardService creditCardService;
    private final ConfirmedOrderRepository confirmedOrderRepository;
    private final PromoCodeRepository promoCodeRepository;
    private final SendEmailService sendEmailService;

    private static final SimpleDateFormat SDF = new SimpleDateFormat("dd MMM yyyy");

    @Override
    public List<Product> getAll() { return productRepository.findAll(); }

    @Override
    public Product getById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("product not found: " + id));
    }

    @Override
    public ProductCreateDto add(ProductCreateDto dto) {
        productRepository.save(new Product(
                dto.getProductName(), dto.getProductBrand(), dto.getProductDetails(),
                dto.getProductPrice(), dto.getStock(), dto.getProductImageUrl()));
        return dto;
    }

    @Override
    public List<Product> getByproductName(String productName) {
        return productRepository.getByproductName(productName);
    }

    @Override
    public List<Product> getByproductBrand(String productBrand) {
        return productRepository.getByproductBrand(productBrand);
    }

    @Override
    public void deleteById(int id) { productRepository.deleteById(id); }

    @Override
    public void updateByProductDetails(int productId, String productDetails) {
        productRepository.findById(productId).ifPresent(p -> {
            p.setProductDetails(productDetails);
            productRepository.save(p);
        });
    }

    @Override
    public List<Product> slice(Pageable pageable) {
        return productRepository.findAll(pageable).stream().collect(Collectors.toList());
    }

    @Override
    public List<ProductViewDto> getDto() {
        return productRepository.findAll().stream().map(ProductViewDto::of).collect(Collectors.toList());
    }

    @Override
    public Cart addToCart(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("product not found: " + id));
        Cart cart = new Cart();
        cart.setId(product.getId());
        cart.setProductBrand(product.getProductBrand());
        cart.setProductName(product.getProductName());
        cart.setProductDetails(product.getProductDetails());
        cart.setProductPrice(product.getProductPrice());
        cart.setProductImageUrl(product.getProductImageUrl());
        cart.setSeller(product.getSeller());
        cart.setQuantity(1);
        product.setStock(product.getStock() - 1);
        if (product.getStock() == 0) productRepository.deleteById(product.getId());
        else productRepository.save(product);
        cartService.add(cart);
        return cart;
    }

    @Override
    public List<Cart> getCart() { return cartService.getAll(); }

    @Override
    public void removeFromCart(int id) {
        Cart cart = cartService.getById(id);
        cartService.deleteById(cart.getId());
    }

    @Override
    public ConfirmedOrder confirmCart(ConfirmCartRequest req) {
        Optional<Cart> cartOpt = Optional.ofNullable(cartService.getById(req.getId()));
        if (cartOpt.isEmpty()) return null;

        Cart cart = cartOpt.get();
        Optional<PromoCode> code = promoCodeRepository.findPromoCodeByCode(req.getPromoCode());

        Date now = new Date();
        // Estimated delivery = 7 days from now
        Date estimatedDelivery = new Date(now.getTime() + 7L * 24 * 60 * 60 * 1000);

        ConfirmedOrder order = new ConfirmedOrder();
        order.setProductBrand(cart.getProductBrand());
        order.setProductDetails(cart.getProductDetails());
        order.setProductName(cart.getProductName());
        order.setProductImageUrl(cart.getProductImageUrl());
        order.setSeller(cart.getSeller());
        order.setOrderDate(now);
        order.setOrderStatus("CONFIRMED");
        order.setPaymentStatus("MOCK_SUCCESS");
        order.setOrderNumber(System.currentTimeMillis());
        order.setDeliveryType(req.getDeliveryType() != null ? req.getDeliveryType() : "home");
        order.setEstimatedDelivery(estimatedDelivery);
        order.setLastEmailSentDate(now);

        // Save customer contact info
        order.setCustomerEmail(req.getCustomerEmail());
        order.setCustomerMobile(req.getCustomerMobile());
        order.setDeliveryPincode(req.getDeliveryPincode());
        order.setDeliveryAddress(req.getDeliveryAddress());

        if (code.isPresent()) {
            order.setProductPrice(cart.getProductPrice() - code.get().getAmount());
            promoCodeRepository.deleteById(code.get().getId());
        } else {
            order.setProductPrice(cart.getProductPrice());
        }

        CreditCard creditCard = new CreditCard(
                req.getCardNumber(), req.getCvv(), req.getExpirationDate(), req.getNameAndSurname());
        creditCardService.add(creditCard);

        confirmedOrderRepository.save(order);
        cartService.deleteById(cart.getId());

        // Send order placed email
        if (req.getCustomerEmail() != null && !req.getCustomerEmail().isEmpty()) {
            try {
                sendEmailService.sendEmails(
                        req.getCustomerEmail(),
                        ECommerceMessage.orderPlacedBody(
                                cart.getProductName(),
                                order.getOrderNumber(),
                                SDF.format(estimatedDelivery),
                                req.getDeliveryPincode() != null ? req.getDeliveryPincode() : "N/A",
                                req.getCustomerMobile() != null ? req.getCustomerMobile() : "N/A"
                        ),
                        ECommerceMessage.ORDER_PLACED_TOPIC
                );
            } catch (Exception e) {
                log.error("Order email failed: {}", e.getMessage());
            }
        }

        return order;
    }

    @Override
    public List<ConfirmedOrder> getAllConfirmedOrder() {
        return confirmedOrderRepository.findAll();
    }

    @Override
    public ConfirmedOrder getConfirmedOrderById(int id) {
        return confirmedOrderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("order not found: " + id));
    }

    @Override
    public ConfirmedOrder getConfirmedOrderByOrderNumber(Long orderNumber) {
        return confirmedOrderRepository.findConfirmedOrderByOrderNumber(orderNumber);
    }

    @Override
    public Map<Integer, Object> searchByProduct(String productName) {
        Map<Integer, Object> result = new HashMap<>();
        List<Product> matched = productRepository.findAll().stream()
                .filter(p -> p.getProductName().toLowerCase().contains(productName.toLowerCase()))
                .collect(Collectors.toList());
        if (!matched.isEmpty()) { result.put(matched.size(), matched); return result; }
        return null;
    }

    @Override
    public void addFavorite(int productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("product not found: " + productId));
        p.setFavoriteNumber(p.getFavoriteNumber() + 1);
        productRepository.save(p);
    }

    @Override
    public int getNumberOfFavorite(int productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("product not found: " + productId))
                .getFavoriteNumber();
    }

    @Override
    public void removeFromFavorites(int productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("product not found: " + productId));
        p.setFavoriteNumber(Math.max(0, p.getFavoriteNumber() - 1));
        productRepository.save(p);
    }
    @Override
    public ConfirmedOrder cancelOrder(Long orderNumber) {
        ConfirmedOrder order = confirmedOrderRepository.findConfirmedOrderByOrderNumber(orderNumber);
        if (order == null) throw new NotFoundException("Order not found: " + orderNumber);
        if ("DELIVERED".equals(order.getOrderStatus())) throw new RuntimeException("Cannot cancel a delivered order.");
        if ("CANCELLED".equals(order.getOrderStatus())) throw new RuntimeException("Already cancelled.");

        order.setOrderStatus("CANCELLED");
        confirmedOrderRepository.save(order);

        // Stock restore
        List<Product> matched = productRepository.findAll().stream()
                .filter(p -> p.getProductName() != null && p.getProductName().equalsIgnoreCase(order.getProductName()))
                .collect(Collectors.toList());

        if (!matched.isEmpty()) {
            Product p = matched.get(0);
            p.setStock(p.getStock() + 1);
            productRepository.save(p);
        } else {
            Product restored = new Product(order.getProductName(), order.getProductBrand(),
                    order.getProductDetails(), order.getProductPrice(), 1, order.getProductImageUrl());
            if (order.getSeller() != null) restored.setSeller(order.getSeller());
            productRepository.save(restored);
        }

        // Cancel email
        if (order.getCustomerEmail() != null && !order.getCustomerEmail().isEmpty()) {
            try {
                sendEmailService.sendEmails(order.getCustomerEmail(),
                        ECommerceMessage.orderCancelledBody(order.getProductName(), order.getOrderNumber()),
                        ECommerceMessage.ORDER_CANCELLED_TOPIC);
            } catch (Exception e) { log.error("Cancel email failed: {}", e.getMessage()); }
        }
        return order;
    }
}
