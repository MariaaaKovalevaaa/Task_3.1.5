package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exception_handling.NoSuchUserException;
import ru.kata.spring.boot_security.demo.exception_handling.UserNotCreatedException;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Collection;
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
    private final RoleService roleService;
//    private final ModelMapper modelMapper; ///используется, чтобы конвертировать UserDTO в User и наоборот.

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
//        this.modelMapper = modelMapper;
    }

    @GetMapping("/showAccount")
    public ResponseEntity<User> showInfoUser (Principal principal) {
        return ResponseEntity.ok (userService.findByUsername(principal.getName()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<Collection<Role>> getAllRoles() {
        return new ResponseEntity<>(roleService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NoSuchUserException("Пользователя с ID = " + id + " нет в БД");
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<User> addNewUser(@RequestBody @Valid User newUser, @RequestParam("roles") String[] roles, BindingResult bindingResult) {

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
//        User user = convertToUser(userDTO);
        newUser.setRoles(roleService.createCollectionRoles(roles));
        userService.saveUser(newUser);
        return new ResponseEntity<>(newUser, HttpStatus.OK);

    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User userFromWebPage, @PathVariable("id") Long id) {
        userService.updateUser(userFromWebPage, id);
        return new ResponseEntity<>(userFromWebPage, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        if (user == null) {
            throw new NoSuchUserException("Пользователь с id = " + id + " не найден в БД и не может быть удален");
        }
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


//    /**
//     * Метод конвертации UserDTO (то, что пришло от клиента) в User
//     * ModelMapper используется, чтобы конвертировать UserDTO в User и наоборот.
//     * В нем задаем исходный объект и целевой класс, т.е. тот класс,
//     * в объект которого нужно конвертировать то, что пришло от клиента
//     * ModelMapper найдет все поля в userDTO, которые совпадают по названию в User,
//     * и положит все поля в User из userDTO
//     */
//    public User convertToUser(UserDTO userDTO) {
//        return modelMapper.map(userDTO, User.class);
//    }
//
//    /**
//     * Метод конвертации User в UserDTO
//     * Нужно для отправки ответа клиенту.
//     * Клиенту не нужно видеть всех полей User
//     */
//
//    public UserDTO convertToUserDTO(User user) {
//        return modelMapper.map(user, UserDTO.class);
//    }
}





