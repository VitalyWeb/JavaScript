const btn = document.getElementById("myBtn");
const spoiler = document.getElementById("spoiler");

function openSpoiler() {
    spoiler.classList.add("open");
    spoiler.classList.remove("closed");
    document.addEventListener("keydown", handleEscape);
}

function closeSpoiler() {
    spoiler.classList.remove("open");
    spoiler.classList.add("closed");
    document.removeEventListener("keydown", handleEscape);
}

function toggleSpoiler() {
    if (spoiler.classList.contains("open")) {
        closeSpoiler();
    } else {
        openSpoiler();
    }
}

function handleEscape(event) {
    if (event.key === "Escape") {
        closeSpoiler();
    }
}

btn.addEventListener("click", toggleSpoiler);