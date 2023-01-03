// use the specified username as the username
function displayUsername(username) {
    document.getElementById('username').innerText = username;
}

// ues the specified param as name of the user
function displayName(name) {
    document.getElementById('name').innerText = name;
}

// add the specified username to contacts
function addChatUser(chatUsername) {
    const chatList = document.getElementById('chat-list');

    // generates a new button
    const clickableUser = document.createElement('button');
    chatList.appendChild(clickableUser);
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


///////////////////////
//  initializations  //
///////////////////////
// retrieve the user information
let userInfo = window.localStorage.getItem('raw-data');
userInfo = JSON.parse(userInfo);

console.log(userInfo);
displayUsername(userInfo.username);
displayName(userInfo.accountDetails.name);