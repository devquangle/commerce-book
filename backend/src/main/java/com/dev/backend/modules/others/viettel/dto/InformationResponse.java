package com.dev.backend.modules.others.viettel.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Trích xuất thông tin giấy tờ tùy thân từ Viettel AI OCR
 * Chỉ lấy các trường cần thiết: id (CCCD), name (tên), birthday (ngày sinh),
 * sex (giới tính), nationality (quốc tịch), expiry (ngày hết hạn), address (địa chỉ thường trú)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InformationResponse {

    private String id;
    private String name;

    @JsonProperty("birthday")
    @JsonAlias({"birthday", "dob", "birth_day"})
    private String birthday;

    @JsonProperty("sex")
    @JsonAlias({"sex", "gender"})
    private String sex;

    private String nationality;
    private String expiry;
    private String address;

    public static InformationResponse fromJsonNode(JsonNode node) {
        if (node == null) {
            return null;
        }
        return InformationResponse.builder()
            .id(extract(node, "id", "id_number", "id_card", "identity_number"))
            .name(extract(node, "name", "full_name"))
            .birthday(extract(node, "birthday", "dob", "birth_day", "date_of_birth"))
            .sex(extract(node, "sex", "gender"))
            .nationality(extract(node, "nationality", "nation"))
            .expiry(extract(node, "expiry", "expiry_date", "valid_until"))
            .address(extract(node, "address", "recent_location", "place_of_residence"))
            .build();
    }

    private static String extract(JsonNode node, String... fieldNames) {
        for (String field : fieldNames) {
            if (node.hasNonNull(field)) {
                return node.get(field).asText();
            }
        }
        return null;
    }
}

