package com.ptprojects.eshopapi.service;

import com.ptprojects.eshopapi.dtos.UserRequest;
import com.ptprojects.eshopapi.dtos.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserRequest request);
}
