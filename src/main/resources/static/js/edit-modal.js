let formEdit = document.forms["formEdit"];
editUser();

const URLEdit = "http://localhost:8080/api/admin/users/";

async function editModal(id) {
    const modalEdit = new bootstrap.Modal(document.querySelector('#editModal'));
    await open_fill_modal(formEdit, modalEdit, id);
    loadRolesForEdit();
}

// function editModal(id) {
//     const modalEdit = new bootstrap.Modal(document.querySelector('#editModal'));
//     const modalEditFill = open_fill_modal(formEdit, modalEdit, id);
//     loadRolesForEdit();
// }
function editUser() {
    formEdit.addEventListener("submit", ev => {
        ev.preventDefault();

        // let id = document.getElementById('edit-id').value;
        // let username = document.getElementById('edit-username').value;
        // let lastname = document.getElementById('edit-lastname').value;
        // let age = document.getElementById('edit-age').value;
        // let email = document.getElementById('edit-email').value;
        // let password = document.getElementById('edit-password').value;

        //Приведение ролей из вида js к виду java
        let rolesForEdit = [];
        for (let i = 0; i < formEdit.roles.options.length; i++) {
            if (formEdit.roles.options[i].selected) rolesForEdit.push({
                id: formEdit.roles.options[i].value,
                role: "ROLE_" + formEdit.roles.options[i].text
            });
        }

        // let user = getUserById(formEdit.id.value);

        fetch(URLEdit + formEdit.id.value, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // id: id,
                // username: username,
                // lastname: lastname,
                // age: age,
                // email: email,
                // password: password,
                // roles: rolesForEdit


                id: formEdit.id.value,
                username: formEdit.username.value,
                lastname: formEdit.lastname.value,
                age: formEdit.age.value,
                email: formEdit.email.value,
                password: formEdit.password.value,
                roles: rolesForEdit
            })
        }).then(() => {
            $('#editClose').click();
            getAllUsers();
        });
    });
}

//Приведение ролей к виду JS
function loadRolesForEdit() {
    let selectEdit = document.getElementById("edit-roles");
    selectEdit.innerHTML = "";

    fetch("http://localhost:8080/api/admin/roles")
        .then(res => res.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.name.toString().replace('ROLE_', '');
                selectEdit.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}
window.addEventListener("load", loadRolesForEdit);

