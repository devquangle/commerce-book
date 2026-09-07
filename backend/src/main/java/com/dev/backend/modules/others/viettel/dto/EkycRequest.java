package com.dev.backend.modules.others.viettel.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class EkycRequest {

    private MultipartFile imageFront;

    private MultipartFile imageBack;

    private MultipartFile imageSelfie;


}


