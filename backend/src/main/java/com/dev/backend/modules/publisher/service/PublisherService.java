package com.dev.backend.modules.publisher.service;

import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;

import java.util.List;

public interface PublisherService {
    List<PublisherResponse> getAllPublishers();
    PublisherResponse getPublisherById(Long id);
    PublisherResponse getPublisherByName(String name);
    PublisherResponse createPublisher(PublisherRequest request);
    PublisherResponse updatePublisher(Long id, PublisherRequest request);
    void deletePublisher(Long id);
}
