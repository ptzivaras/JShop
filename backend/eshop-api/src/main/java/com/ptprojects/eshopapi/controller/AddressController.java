package com.ptprojects.eshopapi.controller;

import com.ptprojects.eshopapi.dtos.AddressRequest;
import com.ptprojects.eshopapi.dtos.AddressResponse;
import com.ptprojects.eshopapi.repository.UserRepository;
import com.ptprojects.eshopapi.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                .getId();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<AddressResponse>> getMyAddresses(Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(addressService.getAddressesForUser(userId));
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<AddressResponse> addAddress(@RequestBody AddressRequest request,
                                                      Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(addressService.addAddress(userId, request));
    }

    @PutMapping("/me/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<AddressResponse> updateAddress(@PathVariable Long id,
                                                         @RequestBody AddressRequest request,
                                                         Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(addressService.updateAddress(userId, id, request));
    }

    @DeleteMapping("/me/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        addressService.deleteAddress(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/{id}/default")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<AddressResponse> setDefault(@PathVariable Long id, Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(addressService.setDefaultAddress(userId, id));
    }
}
