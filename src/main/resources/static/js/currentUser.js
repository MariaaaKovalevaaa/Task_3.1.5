const URLCurrentUser = 'http://localhost:8080/api/admin/users/';

const tableUser = document.getElementById('tableUser');//Элемент, где будет таблица текущего юзера

// <!----------ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ТЕКУЩЕГО ЮЗЕРА------->
function getCurrentUser(id) {
    fetch(URLCurrentUser + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (user) {
            let rolesString = rolesToString(user.roles);

            tableUser.innerHTML = `<tr>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.lastname}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td>${rolesString}</td>
                            </tr>`;
        })
}

getCurrentUser()

function rolesToString(roles) {
    let rolesString = '';
    for (let element of roles) {
        rolesString += (element.name.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}