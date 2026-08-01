package com.dev.backend.security.custom;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.dev.backend.common.constant.ApiErrorCode;
import com.dev.backend.common.response.ResponseData;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        ResponseData<Object> responseData = new ResponseData<>();
        responseData.setSuccess(false);
        responseData.setCode(HttpStatus.UNAUTHORIZED.value());
        responseData.setError(ApiErrorCode.UNAUTHORIZED);
        responseData.setMessage("Không có quyền truy cập hoặc Token đã hết hạn/không hợp lệ");
        responseData.setPath(request.getRequestURI());
        responseData.setTimestamp(LocalDateTime.now());

        response.getWriter().write(objectMapper.writeValueAsString(responseData));
    }
}
