package com.dev.backend.modules.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.dev.backend.modules.product.dto.request.UserFilterRequest;
import com.dev.backend.modules.product.dto.response.ProductCardResponse;
import com.dev.backend.modules.product.entity.Product;
import com.dev.backend.modules.review.entity.Review;
import com.dev.backend.modules.shop.entity.Shop;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;

import java.util.ArrayList;
import java.util.List;

public class ProductRepositoryImpl implements ProductRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<ProductCardResponse> searchProductsForUser(UserFilterRequest request,Long userId, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProductCardResponse> query = cb.createQuery(ProductCardResponse.class);
        Root<Product> product = query.from(Product.class);

        List<Predicate> predicates = buildPredicates(cb, product, request, query);
        query.where(predicates.toArray(new Predicate[0]));

        Join<Product, Shop> shop = product.join("shop", JoinType.LEFT);
        Join<Product, com.dev.backend.modules.image_product.entity.ImageProduct> image = product.join("images", JoinType.LEFT);
        image.on(cb.equal(image.get("isThumbnail"), true));

        Subquery<Integer> discountSubquery = query.subquery(Integer.class);
        Root<com.dev.backend.modules.promotion_product.entity.PromotionProduct> ppRoot = discountSubquery.from(com.dev.backend.modules.promotion_product.entity.PromotionProduct.class);
        Join<com.dev.backend.modules.promotion_product.entity.PromotionProduct, com.dev.backend.modules.promotion.entity.Promotion> promJoin = ppRoot.join("promotion");

        Expression<Number> soldQty = cb.coalesce(ppRoot.get("soldQuantity"), 0);
        Expression<Number> reservedQty = cb.coalesce(ppRoot.get("reservedQuantity"), 0);
        Expression<Number> availableQty = cb.diff(ppRoot.get("maxQuantity"), cb.sum(soldQty, reservedQty));

        discountSubquery.select(cb.max(ppRoot.get("discountPercent")));
        discountSubquery.where(
            cb.equal(ppRoot.get("product"), product),
            cb.greaterThan(availableQty.as(Integer.class), 0),
            cb.equal(promJoin.get("status"), com.dev.backend.common.enums.PromotionStatus.ACTIVE),
            cb.lessThanOrEqualTo(promJoin.get("startDate"), java.time.LocalDateTime.now()),
            cb.greaterThanOrEqualTo(promJoin.get("endDate"), java.time.LocalDateTime.now())
        );

        Expression<Integer> discountPercentExpr = cb.coalesce(discountSubquery, 0);
        Expression<Number> salePriceExpr = cb.quot(
            cb.prod(product.get("price"), cb.diff(100, discountPercentExpr)), 
            100
        );

        Expression<Boolean> isFavoriteExpr;
        if (userId != null) {
            Subquery<Long> favSubquery = query.subquery(Long.class);
            Root<com.dev.backend.modules.favorite.entity.Favorite> favRoot = favSubquery.from(com.dev.backend.modules.favorite.entity.Favorite.class);
            favSubquery.select(cb.literal(1L));
            favSubquery.where(
                cb.equal(favRoot.get("product"), product),
                cb.equal(favRoot.get("user").get("id"), userId)
            );
            isFavoriteExpr = cb.exists(favSubquery);
        } else {
            isFavoriteExpr = cb.literal(false);
        }

        query.select(cb.construct(ProductCardResponse.class,
                product.get("id"),
                product.get("name"),
                product.get("price"),
                discountPercentExpr,
                salePriceExpr.as(Integer.class),
                image.get("urlImage"),
                shop.get("id"),
                shop.get("slug"),
                shop.get("name"),
                isFavoriteExpr
        ));

        query.distinct(true);

        String sortOption = request.getSort();
        if (sortOption != null && !sortOption.isEmpty()) {
            List<Order> orders = new ArrayList<>();
            switch (sortOption) {
                case "priceAsc":
                    orders.add(cb.asc(salePriceExpr));
                    break;
                case "priceDesc":
                    orders.add(cb.desc(salePriceExpr));
                    break;
                case "newest":
                    orders.add(cb.desc(product.get("createdAt")));
                    break;
                case "hasPromotion":
                    orders.add(cb.desc(discountPercentExpr));
                    break;
                case "rating":
                    Subquery<Double> avgRatingSortSubquery = query.subquery(Double.class);
                    Root<Review> reviewSortRoot = avgRatingSortSubquery.from(Review.class);
                    avgRatingSortSubquery.select(cb.avg(reviewSortRoot.get("rating").as(Double.class)));
                    avgRatingSortSubquery.where(cb.equal(reviewSortRoot.get("product"), product));
                    orders.add(cb.desc(cb.coalesce(avgRatingSortSubquery, 0.0)));
                    break;
                case "soldCount":
                    Subquery<Integer> soldCountSubquery = query.subquery(Integer.class);
                    Root<com.dev.backend.modules.order.entity.OrderItem> orderItemRoot = soldCountSubquery.from(com.dev.backend.modules.order.entity.OrderItem.class);
                    soldCountSubquery.select(cb.sum(orderItemRoot.get("quantity")));
                    soldCountSubquery.where(cb.equal(orderItemRoot.get("product"), product));
                    orders.add(cb.desc(cb.coalesce(soldCountSubquery, 0)));
                    break;
                default:
                    orders.add(cb.desc(product.get("createdAt")));
                    break;
            }
            query.orderBy(orders);
        } else if (pageable.getSort().isSorted()) {
            List<Order> orders = new ArrayList<>();
            for (Sort.Order sortOrder : pageable.getSort()) {
                if (sortOrder.isAscending()) {
                    orders.add(cb.asc(product.get(sortOrder.getProperty())));
                } else {
                    orders.add(cb.desc(product.get(sortOrder.getProperty())));
                }
            }
            query.orderBy(orders);
        }

        if ("hasPromotion".equals(sortOption)) {
            predicates.add(cb.greaterThan(discountPercentExpr, 0));
            query.where(predicates.toArray(new Predicate[0]));
        }

        TypedQuery<ProductCardResponse> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<ProductCardResponse> content = typedQuery.getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);
        List<Predicate> countPredicates = buildPredicates(cb, countRoot, request, countQuery);

        if ("hasPromotion".equals(sortOption)) {
            Subquery<Integer> countDiscountSubquery = countQuery.subquery(Integer.class);
            Root<com.dev.backend.modules.promotion_product.entity.PromotionProduct> countPpRoot = countDiscountSubquery.from(com.dev.backend.modules.promotion_product.entity.PromotionProduct.class);
            Join<com.dev.backend.modules.promotion_product.entity.PromotionProduct, com.dev.backend.modules.promotion.entity.Promotion> countPromJoin = countPpRoot.join("promotion");

            Expression<Number> countSoldQty = cb.coalesce(countPpRoot.get("soldQuantity"), 0);
            Expression<Number> countReservedQty = cb.coalesce(countPpRoot.get("reservedQuantity"), 0);
            Expression<Number> countAvailableQty = cb.diff(countPpRoot.get("maxQuantity"), cb.sum(countSoldQty, countReservedQty));

            countDiscountSubquery.select(cb.max(countPpRoot.get("discountPercent")));
            countDiscountSubquery.where(
                cb.equal(countPpRoot.get("product"), countRoot),
                cb.greaterThan(countAvailableQty.as(Integer.class), 0),
                cb.equal(countPromJoin.get("status"), com.dev.backend.common.enums.PromotionStatus.ACTIVE),
                cb.lessThanOrEqualTo(countPromJoin.get("startDate"), java.time.LocalDateTime.now()),
                cb.greaterThanOrEqualTo(countPromJoin.get("endDate"), java.time.LocalDateTime.now())
            );

            countPredicates.add(cb.greaterThan(cb.coalesce(countDiscountSubquery, 0), 0));
        }

        countQuery.select(cb.countDistinct(countRoot));
        countQuery.where(countPredicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<Product> product, UserFilterRequest request, CriteriaQuery<?> query) {
        List<Predicate> predicates = new ArrayList<>();

        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(product.get("name")), "%" + request.getKeyword().toLowerCase() + "%"));
        }

        if (request.getGenres() != null && !request.getGenres().isEmpty()) {
            Join<Object, Object> genreProducts = product.join("genreProducts", JoinType.INNER);
            Join<Object, Object> genre = genreProducts.join("genre", JoinType.INNER);
            predicates.add(genre.get("slug").in(request.getGenres()));
        }

        if (request.getAuthors() != null && !request.getAuthors().isEmpty()) {
            Join<Object, Object> authorProducts = product.join("authorProducts", JoinType.INNER);
            Join<Object, Object> author = authorProducts.join("author", JoinType.INNER);
            predicates.add(author.get("slug").in(request.getAuthors()));
        }

        if (request.getPublisher() != null && !request.getPublisher().trim().isEmpty()) {
            Join<Object, Object> publisher = product.join("publisher", JoinType.INNER);
            predicates.add(cb.equal(publisher.get("slug"), request.getPublisher()));
        }

        if (request.getSeries() != null && !request.getSeries().trim().isEmpty()) {
            Join<Object, Object> series = product.join("series", JoinType.INNER);
            predicates.add(cb.equal(series.get("slug"), request.getSeries()));
        }

        if (request.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(product.get("price"), request.getMinPrice()));
        }

        if (request.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(product.get("price"), request.getMaxPrice()));
        }

        if (request.getRating() != null && request.getRating() > 0) {
            Subquery<Double> avgRatingSubquery = query.subquery(Double.class);
            Root<Review> reviewRoot = avgRatingSubquery.from(Review.class);
            avgRatingSubquery.select(cb.avg(reviewRoot.get("rating").as(Double.class)));
            avgRatingSubquery.where(cb.equal(reviewRoot.get("product"), product));
            
            predicates.add(cb.greaterThanOrEqualTo(avgRatingSubquery, request.getRating()));
        }

        return predicates;
    }
}
