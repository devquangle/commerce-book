package com.dev.backend.modules.author.mapper;

import com.dev.backend.common.utils.TextUtils;
import com.dev.backend.modules.author.dto.AuthorRequest;
import com.dev.backend.modules.author.dto.AuthorResponse;
import com.dev.backend.modules.author.entity.Author;
import org.springframework.stereotype.Component;

@Component
public class AuthorMapper {

    public Author toEntity(Author author, AuthorRequest request) {
        if (author == null) {
            return null;
        }
        author.setName(TextUtils.capitalizeFully(request.getName()));
        author.setWikibaseItem(request.getWikibaseItem());
        author.setSlug(TextUtils.toSlug(request.getName()));
        author.setUrlImage(request.getUrlImage());
        author.setUrlBio(request.getUrlBio());
        author.setDescription(request.getExtract());
        author.setStatus(request.getStatus());
        return author;
    }

    public AuthorResponse toDTO(Author author) {
        if (author == null) {
            return null;
        }
        AuthorResponse authorResponse = new AuthorResponse();
        authorResponse.setId(author.getId());
        authorResponse.setName(author.getName());
        authorResponse.setWikibaseItem(author.getWikibaseItem());
        authorResponse.setSlug(author.getSlug());
        authorResponse.setUrlImage(author.getUrlImage());
        authorResponse.setUrlBio(author.getUrlBio());
        authorResponse.setDescription(author.getDescription());
        authorResponse.setStatus(author.getStatus());
        return authorResponse;

    }

}
