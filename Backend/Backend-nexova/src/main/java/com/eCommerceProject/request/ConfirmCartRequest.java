package com.eCommerceProject.request;

import lombok.Data;

@Data
public class ConfirmCartRequest {

    private int id;

    private String cardNumber;

    private int cvv;

    private String expirationDate;

    private String nameAndSurname;

    private String promoCode;

    // "home" or "pickup"
    private String deliveryType = "home";

    //  customer contact
    private String customerEmail;

    private String customerMobile;

    private String deliveryPincode;

    private String deliveryAddress;
}
