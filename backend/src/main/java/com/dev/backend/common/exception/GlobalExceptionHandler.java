package com.dev.backend.common.exception;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;


import com.dev.backend.common.constant.ApiErrorCode;
import com.dev.backend.common.response.ResponseData;
import com.dev.backend.common.response.ResponseUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AppException.class)
        public ResponseEntity<ResponseData<Object>> handleAppException(AppException ex, HttpServletRequest request) {
                HttpStatus status = HttpStatus.resolve(ex.getCode());
                if (status == null) {
                        status = HttpStatus.BAD_REQUEST;
                }
                String error = ex.getError() == null || ex.getError().isBlank() ? status.name() : ex.getError();

                return ResponseUtil.error(status, ex.getMessage(), error, request.getRequestURI(), ex.getData());
        }

        // 🌟 FIX 1: Thêm Handler riêng cho DuplicateFieldException để trả về map errors chính xác
        @ExceptionHandler(DuplicateFieldException.class)
        public ResponseEntity<ResponseData<Object>> handleDuplicateField(DuplicateFieldException ex, HttpServletRequest request) {
                // Lấy mã HTTP từ lỗi (409 CONFLICT)
                HttpStatus status = HttpStatus.resolve(ex.getCode());
                if (status == null) {
                        status = HttpStatus.CONFLICT;
                }

                // Truyền trực tiếp ex.getErrors() vào vị trí cuối cùng để map trúng trường "data" ở JSON trả về
                return ResponseUtil.error(
                        status, 
                        ex.getMessage(), 
                        "CONFLICT", 
                        request.getRequestURI(), 
                        ex.getErrors() // Đây chính là Map {"name": "Tên tác giả đã tồn tại."}
                );
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ResponseData<Object>> handleMethodArgumentNotValid(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {

                // Gom lỗi bằng Stream API ngắn gọn
                Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                                .collect(Collectors.toMap(
                                                fieldError -> fieldError.getField(),
                                                fieldError -> fieldError.getDefaultMessage() != null
                                                                ? fieldError.getDefaultMessage()
                                                                : "Lỗi không xác định",
                                                (existingValue, newValue) -> existingValue 
                                ));

                // 🌟 FIX 2: Sửa HttpStatus từ CONFLICT thành BAD_REQUEST (400) cho đúng chuẩn validation thông thường
                return ResponseUtil.error(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ!",
                                ApiErrorCode.VALIDATION_ERROR, request.getRequestURI(), errors);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ResponseData<Object>> handleConstraintViolation(
                        ConstraintViolationException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(HttpStatus.BAD_REQUEST, ex.getMessage(), ApiErrorCode.VALIDATION_ERROR,
                                request.getRequestURI(), null);
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ResponseData<Object>> handleTypeMismatch(
                        MethodArgumentTypeMismatchException ex,
                        HttpServletRequest request) {
                String message = "Invalid value for parameter: " + ex.getName();
                return ResponseUtil.error(HttpStatus.BAD_REQUEST, message, ApiErrorCode.TYPE_MISMATCH,
                                request.getRequestURI(), null);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ResponseData<Object>> handleAccessDenied(
                        AccessDeniedException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(HttpStatus.FORBIDDEN, "You do not have permission to access this resource",
                                ApiErrorCode.ACCESS_DENIED, request.getRequestURI(), null);
        }

        @ExceptionHandler({
                        org.springframework.web.servlet.resource.NoResourceFoundException.class,
                        org.springframework.web.servlet.NoHandlerFoundException.class
        })
        public ResponseEntity<ResponseData<Object>> handleNotFoundException(
                        Exception ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đường dẫn hoặc tài nguyên yêu cầu (404)",
                                ApiErrorCode.NOT_FOUND,
                                request.getRequestURI(),
                                null);
        }

        @ExceptionHandler(org.springframework.web.bind.MissingServletRequestParameterException.class)
        public ResponseEntity<ResponseData<Object>> handleMissingParams(
                        org.springframework.web.bind.MissingServletRequestParameterException ex,
                        HttpServletRequest request) {
                String name = ex.getParameterName();
                return ResponseUtil.error(
                                HttpStatus.BAD_REQUEST,
                                "Thiếu tham số bắt buộc: " + name,
                                ApiErrorCode.VALIDATION_ERROR,
                                request.getRequestURI(),
                                null);
        }

        @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
        public ResponseEntity<ResponseData<Object>> handleHttpMessageNotReadable(
                        org.springframework.http.converter.HttpMessageNotReadableException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(
                                HttpStatus.BAD_REQUEST,
                                "Dữ liệu yêu cầu không hợp lệ hoặc bị thiếu",
                                ApiErrorCode.VALIDATION_ERROR,
                                request.getRequestURI(),
                                null);
        }

        @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ResponseData<Object>> handleHttpRequestMethodNotSupported(
                        org.springframework.web.HttpRequestMethodNotSupportedException ex,
                        HttpServletRequest request) {
                return ResponseUtil.error(
                                HttpStatus.METHOD_NOT_ALLOWED,
                                "Phương thức HTTP không được hỗ trợ",
                                "METHOD_NOT_ALLOWED",
                                request.getRequestURI(),
                                null);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ResponseData<Object>> handleException(Exception ex, HttpServletRequest request) {
                log.error("Unhandled exception at {}", request.getRequestURI(), ex);
                return ResponseUtil.error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error",
                                ApiErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI(), null);
        }

        @ExceptionHandler({
                        org.springframework.security.authentication.BadCredentialsException.class,
                        org.springframework.security.core.userdetails.UsernameNotFoundException.class
        })
        public ResponseEntity<ResponseData<Object>> handleBadCredentials(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản hoặc mật khẩu không đúng",
                                ApiErrorCode.UNAUTHORIZED, request.getRequestURI(), null);
        }

        @ExceptionHandler(org.springframework.security.authentication.LockedException.class)
        public ResponseEntity<ResponseData<Object>> handleLocked(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị khóa", ApiErrorCode.UNAUTHORIZED,
                                request.getRequestURI(), null);
        }

        @ExceptionHandler(org.springframework.security.authentication.DisabledException.class)
        public ResponseEntity<ResponseData<Object>> handleDisabled(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseUtil.error(HttpStatus.UNAUTHORIZED, "Tài khoản chưa được kích hoạt",
                                ApiErrorCode.UNAUTHORIZED, request.getRequestURI(), null);
        }
}