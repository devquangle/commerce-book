package com.dev.backend.security.custom;

import com.dev.backend.modules.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails {

    private Long id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private boolean enabled;
    private boolean accountNonLocked;

    @JsonIgnore
    private User user;

    @Builder.Default
    private Set<String> roles = new HashSet<>();

    @Builder.Default
    private Set<String> permissions = new HashSet<>();

    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user, List<String> roles, List<String> permissions) {
        this.user = user;
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.enabled = user.isEnabled();
        this.accountNonLocked = user.isAccountNonLocked();
        this.roles = roles != null ? new HashSet<>(roles) : Collections.emptySet();
        this.permissions = permissions != null ? new HashSet<>(permissions) : Collections.emptySet();

        Set<String> roleSet = this.roles;
        this.authorities = roleSet.stream()
                .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public static CustomUserDetails build(User user) {
        Set<String> roles = new HashSet<>();
        if (user.getRole() != null) {
            String code = user.getRole().getCode();
            String name = user.getRole().getName();
            String roleStr = (code != null && !code.isBlank()) ? code : name;
            if (roleStr != null && !roleStr.isBlank()) {
                roles.add(roleStr);
            }
        }

        List<GrantedAuthority> authorities = roles.stream()
                .map(roleName -> roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return CustomUserDetails.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .accountNonLocked(user.isAccountNonLocked())
                .user(user)
                .roles(roles)
                .permissions(Collections.emptySet())
                .authorities(authorities)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomUserDetails userDetails = (CustomUserDetails) o;
        return Objects.equals(id, userDetails.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
