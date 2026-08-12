package com.dev.backend.modules.role.service;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.common.constant.ModuleConstants;
import com.dev.backend.common.exception.NotFoundException;
import com.dev.backend.modules.role.entity.Role;
import com.dev.backend.modules.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository repository;

    @Override
    public void insertData() {
        List<Role> roles = new ArrayList<>();
        Field[] fields = ModuleConstants.class.getDeclaredFields();

        for (Field field : fields) {
            // Chỉ lấy các trường public static final String
            if (Modifier.isStatic(field.getModifiers()) && field.getType() == String.class) {
                try {
                    String moduleCode = (String) field.get(null);

                    Role role = new Role();
                    role.setCode("ROLE_" + moduleCode);
                    role.setModule(moduleCode);
                    role.setName(moduleCode);
                    role.setDescription("Quản trị module " + moduleCode);

                    roles.add(role);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }

        if (!roles.isEmpty()) {
            repository.saveAll(roles);
        }
    }

    @Override
    public Role getRoleUser() {

        return repository.findByName(ModuleConstants.USER)
                .orElseThrow(() -> new NotFoundException("ROLE not found ROLE_USER"));
    }
}
