const MANUAL_CONNECTION_URL = "https://web.raccster.dmtr.ru/raccster-bot";

const manualLink = document.querySelector("[data-manual-link]");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (manualLink && MANUAL_CONNECTION_URL.trim()) {
  manualLink.href = MANUAL_CONNECTION_URL;
  manualLink.target = "_blank";
  manualLink.rel = "noreferrer";
  manualLink.textContent = "Открыть страницу подключения";
  manualLink.classList.remove("button-disabled");
}
