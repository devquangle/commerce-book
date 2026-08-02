package com.dev.backend.modules.author.service;

import com.dev.backend.common.enums.AuthorStatus;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
                .map(authorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        return authorMapper.toResponse(author);
    }

    @Override
    public AuthorResponse createAuthor(AuthorRequest request) {
        Author author = new Author();
        authorMapper.toEntity(author, request);
        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Override
    public AuthorResponse updateAuthor(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
        authorMapper.updateEntityFromRequest(request, author);
        Author updatedAuthor = authorRepository.save(author);
        return authorMapper.toResponse(updatedAuthor);
    }

    @Override
    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
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
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        AuthorStatus baseStatus = AuthorStatus.from(request.getStatus());
        String keyword = (request.getKeyword() == null) ? "" : request.getKeyword().trim();
        Page<Author> authorPage = authorRepository.search(keyword, baseStatus, pageable);

        List<AuthorResponse> items = authorPage.getContent().stream().map(authorMapper::toResponse).toList();

        return new PageResponse<>(
                items,
                authorPage.getNumber(),
                authorPage.getSize(),
                authorPage.getTotalElements(),
                authorPage.getTotalPages());
    }

}
