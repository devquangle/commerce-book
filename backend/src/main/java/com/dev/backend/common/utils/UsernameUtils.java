package com.dev.backend.common.utils;

import java.security.SecureRandom;

public final class UsernameUtils {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final SecureRandom RANDOM = new SecureRandom();

    private UsernameUtils() {
    }

    public static String generateRandomUsername() {

        StringBuilder username = new StringBuilder("user_");

        for (int i = 0; i < 8; i++) {
            username.append(
                    CHARACTERS.charAt(
                            RANDOM.nextInt(CHARACTERS.length())
                    )
            );
        }

        return username.toString();
    }
}

