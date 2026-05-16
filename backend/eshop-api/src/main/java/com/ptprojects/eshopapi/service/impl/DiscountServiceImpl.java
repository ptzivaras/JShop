package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.Discount;
import com.ptprojects.eshopapi.domain.DiscountType;
import com.ptprojects.eshopapi.dtos.ApplyCouponRequest;
import com.ptprojects.eshopapi.dtos.ApplyCouponResponse;
import com.ptprojects.eshopapi.dtos.DiscountRequest;
import com.ptprojects.eshopapi.dtos.DiscountResponse;
import com.ptprojects.eshopapi.repository.DiscountRepository;
import com.ptprojects.eshopapi.service.DiscountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DiscountResponse createDiscount(DiscountRequest request) {
        discountRepository.findByCode(request.getCode().toUpperCase()).ifPresent(d -> {
            throw new IllegalStateException("Coupon code already exists: " + request.getCode());
        });

        Discount discount = new Discount();
        discount.setCode(request.getCode().toUpperCase());
        discount.setDiscountType(request.getDiscountType());
        discount.setDiscountValue(request.getDiscountValue());
        discount.setMinOrderValue(request.getMinOrderValue());
        discount.setMaxUses(request.getMaxUses());
        discount.setExpiresAt(request.getExpiresAt());
        discount.setActive(request.isActive());

        return mapToResponse(discountRepository.save(discount));
    }

    @Override
    public void deleteDiscount(Long id) {
        discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        discountRepository.deleteById(id);
    }

    @Override
    @Transactional
    public DiscountResponse toggleActive(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        discount.setActive(!discount.isActive());
        return mapToResponse(discountRepository.save(discount));
    }

    @Override
    public ApplyCouponResponse applyCoupon(ApplyCouponRequest request) {
        BigDecimal discountAmount = calculateDiscount(request.getCode(), request.getCartTotal());
        BigDecimal finalTotal = request.getCartTotal().subtract(discountAmount).max(BigDecimal.ZERO);
        return new ApplyCouponResponse(request.getCode().toUpperCase(), discountAmount, finalTotal);
    }

    @Override
    public BigDecimal calculateDiscount(String couponCode, BigDecimal cartTotal) {
        if (couponCode == null || couponCode.isBlank()) return BigDecimal.ZERO;

        Discount discount = discountRepository.findByCode(couponCode.toUpperCase())
                .orElseThrow(() -> new IllegalStateException("Invalid coupon code: " + couponCode));

        if (!discount.isActive()) {
            throw new IllegalStateException("This coupon is no longer active.");
        }
        if (discount.getExpiresAt() != null && discount.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("This coupon has expired.");
        }
        if (discount.getMaxUses() != null && discount.getUsedCount() >= discount.getMaxUses()) {
            throw new IllegalStateException("This coupon has reached its usage limit.");
        }
        if (discount.getMinOrderValue() != null && cartTotal.compareTo(discount.getMinOrderValue()) < 0) {
            throw new IllegalStateException(
                "Minimum order value for this coupon is $" + discount.getMinOrderValue().setScale(2, RoundingMode.HALF_UP)
            );
        }

        if (discount.getDiscountType() == DiscountType.PERCENTAGE) {
            return cartTotal.multiply(discount.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            return discount.getDiscountValue().min(cartTotal);
        }
    }

    @Override
    @Transactional
    public void redeemCoupon(String couponCode) {
        if (couponCode == null || couponCode.isBlank()) return;
        discountRepository.findByCode(couponCode.toUpperCase()).ifPresent(discount -> {
            discount.setUsedCount(discount.getUsedCount() + 1);
            discountRepository.save(discount);
        });
    }

    private DiscountResponse mapToResponse(Discount discount) {
        DiscountResponse response = new DiscountResponse();
        response.setId(discount.getId());
        response.setCode(discount.getCode());
        response.setDiscountType(discount.getDiscountType());
        response.setDiscountValue(discount.getDiscountValue());
        response.setMinOrderValue(discount.getMinOrderValue());
        response.setMaxUses(discount.getMaxUses());
        response.setUsedCount(discount.getUsedCount());
        response.setExpiresAt(discount.getExpiresAt());
        response.setActive(discount.isActive());
        response.setCreatedAt(discount.getCreatedAt());
        return response;
    }
}
