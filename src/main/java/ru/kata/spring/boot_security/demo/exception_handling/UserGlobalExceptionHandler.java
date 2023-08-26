package ru.kata.spring.boot_security.demo.exception_handling;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * @ControllerAdvice (advice - совет) помечается класс, предоставляющий функциональность Global Exception Handler’a.
 * В этом классе вынесен ExceptionHandler-механизм в отдельную сущность, которую могут использовать все REST-контроллеры
 * В этом классе будут содержаться методы, ловящие исключения и отправляющие на отображение JSON.
 * Он будет пересылать клиенту http-response, в котором будет информация об исключении (сообщение исключения)
 */
@ControllerAdvice
public class UserGlobalExceptionHandler {

    /**
     * Метод, который будет возвращать JSON при выбрасывании NoSuchUserException
     * NoSuchUserException - это тот тип Exception, на который должен среагировать метод.
     * Аннотацией @ExceptionHandler помечается метод, ответственный за обработку исключений
     * Он возвращает ResponseEntity (это обертка http-response)
     * В дженерик указываем FormForError, т.к это класс-сущность, который помещается
     * в тело http-response при выбросе исключения.
     * Т.е. UserIncorrectData в данном случае -
     * это объект, который добавляется в http-response body.
     * Метод будет реагировать, если в запросе будет id, которого нет в БД,
     * т.е. если в url будет некорректная цифра - например, api/admin/users/1000000
     * В return - первый параметр (response) - это объект, который превратиться в JSON, второй - статус http-ответа
     * При создании объекта userIncorrectData, который помещается в тело ответа, первым параметром
     * делаем String - а в нашем случае это должно быть сообщение исключения, вторым - время выброса в миллисекундах
     */
    @ExceptionHandler //Аннотация, чтобы обозначить, что этот метод ловит исключение
    public ResponseEntity<FormForError> handleException(NoSuchUserException exception) {
        FormForError response = new FormForError(exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND); //Здесь вернется JSON
    }

    /**
     * Метод будет реагировать, если в запросе вместо id будет текст.
     * т.е. если в url будет, например, api/admin/users/abcbcb
     * Здесь просто будет отлавливать все возможные exception и в UserIncorrectData вставлять их message
     * В return - первый параметр (userIncorrectData) - это объект, который превратиться в JSON, второй - статус http-ответа
     * При создании объекта userIncorrectData, который помещается в тело ответа, первым параметром
     * делаем String - а в нашем случае это должно быть сообщение исключения, вторым - время выброса в миллисекундах
     */
    @ExceptionHandler
    public ResponseEntity<FormForError> handleException(Exception exception) {
        FormForError response = new FormForError(exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); //Здесь вернется JSON
    }

    //Метод-хэндлер для исключения UserNotCreatedException
    @ExceptionHandler
    public ResponseEntity<FormForError> handleException(UserNotCreatedException exception) {
        FormForError response = new FormForError(exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST); //Здесь вернется JSON
    }

}
