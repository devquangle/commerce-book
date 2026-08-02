package com.dev.backend.modules.publisher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.dev.backend.common.enums.PublisherStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublisherResponse {
    private Long id;
    private String name;
    private PublisherStatus status;
}
