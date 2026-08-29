package com.dev.backend.modules.publisher.repository;

import com.dev.backend.common.enums.PublisherStatus;
import com.dev.backend.modules.publisher.dto.PublisherProductResponse;
import com.dev.backend.modules.publisher.entity.Publisher;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    Optional<Publisher> findByName(String name);

    @Query("SELECT COUNT(p)>0 FROM Publisher p WHERE p.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("""
                SELECT p
                FROM Publisher p
                WHERE (
                    :keyword IS NULL
                    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND (
                    :status IS NULL
                    OR p.status = :status
                )
            """)
    Page<Publisher> search(
            @Param("keyword") String keyword,
            @Param("status") PublisherStatus status,
            Pageable pageable);

    @Query("""
            SELECT new com.dev.backend.modules.publisher.dto.PublisherProductResponse(
                p.id,
                p.name,
                p.slug
            )
            FROM Publisher p
            JOIN p.products pr 
            WHERE pr.status = 'ACTIVE'
            """)
    List<PublisherProductResponse> findPublishersWithProducts();
}
