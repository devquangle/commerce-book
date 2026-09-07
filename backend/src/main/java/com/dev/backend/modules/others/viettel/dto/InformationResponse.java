package com.dev.backend.modules.others.viettel.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformationResponse {
    private String id;
    private String name;
    private String birthday;
    private String sex;
    private String address;
    private String nationality;
    private String expiry;

    @JsonProperty("issue_date")
    @JsonAlias({"issue_date", "issueDate"})
    private String issueDate;

    @JsonProperty("issue_by")
    @JsonAlias({"issue_by", "issueBy"})
    private String issueBy;

    private String hometown;
    private String province;
    private String district;
    private String ward;
}

