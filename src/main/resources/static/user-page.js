// Создаем переменные для получения данных для вывода на панель (mail и роль) и сразу же получаем данные
// для вывода в таблицу инфо для каждого пользователя о себе

const urlForInfoUser = 'http://localhost:8080/api/user/showInfoUser'; //url для получения данных для каждого юзера
const panel = document.getElementById('user-header'); //Элемент в DOM, где будет инфа для панели (mail и роль)
const dataForTableUser = document.getElementById("table-for-user"); // //Элемент в DOM, где будет инфа для юзера о себе

// <!-----------------------------Метод получения данных юзера о себе и данных для панели, где почта и роль---------------------->
function showAuthenticatedUser() {
    try {
        fetch(urlForInfoUser)//извлекли по методу showInfoUser аутентифицированного пользователя
            .then((response) => response.json())//конвертировали ответ от сервера в формат json
            .then((authenticatedUsers) => {
                for (let authenticatedUser of authenticatedUsers) {

                    let infoForTableUser = ''; //Создали переменную, куда сложить данные для таблицы

                    infoForTableUser += `<tr>
                    <td>${authenticatedUser.id}</td>
                    <td>${authenticatedUser.username}</td>
                    <td>${authenticatedUser.lastname}</td>
                    <td>${authenticatedUser.age}</td>
                    <td>${authenticatedUser.email}</td>
                    <td>${authenticatedUser.role.map(role => " " + role.role.substring(5))}</td> <!--роль отображается с 5 ячейки -->
                    </tr>`;

                    dataForTableUser.innerHTML = infoForTableUser; // Поместили в элемент table-for-user переменную infoForTable, куда положили данные юзера
                    panel.innerHTML = `<h5>${authenticatedUser.username} with roles: ${authenticatedUser.role.map(role => " " + role.role.substring(5))}</h5>`;
                }
            });
    } catch (e) {
        console.error(e)
    } finally {
    }
}

showAuthenticatedUser();