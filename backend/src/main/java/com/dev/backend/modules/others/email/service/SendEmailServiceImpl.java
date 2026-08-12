package com.dev.backend.modules.others.email.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SendEmailServiceImpl implements SendEmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendEmailRegister(String toEmail, String subject, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            log.error("to send email to {}", fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content(token), true);
            helper.setFrom(fromEmail);

            mailSender.send(message);
            System.out.println("✅ HTML email sent to " + toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}", toEmail, e);
        }
    }

    public String content(String token) {
        String verifyLink = "http://localhost:5173/verify-email?verifyToken=" + token;
        return """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='UTF-8'>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f2f2f2;
                                padding: 20px;
                            }
                            .container {
                                background-color: #fff;
                                padding: 30px;
                                border-radius: 10px;
                                max-width: 600px;
                                margin: auto;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .btn {
                                display: inline-block;
                                padding: 12px 20px;
                                background-color: #28a745;
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                                margin-top: 20px;
                            }
                            .btn:hover {
                                background-color: #1e7e34;
                            }
                            .code {
                                font-size: 24px;
                                font-weight: bold;
                                letter-spacing: 3px;
                                margin: 15px 0;
                                color: #007BFF;
                            }
                            .footer {
                                margin-top: 30px;
                                font-size: 14px;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <h2>Xác thực tài khoản</h2>

                            <p>Chào bạn 👋,</p>

                            <p>Cảm ơn bạn đã đăng ký tài khoản.</p>

                            <p>Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn:</p>

                            <a class='btn' href='%s'>Xác thực tài khoản</a>


                            <p>Liên kết sẽ hết hạn sau <strong>5 phút</strong>.</p>

                            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>

                            <div class='footer'>
                                <p>Trân trọng,<br><strong>BookStore</strong></p>
                            </div>
                        </div>
                    </body>
                    </html>
                """.formatted(verifyLink);
    }
}
