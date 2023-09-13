const URLFormNew = 'http://localhost:8080/api/admin/users';

const formNew = document.getElementById('formNew');//Положили в переменную форму для добавления нового юзера. У формы есть кнопка, тип которой submit


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

    await fetch(URLFormNew, {
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



