package com.dev.backend.modules.cart.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResponse {
   private Integer shopId;
   private String shopName;
   private String shopSlug;
   private List<CartItemResponse> items = new ArrayList<>();
   private boolean checked=false;
}
