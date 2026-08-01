package com.dev.backend.modules.favorite.service;

import com.dev.backend.modules.favorite.entity.Favorite;

import java.util.List;

public interface FavoriteService {
    List<Favorite> getFavoritesByUserId(Long userId);
    Favorite getFavoriteById(Long id);
    Favorite addFavorite(Favorite favorite);
    void removeFavorite(Long id);
    boolean isFavorite(Long userId, Long productId);
}
