package com.eCommerceProject.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ADDRESS")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "apartmentNumber")
    private int apartmentNumber;

    @Column(name = "street")
    private String street;


    @Column(name = "pincode")
    private String pincode;


    @Column(name = "mobileNumber")
    private String mobileNumber;

    @ManyToOne
    private User user;
}
