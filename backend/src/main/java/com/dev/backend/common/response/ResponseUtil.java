package com.dev.backend.common.response;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    public static <T> ResponseEntity<ResponseData<T>> success(
            String message,
            T data) {

        ResponseData<T> response = new ResponseData<T>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setCode(null);
        response.setError(null);
        response.setPath(null);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<ResponseData<T>> error(
            HttpStatus status,
            String message,
            String error,
            String path,
            T data) {
        ResponseData<T> response = new ResponseData<T>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setCode(status.value());
        response.setError(error);
        response.setPath(path);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(status).body(response);
    }

    public static <T> ResponseEntity<ResponseData<T>> successMessage(
            String message) {

        ResponseData<T> response = new ResponseData<T>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setCode(null);
        response.setError(null);
        response.setPath(null);
        response.setData(null);
        response.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

}