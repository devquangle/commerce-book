package com.dev.backend.modules.publisher.service;

import com.dev.backend.common.response.PageResponse;
import com.dev.backend.modules.publisher.dto.PublisherFilterRequest;
import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;

import java.util.List;

public interface PublisherService {
    List<PublisherResponse> getAllPublishers();

    Publisher getById(Long id);

    boolean existsByName(String name);

    void validate(PublisherRequest request);

    PublisherResponse getPublisherResponse(Long id);

    PublisherResponse create(PublisherRequest request);

    PublisherResponse update(Long id, PublisherRequest request);

    void delete(Long id);

    void insertData();

    PageResponse<PublisherResponse> search(PublisherFilterRequest request);
}
