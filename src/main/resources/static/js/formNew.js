

let formNew = document.forms["formNew"];

createNewUser()

function createNewUser() {
    formNew.addEventListener("submit", ev => {
        ev.preventDefault();

        let roles = [];
        for (let i = 0; i < formNew.roles.options.length; i++) {
            if (formNew.roles.options[i].selected)
                roles.push({
                    id: formNew.roles.options[i].value,
                    role: "ROLE_" + formNew.roles.options[i].text
                });
        }

        fetch('http://localhost:8080/api/admin/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formNew.username.value,
                lastname: formNew.lastname.value,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: roles
            })
        }).then(() => {
            formNew.reset();
            $('#usersTable').click(); //клик по кнопке Users Table
            getAllUsers();
        });
    });
}

function loadRolesForNewUser() {
    let selectAdd = document.getElementById("create-roles");
    selectAdd.innerHTML = "";

    fetch("http://localhost:8080/api/admin/roles")
        .then(res => res.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role === "ROLE_USER" ? "USER" : role.role === "ROLE_ADMIN" ? "ADMIN" : role.name;
                selectAdd.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", loadRolesForNewUser);

// const formNew = document.getElementById('formNew');
//
// formNew.addEventListener('submit', async (event) => {
//     event.preventDefault();
//
//     let roles = Array
//         .from(document.getElementById('create-roles').options)
//         .filter(option => option.selected)
//         .map(option => `ROLE_${option.text}`);
//
//     let username = document.getElementById('create-username').value;
//     let lastname = document.getElementById('create-lastname').value;
//     let age = document.getElementById('create-age').value;
//     let email = document.getElementById('create-email').value;
//     let password = document.getElementById('create-password').value;
//
//     await fetch(
//         'http://localhost:8080/api/admin/users',
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json; charset=utf-8'
//             },
//             body: JSON.stringify(
//                 {
//                     username: username,
//                     lastname: lastname,
//                     age: age,
//                     email: email,
//                     password: password,
//                     roles: roles
//                 })
//         })
//         .then(() => {
//             formNew.reset();
//             $('#usersTable').click();
//             getAllUsers();
//
//         })
//         .catch((error) => {
//             alert(error);
//         })
// })
//
// async function setRolesToFormNew() {
//     const response = await fetch('http://localhost:8080/api/admin/roles');
//     if (response.ok) {
//         const roles = await response.json();
//         let insertCode = '';
//         for (const role of roles) {
//             let value = role.id;
//             let text = role.name;
//             text = text.toString().substring(5, text.length);
//             insertCode += `<option value="${value}">${text}</option>`;
//         }
//         document.getElementById('create-roles').innerHTML = insertCode;
//     } else {
//         alert('Ошибка при получении списка ролей: ' + response.status);
//     }
// }
//
// setRolesToFormNew()
//
// function rolesToString(roles) {
//     let rolesString = '';
//     for (const element of roles) {
//         rolesString += (element.name.toString().replace('ROLE_', '') + ', ');
//     }
//     rolesString = rolesString.substring(0, rolesString.length - 2);
//     return rolesString;
// }


