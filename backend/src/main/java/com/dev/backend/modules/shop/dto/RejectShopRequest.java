package com.dev.backend.modules.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RejectShopRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    private String reason;
}
