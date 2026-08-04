package com.dev.backend.modules.genre.repository;

import com.dev.backend.common.enums.GenreStatus;
import com.dev.backend.modules.genre.entity.Genre;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByName(String name);

    @Query("""
                SELECT g
                FROM Genre g
                WHERE (
                    :keyword IS NULL
                    OR LOWER(g.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND (
                    :status IS NULL
                    OR g.status = :status
                )
            """)
    Page<Genre> search(
            @Param("keyword") String keyword,
            @Param("status") GenreStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(g)>0 FROM Genre g WHERE g.name = :name")
    boolean existsByName(@Param("name") String name);


    
}
