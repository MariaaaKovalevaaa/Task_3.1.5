// <---------------ФУНКЦИЯ ПОЛУЧЕНИЯ ДАННЫХ ДЛЯ НАВБАРА ТЕКУЩЕГО ЮЗЕРА И ВСТАВКИ ИХ В НАВБАР -------------------->

const URLForNavbar = 'http://localhost:8080/api/admin/showAccount';


const navbarBrand = document.getElementById('navbarBrand');//Элемент, где будет роль и почта текущего юзера

function getCurrentNavbar() {
    fetch(URLForNavbar)
        .then(function (response) {
            return response.json();
        })
        .then(function (user) {
            let rolesString = rolesToStringForNavbar(user.roles);

            navbarBrand.innerHTML = `<b><span>${user.email}</span></b>
                            <span>with roles:</span>
                            <span>${rolesString}</span>`;
        });
}

getCurrentNavbar()

function rolesToStringForNavbar(roles) {
    let rolesString = '';

    for (const element of roles) {
        rolesString += (element.name.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}

