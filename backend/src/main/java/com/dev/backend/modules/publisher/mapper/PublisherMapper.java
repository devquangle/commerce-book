package com.dev.backend.modules.publisher.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;
import org.springframework.stereotype.Component;

@Component
public class PublisherMapper {

    public Publisher toEntity(Publisher publisher, PublisherRequest request) {
        if (publisher == null || request == null) {
            return null;
        }
        String name = TextUtils.capitalizeFully(request.getName());
        publisher.setName(name);
        publisher.setSlug(TextUtils.toSlug(name));

        return publisher;
    }

    public PublisherResponse toDTO(Publisher entity) {
        if (entity == null) {
            return null;
        }
        PublisherResponse response = new PublisherResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setSlug(entity.getSlug());
        response.setStatus(entity.getStatus());
        return response;
    }

}
