package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.ApplyCouponRequest;
import com.ptprojects.eshopapi.dtos.ApplyCouponResponse;
import com.ptprojects.eshopapi.dtos.DiscountRequest;
import com.ptprojects.eshopapi.dtos.DiscountResponse;

import java.math.BigDecimal;
import java.util.List;

public interface DiscountService {

    List<DiscountResponse> getAllDiscounts();

    DiscountResponse createDiscount(DiscountRequest request);

    void deleteDiscount(Long id);

    DiscountResponse toggleActive(Long id);

    ApplyCouponResponse applyCoupon(ApplyCouponRequest request);

    BigDecimal calculateDiscount(String couponCode, BigDecimal cartTotal);

    void redeemCoupon(String couponCode);
}
