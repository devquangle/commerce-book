package com.dev.backend.modules.cart.service;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.exception.UnauthorizedException;
import com.dev.backend.modules.author_product.service.AuthorProductService;
import com.dev.backend.modules.cart.dto.AddToCartRequest;
import com.dev.backend.modules.cart.dto.CartItemResponse;
import com.dev.backend.modules.cart.dto.CartResponse;
import com.dev.backend.modules.cart.dto.UpdateCartItemRequest;
import com.dev.backend.modules.cart.entity.CartItem;
import com.dev.backend.modules.cart.repository.CartItemRepository;
import com.dev.backend.modules.genre_product.service.GenreProductService;
import com.dev.backend.modules.image_product.service.ImageProductService;
import com.dev.backend.modules.product.dto.response.ProductInfo;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.product.mapper.ProductMapper;
import com.dev.backend.modules.product.repository.ProductRepository;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;
import com.dev.backend.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuthorProductService authorProductService;
    private final GenreProductService genreProductService;
    private final ImageProductService imageProductService;
    private final ProductMapper productMapper;
    private final CacheManager cacheManager;

    @Override
    @Transactional(readOnly = true)
    public List<CartResponse> getCartItemsByUserId(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems == null || cartItems.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> productIds = cartItems.stream()
                .map(item -> item.getProduct().getId())
                .toList();

        Map<Long, List<String>> authorMap = getFromCacheOrFetch("productAuthors", productIds, authorProductService::findAuthorMap);
        Map<Long, List<String>> genreMap = getFromCacheOrFetch("productGenres", productIds, genreProductService::findGenreMap);
        Map<Long, String> imageMap = getFromCacheOrFetch("productImages", productIds, imageProductService::findThumbnailMap);

        Map<Long, CartResponse> shopMap = new LinkedHashMap<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            Shop shop = product.getShop();

            CartResponse cartResponse = shopMap.computeIfAbsent(
                    shop.getId(),
                    key -> {
                        CartResponse response = new CartResponse();
                        response.setShopId(shop.getId().intValue());
                        response.setShopName(shop.getName());
                        response.setShopSlug(shop.getSlug());
                        return response;
                    });

            ProductInfo productInfo = productMapper.toProductInfo(product);
            productInfo.setAuthorsName(authorMap.getOrDefault(product.getId(), Collections.emptyList()));
            productInfo.setGenresName(genreMap.getOrDefault(product.getId(), Collections.emptyList()));
            productInfo.setUrlImageDefault(imageMap.get(product.getId()));

            CartItemResponse itemResponse = new CartItemResponse();
            itemResponse.setCartItemId(cartItem.getId().intValue());
            itemResponse.setQuantity(cartItem.getQuantity());
            itemResponse.setProduct(productInfo);

            cartResponse.getItems().add(itemResponse);
        }

        return new ArrayList<>(shopMap.values());
    }

    @Override
    @Transactional(readOnly = true)
    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy mục giỏ hàng với ID: " + id));
    }

    @Override
    public CartItem addToCart(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + request.getProductId()));

        if (product.getStatus() != null && product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Sản phẩm hiện không mở bán");
        }

        int availableStock = product.getQuantity() != null ? product.getQuantity() : 0;
        if (availableStock <= 0) {
            throw new BadRequestException("Sản phẩm đã hết hàng");
        }

        return cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .map(existing -> {
                    int updatedQuantity = existing.getQuantity() + request.getQuantity();
                    if (updatedQuantity > availableStock) {
                        throw new BadRequestException("Tổng số lượng trong giỏ (" + updatedQuantity + 
                                ") vượt quá số lượng tồn kho khả dụng (" + availableStock + ")");
                    }
                    existing.setQuantity(updatedQuantity);
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    if (request.getQuantity() > availableStock) {
                        throw new BadRequestException("Số lượng yêu cầu vượt quá tồn kho khả dụng (" + availableStock + ")");
                    }
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin tài khoản người dùng"));
                    CartItem cartItem = new CartItem();
                    cartItem.setUser(user);
                    cartItem.setProduct(product);
                    cartItem.setQuantity(request.getQuantity());
                    return cartItemRepository.save(cartItem);
                });
    }

    @Override
    public CartItem updateQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy mục giỏ hàng với ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Bạn không có quyền chỉnh sửa mục giỏ hàng này");
        }

        Product product = cartItem.getProduct();
        int availableStock = product.getQuantity() != null ? product.getQuantity() : 0;
        if (request.getQuantity() > availableStock) {
            throw new BadRequestException("Số lượng yêu cầu (" + request.getQuantity() + 
                    ") vượt quá số lượng tồn kho (" + availableStock + ")");
        }

        cartItem.setQuantity(request.getQuantity());
        return cartItemRepository.save(cartItem);
    }

    @Override
    public void deleteCartItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy mục giỏ hàng với ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Bạn không có quyền xóa mục giỏ hàng này");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    @SuppressWarnings("unchecked")
    private <T> Map<Long, T> getFromCacheOrFetch(String cacheName, List<Long> ids, java.util.function.Function<List<Long>, Map<Long, T>> fetcher) {
        Cache cache = cacheManager.getCache(cacheName);
        Map<Long, T> resultMap = new LinkedHashMap<>();
        List<Long> missingIds = new ArrayList<>();

        if (cache != null) {
            for (Long id : ids) {
                Cache.ValueWrapper wrapper = cache.get(id);
                if (wrapper != null) {
                    resultMap.put(id, (T) wrapper.get());
                } else {
                    missingIds.add(id);
                }
            }
        } else {
            missingIds.addAll(ids);
        }

        if (!missingIds.isEmpty()) {
            Map<Long, T> fetchedMap = fetcher.apply(missingIds);
            resultMap.putAll(fetchedMap);
            if (cache != null) {
                for (Map.Entry<Long, T> entry : fetchedMap.entrySet()) {
                    cache.put(entry.getKey(), entry.getValue());
                }
            }
        }
        return resultMap;
    }
}
