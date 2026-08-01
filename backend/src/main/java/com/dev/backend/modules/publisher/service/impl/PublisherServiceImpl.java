package com.dev.backend.modules.publisher.service.impl;

import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;
import com.dev.backend.modules.publisher.mapper.PublisherMapper;
import com.dev.backend.modules.publisher.repository.PublisherRepository;
import com.dev.backend.modules.publisher.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PublisherServiceImpl implements PublisherService {

    private final PublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PublisherResponse> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(publisherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PublisherResponse getPublisherById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));
        return publisherMapper.toResponse(publisher);
    }

    @Override
    @Transactional(readOnly = true)
    public PublisherResponse getPublisherByName(String name) {
        Publisher publisher = publisherRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Publisher not found with name: " + name));
        return publisherMapper.toResponse(publisher);
    }

    @Override
    public PublisherResponse createPublisher(PublisherRequest request) {
        Publisher publisher = publisherMapper.toEntity(request);
        Publisher savedPublisher = publisherRepository.save(publisher);
        return publisherMapper.toResponse(savedPublisher);
    }

    @Override
    public PublisherResponse updatePublisher(Long id, PublisherRequest request) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));
        publisherMapper.updateEntityFromRequest(request, publisher);
        Publisher updatedPublisher = publisherRepository.save(publisher);
        return publisherMapper.toResponse(updatedPublisher);
    }

    @Override
    public void deletePublisher(Long id) {
        if (!publisherRepository.existsById(id)) {
            throw new RuntimeException("Publisher not found with id: " + id);
        }
        publisherRepository.deleteById(id);
    }
}
