const adminURL = 'http://localhost:8080/api/admin/';

const formEdit = document.getElementById('formEdit'); //Положили в переменную форму для редактирования. У формы есть кнопка, тип которой submit
const formDelete = document.getElementById('formDelete');//Положили в переменную форму для удаления. У формы есть кнопка, тип которой submit
const formNew = document.getElementById('formNew');//Положили в переменную форму для добавления нового юзера. У формы есть кнопка, тип которой submit

const tableUser = document.getElementById('tableUser');//Элемент, где будет таблица текущего юзера
const tableUsers = document.getElementById('tableUsers');
const navbarBrand = document.getElementById('navbarBrand');//Элемент, где будет роль и почта текущего юзера


// <!---------------- ФУНКЦИЯ ПОЛУЧЕНИЯ ВСЕХ ЮЗЕРОВ----------------------->
async function getAllUsers() {
    const response = await fetch(adminURL + 'users');
    if (response.ok) {
        const users = await response.json();
        insertDataForTableUsers(users);

    } else {
        alert('Ошибка при получении списка всех пользователей: ' + response.status);
    }
}

getAllUsers()


// <!----------ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ТЕКУЩЕГО ЮЗЕРА------->
async function getCurrentUser() {
    const response = await fetch(adminURL + 'showInfoUser');
    if (response.ok) {
        const user = await response.json();
        insertDataCurrentUser(user);
        insertDataForNavbarBrand(user);
    } else {
        alert('Ошибка при получении данных текущего пользователя: ' + response.status);
    }
}

getCurrentUser()



function insertDataForTableUsers(users) {

    let dataOfUsers = '';
    let roles = ''; // Здесь будет результат функции rolesToString

    for (const user of users) {

        roles = rolesToString(user.role);

        dataOfUsers += `<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.lastname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td> 



                         <!--На кнопку Edit повесили событие editUser(id) -->
                        <td>
                            <button type="button" class="btn btn-info" id="${'#editModal' + user.id}"
                            onclick="editUser(${user.id})">
                                Edit
                            </button>
                        </td>

                        <!--На кнопку Delete повесили событие deleteUser(id) -->
                        <td>
                            <button type="button" class="btn btn-danger" id="${'#deleteModal' + user.id}"
                            onclick="deleteUser(${user.id})">
                                Delete
                            </button>
                        </td>
                    </tr>`;
    }
    tableUsers.innerHTML = dataOfUsers;
}


// <---------------ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ДЛЯ ТАБЛИЦЫ ТЕКУЩЕГО ЮЗЕРА И ВСТАВКИ ИХ В ТАБЛИЦУ -------------------->
function insertDataCurrentUser(user) {

    let rolesString = rolesToString(user.role);

    tableUser.innerHTML = `<tr>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.lastname}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td>${rolesString}</td>
                            </tr>`;
}

// <---------------ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ДЛЯ НАВБАРА ТЕКУЩЕГО ЮЗЕРА И ВСТАВКИ ИХ В НАВБАР -------------------->
function insertDataForNavbarBrand(user) {
    let rolesString = rolesToString(user.role);
    navbarBrand.innerHTML = `<b><span>${user.username}</span></b>
                            <span>with roles:</span>
                            <span>${rolesString}</span>`;
}


//ФУНКЦИЯ НАЙТИ ЮЗЕРА ПО id. НУЖНА Д/РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
async function getUserById(id) {
    const response = await fetch(adminURL + id);
    if (response.ok) {
        return await response.json();
    } else {
        alert('Ошибка при получении пользователя по "id": ' + response.status);
    }
}

//----САМА ФУНКЦИЯ РЕДАКТИРОВАНИЯ ЮЗЕРА. СРАБОТАЕТ, КОГДА НАЖМУТ НА КНОПКУ Edit (при каждом юзере в таблице), Т.К. НА НЕЕ ПОВЕШЕНО СОБЫТИЕ--------
async function editUser(id) {

    const user = await getUserById(id); //нашли редактируемого юзера по id

    //Получили все значения, введенные в инпуты
    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-lastname').value = user.lastname;
    document.getElementById('edit-age').value = user.age;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-password').value = user.password;

    //Получаем значение ролей ниже
    const response = await fetch(adminURL + 'roles');

    if (response.ok) {
        const roles = await response.json();

        let rolesOfUser = '';

        for (const role1 of roles) {
            let value = role1.id;
            let text = role1.name;
            text = text.toString().substring(5, text.length); //показываем с 5 ячейки, т.е. пропуская "ROLE_"
            let selected = '';
            for (const role2 of user.roles) {
                if (role1.name === role2.name) {
                    selected = 'selected';
                    break;
                }
            }
            rolesOfUser += `<option ${selected} value="${value}">${text}</option>`;
        }
        document.getElementById('edit-roles').innerHTML = rolesOfUser;
        $('#editModal').modal('show'); //обратились к модалке редактирования по его id и говорим показать его
    } else {
        alert('Ошибка при получении списка ролей: ' + response.status);
    }
}

// <!----ФУНКЦИЯ, ОТПРАВЛЯЮЩАЯ НА СЕРВЕР ИЗМЕНЕННЫЕ ДАННЫЕ ЮЗЕРА ПРИ НАЖАТИИИ НА КНОПКУ EDIT В МОДАЛЬНОМ ОКНЕ Д/РЕДАКТИРОВАНИЯ
// ЭТО ТО, ЧТО ПРОИСХОДИТ В САМОМ МОДАЛЬНОМ ОКНЕ--->
// Повесили событие на форму для редактирования юзера
//назначаем функцию обработчика событий, которая будет вызываться при событии 'submit'
formEdit.addEventListener('submit', async (event) => {
    event.preventDefault(); //Предотвращаем действие браузера по умолчанию, т.е. - перезагрузку

    //Получаем значения, введенные в инпуты
    let id = document.getElementById('edit-id').value;
    let username = document.getElementById('edit-username').value;
    let lastname = document.getElementById('edit-lastname').value;
    let age = document.getElementById('edit-age').value;
    let email = document.getElementById('edit-email').value;
    let password = document.getElementById('edit-password').value;

    let roles = Array
        .from(document.getElementById('edit-roles').options)
        .filter(option => option.selected) //отфильтровать выбранный
        .map(option => ({id: option.value, name: `ROLE_${option.text}`}));

    await fetch( //посылаем PUT-запрос с измененными данными юзера
        adminURL + 'users', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }, body: JSON.stringify({
                id: id, username: username, lastname: lastname, age: age, email: email, password: password, roles: roles
            })
        })
        .then(() => {
            formEdit.reset(); //очищаем поля формы
            $('#editClose').click(); //обратились к кнопке-закрывашке модалки д/редактирования и говорим, что нужно кликнуть по ней
            getAllUsers(); //получаем список юзеров с учетом изменений

            // $('#nav-home-tab').click();
        })
        .catch((error) => {
            alert(error); //вызов ошибок, если они будут
        })
})


//---САМА ФУНКЦИЯ УДАЛЕНИЯ ЮЗЕРА. СРАБОТАЕТ, КОГДА НАЖМУТ НА КНОПКУ Delete (при каждом юзере в таблице), Т.К. НА НЕЙ ПОВЕШЕНО СОБЫТИЕ--------
async function deleteUser(id) {

    const user = await getUserById(id);

    document.getElementById('delete-id').value = user.id;
    document.getElementById('delete-username').value = user.username;
    document.getElementById('delete-lastname').value = user.lastname;
    document.getElementById('delete-age').value = user.age;
    document.getElementById('delete-email').value = user.email;
    document.getElementById('delete-password').value = user.password;

    const response = await fetch(adminURL + 'roles');
    if (response.ok) {
        const roles = await response.json();

        let insertCode = '';

        for (const role1 of roles) {
            let value = role1.id;
            let text = role1.name;
            text = text.toString().substring(5, text.length);
            let selected = '';
            for (const role2 of user.roles) {
                if (role1.name === role2.name) {
                    selected = 'selected';
                    break;
                }
            }
            insertCode += `<option ${selected} value="${value}">${text}</option>`;
        }
        document.getElementById('delete-roles').innerHTML = insertCode;
        $('#deleteModal').modal('show');
    } else {
        alert('Ошибка при получении списка ролей: ' + response.status);
    }
}


// <!----ФУНКЦИЯ, ОТПРАВЛЯЮЩАЯ НА СЕРВЕР DELETE-ЗАПРОС ПРИ НАЖАТИИИ НА КНОПКУ DELETE В МОДАЛЬНОМ ОКНЕ Д/УДАЛЕНИЯ --->
// Повесили событие на форму для удаления юзера
//назначаем функцию обработчика событий, которая будет вызываться при событии 'submit'
formDelete.addEventListener('submit', async (event) => {
    event.preventDefault();//Предотвращаем действие браузера по умолчанию, т.е. - перезагрузку

    let id = document.getElementById('delete-id').value; //Получили значения id из инпута

    await fetch(adminURL + 'users/' + id, {
        method: 'DELETE', headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(() => {
            formDelete.reset();//очищаем поля формы
            $('#deleteClose').click(); //обратились к кнопке-закрывашке модалки д/удаления и говорим, что нужно кликнуть по ней
            getAllUsers();
            // $('#nav-home-tab').click();
        })
        .catch((error) => {
            alert(error); //вызов ошибок, если они будут
        })
})


// <!-----ФУНКЦИЯ, ОТПРАВЛЯЮЩАЯ НА СЕРВЕР POST-ЗАПРОСОМ ДАННЫЕ НОВЫОГО ЮЗЕРА ПРИ НАЖАТИИИ НА КНОПКУ Add new user В ФОРМЕ Д/ДОБАВЛЕНИЯ --->
// Повесили событие на форму для добавления юзера
//назначаем функцию обработчика событий, которая будет вызываться при событии 'submit' (на кнопке Add new user)

formNew.addEventListener('submit', async (event) => {
    event.preventDefault(); //Предотвращаем действие браузера по умолчанию, т.е. - перезагрузку

    //Получаем значения, введенные в инпуты
    let username = document.getElementById('create-username').value;
    let lastname = document.getElementById('create-lastname').value;
    let age = document.getElementById('create-age').value;
    let email = document.getElementById('create-email').value;
    let password = document.getElementById('create-password').value;

    let roles = Array
        .from(document.getElementById('create-role').options)
        .filter(option => option.selected)
        .map(option => `ROLE_${option.text}`);

    await fetch(adminURL + 'users', {
        method: 'POST', headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }, body: JSON.stringify({
            username: username, lastname: lastname, age: age, email: email, password: password, roles: roles
        })
    })
        .then(() => {
            formNew.reset();  //очищаем поля формы
            getAllUsers();
            // $('#nav-home-tab').click();
        })
        .catch((error) => {
            alert(error);
        })
})


function rolesToString(roles) {
    let rolesString = '';
    for (const element of roles) {
        rolesString += (element.name.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}


