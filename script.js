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
    console.log(window.base64url.encode(exported));
}

window.crypto.subtle
    .generateKey(
        {
            name: "AES-CTR",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
    .then((key) => {
        encryptMessage(key, 'plop').then((cipher) => {
            decryptMessage(key, cipher).then((m) => {
                console.log(m);
            });
        });
        exportCryptoKey(key);
    });


