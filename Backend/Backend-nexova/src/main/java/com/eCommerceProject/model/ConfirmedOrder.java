package com.eCommerceProject.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "CONFIRMED_ORDER")
public class ConfirmedOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "orderNumber", unique = true)
    private Long orderNumber;

    @Column(name = "productName")
    private String productName;

    @Column(name = "productBrand")
    private String productBrand;

    @Column(name = "productDetails")
    private String productDetails;

    @Column(name = "productPrice")
    private double productPrice;

    @Column(name = "productImageUrl")
    private String productImageUrl;

    @Column(name = "paymentStatus")
    private String paymentStatus = "MOCK_SUCCESS";

    @Column(name = "orderDate")
    private Date orderDate;

    // CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    @Column(name = "orderStatus")
    private String orderStatus = "CONFIRMED";

    // home or pickup
    @Column(name = "deliveryType")
    private String deliveryType = "home";


    @Column(name = "estimatedDelivery")
    private Date estimatedDelivery;

    //  last email sent date (for 2-day email scheduler)
    @Column(name = "lastEmailSentDate")
    private Date lastEmailSentDate;

    // customer contact info
    @Column(name = "customerEmail")
    private String customerEmail;

    @Column(name = "customerMobile")
    private String customerMobile;

    @Column(name = "deliveryPincode")
    private String deliveryPincode;

    @Column(name = "deliveryAddress")
    private String deliveryAddress;

    @OneToOne
    private Address address;

    @ManyToOne
    private Seller seller;

    @ManyToOne
    private User user;
}
