package com.dev.backend.modules.user.service;

import com.dev.backend.modules.auth.dto.RegisterUserRequest;
import com.dev.backend.modules.user.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse getUserByUsername(String username);

    UserResponse getUserByEmail(String email);

    void deleteUser(Long id);

    void insertData();

    void register(RegisterUserRequest request);
}
