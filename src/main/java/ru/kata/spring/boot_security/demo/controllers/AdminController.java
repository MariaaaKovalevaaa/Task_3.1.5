package ru.kata.spring.boot_security.demo.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.DTO.UserDTO;
import ru.kata.spring.boot_security.demo.exception_handling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.exception_handling.UserNotCreatedException;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

/**
 * RestController – это Controller, который управляет REST запросами и ответами.
 * Такие Спринг-приложении, которые принимают http-запросы и не реализуют представления,
 * а отдают сырые данные в формате JSON (в 99% случаев, т.к. это самый распространенный формат),
 * называются REST API.
 * По принятому стандарту url любого запроса в REST API должно начинаться с /api,
 * поэтому всему rest-контроллеру ставим такой url
 * Теперь, когда со стороны клиента, т.е. браузера, будет приходить запрос, содержащий в url "/api",
 * то Спринг с помощью функционала проекта Jackson будет конвертировать данные в JSON-формат
 * и в теле http-response будет передан JSON, который отобразится в браузере.
 * <p>
 * Чтобы получать о запросах и ответа больше инфы, есть разные проги. Одна из них - Postman.
 * Т.е. в качестве клиента будет не браузер, а Postman.
 */

@CrossOrigin //позволяет выполнять запросы между разными источниками
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final ModelMapper modelMapper; ///используется, чтобы конвертировать UserDTO в User и наоборот.

    @Autowired
    public AdminController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    /*
    Метод для получения данных, которые будут отображаться в панели (mail и роль)
     */

    @GetMapping("/showInfoUser")
    public ResponseEntity<User> authorization_data (Principal principal) {
        return ResponseEntity.ok (userService.findByUsername(principal.getName()));
    }

    /**
     * Метод получения списка всех юзеров.
     * Аннотация GET, потому что мы хотим получить список.
     * Когда со стороны клиента, т.е. браузера, будет приходить запрос "/api/users",
     * то Спринг с помощью функционала проекта Jackson будет конвертировать данные в JSON-формат
     * и в теле http-response будет передан список юзеров в формате JSON, который отобразится в браузере.
     * Метод ниже среагирует на запрос "/users", посланный с помощью метода GET
     * Здесь тоже используем конвертацию с помощью ModelMapper - из User в UserDTO,
     * который будет отправлять в качестве ответа клиенту.
     * Клиенту не нужны все поля User, ему нужно видеть только поля UserDTO
     * <p>
     * map(this::convertToUserDTO) - означает, что каждый элемент списка сконвертировали в UserDTO
     * затем создали из них список
     */
//    @GetMapping("/users")
//    public List<UserDTO> showAllUsers() {
//        return userService.findAll()
//                .stream()
//                .map(this::convertToUserDTO)
//                .collect(Collectors.toList());
//    }

// Переписала метод получения юзеров. Решила, что здесь должны быть юзеры в их обычном виде, а не в DTO, т.к. это инфа д/админа
//    @GetMapping("/users")
//    public ResponseEntity<List<User>> allUsers() {
//        List <User> listUsers = userService.findAll();
//        return new ResponseEntity<>(listUsers, HttpStatus.OK);
//    }
    @GetMapping("/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    /**
     * Метод получения юзера по id.
     * В теле http-response будет передан юзер в формате JSON,
     * который отобразится в браузере.
     * Метод ниже среагирует на запрос "/users/{id}", посланный с помощью метода GET
     * ResponseEntity - это обертка для http-response, т.е. по сути мы получаем http-response, только в обертке
     * Исключение NoSuchUserException регулируется UserGlobalExceptionHandler, который будет ответственен за возвращение нам
     * JSONа с инфой. Т.е. этот JSON будет возвращаться при выбрасывании NoSuchUserException.
     * <p>
     * Здесь тоже используем конвертацию с помощью ModelMapper - из User в UserDTO,
     * который будет отправлять в качестве ответа клиенту.
     * Клиенту не нужны все поля User, ему нужно видеть только поля UserDTO
     */
//    @GetMapping("/users/{id}")
//    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id) {
//        UserDTO userDTO = convertToUserDTO(userService.findUserById(id));//нужно сразу конвертировать в UserDTO, потому что это для клиента
//        if (userDTO == null) {
//            throw new NoSuchUserException("Пользователя с ID = " + id + " нет в БД");
//        }
//        return new ResponseEntity<>(userDTO, HttpStatus.FOUND);
//    }

// Переписала метод получения юзера по id. Решила, что здесь должен быть юзер в обычном виде, а не в DTO, т.к. это инфа д/админа
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NoSuchUserException("Пользователя с ID = " + id + " нет в БД");
        }
        return new ResponseEntity<>(user, HttpStatus.FOUND);
    }



    /**
     * Метод добавления юзера.
     * Метод ниже среагирует на запрос "/api/admin/users", посланный с помощью метода POST
     * В этом методе нам нужно использовать инфу о новом юзере, которую посылаем в теле запроса,
     * поэтому используем аннотацию @RequestBody (тело запроса), в котором UserDTO userDTO
     * UserDTO - это пройслойка м/у тем, что прислал клиент, и тем, что будет принимать сервер.
     * Т.е. на сервере этот объект, присланный от клиента, можно дополнить другими полями, либо,
     * наоборот, убрать какие-то поля, т.е. привести объект от клиента к тому виду, который нужен серверу.
     * Для этого на сервере UserDTO будет конвертирован в User.
     * <p>
     * С помощью аннотации @RequestBody параметр в методе UserDTO userDTO, принятый в формате JSON от клиента,
     * за кулисами с помощью Jackson конвертируется из JSON в java-объект
     * Аннотация @Valid проверяет полученный от клиента объект на валидность
     * по аннотациям в классе User - @NotEmpty, @Size, @Email
     * BindingResult нужен, чтобы узнать, были ли ошибки валидации и какие
     * Под UserNotCreatedException нужен метод @ExceptionHandler в классе UserGlobalExceptionHandler,
     * чтобы он его поймал и прислал какой-то JSON
     */

    @PostMapping("/users")
    public ResponseEntity<User> addNewUser(@RequestBody @Valid UserDTO userDTO, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder info_about_errors = new StringBuilder(); //Создали строку, в которую поместим ошибки
            List<FieldError> fields_of_errors = bindingResult.getFieldErrors(); //Получили список из полей, где произошли ошибки

            for (FieldError error : fields_of_errors) { //Прошлись по ошибкам
                info_about_errors.append(error.getField()) // в строку добавили само поле
                        .append(" - ")
                        .append(error.getDefaultMessage()) //добавили сообщение ошибки
                        .append(";");
            }

            throw new UserNotCreatedException(info_about_errors.toString());
        }
        User user = convertToUser(userDTO); // Конвертируем UserDTO в User перед сохранением в БД
        userService.saveUser(user); // Сохраняем в БД
        return new ResponseEntity<>(user, HttpStatus.OK); //Ответ в виде JSON
    }

    /**
     * Метод изменения юзера.
     * В аннотации PUT, т.к. мы апдейтим данные.
     * в теле запроса будут переданы те данные, на которые нужно изменить. И они же придут ответом.
     * С помощью аннотации @RequestBody параметр в методе UserDTO userDTO, принятый в формате JSON от клиента,
     * за кулисами с помощью Jackson конвертируется из JSON в java-объект
     */

    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody UserDTO userDTO) {
        User userFromWebPage = convertToUser(userDTO);
        userService.updateUser(userFromWebPage, userFromWebPage.getId());
        return new ResponseEntity<>(userFromWebPage, HttpStatus.OK);
    }


//    @PutMapping("/users")
//    public ResponseEntity<User> updateUser(@RequestBody User user) {
//        userService.updateUser(user, user.getId());
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }


    /**
     * Метод удаления юзера.
     * Сначала наход юзера по id, проверяем, что он существует в БД и тогда удаляем.
     * Если такого нет, то выбрасываем исключение.
     */


    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NoSuchUserException("Пользователь с id = " + id + " не найден в БД и не может быть удален");
        }
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * Метод конвертации UserDTO (то, что пришло от клиента) в User
     * ModelMapper используется, чтобы конвертировать UserDTO в User и наоборот.
     * В нем задаем исходный объект и целевой класс, т.е. тот класс,
     * в объект которого нужно конвертировать то, что пришло от клиента
     * ModelMapper найдет все поля в userDTO, которые совпадают по названию в User,
     * и положит все поля в User из userDTO
     */
    public User convertToUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    /**
     * Метод конвертации User в UserDTO
     * Нужно для отправки ответа клиенту.
     * Клиенту не нужно видеть всех полей User
     */

    public UserDTO convertToUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
}





