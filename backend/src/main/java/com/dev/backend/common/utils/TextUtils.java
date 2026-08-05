package com.dev.backend.common.utils;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.github.slugify.Slugify;

public final class TextUtils {
    private static final Slugify SLUGIFY = Slugify.builder().build();

    private TextUtils() {
    }

    public static String capitalizeFully(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        // Tách chuỗi thành mảng các từ dựa vào khoảng trắng
        String[] words = input.trim().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                // Viết hoa chữ đầu của từ, viết thường các chữ sau
                result.append(word.substring(0, 1).toUpperCase())
                        .append(word.substring(1).toLowerCase())
                        .append(" "); // Thêm khoảng trắng giữa các từ
            }
        }

        // Trả về chuỗi đã cắt bỏ khoảng trắng thừa ở cuối
        return result.toString().trim();
    }

    public static String toSlug(String name) {
        String slug = SLUGIFY.slugify(name);
        return slug;
    }

   

    public static String urlImage(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }

        String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);

        return "https://ui-avatars.com/api/?name="
                + encodedName
                + "&background=random&size=128";
    }
}
