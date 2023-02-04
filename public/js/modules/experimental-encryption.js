// This module was made for experimental encryption created by me :>
// this encryption is a simple modified XOR encryption that uses bit ROT
// and Colatz Conjecture for random number generation

let AGREED_NUMBER = 32;
let GENERATED_NUMBER_SET = [];

function generateNumberSet(sizeLimit=32) {
    GENERATED_NUMBER_SET = [];

    let currentNumber = AGREED_NUMBER;
    let size = 1;

    while (size <= sizeLimit && currentNumber > 0) {
        if (currentNumber % 2 == 0) currentNumber /= 2;
        else currentNumber = (3 * currentNumber) + 1;

        GENERATED_NUMBER_SET.push(currentNumber % 256);
        size++;
    }
}

function ROTR(inp, rotation) {
    return (inp >> rotation) ^ ((inp << (8 - rotation)) & 255);
}

function ROTL(inp, rotation) {
    return ((inp << rotation) & 255) ^ ((inp >> (8 - rotation)));
}

function encryptData(data='', key='') {
    let encryptedCharacter = '';
    for (let i = 0; i < data.length; i++) {
        const currentCharCode = data.charCodeAt(i);
        const currentKey = key.charCodeAt(i % key.length);
        const currentCollatz = GENERATED_NUMBER_SET[i % GENERATED_NUMBER_SET.length];

        // we can do better here
        let encryptedCharCode;
        if (i % 2 == 0) encryptedCharCode = ROTR((currentCharCode ^ currentKey ^ currentCollatz), (currentCollatz % 8));
        else encryptedCharCode = ROTL((currentCharCode ^ currentKey ^ currentCollatz), (currentCollatz % 8));

        encryptedCharacter += (String.fromCharCode(encryptedCharCode));
    }

    return encryptedCharacter;
}

function decryptData(data='', key='') {
    let decryptedCharacter = '';
    for (let i = 0; i < data.length; i++) {
        const currentCharCode = data.charCodeAt(i);
        const currentKey = key.charCodeAt(i % key.length);
        const currentCollatz = GENERATED_NUMBER_SET[i % GENERATED_NUMBER_SET.length];

        // we can do better here
        let decryptedCharCode;
        if (i % 2 == 0) decryptedCharCode = (ROTL(currentCharCode, (currentCollatz  % 8)) ^ currentKey ^ currentCollatz);
        else decryptedCharCode = (ROTR(currentCharCode, (currentCollatz  % 8)) ^ currentKey ^ currentCollatz);

        decryptedCharacter += String.fromCharCode(decryptedCharCode);
    }

    return decryptedCharacter;
}

function XOR(data='', key='') {
    let newCharacter = '';
    for (let i = 0; i < data.length; i++) {
        const currentCharCode = data.charCodeAt(i);
        const currentKey = key.charCodeAt(i % key.length);
        newCharacter += String.fromCharCode(currentCharCode ^ currentKey);
    }

    return newCharacter;
}

function assignNumber(num) {
    AGREED_NUMBER = num;
    generateNumberSet();
}

export {
    assignNumber,
    encryptData,
    decryptData,
    XOR
}