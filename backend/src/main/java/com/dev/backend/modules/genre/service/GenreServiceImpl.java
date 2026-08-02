package com.dev.backend.modules.genre.service;

import com.dev.backend.common.enums.GenreStatus;
import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.common.exception.DuplicateFieldException;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.common.response.PageResponse;
import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.genre.dto.GenreFilterRequest;
import com.dev.backend.modules.genre.dto.GenreRequest;
import com.dev.backend.modules.genre.dto.GenreResponse;
import com.dev.backend.modules.genre.entity.Genre;
import com.dev.backend.modules.genre.mapper.GenreMapper;
import com.dev.backend.modules.genre.repository.GenreRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Genre getById(Long id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Genre not found with id: " + id));
    }

    @Override
    public boolean existsByName(String name) {
        return genreRepository.existsByName(name);
    }

    @Override
    public void validate(GenreRequest request) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByName(request.getName())) {
            errors.addError("name", "Tên thể loại đã được sử dụng.");
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public GenreResponse getGenreResponse(Long id) {
        return genreMapper.toDTO(getById(id));
    }

    @Override
    public GenreResponse create(GenreRequest request) {
        Genre genre = new Genre();
        validate(request);
        genreMapper.toEntity(genre, request);
        genre.setStatus(GenreStatus.ACTIVE);
        return genreMapper.toDTO(genreRepository.save(genre));
    }

    @Override
    public GenreResponse update(Long id, GenreRequest request) {
        Genre genre = getById(id);
        if (request.getStatus() == GenreStatus.DELETED) {
            throw new BadRequestException("Không được cập nhật sang trạng thái DELETED");
        }
        String newName = TextUtils.capitalizeFully(request.getName());
        if (!genre.getName().equals(newName)) {
            validate(request);
        }
        genreMapper.toEntity(genre, request);
        return genreMapper.toDTO(genreRepository.save(genre));
    }

    @Override
    public void delete(Long id) {
        Genre genre = getById(id);
        genre.setStatus(GenreStatus.DELETED);
        genreRepository.save(genre);
    }

    @Override
    public void insertData() {
        if (genreRepository.count() > 0) {
            return;
        }
        List<Genre> genres = new ArrayList<>();
        genres.add(createGenre("Khác"));
        genres.add(createGenre("Văn học"));
        genres.add(createGenre("Kinh tế"));
        genres.add(createGenre("Kỹ năng sống"));
        genres.add(createGenre("Thiếu nhi"));
        genres.add(createGenre("Giáo dục"));
        genres.add(createGenre("Ngoại ngữ"));
        genres.add(createGenre("Công nghệ thông tin"));
        genres.add(createGenre("Lịch sử"));
        genres.add(createGenre("Khoa học"));
        genres.add(createGenre("Trinh thám"));

        genres.add(createGenre("Tâm lý học"));
        genres.add(createGenre("Y học - Sức khỏe"));
        genres.add(createGenre("Tài chính cá nhân"));
        genres.add(createGenre("Khởi nghiệp"));
        genres.add(createGenre("Marketing - Bán hàng"));
        genres.add(createGenre("Giao tiếp - Thuyết trình"));
        genres.add(createGenre("Triết học"));
        genres.add(createGenre("Tôn giáo - Tâm linh"));
        genres.add(createGenre("Văn hóa - Du lịch"));
        genres.add(createGenre("Tiểu sử - Hồi ký"));
        genreRepository.saveAll(genres);
    }

    private Genre createGenre(String name) {
        Genre genre = new Genre();
        genre.setName(TextUtils.capitalizeFully(name));
        genre.setSlug(TextUtils.toSlug(name));
        genre.setStatus(GenreStatus.ACTIVE);
        return genre;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GenreResponse> search(GenreFilterRequest request) {
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        GenreStatus baseStatus = GenreStatus.from(request.getStatus());
        String keyword = StringUtils.trimToNull(request.getKeyword());
        Page<Genre> authorPage = genreRepository.search(keyword, baseStatus, pageable);

        List<GenreResponse> items = authorPage.getContent().stream().map(genreMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                authorPage.getNumber(),
                authorPage.getSize(),
                authorPage.getTotalElements(),
                authorPage.getTotalPages());
    }
}
