async function encryptMessage(key, message) {
    let enc = new TextEncoder();
    let encoded = enc.encode(message);
    // counter = window.crypto.getRandomValues(new Uint8Array(16));
    ciphertext = await window.crypto.subtle.encrypt(
    {
        name: "RSA-OAEP"
    },
    key,
    encoded
    );
    return ciphertext;
}

async function decryptMessage(key, ciphertext) {
    let decrypted = await window.crypto.subtle.decrypt(
    {
        name: "RSA-OAEP"
    },
    key,
    ciphertext
    );

    let dec = new TextDecoder();
    return dec.decode(decrypted);
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
// async function exportCryptoKeyX(key) {
//     const exported = await window.crypto.subtle.exportKey("pkcs8", key);
//     const exportedAsString = ab2str(exported);
//     const exportedAsBase64 = window.btoa(exportedAsString);
//     const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
//     console.log(pemExported);
//   }
// async function exportCryptoKey(key) {
//     const exported = await window.crypto.subtle.exportKey("jwk", key);
//     const exportKeyOutput = document.querySelector(".exported-key");
//     exportKeyOutput.textContent = JSON.stringify(exported, null, " ");
//     console.log(exported);
//   }
// window.crypto.subtle.generateKey(
//     {
//     name: "RSA-OAEP",
//     // Consider using a 4096-bit key for systems that require long-term security
//     modulusLength: 1024,
//     publicExponent: new Uint8Array([1, 0, 1]),
//     hash: "SHA-256",
//     },
//     true,
//     ["encrypt", "decrypt"]
// ).then((keyPair)=>{
//     const message="plop";
//     console.log(keyPair);
//     exportCryptoKey(keyPair.privateKey);
//     encryptMessage(keyPair.publicKey, message).then((cipher)=>{
//         decryptMessage(keyPair.privateKey, cipher).then((m)=>{
//             console.log(m);
//         });
//     });
// });
// window.crypto.subtle.generateKey(
//     {
//     name: "RSA-OAEP",
//     // Consider using a 4096-bit key for systems that require long-term security
//     modulusLength: 1024,
//     publicExponent: new Uint8Array([1, 0, 1]),
//     hash: "SHA-256",
//     },
//     true,
//     ["decrypt", "encrypt"]
// ).then((keyPair)=>{
//     exportCryptoKey(keyPair.privateKey);
// });
/*
Export the given key and write it into the "exported-key" space.
*/

async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    const exportedKeyBuffer = new Uint8Array(exported);
    console.log(window.base64url.encode(exported));
    console.log(exportedKeyBuffer.toString('base64'));
  }
  
  /*
  Generate an encrypt/decrypt secret key,
  then set up an event listener on the "Export" button.
  */
  window.crypto.subtle
    .generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    )
    .then((key) => {
        exportCryptoKey(key);
    });
  

