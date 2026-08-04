package com.dev.backend.security.custom;

import com.dev.backend.common.exception.BadRequestException;
import com.dev.backend.modules.shop.entity.Shop;
import com.dev.backend.modules.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user, Collection<? extends GrantedAuthority> authorities) {
        this.user = user;
        this.authorities = authorities;
    }

    public static CustomUserDetails build(User user) {
        Collection<GrantedAuthority> authorities = Collections.emptyList();

        if (user.getRole() != null) {
            String code = user.getRole().getCode();
            String name = user.getRole().getName();
            String roleStr = (code != null && !code.isBlank()) ? code : name;

            if (roleStr != null && !roleStr.isBlank()) {
                String authorityName = roleStr.startsWith("ROLE_") ? roleStr : "ROLE_" + roleStr;
                authorities = Collections.singletonList(new SimpleGrantedAuthority(authorityName));
            }
        }

        return new CustomUserDetails(user, authorities);
    }

    public User getUser() {
        return user;
    }

    public Long getUserId() {
        return user.getId();
    }

    public Long getShopId() {
        if (user.getShop() == null) {
            throw new BadRequestException("Người dùng chưa có cửa hàng.");
        }
        return user.getShop().getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }
}
