package com.dev.backend.modules.publisher.repository;

import com.dev.backend.modules.publisher.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    Optional<Publisher> findByName(String name);

    @Query("SELECT COUNT(p)>0 FROM Publisher p WHERE p.name = :name")
    boolean existsByName(@Param("name") String name);
}
