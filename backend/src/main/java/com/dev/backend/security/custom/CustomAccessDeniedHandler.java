package com.dev.backend.security.custom;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.dev.backend.common.constant.ApiErrorCode;
import com.dev.backend.common.response.ResponseData;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");

        ResponseData<Object> responseData = new ResponseData<>();
        responseData.setSuccess(false);
        responseData.setCode(HttpStatus.FORBIDDEN.value());
        responseData.setError(ApiErrorCode.ACCESS_DENIED);
        responseData.setMessage("Bạn không có quyền thực hiện hành động này");
        responseData.setPath(request.getRequestURI());
        responseData.setTimestamp(LocalDateTime.now());

        response.getWriter().write(objectMapper.writeValueAsString(responseData));
    }
}