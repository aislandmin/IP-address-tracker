let map;

const geolocationURL =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_8Bw3hyhh44dju3Yywx9vnkdqYcYsk&ipAddress=";

//IPV4/IPV6
const IPRegex =
  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

//   /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

const inputForm = document.querySelector(".IP-form");
const userInput = document.querySelector(".IP-input");
const failMessage = document.querySelector(".fail-message");

const IPAddressValue = document.querySelector(".IP-address");
const locationValue = document.querySelector(".location");
const timezoneValue = document.querySelector(".timezone");
const ispValue = document.querySelector(".isp");

function showData(data) {
  IPAddressValue.innerHTML = `${data.ip}`;
  locationValue.innerHTML = `${data.location.city}${
    data.location.city ? "," : ""
  } ${data.location.region} ${data.location.postalCode}`;
  timezoneValue.innerHTML = `UTC ${data.location.timezone}`;
  ispValue.innerHTML = `${data.isp}`;
}

function drawMap(lat, lng) {
  const myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
  });

  if (map !== undefined) map.remove();
  map = L.map("map", { zoomControl: false }).setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.control
    .zoom({
      position: "bottomleft",
    })
    .addTo(map);

  let marker = L.marker([lat, lng], { icon: myIcon }).addTo(map);
}

async function getIPAddress(IP = "") {
  await fetch(geolocationURL + IP)
    .then((response) => response.json())
    .then((data) => {
      let { lat, lng } = data.location;
      showData(data);
      drawMap(lat, lng);
    })
    .catch((error) => console.log(error));
}

function handleSubmit(e) {
  e.preventDefault();
  let userIP = userInput.value.trim();
  let isAddressValid = validateIPaddress(userIP);
  if (isAddressValid) getIPAddress(userIP);
}

function validateIPaddress(IPAddress) {
  if (IPRegex.test(IPAddress)) return true;
  failMessage.classList.add("show");
  return false;
}

function hideFailMessageIfShown() {
  if (failMessage.classList.contains("show")) {
    failMessage.classList.remove("show");
  }
}

inputForm.addEventListener("submit", handleSubmit);
userInput.addEventListener("input", hideFailMessageIfShown);

getIPAddress();
