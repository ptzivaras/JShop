package com.ptprojects.eshopapi.service.impl;

import com.ptprojects.eshopapi.domain.Address;
import com.ptprojects.eshopapi.domain.User;
import com.ptprojects.eshopapi.dtos.AddressRequest;
import com.ptprojects.eshopapi.dtos.AddressResponse;
import com.ptprojects.eshopapi.repository.AddressRepository;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AddressResponse> getAddressesForUser(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (request.isDefault()) {
            clearExistingDefault(userId);
        }

        Address address = new Address();
        address.setUser(user);
        mapFromRequest(address, request);

        // first address is always default
        boolean hasAny = !addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).isEmpty();
        if (!hasAny) {
            address.setDefault(true);
        }

        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (request.isDefault() && !address.isDefault()) {
            clearExistingDefault(userId);
        }

        mapFromRequest(address, request);
        return mapToResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepository.delete(address);

        // if deleted was default, promote the next most recent one
        if (address.isDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                    .stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setDefault(true);
                        addressRepository.save(next);
                    });
        }
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        clearExistingDefault(userId);
        address.setDefault(true);
        return mapToResponse(addressRepository.save(address));
    }

    private void clearExistingDefault(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(existing -> {
            existing.setDefault(false);
            addressRepository.save(existing);
        });
    }

    private void mapFromRequest(Address address, AddressRequest request) {
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setFullName(address.getFullName());
        response.setPhone(address.getPhone());
        response.setStreet(address.getStreet());
        response.setCity(address.getCity());
        response.setPostalCode(address.getPostalCode());
        response.setCountry(address.getCountry());
        response.setDefault(address.isDefault());
        response.setCreatedAt(address.getCreatedAt());
        return response;
    }
}
