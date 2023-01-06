import { addContact } from './modules/expanded.js';

// retrieve the user information
let userInfo = window.localStorage.getItem('raw-data');
userInfo = JSON.parse(userInfo);

// dynamic variables for page
let currentButton = null;
let currentChat = null;

// use the specified username as the username
function displayUsername(username) {
    document.getElementById('username').innerText = username;
}

// use the specified param as name of the user
function displayName(name) {
    document.getElementById('name').innerText = name;
}

function displayChatDetail(username, name) {
    document.getElementById('contact-username').innerText = username;
    document.getElementById('contact-name').innerText = name;
}

function displayPopup() {
    document.getElementById('popup').style.display = '';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

function displayContactAddMessage(message) {
    document.getElementById('contact-add-message').innerText = message;
}

// add the specified username to contacts
function addChatUser(chatUsername) {
    const chatList = document.getElementById('chat-list');

    // generates a new button
    const clickableUser = document.createElement('button');
    clickableUser.innerText = `@${chatUsername}`;
    chatList.appendChild(clickableUser);

    // add onclick event
    clickableUser.onclick = () => {
        clickableUser.classList.add('selected');
        if (currentButton != null)
            currentButton.classList.remove('selected');
        currentButton = clickableUser;
        displayChatDetail(`@${chatUsername}`, 'sampleUser');
    };
}

function getContactValues() {
    return {
        contactUsername: document.getElementById('usernameContact').value,
        key: document.getElementById('key').value
    };
}

// logs out the user by deleting the token
function logout() {
    document.cookie = `token=''; path=/`;
    window.location.href = '/login.html';
}


/////////////////////////////////
//  buttons inputs and others  //
/////////////////////////////////
// logout button
document.getElementById('logout').onclick = () => {
    logout();
};

document.getElementById('addContact').onclick = () => {
    displayPopup();
};

document.getElementById('cancel').onclick = () => {
    hidePopup();
};

// events with permissions here
document.getElementById('check').onclick = () => {
    const data = getContactValues();
    addContact(data, (jsonData) => {
        if (!jsonData.existing) {
            displayContactAddMessage('Entered Username does not exist');
            return;
        }

        if (jsonData.added) {
            window.localStorage.setItem('token', jsonData.token);
            window.localStorage.setItem('raw-data', JSON.stringify(jsonData.data));
            document.cookie = `token=${jsonData.token}; path=/`;
            window.location.reload();    
        } else {
            displayContactAddMessage('Key does not match the user\'s key');
        }
    });
};

///////////////////////
//  initializations  //
///////////////////////
console.log(userInfo);
displayUsername(userInfo.username);
displayName(userInfo.accountDetails.name);

// displays each chat on screen
const contacts = Object.keys(userInfo.contacts);
contacts.forEach(usernameContact => {
    console.log(usernameContact);
    addChatUser(usernameContact);
});