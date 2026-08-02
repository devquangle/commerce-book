package com.dev.backend.modules.genre.dto;

import com.dev.backend.common.enums.GenreStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenreRequest {
    @NotBlank(message = "Tên thể loại không được để trống.")
    @Pattern(regexp = "^[\\p{L}]+(?:\\s[\\p{L}]+)*$", message = "Tên thể loại không được chứa số hoặc ký tự đặc biệt.")
    @Size(min = 2, max = 100, message = "Tên thể loại phải từ 2 đến 100 ký tự.")
    private String name;

    @NotNull(message = "Trạng thái không được để trống.")
    private GenreStatus status;
}
