package com.dev.backend.modules.user.service;

import com.dev.backend.modules.user.dto.UserRequest;
import com.dev.backend.modules.user.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);
    UserResponse getUserByEmail(String email);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);


    void insertData();
}
