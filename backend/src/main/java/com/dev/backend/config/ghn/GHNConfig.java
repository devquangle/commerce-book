package com.dev.backend.config.ghn;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "ghn")
public class GHNConfig {

    private String token;
    private String shopId;
    private String masterDataUrl;
    private String shippingFeeUrl;
}