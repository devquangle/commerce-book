package com.dev.backend.modules.author.service;

import com.dev.backend.common.enums.AuthorStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.author.dto.AuthorFilterRequest;
import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;
import com.dev.backend.modules.author.dto.WikipediaResponse;
import com.dev.backend.modules.author.entity.Author;
import com.dev.backend.modules.author.mapper.AuthorMapper;
import com.dev.backend.modules.author.repository.AuthorRepository;

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
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;
    private final WikipediaService wikipediaService;

    @Override
    @Transactional(readOnly = true)
    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(authorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return authorRepository.existsByName(name);
    }

    @Override
    public void validate(AuthorRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByName(request.getName())) {
            errors.addError("name", "Tên thể loại đã được sử dụng.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    public Author getById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorResponse detail(Long id) {
        Author author = getById(id);
        return authorMapper.toDTO(author);
    }

    @Override
    public AuthorResponse create(AuthorRequest request) {
        Author author = new Author();
        validate(request);
        authorMapper.toEntity(author, request);
        author.setStatus(AuthorStatus.ACTIVE);
        return authorMapper.toDTO(authorRepository.save(author));
    }

    @Override
    public AuthorResponse update(Long id, AuthorRequest request) {
        Author author = getById(id);
        if (request.getStatus() == AuthorStatus.DELETED) {
            throw new BadRequestException("Không được cập nhật sang trạng thái DELETED");
        }
        String newName = TextUtils.capitalizeFully(request.getName());
        if (!author.getName().equals(newName)) {
            validate(request);
        }
        authorMapper.toEntity(author, request);
        return authorMapper.toDTO(authorRepository.save(author));
    }

    @Override
    public void delete(Long id) {
        Author author = getById(id);
        author.setStatus(AuthorStatus.DELETED);
        authorRepository.save(author);
    }

    @Override
    public void insertData() {
        if (authorRepository.count() > 0) {
            return;
        }
        List<String> authorNames = List.of(
                // Tác giả Việt Nam
                "Nguyễn Nhật Ánh",
                "Nam Cao",
                "Tô Hoài",
                "Nguyễn Du",
                "Vũ Trọng Phụng",
                "Thạch Lam",
                "Nguyễn Huy Thiệp",
                "Nguyễn Tuân",
                "Xuân Diệu",
                "Huy Cận",

                // Tác giả quốc tế
                "William Shakespeare", // Anh
                "Leo Tolstoy", // Nga
                "Fyodor Dostoevsky", // Nga
                "Gabriel García Márquez", // Colombia
                "Ernest Hemingway", // Mỹ
                "Haruki Murakami", // Nhật Bản
                "Victor Hugo", // Pháp
                "Franz Kafka", // Séc
                "Mark Twain", // Mỹ
                "J.K. Rowling" // Anh
        );
        // Tạo danh sách Author bằng cách gọi Service cho từng tên
        List<Author> authors = authorNames.stream()
                .map(this::createAuthor)
                .collect(Collectors.toList());

        // Thêm trường hợp "Khác" nếu cần thiết
        Author other = new Author();
        other.setName("Khác");
        other.setSlug("khac");
        other.setDescription("Tác giả không xác định hoặc nhóm khác");
        other.setStatus(AuthorStatus.ACTIVE);
        authors.add(other);

        authorRepository.saveAll(authors);
    }

    public Author createAuthor(String name) {
        Author a = new Author();
        a.setName(TextUtils.capitalizeFully(name));
        a.setSlug(TextUtils.toSlug(name));

        WikipediaResponse response = wikipediaService.fetchApiInforAuthor(name);
        if (response != null) {
            a.setWikibaseItem(response.getWikibaseItem());
            a.setUrlImage(response.getUrlImage());
            a.setUrlBio(response.getUrlBio());
            a.setDescription(response.getExtract());
        }

        a.setStatus(AuthorStatus.ACTIVE);
        return a;
    }

    @Override
    public PageResponse<AuthorResponse> search(AuthorFilterRequest request) {
        Pageable pageable = PageRequest.of(
                Math.max(0, Optional.ofNullable(request.getPage()).orElse(1) - 1),
                Optional.ofNullable(request.getSize()).filter(s -> s > 0).orElse(10),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<AuthorResponse> page = authorRepository
                .search(
                        StringUtils.trimToNull(request.getKeyword()),
                        request.getStatus(),
                        pageable)
                .map(authorMapper::toDTO);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

}
