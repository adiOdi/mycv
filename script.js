const elem = document.getElementById("main");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

async function getData() {
  // url?key=...
  if (urlParams.has("key")) {
    const key = urlParams.get("key");
    const data = await parseBlob(key);
    if (data) {
      return data;
    }
    console.error("wrong key, using dummy data");
  } else {
    console.warn("no key, using dummy data");
  }
  let response = await fetch("./dummydata.json");
  return await response.json();
}

const legend = document.createElement("div");
for (let year = 2003; year <= 2024; year++) {
  const yearElement = document.createElement("div");
  yearElement.innerText = year;
  yearElement.style.width = CV.scale + "em";
  legend.appendChild(yearElement);
}
legend.className = "legend";

getData().then((data) => {
  let myCV = new CV(data);
  elem.innerText = "";
  elem.appendChild(legend);
  elem.appendChild(myCV.htmlify());
});

// url?key=...&admin
if (urlParams.has("key") && urlParams.has("admin")) {
  const key = urlParams.get("key");
  encrypt(key).then((blob) => {
    console.log(blob);
  });
}
