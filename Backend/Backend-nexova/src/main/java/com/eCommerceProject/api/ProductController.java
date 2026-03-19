package com.eCommerceProject.api;

import com.eCommerceProject.request.CampaignCreateRequest;
import com.eCommerceProject.request.ConfirmCartRequest;
import com.eCommerceProject.request.PriceIncreaseRequest;
import com.eCommerceProject.request.ProductDetailsUpdateRequest;
import com.eCommerceProject.service.product.ProductService;
import com.eCommerceProject.dto.createDto.ProductCreateDto;
import com.eCommerceProject.dto.viewDto.ProductViewDto;
import com.eCommerceProject.model.ConfirmedOrder;
import com.eCommerceProject.model.Product;
import com.eCommerceProject.service.product.UpdateProductPriceService;
import com.eCommerceProject.shared.ECommerceMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;
    private final UpdateProductPriceService updateProductPriceService;

    @PostMapping("add")
    public ResponseEntity<?> add(@RequestBody @Valid ProductCreateDto productCreateDto) {
        this.productService.add(productCreateDto);
        return ResponseEntity.ok(ECommerceMessage.PRODUCT_SAVED);
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("getAll")
    public ResponseEntity<?> getAll() {
        final List<Product> products = productService.getAll();
        if (products.isEmpty()) {
            return ResponseEntity.ok(ECommerceMessage.PRODUCT_NOT_FOUND);
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("getByProductName/{productName}")
    public ResponseEntity<?> getByproductName(@PathVariable String productName) {
        List<Product> products = this.productService.getByproductName(productName);
        if (products == null || products.isEmpty()) {
            return ResponseEntity.ok(ECommerceMessage.NOT_FOUND_THIS_NAME);
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("getByProductBrand/{productBrand}")
    public ResponseEntity<?> getByproductBrand(@PathVariable String productBrand) {
        return ResponseEntity.ok(this.productService.getByproductBrand(productBrand));
    }

    @GetMapping("slice")
    public ResponseEntity<List<Product>> slice(Pageable pageable) {
        return ResponseEntity.ok(this.productService.slice(pageable));
    }

    @DeleteMapping("deleteById/{id}")
    public ResponseEntity<?> deleteByid(@PathVariable int id) {
        this.productService.deleteById(id);
        return ResponseEntity.ok(ECommerceMessage.PRODUCT_DELETED);
    }

    @GetMapping("getDto")
    public ResponseEntity<?> getDto() {
        List<ProductViewDto> products = this.productService.getDto();
        if (products.isEmpty()) {
            return ResponseEntity.ok(ECommerceMessage.PRODUCT_NOT_FOUND);
        }
        return ResponseEntity.ok(products);
    }

    @PostMapping("addToCart/{id}")
    public ResponseEntity<?> addToCart(@PathVariable int id) {
        productService.addToCart(id);
        return ResponseEntity.ok(ECommerceMessage.ADD_TO_CART);
    }

    @GetMapping("getCart")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(productService.getCart());
    }

    @DeleteMapping("removeFromCart/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable int id) {
        productService.removeFromCart(id);
        return ResponseEntity.ok(ECommerceMessage.REMOVE_FROM_CART);
    }

    @GetMapping("searchByProduct/{productName}")
    public ResponseEntity<?> searchByProduct(@PathVariable String productName) {
        Map<Integer, Object> result = productService.searchByProduct(productName);
        if (result == null) {
            return ResponseEntity.ok(ECommerceMessage.NOT_FOUND_THIS_NAME);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("confirmCart")
    public ResponseEntity<?> confirmCart(@RequestBody ConfirmCartRequest confirmCartRequest) {
        ConfirmedOrder order = productService.confirmCart(confirmCartRequest);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ECommerceMessage.PAYMENT_FAILED);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("message",       ECommerceMessage.ITEMS_IN_THE_CART_HAVE_BEEN_PURCHASED);
        response.put("orderId",        order.getId());
        response.put("orderNumber",    order.getOrderNumber());
        response.put("paymentStatus",  order.getPaymentStatus());
        response.put("orderStatus",    order.getOrderStatus());
        response.put("totalAmount",    order.getProductPrice());
        response.put("deliveryType",   order.getDeliveryType());
        return ResponseEntity.ok(response);
    }

    @GetMapping("getAllConfirmedCart")
    public ResponseEntity<?> getAllConfirmedOrder() {
        return ResponseEntity.ok(productService.getAllConfirmedOrder());
    }

    @GetMapping("getConfirmedOrderById/{id}")
    public ResponseEntity<?> getConfirmedOrderById(@PathVariable int id) {
        return ResponseEntity.ok(productService.getConfirmedOrderById(id));
    }

    @GetMapping("getConfirmedOrderByOrderNumber/{orderNumber}")
    public ResponseEntity<?> getConfirmedOrderByOrderNumber(@PathVariable Long orderNumber) {
        return ResponseEntity.ok(productService.getConfirmedOrderByOrderNumber(orderNumber));
    }

    // NEW: Update order status (CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
    @PutMapping("updateOrderStatus/{orderNumber}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderNumber,
            @RequestParam String status) {
        ConfirmedOrder order = productService.getConfirmedOrderByOrderNumber(orderNumber);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        List<String> validStatuses = List.of("CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED");
        if (!validStatuses.contains(status.toUpperCase())) {
            return ResponseEntity.badRequest().body("Invalid status. Use: CONFIRMED, PROCESSING, SHIPPED, DELIVERED");
        }
        order.setOrderStatus(status.toUpperCase());
        Map<String, Object> res = new HashMap<>();
        res.put("orderNumber", order.getOrderNumber());
        res.put("orderStatus", order.getOrderStatus());
        res.put("message", "Order status updated to " + status.toUpperCase());
        return ResponseEntity.ok(res);
    }

    @PutMapping("createCampaign")
    public ResponseEntity<?> createCampaign(@RequestBody CampaignCreateRequest campaignCreateRequest) {
        updateProductPriceService.createCampaign(campaignCreateRequest);
        return ResponseEntity.ok("Campaign created successfully");
    }

    @PutMapping("priceIncrease")
    public ResponseEntity<?> priceIncrease(@RequestBody PriceIncreaseRequest priceIncreaseRequest) {
        updateProductPriceService.priceIncrease(priceIncreaseRequest);
        return ResponseEntity.ok("Price updated successfully");
    }

    @PutMapping("update-product-details")
    public ResponseEntity<?> updateByProductDetails(@RequestBody ProductDetailsUpdateRequest updateRequest) {
        productService.updateByProductDetails(updateRequest.getProductId(), updateRequest.getProductDetails());
        return ResponseEntity.ok("Product details updated");
    }

    @PutMapping("addFavorite/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable int productId) {
        productService.addFavorite(productId);
        return ResponseEntity.ok(ECommerceMessage.ADDED_TO_FAVORITES);
    }

    @GetMapping("getNumberOfFavorite/{productId}")
    public ResponseEntity<?> getNumberOfFavorite(@PathVariable int productId) {
        return ResponseEntity.ok(productService.getNumberOfFavorite(productId));
    }

    @PutMapping("removeFromFavorite/{productId}")
    public ResponseEntity<?> removeFromFavorite(@PathVariable int productId) {
        productService.removeFromFavorites(productId);
        return ResponseEntity.ok(ECommerceMessage.REMOVE_FROM_FAVORITES);
    }
    @DeleteMapping("cancelOrder/{orderNumber}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderNumber) {
        try {
            ConfirmedOrder order = productService.cancelOrder(orderNumber);
            Map<String, Object> res = new HashMap<>();
            res.put("message", "Order cancelled successfully.");
            res.put("orderNumber", order.getOrderNumber());
            res.put("orderStatus", order.getOrderStatus());
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
