import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "../images/icon-location.svg";
import { validateIp, addOffset } from "./helpers/index";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".search-bar__btn");
  const ipInput = document.querySelector(".search-bar__input");
  const ipInfo = document.querySelector("#ip");
  const locationInfo = document.querySelector("#location");
  const timezoneInfo = document.querySelector("#timezone");
  const ispInfo = document.querySelector("#isp");
  const mapArea = document.querySelector(".map");

  let currentMarker = null;
  const map = L.map(mapArea).setView([0, 0], 2);

  const markerIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 40],
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
  }).addTo(map);

  if (btn) {
    btn.addEventListener("click", () => getData());
    console.log("Обработчик на кнопку назначен");
  } 
  else {
    console.error("Кнопка не найдена!");
  }

  ipInput.addEventListener("keydown", handleKey);

  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => getData(data.ip))
    .catch(() => {
      console.error("Не удалось определить IP пользователя");
      getData("8.8.8.8");
    });

  function getData(ipAddress = null) {
    let address = ipAddress || ipInput.value;
    if (typeof address === "string") {
      address = address.trim().replace(/\s+/g, '');
    }

    if (validateIp(address)) {
      fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_EvA98yZvnHJjLVMNdBRqFxPSRYpJd&ipAddress=${address}`)
        .then((response) => response.json())
        .then((data) => {
          setInfo(data);
          if (!ipAddress) ipInput.value = "";
        })
        .catch((error) => {
          console.error("Ошибка при получении данных IP:", error);
          if (!ipAddress) ipInput.value = "";
        });
    } 
    else if (!ipAddress) {
      ipInput.value = "";
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      getData();
    }
  }

  function setInfo(mapData) {
    const { lat, lng, country, region, city, timezone } = mapData.location;
    ipInfo.innerText = mapData.ip;
    locationInfo.innerText = `${country}  ${region}  ${city}`;
    timezoneInfo.innerText = timezone;
    ispInfo.innerText = mapData.isp;

    map.setView([lat, lng], 13);

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

    if (window.matchMedia("(max-width: 1024px)").matches) {
      addOffset(map);
    }
  }
});