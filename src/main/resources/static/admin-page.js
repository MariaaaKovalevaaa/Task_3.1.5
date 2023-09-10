// Создаем переменные для получения данных для вывода на панель (mail и роль) и сразу же получаем данные
// для вывода в таблицу инфо для каждого пользователя о себе

const urlForInfoUser = 'http://localhost:8080/api/admin/showInfoUser'; //url для получения данных для каждого юзера
const panel = document.getElementById('admin-header'); //Элемент в DOM, где будет инфа для панели (mail и роль)
const dataForTableAdmin = document.getElementById("table-for-admin"); // //Элемент в DOM, где будет инфа для юзера о себе

// <!-----------------------------Метод получения данных юзера о себе и данных для панели, где почта и роль---------------------->
function showAuthenticatedUser() {
    try {
        fetch(urlForInfoUser)//извлекли по методу showInfoUser аутентифицированного пользователя
            .then((response) => response.json())//конвертировали ответ от сервера в формат json
            .then((authenticatedUsers) => {
                for (let authenticatedUser of authenticatedUsers) {

                    let infoForTableAdmin = ''; //Создали переменную, куда сложить данные для таблицы

                    infoForTableAdmin += `<tr>
                    <td>${authenticatedUser.id}</td>
                    <td>${authenticatedUser.username}</td>
                    <td>${authenticatedUser.lastname}</td>
                    <td>${authenticatedUser.age}</td>
                    <td>${authenticatedUser.email}</td>
                    <td>${authenticatedUser.role.map(role => " " + role.role.substring(5))}</td> <!--роль отображается с 5 ячейки -->
                    </tr>`;

                    dataForTableAdmin.innerHTML = infoForTableAdmin; // Поместили в элемент table-for-user переменную infoForTable, куда положили данные админа
                    panel.innerHTML = `<h5>${authenticatedUser.username} with roles: ${authenticatedUser.role.map(role => " " + role.role.substring(5))}</h5>`;
                }
            });
    } catch (e) {
        console.error(e)
    } finally {
    }
}

showAuthenticatedUser();

// ------------------------------------------Метод получения всех юзеров---------------------------------------

const mainURL = "/api/admin/users"; //главный URL

/**Страницей нельзя безопасно манипулировать, пока документ не будет «готов».
 // jQuery определяет это состояние готовности за вас. Код, включенный внутрь,
 // $( document ).ready()будет выполняться только тогда, когда объектная модель документа страницы (DOM)
 // будет готова для выполнения кода JavaScript
 **/
$(document).ready(function () { //
    getAllUsers();
})

function getAllUsers() {
    try {
        fetch(mainURL)
            .then((res) => res.json())
            .then((allUsers) => {
                    for (let user of allUsers) {
                        let tableOfUsers = document.getElementById('table-of-users');
                        let dataForTableOfUsers = "";//переменная, куда поместим всю таблицу, а потом ее саму внедрим в элемент table-of-users

                        dataForTableOfUsers += '<tr>';
                        dataForTableOfUsers += '<td>' + user.id + '</td>';
                        dataForTableOfUsers += '<td>' + user.username + '</td>';
                        dataForTableOfUsers += '<td>' + user.lastname + '</td>';
                        dataForTableOfUsers += '<td>' + user.age + '</td>';
                        dataForTableOfUsers += '<td>' + user.email + '</td>';

                        let role = "";

                        /**
                         * let user = {
                         *   name: "John",
                         *   age: 30,
                         *   isAdmin: true
                         * };
                         *
                         * for (let key in user) { // ключи
                         *   alert( key );  // name, age, isAdmin - значения ключей
                         *   alert( user[key] ); // John, 30, true - сами значения, т.е. value
                         * }
                         */
                        for (let key of user.role) {
                            if (user.role[key].role === "ROLE_USER") {//key здесь id ролей. role здесь все роли юзера. ".role" - это поле в классе Role, т.е. ее имя
                                role = "USER";
                            } else {
                                role = "ADMIN";
                            }

                            // if (user.roles.length === 1) {
                            //     out += "<td>" + role + "</td>";
                            // } else if (i == 0) {
                            //     out += "<td>" + role + ", ";
                            // } else {
                            //     out += role + "</td>";
                            // }

                            dataForTableOfUsers += '<td>' + role + '</td>';
                        }

                        //onclick="getEditModal(id) - повесили событие - при клике сработает метод getEditModal(id)
                        dataForTableOfUsers += '<td>' + ' <button type="button" class="btn btn-info" data-bs-toggle="modal"' +
                            'onclick = "getEditModal(' + user.id + ')">' + 'Edit' +
                            '</button>' +
                            '</td>';

                        //onclick="getDeleteModal(id) - повесили событие - при клике сработает метод getDeleteModal(id)
                        dataForTableOfUsers += '<td>' +
                            '<button type="button" class="btn btn-danger" data-bs-toggle="modal"' +
                            'onclick = "getDeleteModal(' + user.id + ')">' + 'Delete' +
                            '</button>' +
                            '</td>';

                        dataForTableOfUsers += '<tr>';

                        tableOfUsers.innerHTML = dataForTableOfUsers; // таблице юзеров присвоили все, что положили в dataForTableOfUsers
                    }
                }
            );
    } catch (e) {
        console.error(e)
    } finally {
    }
}

// <--Функция получения (!), т.е. здесь ничего не отправляем на сервер, только получаем модальное окно для редактирования------->
function getEditModal(id) {
    try {
        fetch(mainURL + '/' + id, {
            headers: {
                'Accept': 'application/json', //Это ожидаемый формат данных ответа. Всегда должен быть application/json. Используется только для запросов с методом GET
            }
        }).then((response) => {
            response.json().then((userForEdit) => {

// --------------Это то, что откроется для редактирования, т.е. текущие значения--------------
                userForEdit.id = document.getElementById('edit_id').value; //edit_id - это id инпута (поля д/ввода значения) для id. Методом value сразу получаем значение д/редактирования
                userForEdit.username = document.getElementById('edit-username').value; //edit-username - это id для инпута для username
                userForEdit.lastname = document.getElementById('edit-lastname').value;
                userForEdit.age = document.getElementById('edit-age').value;
                userForEdit.email = document.getElementById('edit-email').value;
                userForEdit.password = document.getElementById('edit-password').value;
                userForEdit.roles = document.getElementById('edit_role').value; // Здесь будет рез-т кода ниже

                let selectRole = document.getElementById('edit_role'); //нашли эл-т, где есть теги option, в которых роли, т.е. это коллекция
                let options = selectRole.getElementsByTagName("option"); //Рез-т будет в виде коллекции, т.е. сколько option,
                // столько и будет позиций в коллекции. Эта коллекция будет в переменной выше userForEdit.roles

                for (let i = 0; i < selectRole.length; i++) { //Пробегаемся по полученной коллекции ролей
                    if (selectRole[i].value === userForEdit.roles[i].role) { // если 0 = 0
                        selectRole[i].selected = true; // то, выбираем 0 и утверждаем, и затем если
                        if (i === selectRole.length - 1) { //если  0 = 0, т.е. коллекция ролей закончилась, т.к. там всего две роли: 0 и 1, то больше перебирать нечего
                            break; // Итого: здесь будет роль под индексом 0
                        }
                    } else if (selectRole[i + 1].value === userForEdit.roles[i].role) { // если 0 ≠ 1 в строке (selectRole[i].value === userForEdit.roles[i].role),
                        selectRole[i + 1].selected = true; // то прибавляем к 0 единицу и будет равно и утверждаем ее. Итого: здесь будет роль под индексом 1
                    }
                }
            })
        });
    } catch (e) {
        console.error(e)
    } finally {
    }
}


// ---------------------------------Функция редактирования---------------------------
// На кнопке Edit внутри модального окна висит событие onclick="editUser()"
function editUser() {
    try {
        event.preventDefault(); //это для отмены действия браузера по умолчанию, т.е. чтобы браузер не перезагрузился (preventDefault - предотвращать то, что по умолчанию)

        //Здесь новые значения полей
        let id = document.getElementById('edit_id').value;
        let username = document.getElementById('edit-username').value;
        let lastname = document.getElementById('edit_lastname').value;
        let age = document.getElementById('edit_age').value;
        let email = document.getElementById('edit_email').value;
        let password = document.getElementById('edit_password').value;
        let roles = document.getElementById('edit_role').value;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i] === 'ROLE_ADMIN') {
                roles[i] = {
                    'id': 2,
                    'role': 'ROLE_ADMIN',
                    // "authority": "ROLE_ADMIN"
                }
            }
            if (roles[i] === 'ROLE_USER') {
                roles[i] = {
                    'id': 1,
                    'role': 'ROLE_USER',
                    // "authority": "ROLE_USER"
                }
            }

        }

        //отправляем новые значения серверу методом PUT, с заголовком и с телом PUT-запроса
        fetch(mainURL, {

            method: 'PUT',

            headers: { // заголовки
                'Content-Type': 'application/json;charset=UTF-8' //обозначает содержимое в формате JSON, закодированное в кодировке символов UTF-8
            },

            body: JSON.stringify({ //преобразование в JSON-строку

                'id': id,
                'username': username,
                'lastname': lastname,
                'age': age,
                'email': email,
                'password': password,
                'roles': roles
            })
        })
            .then(() => {
                const modalEdit = document.querySelector('#editModal'); //положили в переменную модальное окно редактирования
                modalEdit.hide(); //скрыли модальное окно
                getAllUsers(); //показали список всех юзеров с учетом редактирования
            })
    } catch (e) {
        console.error(e)
    } finally {
    }
}


// <------Функция получения (!), т.е. здесь ничего не отправляем на сервер, только получаем модальное окно для удаления------->
function getDeleteModal(id) {
    try {
        fetch(mainURL + '/' + id, {

            headers: {
                'Accept': 'application/json', //Это ожидаемый формат данных ответа. Всегда должен быть application/json. Используется только для запросов с методом GET
            }
        })
            .then((response) => {
                response.json()
                    .then((userForDelete) => {

                        //все значения будут disabled
                        userForDelete.id = document.getElementById('delete_id').value;
                        userForDelete.username = document.getElementById('delete-username').value;
                        userForDelete.lastname = document.getElementById('delete-lastname').value;
                        userForDelete.age = document.getElementById('delete-age').value;
                        userForDelete.email = document.getElementById('delete-email').value;
                        userForDelete.password = document.getElementById('delete-password').value;
                        userForDelete.roles = document.getElementById('delete_role').value;
                    })
            });
    } catch (e) {
        console.error(e)
    } finally {
    }
}

// ---------------------------------Функция удаления---------------------------
// На кнопке Delete внутри модального окна висит событие onclick="deleteUser()
function deleteUser() {
    try {
        event.preventDefault(); //это для отмены действия браузера по умолчанию, т.е. чтобы браузер не перезагрузился (preventDefault - предотвращать то, что по умолчанию)
        let id = document.getElementById('delete-id').value;

        fetch(URL + '/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },

        })
            .then(() => {
                const modalDelete = document.querySelector('#deleteModal'); //положили в переменную модальное окно удаления
                modalDelete.hide(); //скрыли модальное окно
                getAllUsers(); //показали список всех юзеров с учетом удаления
            })
    } catch (e) {
        console.error(e)
    } finally {
    }
}

// -------------------Функция добавления нового юзера---------------------

function addUser() {
    try {
        event.preventDefault(); //это для отмены действия браузера по умолчанию, т.е. чтобы браузер не перезагрузился (preventDefault - предотвращать то, что по умолчанию)
        let username = document.getElementById('create-username').value;
        let lastname = document.getElementById('create-lastname').value;
        let age = document.getElementById('create-age').value;
        let email = document.getElementById('create-email').value;
        let password = document.getElementById('create-password').value;
        let roles = $("#create-role").val() //значение выбранной роли


        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'username': username,
                'lastname': lastname,
                'age': age,
                'email': email,
                'password': password,
                'roles': roles
            })
        })
            //nav-users_table-tab - это кнопка "Users table".
            .then(() => {
                document.getElementById('nav-users_table-tab').click();
                getAllUsers();//показали список всех юзеров с учетом добавления нового юзера
                document.getElementById('formForNewUser').reset(); //для очистки формы
            })
    } catch (e) {
        console.error(e)
    } finally {
    }
}