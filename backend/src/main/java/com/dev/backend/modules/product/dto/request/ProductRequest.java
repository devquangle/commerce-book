package com.dev.backend.modules.product.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import com.dev.backend.common.enums.ProductStatus;
import com.dev.backend.modules.cloudinary.dto.ImageResponse;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String isbn;

    @NotNull(message = "Giá gốc không được để trống")
    @Min(value = 0, message = "Giá gốc không được âm")
    private Integer originalPrice;

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 0, message = "Giá bán không được âm")
    private Integer price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    @NotNull(message = "Trọng lượng không được để trống")
    @Min(value = 0, message = "Trọng lượng không được âm")
    private Integer weight;

    @NotNull(message = "Năm xuất bản không được để trống")
    private LocalDate publishYear;

    @NotNull(message = "Số trang không được để trống")
    @Min(value = 0, message = "Số trang không được âm")
    private Integer pages;

    @NotBlank(message = "Ngôn ngữ không được để trống")
    private String language;

    @NotBlank(message = "Mô tả sản phẩm không được để trống")
    private String description;

    @NotNull(message = "Nhà xuất bản không được để trống")
    private Long publisherId;

    private Long seriesId;

    @NotEmpty(message = "Danh sách tác giả không được để trống")
    private List<Long> authorIds;

    @NotEmpty(message = "Danh sách thể loại không được để trống")
    private List<Long> genreIds;

    @NotEmpty(message = "Phải có ít nhất một ảnh bìa")
    @Size(max = 6, message = "Tối đa chỉ được 6 ảnh bìa")
    private List<ImageResponse> coverImages;
    
    private ProductStatus status;
}
