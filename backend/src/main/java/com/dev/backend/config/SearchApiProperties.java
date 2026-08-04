package com.dev.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.searchapi")
public record SearchApiProperties(
        String apiKey,
        String url) {
}