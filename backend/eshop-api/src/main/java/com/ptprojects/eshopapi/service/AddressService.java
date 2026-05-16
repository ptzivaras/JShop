package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.AddressRequest;
import com.ptprojects.eshopapi.dtos.AddressResponse;

import java.util.List;

public interface AddressService {

    List<AddressResponse> getAddressesForUser(Long userId);

    AddressResponse addAddress(Long userId, AddressRequest request);

    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);

    void deleteAddress(Long userId, Long addressId);

    AddressResponse setDefaultAddress(Long userId, Long addressId);
}
