package com.dev.backend.modules.cloudinary.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadForm {
    private List<ImageRequest> imageRequests;   
}
