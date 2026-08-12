package com.dev.backend.modules.others.email.service;

public interface SendEmailService {
    void sendEmailRegister(String toEmail, String subject, String token);
}
