const URLEdit = 'http://localhost:8080/api/admin/users/';
const URLRolesForEdit = 'http://localhost:8080/api/admin/roles';

const formEdit = document.getElementById('formEdit'); //Положили в переменную форму для редактирования. У формы есть кнопка, тип которой submit


//ФУНКЦИЯ НАЙТИ ЮЗЕРА ПО id. НУЖНА Д/РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
async function getUserById(id) {
    const response = await fetch(URLEdit + id);
    if (response.ok) {
        return await response.json();
    } else {
        alert('Ошибка при получении пользователя по "id": ' + response.status);
    }
}

//----САМА ФУНКЦИЯ РЕДАКТИРОВАНИЯ ЮЗЕРА. СРАБОТАЕТ, КОГДА НАЖМУТ НА КНОПКУ Edit (при каждом юзере в таблице), Т.К. НА НЕЕ ПОВЕШЕНО СОБЫТИЕ--------
async function getEditModal(id) {

    const user = await getUserById(id); //нашли редактируемого юзера по id

    //Получили все значения, введенные в инпуты
    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-lastname').value = user.lastname;
    document.getElementById('edit-age').value = user.age;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-password').value = user.password;

    //Получаем значение ролей ниже
    const response = await fetch(URLRolesForEdit);

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

    await fetch(URLEdit, {
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
