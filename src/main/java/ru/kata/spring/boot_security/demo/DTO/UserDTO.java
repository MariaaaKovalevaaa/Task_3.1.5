package ru.kata.spring.boot_security.demo.DTO;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

/**
 * DTO - Data Transfer Object (Объект для передачи данных) - Это слой между данными клиента и между моделью на сервере.
 * Т.е. в DTO те поля, которые видит и назначает клиент
 * А уже на сервере объект, поля которого заполнил частично клиент, можно дополнить на сервере (например, id назначает не клиент),
 * либо, наоборот, сократить какие-то поля (например, клиенту для проверки пароля нужно два поля, а на сервере оно не нужно)
 * DTO используется строго на уровне контроллера. Глубже лезть (в сервис или в репозиторий) не нужно
 * Аннотировать этот класс никак не нужно
 * Класс никак не связан с БД, поэтому аннотаций @Column быть не должно
 * Аннотации для валидации - @Size, @NotEmpty, @Email, - нужно оставить
 */
public class UserDTO {

    @NotEmpty(message = "Имя не может быть пустым.")
    @Size(min = 2, max = 10, message = "Имя должно состоять от 2 до 10 символов.")
    private String username;

    @NotEmpty(message = "Фамилия не может быть пустым.")
    @Size(min = 2, max = 10, message = "Фамилия должно состоять от 2 до 10 символов.")
    private String lastname;

    @Size (min = 14, message = "Возраст может быть от 14 лет.")
    private Byte age;

    @Email
    private String email;


    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
