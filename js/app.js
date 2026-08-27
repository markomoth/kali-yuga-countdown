import { getCountdownParts, getElapsedPercentage, KALI_YUGA_END } from "./calendar.js";

const elements = {
  years: document.querySelector("#years"),
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
  elapsed: document.querySelector("#elapsed"),
  remains: document.querySelector("#remains"),
};

const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const percentageFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function pad(value) {
  return String(value).padStart(2, "0");
}

function renderCountdown() {
  const parts = getCountdownParts(new Date(), KALI_YUGA_END);
  elements.years.textContent = integerFormatter.format(parts.years);
  elements.days.textContent = pad(parts.days);
  elements.hours.textContent = pad(parts.hours);
  elements.minutes.textContent = pad(parts.minutes);
  elements.seconds.textContent = pad(parts.seconds);

  const elapsed = getElapsedPercentage(new Date());
  elements.elapsed.textContent = `${percentageFormatter.format(elapsed)}%`;
  elements.remains.textContent = `${percentageFormatter.format(100 - elapsed)}%`;
}

const quotes = [
  { text: "“Property alone will confer rank.”", source: "— Vishnu Purana, Book IV, Chapter XXIV" },
  { text: "“The minds of men will be wholly occupied in acquiring wealth.”", source: "— Vishnu Purana, Book VI, Chapter I" },
  { text: "“Princes, instead of protecting, will plunder their subjects.”", source: "— Vishnu Purana, Book VI, Chapter I" },
];

let quoteIndex = 0;
let quoteTimer;
const quoteText = document.querySelector("#quote-text");
const quoteSource = document.querySelector("#quote-source");
const quoteSection = document.querySelector(".quote-section");

function showNextQuote() {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  quoteText.textContent = quotes[quoteIndex].text;
  quoteSource.textContent = quotes[quoteIndex].source;
}

function manageQuoteRotation() {
  window.clearInterval(quoteTimer);
  if (document.visibilityState === "visible" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    quoteTimer = window.setInterval(showNextQuote, 14000);
  }
}

renderCountdown();
window.setInterval(renderCountdown, 1000);
document.addEventListener("visibilitychange", manageQuoteRotation);
manageQuoteRotation();

quoteSection?.addEventListener("mouseenter", () => window.clearInterval(quoteTimer));
quoteSection?.addEventListener("mouseleave", manageQuoteRotation);
