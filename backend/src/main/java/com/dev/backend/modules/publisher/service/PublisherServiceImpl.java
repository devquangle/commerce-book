package com.dev.backend.modules.publisher.service;

import com.dev.backend.common.enums.PublisherStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.publisher.dto.PublisherFilterRequest;
import com.dev.backend.modules.publisher.dto.PublisherProductResponse;
import com.dev.backend.modules.publisher.dto.PublisherRequest;
import com.dev.backend.modules.publisher.dto.PublisherResponse;
import com.dev.backend.modules.publisher.entity.Publisher;
import com.dev.backend.modules.publisher.mapper.PublisherMapper;
import com.dev.backend.modules.publisher.repository.PublisherRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
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
        validate(request);
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

    @Override
    public PageResponse<PublisherResponse> search(PublisherFilterRequest request) {
       Pageable pageable = PageRequest.of(
                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<PublisherResponse> page = publisherRepository
                .search(
                        StringUtils.trimToNull(request.getKeyword()),
                        request.getStatus(),
                        pageable)
                .map(publisherMapper::toDTO);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    @Override
    public void insertData() {
        if (publisherRepository.count() > 0) {
            return;
        }

        List<Publisher> items = List.of(
                createPublisher("Khác"),

                // Việt Nam
                createPublisher("NXB Kim Đồng"),
                createPublisher("NXB Trẻ"),
                createPublisher("NXB Giáo Dục Việt Nam"),
                createPublisher("NXB Văn Học"),
                createPublisher("NXB Lao Động"),
                createPublisher("NXB Tổng Hợp TP. Hồ Chí Minh"),
                createPublisher("NXB Hội Nhà Văn"),
                createPublisher("NXB Phụ Nữ Việt Nam"),
                createPublisher("NXB Chính Trị Quốc Gia Sự Thật"),
                createPublisher("NXB Thế Giới"),
                createPublisher("NXB Dân Trí"),

                // Mỹ
                createPublisher("Penguin Random House"),
                createPublisher("HarperCollins"),
                createPublisher("Simon & Schuster"),
                createPublisher("Macmillan Publishers"),
                createPublisher("Hachette Book Group"),

                // Anh
                createPublisher("Oxford University Press"),
                createPublisher("Cambridge University Press"),
                createPublisher("Bloomsbury Publishing"),
                createPublisher("Pearson"),

                // Nhật Bản
                createPublisher("Kodansha"),
                createPublisher("Shueisha"),
                createPublisher("Shogakukan"),
                createPublisher("Kadokawa"),

                // Hàn Quốc
                createPublisher("Munhakdongne"),
                createPublisher("Changbi Publishers"),
                createPublisher("Wisdom House"),

                // Trung Quốc
                createPublisher("People's Literature Publishing House"),
                createPublisher("China Publishing Group"),
                createPublisher("CITIC Press"),

                // Quốc tế
                createPublisher("Springer"),
                createPublisher("Elsevier"),
                createPublisher("Wiley"),
                createPublisher("O'Reilly Media"),
                createPublisher("Manning Publications"),
                createPublisher("Packt Publishing"));

        publisherRepository.saveAll(items);
    }

    private Publisher createPublisher(String name) {
        Publisher publisher = new Publisher();
        publisher.setName(TextUtils.capitalizeFully(name));
        publisher.setSlug(TextUtils.toSlug(name));
        publisher.setStatus(PublisherStatus.ACTIVE);
        return publisher;
    }
    @Override
    public List<PublisherProductResponse> getPublishersWithBookCount() {
        return publisherRepository.findPublishersWithBookCount();
    }
}