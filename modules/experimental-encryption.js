// This module was made for experimental encryption created by me :>
// this encryption is a simple modified XOR encryption that uses bit ROT
// and Colatz Conjecture for random number generation
class EDCryptor {
    constructor(agreedNumber=32) {
        this.AGREED_NUMBER = agreedNumber;
        this.GENERATED_NUMBER_SET = [];

        this.generateNumberSet(32);
    }

    generateNumberSet(sizeLimit=32) {
        this.GENERATED_NUMBER_SET = [];
    
        let currentNumber = this.AGREED_NUMBER;
        let size = 1;
    
        while (size <= sizeLimit && currentNumber > 0) {
            if (currentNumber % 2 == 0) currentNumber /= 2;
            else currentNumber = (3 * currentNumber) + 1;
    
            this.GENERATED_NUMBER_SET.push(currentNumber % 256);
            size++;
        }
    }

    #ROTR(inp, rotation) {
        return (inp >> rotation) ^ ((inp << (8 - rotation)) & 255);
    }

    #ROTL(inp, rotation) {
        return ((inp << rotation) & 255) ^ ((inp >> (8 - rotation)));
    }

    encryptData(data='', key='') {
        let encryptedCharacter = '';
        for (let i = 0; i < data.length; i++) {
            const currentCharCode = data.charCodeAt(i);
            const currentKey = key.charCodeAt(i % key.length);
            const currentCollatz = this.GENERATED_NUMBER_SET[i % this.GENERATED_NUMBER_SET.length];
    
            // we can do better here
            let encryptedCharCode;
            if (i % 2 == 0) encryptedCharCode = this.#ROTR((currentCharCode ^ currentKey ^ currentCollatz), (currentCollatz % 8));
            else encryptedCharCode = this.#ROTL((currentCharCode ^ currentKey ^ currentCollatz), (currentCollatz % 8));
    
            encryptedCharacter += String.fromCharCode(encryptedCharCode);
        }

        return encryptedCharacter;
    }
    
    decryptData(data='', key='') {
        let decryptedCharacter = '';
        for (let i = 0; i < data.length; i++) {
            const currentCharCode = data.charCodeAt(i);
            const currentKey = key.charCodeAt(i % key.length);
            const currentCollatz = this.GENERATED_NUMBER_SET[i % this.GENERATED_NUMBER_SET.length];

            // we can do better here
            let decryptedCharCode;
            if (i % 2 == 0) decryptedCharCode = (this.#ROTL(currentCharCode, (currentCollatz  % 8)) ^ currentKey ^ currentCollatz);
            else decryptedCharCode = (this.#ROTR(currentCharCode, (currentCollatz  % 8)) ^ currentKey ^ currentCollatz);
    
            decryptedCharacter += String.fromCharCode(decryptedCharCode);
        }

        return decryptedCharacter;
    }
}

module.exports = EDCryptor;