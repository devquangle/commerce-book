package com.dev.backend.modules.publisher.dto;

import com.dev.backend.common.enums.PublisherStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublisherFilterRequest {
    private String keyword;
    private PublisherStatus status;
    private Integer page;
    private Integer size;
}
