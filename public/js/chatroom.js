import { addContact, getUserDetails } from './modules/expanded.js';

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
        if (currentButton == clickableUser)
            return;

        clickableUser.classList.add('selected');
        if (currentButton != null)
            currentButton.classList.remove('selected');

        currentButton = clickableUser;
        getUserDetails(chatUsername,
            function (jsonData) {
                console.log(jsonData);
                if (jsonData.existing)
                    displayChatDetail(`@${chatUsername}`, jsonData.data.accountDetails.name);    
            },
            function (error) {
                console.log(error);
            });

        // hide the 'no message' display if not yet hidden and display the chat
        document.getElementById('no-message').style.display = 'none';
        document.getElementById('wrapper').style.display = '';
    };
}

// displays the message sent on the screen
function displaySentMessage(message) {
    const contentContainer = document.getElementById('scrollable');
    const chatContainer = document.createElement('div');
    const messageHolder = document.createElement('div');

    chatContainer.classList.add('my-message-container');
    messageHolder.classList.add('my-message');
    messageHolder.innerText = message;

    chatContainer.appendChild(messageHolder);
    contentContainer.appendChild(chatContainer);

    const scrollable = document.getElementById('wrapper');
    scrollable.scrollTop = scrollable.scrollHeight;
}

// displays message that is recieved from the server
function displayRecievedMessage(message) {
    const contentContainer = document.getElementById('scrollable');
    const chatContainer = document.createElement('div');
    const messageHolder = document.createElement('div');

    chatContainer.classList.add('contact-message-container');
    messageHolder.classList.add('contact-message');

    messageHolder.innerText = message;

    chatContainer.appendChild(messageHolder);
    contentContainer.appendChild(chatContainer);
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

document.getElementById('send').onclick = () => {
    const messageBox = document.getElementById('message-input');
    displaySentMessage(messageBox.value);
    messageBox.value = '';
};

document.getElementById('message-input').addEventListener('keyup', (event) => {
    if (event.key == 'Enter')
        document.getElementById('send').onclick();
});

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
    }, (error) => {
        displayChatDetail('Server Error Occured');
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

// hardcoded fixed height and max-height
const wrapper = document.getElementById('wrapper');
const scrollable = document.getElementById('scrollable');

const calculatedHeight = Math.floor(window.innerHeight * 0.720);
const calculatedWidth = (window.innerWidth * 0.684);

wrapper.style.height = `${calculatedHeight}px`;
wrapper.style.width = `${calculatedWidth}px`;
scrollable.style.maxHeight = `${calculatedHeight}px`;

displayRecievedMessage('This is a sample recieved message');

window.onresize = () => {
    const wrapper = document.getElementById('wrapper');
    const scrollable = document.getElementById('scrollable');
    const calculatedHeight = Math.floor(window.innerHeight * 0.720);
    const calculatedWidth = (window.innerWidth * 0.684);    

    wrapper.style.height = `${calculatedHeight}px`;
    wrapper.style.width = `${calculatedWidth}px`;
    scrollable.style.maxHeight = `${calculatedHeight}px`;
}