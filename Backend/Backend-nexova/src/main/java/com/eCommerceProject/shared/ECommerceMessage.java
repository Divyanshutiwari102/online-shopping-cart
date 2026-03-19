package com.eCommerceProject.shared;

public interface ECommerceMessage {

    String PRODUCT_NOT_FOUND = "Product Not Found!";
    String PRODUCT_DELETED = "Product Deleted";
    String PRODUCT_SAVED = "Product Saved";
    String NOT_FOUND_THIS_NAME = "No Product Found With This Name";
    String ADD_TO_CART = "Product Added To Cart";
    String REMOVE_FROM_CART = "Product Removed From Cart";
    String USER_CREATED = "User Created Successfully";
    String USERNAME_ALREADY_IN_USE = "Username Already In Use!";
    String EMAIL_ALREADY_IN_USE = "Email Already In Use!";

    String REGISTER_TOPIC = "Welcome To Nexova";
    String REGISTER_BODY = "We are happy to have you! Find great deals and discounts.";
    String REGISTER_TOPIC_EMOJI = "\uD83D\uDE0D";

    String LOGIN_TOPIC = "New Login Detected!";
    String LOGIN_BODY_PREFIX = "Login detected on your Nexova account. If this wasn't you, please change your password immediately.";

    String AUTH_DELETE_TOPIC = "We're Sorry To See You Go";
    String AUTH_DELETE_TOPIC_EMOJI = "\uD83D\uDE15";
    String AUTH_DELETE_BODY = "Your Nexova account has been deleted. Please let us know how we can improve.";

    String USER_DELETED = "User Deleted Successfully";
    String CATEGORY_NAME_ALREADY_IN_USE = "Category Name Already In Use!";
    String SELLER_SAVED = "Seller Saved Successfully";
    String SELLER_DELETED = "Seller Deleted Successfully";
    String SELLER_COMMENT_CREATED = "Seller Comment Created";
    String SELLER_COMMENT_DELETED = "Seller Comment Deleted";
    String PRODUCT_COMMENT_CREATED = "Product Comment Created";
    String PRODUCT_COMMENT_DELETED = "Product Comment Deleted";
    String ITEMS_IN_THE_CART_HAVE_BEEN_PURCHASED = "Payment Successful! Order Confirmed.";
    String ADDRESS_CREATED = "Address Created";
    String ADDRESS_DELETED = "Address Deleted";
    String ADDED_TO_FAVORITES = "Added To Favorites";
    String REMOVE_FROM_FAVORITES = "Removed From Favorites";

    String PAYMENT_SUCCESS = "Mock Payment Successful! Order ID: ";
    String PAYMENT_FAILED = "Payment Failed. Please try again.";

    // ── Order email templates ─────────────────────────────────────
    String ORDER_PLACED_TOPIC = "\uD83D\uDCE6 Order Confirmed - Nexova";

    static String orderPlacedBody(String productName, Long orderNumber, String estimatedDate, String pincode, String mobile) {
        return "Hi!\n\n"
                + "Your order has been confirmed on Nexova.\n\n"
                + "Order Details:\n"
                + "  Product    : " + productName + "\n"
                + "  Order No.  : #" + orderNumber + "\n"
                + "  Pincode    : " + pincode + "\n"
                + "  Mobile     : " + mobile + "\n"
                + "  Est. Delivery : " + estimatedDate + "\n\n"
                + "Track your order anytime from the app:\n"
                + "  -> Open Nexova -> Click 'Orders' -> Enter Order #" + orderNumber + "\n\n"
                + "Status will update every 2 days automatically.\n\n"
                + "Thank you for shopping with Nexova!";
    }

    // ── Auto tracking update emails ───────────────────────────────
    static String statusUpdateBody(String productName, Long orderNumber, String status, String estimatedDate) {
        String emoji = switch (status) {
            case "PROCESSING" -> "\u2699\uFE0F";
            case "SHIPPED"    -> "\uD83D\uDE9A";
            case "DELIVERED"  -> "\uD83C\uDFE0";
            default           -> "\uD83D\uDCE6";
        };
        String statusMsg = switch (status) {
            case "PROCESSING" -> "Your order is being processed and packed.";
            case "SHIPPED"    -> "Your order is out for delivery! Expected by " + estimatedDate + ".";
            case "DELIVERED"  -> "Your order has been delivered. Enjoy your purchase!";
            default           -> "Your order status has been updated.";
        };
        return "Hi!\n\n"
                + emoji + " Order Update: " + status + "\n\n"
                + "Product  : " + productName + "\n"
                + "Order No.: #" + orderNumber + "\n\n"
                + statusMsg + "\n\n"
                + "Track live in the app -> Orders -> #" + orderNumber + "\n\n"
                + "Thank you for shopping with Nexova!";
    }

    static String statusUpdateTopic(String status) {
        return switch (status) {
            case "PROCESSING" -> "\u2699\uFE0F Order Processing - Nexova";
            case "SHIPPED"    -> "\uD83D\uDE9A Your Order is On the Way! - Nexova";
            case "DELIVERED"  -> "\uD83C\uDFE0 Order Delivered - Nexova";
            default           -> "\uD83D\uDCE6 Order Update - Nexova";
        };
    }
    // Ye 2 cheezein add ki neeche existing code ke:
    String ORDER_CANCELLED_TOPIC = "❌ Order Cancelled - Nexova";

    static String orderCancelledBody(String productName, Long orderNumber) {
        return "Hi!\n\n"
                + "❌ Your order has been successfully cancelled.\n\n"
                + "Order Details:\n"
                + "  Product   : " + productName + "\n"
                + "  Order No. : #" + orderNumber + "\n\n"
                + "The item has been restocked...\n\n"
                + "Thank you for shopping with Nexova!";
    }
}
