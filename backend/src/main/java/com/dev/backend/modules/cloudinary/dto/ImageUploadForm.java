package com.dev.backend.modules.cloudinary.dto;

import java.util.List;

public record ImageUploadForm(List<ImageRequest> imageRequests) {

}
