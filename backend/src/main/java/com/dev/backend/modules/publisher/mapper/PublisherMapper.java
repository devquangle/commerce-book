package com.dev.backend.modules.publisher.mapper;

import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;
import org.springframework.stereotype.Component;

@Component
public class PublisherMapper {

    public Publisher toEntity(PublisherRequest request) {
        if (request == null) {
            return null;
        }
        return Publisher.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public PublisherResponse toResponse(Publisher entity) {
        if (entity == null) {
            return null;
        }
        return PublisherResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(PublisherRequest request, Publisher entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getName() != null) {
            entity.setName(request.getName());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription());
        }
    }
}
