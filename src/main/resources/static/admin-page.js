// Создаем переменные для получения данных для вывода на панель (mail и роль) и сразу же получаем данные
// для вывода в таблицу инфо для каждого пользователя о себе

alert("Hello");

const urlForInfoUser = 'http://localhost:8080/api/admin/showInfoUser'; //url для получения данных
const panel = document.getElementById('admin-header'); //Элемент в DOM, где будет инфа для панели (mail и роль)
const dataForTableUser = document.getElementById("table-for-user"); // //Элемент в DOM, где будет инфа для юзера о себе

async function showAuthenticatedUser() {
    try {
        let response = await fetch(urlForInfoUser) //извлекли по методу showInfoUser аутентифицированного пользователя
        let users = await response.json();   //конвертировали ответ от сервера в формат json

        users.forEach(user => {

                let temp = '';

                temp += `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.lastname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.role.map(role => " " + role.role.substring(5))}</td> <!--роль отображается с 5 ячейки -->
            </tr>`;

                dataForTableUser.innerHTML = temp; // Поместили в элемент table-for-user переменную temp, куда положили данные юзера
                panel.innerHTML = `<h5>${user.username} with roles: ${user.role.map(role => " " + role.role.substring(5))}</h5>`;
            })
    } catch (e) {
        console.error(e)
    } finally {
    }
}

showAuthenticatedUser()

// --------------Метод получения всех юзеров-------------------

const mainURL = "/api/admin/users"; //главный URL

//Страницей нельзя безопасно манипулировать, пока документ не будет «готов».
// jQuery определяет это состояние готовности за вас. Код, включенный внутрь,
// $( document ).ready()будет выполняться только тогда, когда объектная модель документа страницы (DOM)
// будет готова для выполнения кода JavaScript
$(document).ready(function () { //
    getAllUsers();
})

function getAllUsers() {
    fetch(mainURL)
        .then((res) => res.json())
        .then((users) => {
                let tableOfUsers = document.getElementById('table-of-users');
                let output = ""; //переменная, куда поместим всю таблицу, а потом ее саму внедрим в элемент table-of-users

                for (let user of users) {

                    output += '<tr>';

                    output += '<td>' + user.id + '</td>';
                    output += '<td>' + user.username + '</td>';
                    output += '<td>' + user.lastname + '</td>';
                    output += '<td>' + user.age + '</td>';
                    output += '<td>' + user.email + '</td>';

                    let role = "";

                    for (let key of user.role) {
                        if (user.role[key].role === "ROLE_USER") {//key здесь id ролей. role здесь все роли юзера. ".role" - это поле в классе Role, т.е. ее имя
                            role = "USER";
                        } else {
                            role = "ADMIN";
                        }

                        output += '<td>' + role + '</td>';
                    }

                    //onclick="getEditModal(id) - повесили событие - при клике сработает метод getEditModal(id)
                    output += '<td>' + ' <button type="button" class="btn btn-info" data-bs-toggle="modal"' +
                        'onclick = "getEditModal(' + user.id + ')">' + 'Edit' +
                        '</button>' +
                        '</td>';

                    output += '<td>' +
                        '<button type="button" class="btn btn-danger" data-bs-toggle="modal"' +
                        'onclick = "getDeleteModal(' + user.id + ')">' + 'Delete' +
                        '</button>' +
                        '</td>';

                    output += '<tr>';
                }
                tableOfUsers.innerHTML = output; // таблице юзеров присвоили все, что положили в output
            }
        );
}


function getEditModal(id) {
    fetch (mainURL + '/' + id, {

    })
}