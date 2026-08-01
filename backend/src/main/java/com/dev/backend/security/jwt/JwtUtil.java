package com.dev.backend.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dev.backend.common.constant.JwtType;
import com.dev.backend.security.custom.CustomUserDetails;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey signingKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secretKey);
        } catch (IllegalArgumentException e) {
            keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ================= GENERATE =================
    public String generateAccessToken(CustomUserDetails userDetails) {
        return Jwts.builder()
                .setSubject(String.valueOf(userDetails.getUser().getId()))
                .claim("tokenVersion", userDetails.getUser().getTokenVersion())
                .claim("roles", userDetails.getRoles())
                .claim("permissions", userDetails.getPermissions())
                .claim("type", JwtType.ACCESS.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JwtType.ACCESS.getExpirationMillis()))
                .signWith(signingKey(), SignatureAlgorithm.HS256)
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
                .signWith(signingKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= PARSE =================
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long extractUserId(String token) {
        return Long.parseLong(extractAllClaims(token).getSubject());
    }

    public JwtType extractType(String token) {
        String type = extractAllClaims(token).get("type", String.class);
        return JwtType.valueOf(type);
    }

    public int extractTokenVersion(String token) {
        Integer version = extractAllClaims(token).get("tokenVersion", Integer.class);
        return version == null ? 0 : version;
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractPermissions(String token) {
        return extractAllClaims(token).get("permissions", List.class);
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
    public boolean isTokenVersionValid(String token, int dbTokenVersion) {
        return extractTokenVersion(token) == dbTokenVersion;
    }
}
