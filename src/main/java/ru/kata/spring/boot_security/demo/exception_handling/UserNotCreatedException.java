package ru.kata.spring.boot_security.demo.exception_handling;

public class UserNotCreatedException extends RuntimeException{
    public UserNotCreatedException(String message) {
        super(message);
    }
}
