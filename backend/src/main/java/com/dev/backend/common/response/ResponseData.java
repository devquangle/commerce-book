package com.dev.backend.common.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseData<T> {
    private boolean success;
    private String message;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    private T data;

    private Integer code;
    private String error;
    private String path;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime timestamp ;
}