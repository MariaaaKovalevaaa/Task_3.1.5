package ru.kata.spring.boot_security.demo.exception_handling;


/**Делаем свой класс-исключение.
Чтобы оно стало исключением наследуемся от RuntimeException
 */
public class NoSuchUserException extends RuntimeException {
    public NoSuchUserException(String message) {
        super(message);
    }
}
