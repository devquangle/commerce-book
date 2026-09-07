package com.dev.backend.modules.others.viettel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
public class InformationResponse {
    private String id;
    private String name;
    private String birthday;
    private String sex;
    private String address;
    private String nationality;
    private String expiry;
}
