const userURL = 'http://localhost:8080/api/user/';

const tableUser = document.getElementById('tableUser'); //Элемент, где будет таблица текущего юзера
const navbarBrand = document.getElementById('navbarBrand');//Элемент, где будет роль и почта текущего юзера

async function getCurrentUser() {
    const response = await fetch(userURL + 'showInfoUser');
    if (response.ok) {
        const user = await response.json();
        insertDataTableUser(user);
        insertDataNavbarBrand(user);
    } else {
        alert('Ошибка при получении текущего пользователя: ' + response.status);
    }
}

getCurrentUser()

function insertDataTableUser(user) {
    let rolesString = rolesToString(user.roles);
    tableUser.innerHTML = `<tr>
                                <td>${user.id}</td>
                                <td>${user.username}</td>
                                <td>${user.lastname}</td>
                                <td>${user.age}</td>
                                <td>${user.email}</td>
                                <td>${rolesString}</td>
                            </tr>`;
}

function insertDataNavbarBrand(user) {
    let rolesString = rolesToString(user.role);
    navbarBrand.innerHTML = `<b> <span>${user.username}</span></b>
                            <span>with roles:</span>
                            <span>${rolesString}</span>`;
}

function rolesToString(roles) {
    let rolesString = '';
    for (const element of roles) {
        rolesString += (element.name.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}
