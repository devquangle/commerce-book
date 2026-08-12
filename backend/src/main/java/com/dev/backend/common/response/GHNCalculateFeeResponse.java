package com.dev.backend.common.response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GHNCalculateFeeResponse<T>{
    private int code;
    private String message;
    private T data;
}
