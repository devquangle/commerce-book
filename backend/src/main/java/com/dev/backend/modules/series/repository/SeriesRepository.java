package com.dev.backend.modules.series.repository;

import com.dev.backend.common.enums.SeriesStatus;
import com.dev.backend.modules.series.dto.SeriesProductResponse;
import com.dev.backend.modules.series.entity.Series;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {
    Optional<Series> findByName(String name);

    @Query("SELECT COUNT(g)>0 FROM Series g WHERE g.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("""
                SELECT g
                FROM Series g
                WHERE (
                    :keyword IS NULL
                    OR LOWER(g.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND (
                    :status IS NULL
                    OR g.status = :status
                )
            """)
    Page<Series> search(
            @Param("keyword") String keyword,
            @Param("status") SeriesStatus status,
            Pageable pageable);

    @Query("""
            SELECT new com.dev.backend.modules.series.dto.SeriesProductResponse(
                s.id,
                s.name,
                s.slug
            )
            FROM Series s
            JOIN Product p
            WHERE p.status = 'ACTIVE'
            """)
    List<SeriesProductResponse> findSeriesWithProducts();
}
