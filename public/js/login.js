const buttons = document.getElementsByTagName('button');

const login = buttons.item(0);
const signup = buttons.item(1);

signup.onclick = () => {
    window.location.href = '/signup.html';
};