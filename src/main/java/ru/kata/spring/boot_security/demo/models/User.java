package ru.kata.spring.boot_security.demo.models;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * //UserDetails нужен д/того, чтобы преобразовать юзера из БД к определенному стандарту, чтобы его понял Спринг Секьюрити.
 * //Т.е. UserDetails - это такая обертка д/Entity-класса.
 * //UserDetails заведует самым основным: полномочиями - getAuthorities(), паролем - getPassword() и
 * // именем юзера - getUsername()
 *
 * Аннотации @NotEmpty, @Size, @Email - это проверка на валидность.
 * Проверка на то, что объект типа User пришел от клиента корректный
 **/
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Имя не может быть пустым.")
    @Size(min = 2, max = 10, message = "Имя должно состоять от 2 до 10 символов.")
    @Column(name = "username")
    private String username;
    @NotEmpty(message = "Фамилия не может быть пустым.")
    @Size(min = 2, max = 10, message = "Фамилия должно состоять от 2 до 10 символов.")
    @Column(name = "lastname")
    private String lastname;

    @Size (min = 14, message = "Возраст может быть от 14 лет.")
    @Column(name = "age")
    private Byte age;

    @Email
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;



    @ManyToMany(fetch = FetchType.EAGER)
    //Здесь жадная загрузка, чтобы сразу грузились все дочерние зависимости юзера. fetch (извлечение)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),//Это колонка текущей сущности, т.е. User.
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    //Это колонка второй (обратной) сущности, с которой связан User, т.е. Role.
    private List<Role> roles = new ArrayList<>();

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User(String username, String lastname, Byte age, String email, String password, List<Role> roles) {
        this.username = username;
        this.lastname = lastname;
        this.age = age;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    public User(Long id, String username, String lastname, Byte age, String email, String password,
                List<Role> roles) {
        this.id = id;
        this.username = username;
        this.lastname = lastname;
        this.age = age;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }


    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Byte getAge() {
        return age;
    }

    public void setAge(Byte age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
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
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", roles=" + roles +
                '}';
    }
}


