package com.dev.backend.common.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter 
public class BankDataResponse<T> {
    private String code;
    private String desc;
    private List<T> data;
}
