package com.ptprojects.eshopapi.dtos;

import java.math.BigDecimal;

public class ApplyCouponResponse {

    private String code;
    private BigDecimal discountAmount;
    private BigDecimal finalTotal;

    public ApplyCouponResponse() {
    }

    public ApplyCouponResponse(String code, BigDecimal discountAmount, BigDecimal finalTotal) {
        this.code = code;
        this.discountAmount = discountAmount;
        this.finalTotal = finalTotal;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalTotal() { return finalTotal; }
    public void setFinalTotal(BigDecimal finalTotal) { this.finalTotal = finalTotal; }
}
