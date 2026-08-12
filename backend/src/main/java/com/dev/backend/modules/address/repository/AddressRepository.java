package com.dev.backend.modules.address.repository;

import com.dev.backend.modules.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("""
                SELECT a
                FROM Address a
                WHERE a.user.id = :userId
            """)
    List<Address> findByUserId(Long userId);

    @Query("""
                SELECT COUNT(a)
                FROM Address a
                WHERE a.user.id = :userId
            """)
    int countByUserId(@Param("userId") Long userId);

    @Query("""
                SELECT a
                FROM Address a
                WHERE  a.id = :id
                AND a.user.id = :userId
            """)
    Optional<Address> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Modifying
    @Query("""
                UPDATE Address a
                SET a.defaultAddress = false
                WHERE a.user.id = :userId
            """)
    void resetDefaultAddress(@Param("userId") Long userId);
}
