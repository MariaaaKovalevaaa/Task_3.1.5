package ru.kata.spring.boot_security.demo;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringBootSecurityDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootSecurityDemoApplication.class, args);
    }

    /**
     * Он нужен для конвертации UserDTO в User и наоборот.
     * Чтобы не создавать его каждый раз, пишем бин при запуске.
     * Будет находиться в Спринг-контексте. Он будет singleton.
     * Внедряем его в контроллер Админа
     */

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
