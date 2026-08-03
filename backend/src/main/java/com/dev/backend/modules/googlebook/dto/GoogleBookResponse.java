package com.dev.backend.modules.googlebook.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoogleBookResponse {
    private String volumeId;

    private String name;
    private List<String> authors;

    private String publishedDate;

    private String description;

    private Integer pageCount;
    private String language;
    private String isbn;

    private String thumbnail;

    private Double listPrice;

    private Double retailPrice;

}
