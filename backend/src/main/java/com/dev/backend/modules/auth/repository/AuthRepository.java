package com.dev.backend.modules.auth.repository;

import com.dev.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);


    Optional<User> findById(Long id);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);
}
