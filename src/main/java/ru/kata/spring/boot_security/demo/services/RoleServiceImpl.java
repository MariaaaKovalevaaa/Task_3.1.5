package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Collection<Role> createCollectionRoles(String[] roles) {
        Collection<Role> rolesCollection = new HashSet<>();
        for (String role : roles) {
            Optional<Role> optionalRole = roleRepository.findByName(role);
            optionalRole.ifPresent(rolesCollection::add);
        }
        return rolesCollection;
    }
}