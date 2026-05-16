package com.ptprojects.eshopapi.dtos;

public class CheckoutRequest {

    private String couponCode;

    public CheckoutRequest() {
    }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
}
