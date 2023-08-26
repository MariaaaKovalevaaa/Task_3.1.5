package ru.kata.spring.boot_security.demo.exception_handling;

/**Это класс для того, чтобы создался JSON при выбросе исключения.
 * Т.е. форма для сообщения об ошибке, которая будет помещена в тело http-response при выбросе исключения.
 * В нем будет только сообщение о том, что именно не так, поэтому у него только одно поле String
 * Т.е. просто при возникновении исключения объект этого класса превратится в JSON
 * и отобразится на экране.
 * */


public class FormForError {
    private String info;
    private Long timestamp; //отметка времени в миллисекундах, когда произошло исключение

    public FormForError(String info, Long timestamp) {
        this.info = info;
        this.timestamp = timestamp;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
