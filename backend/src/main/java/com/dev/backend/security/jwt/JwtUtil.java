package com.dev.backend.security.jwt;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.dev.backend.common.constant.JwtType;
import com.dev.backend.security.custom.CustomUserDetails;

import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {

   private final SecretKey signingKey;


    // ================= GENERATE =================
    public String generateAccessToken(CustomUserDetails userDetails) {
        String role = "";
        if (userDetails.getAuthorities() != null && !userDetails.getAuthorities().isEmpty()) {
            role = userDetails.getAuthorities().iterator().next().getAuthority();
        }
        
        return Jwts.builder()
                .setSubject(String.valueOf(userDetails.getUser().getId()))
                .claim("tokenVersion", userDetails.getUser().getTokenVersion())
                .claim("role", role)
                .claim("type", JwtType.ACCESS.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JwtType.ACCESS.getExpirationMillis()))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(Long userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.REFRESH);
    }

    public String generateVerifyToken(Long userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.VERIFY_EMAIL);
    }

    public String generateResetPasswordToken(Long userId, int tokenVersion) {
        return buildToken(userId, tokenVersion, JwtType.RESET_PASSWORD);
    }

    private String buildToken(Long userId, int tokenVersion, JwtType type) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("tokenVersion", tokenVersion)
                .claim("type", type.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + type.getExpirationMillis()))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= PARSE =================
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public Long extractUserId(String token) {
        return Long.parseLong(extractAllClaims(token).getSubject());
    }

    public JwtType extractType(String token) {
        String type = extractAllClaims(token).get("type", String.class);
        return JwtType.valueOf(type);
    }

    public int extractTokenVersion(String token) {
        Object versionObj = extractAllClaims(token).get("tokenVersion");
        if (versionObj instanceof Number) {
            return ((Number) versionObj).intValue();
        }
        return 0;
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ================= VALIDATE =================
    public boolean isValid(String token, JwtType expectedType) {
        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && expectedType.name().equals(claims.get("type", String.class))
                    && !isExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isExpired(String token) {
        return isExpired(extractAllClaims(token));
    }

    private boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    // ================= HELPER =================
    public boolean isTokenVersionValid(String token, Integer dbTokenVersion) {
        int dbVersion = dbTokenVersion == null ? 0 : dbTokenVersion;
        return extractTokenVersion(token) == dbVersion;
    }
}
