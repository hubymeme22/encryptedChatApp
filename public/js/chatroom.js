import { addContact, getChatDetails, getUserDetails, getUserWSNumber } from './modules/expanded.js';
import * as edCryptor from './modules/experimental-encryption.js';
import * as messenger from './modules/encryptedMessenger.js';

// retrieve the user information
let userInfo = window.localStorage.getItem('raw-data');
userInfo = JSON.parse(userInfo);

// all current chat details
let userChatInfo = {};

// dynamic variables for page
let currentButton = null;

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

        // this part is for display
        getUserDetails(chatUsername, (jsonData) => {
            if (jsonData.existing) {

                // display the contact username with the ff. format
                displayChatDetail(`@${chatUsername}`, jsonData.data.accountDetails.name);
                const messages = userChatInfo[chatUsername];

                // assign the target username for chat
                messenger.assignContactDetails(chatUsername, userInfo.contacts[chatUsername]);

                // retrieve message from this contact and display
                if (messages != [] || messages != null) {
                    resetMessageContainer();
                    messages.forEach(chat => {
                        if (chat[2] == 'me') {
                            const message = messenger.decryptMyMessage(chat[0]);
                            displaySentMessage(message)
                        } else {
                            const message = messenger.decryptConMessage(chat[0]);
                            displayRecievedMessage(message);
                        }
                    });
                }
            }
        });

        // hide the 'no message' display if not yet hidden and display the chat
        document.getElementById('no-message').style.display = 'none';
        document.getElementById('wrapper').style.display = '';
    };
}

function resetMessageContainer() {
    const contentContainer = document.getElementById('scrollable');
    contentContainer.innerHTML = '';
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

    const scrollable = document.getElementById('wrapper');
    scrollable.scrollTop = scrollable.scrollHeight;
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

    // send to server for request handling
    messenger.sendMessage(messageBox.value);

    // for user interface display
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
displayUsername(userInfo.username);
displayName(userInfo.accountDetails.name);

// displays each chat on screen
const contacts = Object.keys(userInfo.contacts);
contacts.forEach(usernameContact => {
    addChatUser(usernameContact);
});

// set the process whenever a user recieves a message
messenger.setOnMessage(data => {
    displayRecievedMessage(data);
});

// retrieves all the chat history
getChatDetails((chatData) => {
    if (chatData.data == null) return;
    userChatInfo = chatData.data.messages;
});

// retrieve code number for chat encryption
getUserWSNumber((jsonData) => {
    if (jsonData.access) {
        edCryptor.assignNumber(jsonData.wsKey);
        messenger.assignAccDetails(userInfo.username, userInfo.accountDetails.key);
    }
});

// hardcoded fixed height and max-height
const wrapper = document.getElementById('wrapper');
const scrollable = document.getElementById('scrollable');

const calculatedHeight = Math.floor(window.innerHeight * 0.720);
const calculatedWidth = (window.innerWidth * 0.684);

wrapper.style.height = `${calculatedHeight}px`;
wrapper.style.width = `${calculatedWidth}px`;
scrollable.style.maxHeight = `${calculatedHeight}px`;

window.onresize = () => {
    const wrapper = document.getElementById('wrapper');
    const scrollable = document.getElementById('scrollable');
    const calculatedHeight = Math.floor(window.innerHeight * 0.720);
    const calculatedWidth = (window.innerWidth * 0.684);    

    wrapper.style.height = `${calculatedHeight}px`;
    wrapper.style.width = `${calculatedWidth}px`;
    scrollable.style.maxHeight = `${calculatedHeight}px`;
}