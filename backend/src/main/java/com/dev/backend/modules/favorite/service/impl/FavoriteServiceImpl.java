package com.dev.backend.modules.favorite.service.impl;

import com.dev.backend.modules.favorite.entity.Favorite;
import com.dev.backend.modules.favorite.repository.FavoriteRepository;
import com.dev.backend.modules.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Favorite> getFavoritesByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Favorite getFavoriteById(Long id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorite not found with id: " + id));
    }

    @Override
    public Favorite addFavorite(Favorite favorite) {
        if (favorite.getUser() != null && favorite.getProduct() != null) {
            boolean exists = favoriteRepository.existsByUserIdAndProductId(
                    favorite.getUser().getId(), favorite.getProduct().getId()
            );
            if (exists) {
                throw new RuntimeException("Product is already in favorites");
            }
        }
        return favoriteRepository.save(favorite);
    }

    @Override
    public void removeFavorite(Long id) {
        if (!favoriteRepository.existsById(id)) {
            throw new RuntimeException("Favorite not found with id: " + id);
        }
        favoriteRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
}
