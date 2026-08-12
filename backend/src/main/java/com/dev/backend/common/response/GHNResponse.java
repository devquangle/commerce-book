package com.dev.backend.common.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GHNResponse<T> {
    private int code;
    private String message;
    private List<T> data;
}
