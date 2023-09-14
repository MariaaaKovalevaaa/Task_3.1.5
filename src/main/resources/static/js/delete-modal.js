const URLDelete = 'http://localhost:8080/api/admin/users/';
const URLRolesForDelete = 'http://localhost:8080/api/admin/roles/';

// const formDelete = document.getElementById('formDelete');


//ФУНКЦИЯ НАЙТИ ЮЗЕРА ПО id. НУЖНА Д/РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
async function getUserById(id) {
    const response = await fetch(URLDelete + id);
    if (response.ok) {
        return await response.json();
    } else {
        alert('Ошибка при получении пользователя по "id": ' + response.status);
    }
}

async function getDeleteModal(id) {

    const userDelete = await getUserById(id);

    document.getElementById('delete-id').value = userDelete.id;
    document.getElementById('delete-username').value = userDelete.username;
    document.getElementById('delete-lastname').value = userDelete.lastname;
    document.getElementById('delete-age').value = userDelete.age;
    document.getElementById('delete-email').value = userDelete.email;
    document.getElementById('delete-password').value = userDelete.password;

    const response = await fetch(URLRolesForDelete);
    if (response.ok) {
        const roles = await response.json();

        let insertCode = '';

        for (const role1 of roles) {
            let value = role1.id;
            let text = role1.name;
            text = text.toString().substring(5, text.length);
            let selected = '';
            for (const role2 of userDelete.roles) {
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
async function deleteUser() {
    event.preventDefault();//Предотвращаем действие браузера по умолчанию, т.е. - перезагрузку

    let id = await document.getElementById('delete-id').value; //Получили значения id из инпута

    fetch(URLDelete + id, {
        method: 'DELETE', headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(() => {
            // formDelete.reset();//очищаем поля формы
            $('#editModal').modal('hide');
            getAllUsers();
        })
        .catch((error) => {
            alert(error);
        });
}




// function getDeleteModal(id) {
//     fetch(URL + '/' + id, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json;charset=UTF-8'
//         }
//     }).then(res => {
//         res.json().then(userDelete => {
//             document.getElementById('delete-id').value = userDelete.id;
//             document.getElementById('delete-username').value = userDelete.username;
//             document.getElementById('delete-lastname').value = userDelete.lastname;
//             document.getElementById('delete-age').value = userDelete.age;
//             document.getElementById('delete-email').value = userDelete.email;
//             document.getElementById('delete-password').value = userDelete.password;
//             document.getElementById('delete-roles').value = userDelete.roles;
//         })
//     });
// }
//
// function deleteUser() {
//     event.preventDefault();
//     let id = document.getElementById('delete-id').value;
//
//     fetch(URL + '/' + id, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json;charset=UTF-8'
//         },
//
//     })
//         .then(() => {
//             $('#deleteModal').modal('hide');
//             getAllUsers();
//         })
// }






















