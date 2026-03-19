package com.eCommerceProject.service.scheduler;

import com.eCommerceProject.model.ConfirmedOrder;
import com.eCommerceProject.repository.ConfirmedOrderRepository;
import com.eCommerceProject.service.SendEmailService;
import com.eCommerceProject.shared.ECommerceMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliverySchedulerService {

    private final ConfirmedOrderRepository confirmedOrderRepository;
    private final SendEmailService sendEmailService;

    private static final long TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000L;
    private static final SimpleDateFormat SDF = new SimpleDateFormat("dd MMM yyyy");

    // Runs every 6 hours — checks if any order needs status update
    @Scheduled(fixedRate = 6 * 60 * 60 * 1000)
    public void processDeliveryUpdates() {
        log.info("Running delivery status scheduler...");
        List<ConfirmedOrder> orders = confirmedOrderRepository.findAll();
        Date now = new Date();

        for (ConfirmedOrder order : orders) {
            // Skip already delivered orders
            if ("DELIVERED".equals(order.getOrderStatus())) continue;
            // Skip store pickup
            if ("pickup".equals(order.getDeliveryType())) continue;
            // Skip orders without email
            if (order.getCustomerEmail() == null || order.getCustomerEmail().isEmpty()) continue;

            Date lastEmail = order.getLastEmailSentDate();
            Date orderDate = order.getOrderDate();
            if (orderDate == null) continue;

            long daysSinceOrder    = (now.getTime() - orderDate.getTime()) / (24 * 60 * 60 * 1000L);
            long daysSinceLastEmail = lastEmail == null
                    ? daysSinceOrder
                    : (now.getTime() - lastEmail.getTime()) / (24 * 60 * 60 * 1000L);

            // Only act every 2 days
            if (daysSinceLastEmail < 2) continue;

            String nextStatus = getNextStatus(order.getOrderStatus(), daysSinceOrder);
            if (nextStatus == null) continue;

            order.setOrderStatus(nextStatus);
            order.setLastEmailSentDate(now);
            confirmedOrderRepository.save(order);

            // Send status update email
            try {
                String estDate = order.getEstimatedDelivery() != null
                        ? SDF.format(order.getEstimatedDelivery()) : "Soon";

                sendEmailService.sendEmails(
                        order.getCustomerEmail(),
                        ECommerceMessage.statusUpdateBody(
                                order.getProductName(),
                                order.getOrderNumber(),
                                nextStatus,
                                estDate
                        ),
                        ECommerceMessage.statusUpdateTopic(nextStatus)
                );
                log.info("Status email sent for order #{} → {}", order.getOrderNumber(), nextStatus);
            } catch (Exception e) {
                log.error("Email failed for order #{}: {}", order.getOrderNumber(), e.getMessage());
            }
        }
    }

    // CONFIRMED → PROCESSING (day 0-2)
    // PROCESSING → SHIPPED   (day 2-4)
    // SHIPPED    → DELIVERED  (day 4+)
    private String getNextStatus(String current, long daysSinceOrder) {
        return switch (current) {
            case "CONFIRMED"  -> daysSinceOrder >= 2 ? "PROCESSING" : null;
            case "PROCESSING" -> daysSinceOrder >= 4 ? "SHIPPED"    : null;
            case "SHIPPED"    -> daysSinceOrder >= 6 ? "DELIVERED"  : null;
            default -> null;
        };
    }
}
