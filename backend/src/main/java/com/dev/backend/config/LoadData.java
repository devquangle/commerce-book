package com.dev.backend.config;

import com.dev.backend.modules.author.service.AuthorService;
import com.dev.backend.modules.genre.service.GenreService;
import com.dev.backend.modules.publisher.service.PublisherService;

import com.dev.backend.modules.series.service.SeriesService;
import com.dev.backend.modules.voucher.service.VoucherService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tải dữ liệu ban đầu cho hệ thống khi ứng dụng khởi chạy.
 * Mỗi role sẽ được tạo 1 tài khoản tương ứng nếu chưa tồn tại.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LoadData implements CommandLineRunner {


    private final AuthorService authorService;
    private final GenreService genreService;
    private final PublisherService publisherService;
    private final SeriesService seriesService;

    private final VoucherService voucherService;
    @Override
    public void run(String... args) throws Exception {
        insertData();
    }

    @Transactional
    public void insertData() {
        log.info("Đang kiểm tra và khởi tạo dữ liệu mẫu cho hệ thống...");

       
        authorService.insertData();
        genreService.insertData();
        publisherService.insertData();
        seriesService.insertData();
        voucherService.insertData();
        log.info("Khởi tạo dữ liệu mẫu hoàn tất.");
    }
}
