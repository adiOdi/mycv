let counter;
async function encryptMessage(key, message) {
    let enc = new TextEncoder();
    let encoded = enc.encode(message);
    counter = window.crypto.getRandomValues(new Uint8Array(16));
    ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter,
            length: 64
        },
        key,
        encoded
    );
    return ciphertext;
}

async function decryptMessage(key, ciphertext) {
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter,
            length: 64
        },
        key,
        ciphertext
    );

    let dec = new TextDecoder();
    return dec.decode(decrypted);
}

async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    return(window.base64url.encode(exported));
}
async function importCryptoKey(base64) {
    const buffer = window.base64url.decode(base64);
    return await window.crypto.subtle.importKey("raw", buffer,
    {
        name: "AES-CTR",
        length: 256
    },
    true,
    ["encrypt", "decrypt"]);
}

async function main() {
    let key = await window.crypto.subtle
    .generateKey(
        {
            name: "AES-CTR",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    let kb64 = await exportCryptoKey(key);
    console.log(kb64);
    let importedKey = await importCryptoKey(kb64);
    let cipher = await encryptMessage(importedKey, "plop");
    console.log(await decryptMessage(key,cipher));
}
main();


