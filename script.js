let counter=new Uint8Array(16)//window.crypto.getRandomValues(new Uint8Array(16));
async function encryptMessage(key, message) {
    let enc = new TextEncoder();
    let encoded = enc.encode(message);
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

// not really neccessary as one can just put any b64url text here
async function createKey() {
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
}

async function decrypt(kb64) {
    let importedKey = await importCryptoKey(kb64);
    let cipher = await window.base64url.decode(encryptedHtml)
    return await decryptMessage(importedKey, cipher);
}
async function encrypt(kb64) {
    const response=await fetch('./data.json');
    const data=await response.json();
    let importedKey = await importCryptoKey(kb64);
    let cipher = await encryptMessage(importedKey, JSON.stringify(data));
    let cipherText=await window.base64url.encode(cipher);
    return cipherText;
}
function CVentry(entry) {
    let len =1;
    let title="<p>";
    title+=entry.from;
    if (entry.to) {
        title+='-'
        title+=entry.to;
        len=entry.to-entry.from;
    }
    title+="</p>"
    return `<div style="height:${len*3}em"><div>${title}<a href="${entry.link}">${entry.name}</a></div></div>`
}
async function buildCV(key) {
    const blob=await decrypt(key);
    const data=await JSON.parse(blob);
    let html='';
    for (const key in data) {
        const entry=data[key];
        html+=CVentry(entry);
    }
    return html;
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const elem = document.getElementById("main");
if(urlParams.has('key')){
    const key = urlParams.get('key');
    buildCV(key).then((data)=>{
        elem.innerHTML=data;
    });
    
} else {
    elem.innerHTML="access denied";
    console.log("no key");
}
// buildCV();   
