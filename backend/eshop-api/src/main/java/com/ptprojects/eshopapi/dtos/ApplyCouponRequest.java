package com.ptprojects.eshopapi.dtos;

import java.math.BigDecimal;

public class ApplyCouponRequest {

    private String code;
    private BigDecimal cartTotal;

    public ApplyCouponRequest() {
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getCartTotal() { return cartTotal; }
    public void setCartTotal(BigDecimal cartTotal) { this.cartTotal = cartTotal; }
}
