package com.dev.backend.modules.publisher.service;

import com.dev.backend.common.enums.PublisherStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;
import com.dev.backend.modules.publisher.mapper.PublisherMapper;
import com.dev.backend.modules.publisher.repository.PublisherRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
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
                .map(publisherMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Publisher getById(Long id) {
        return publisherRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publisher not found with id: " + id));
    }

    @Override
    public boolean existsByName(String name) {
        return publisherRepository.existsByName(name);
    }

    @Override
    public void validate(PublisherRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByName(request.getName())) {
            errors.addError("name", "Tên nhà xuất bản đã được sử dụng.");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PublisherResponse getPublisherResponse(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));
        return publisherMapper.toDTO(publisher);
    }

    @Override
    public PublisherResponse create(PublisherRequest request) {
        Publisher publisher = new Publisher();
        publisherMapper.toEntity(publisher, request);
        publisher.setStatus(PublisherStatus.ACTIVE);
        return publisherMapper.toDTO(publisherRepository.save(publisher));
    }

    @Override
    public PublisherResponse update(Long id, PublisherRequest request) {

        Publisher publisher = getById(id);
        if (request.getStatus() == PublisherStatus.DELETED) {
            throw new BadRequestException("Không được cập nhật sang trạng thái DELETED");
        }
        String newName = TextUtils.capitalizeFully(request.getName());
        if (!publisher.getName().equals(newName)) {
            validate(request);
        }
        publisherMapper.toEntity(publisher, request);
        return publisherMapper.toDTO(publisherRepository.save(publisher));
    }

    @Override
    public void delete(Long id) {
        Publisher publisher = getById(id);
        publisher.setStatus(PublisherStatus.DELETED);
        publisherRepository.save(publisher);
    }
}
