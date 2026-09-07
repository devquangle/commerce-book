package com.dev.backend.config.viettel;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Configuration 
@Component 
@ConfigurationProperties (prefix = "viettel")
public class ViettelAiConfig {
    private  String url;
    private String token;    
}