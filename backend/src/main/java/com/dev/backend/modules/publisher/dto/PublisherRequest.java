package com.dev.backend.modules.publisher.dto;

import com.dev.backend.common.enums.PublisherStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublisherRequest {
    private String name;
    private PublisherStatus status;
}
