const URLEdit = 'http://localhost:8080/api/admin/users/';
const URLRolesForEdit = 'http://localhost:8080/api/admin/roles/';

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

async function getEditModal(id) {

    const userEdit = await getUserById(id); //нашли редактируемого юзера по id

    //Получили все значения, введенные в инпуты
    document.getElementById('edit-id').value = userEdit.id;
    document.getElementById('edit-username').value = userEdit.username;
    document.getElementById('edit-lastname').value = userEdit.lastname;
    document.getElementById('edit-age').value = userEdit.age;
    document.getElementById('edit-email').value = userEdit.email;
    document.getElementById('edit-password').value = userEdit.password;

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
            for (const role2 of userEdit.roles) {
                if (role1.name === role2.name) {
                    selected = 'selected';
                    break;
                }
            }
            rolesOfUser += `<option ${selected} value="${value}">${text}</option>`;
        }
        document.getElementById('edit-roles').innerHTML = rolesOfUser;
        $('#editModal').modal('show');
    } else {
        alert('Ошибка при получении списка ролей: ' + response.status);
    }
}

formEdit.addEventListener('submit', async (event) => {
    event.preventDefault();//Предотвращаем действие браузера по умолчанию, т.е. - перезагрузку

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

    await fetch(URLEdit + id, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }, body: JSON.stringify({
            id: id, username: username, lastname: lastname, age: age, email: email, password: password, roles: roles
        })
    })
        .then(() => {
            $('#editModal').modal('hide');
            getAllUsers();
        })
        .catch((error) => {
            alert(error);
        })
})