// ====================== CLEAN SCRIPT.JS ======================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec";

let currentLang = "tr";
let currentSectionIndex = 0;

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById("languageSelector").style.display = "none";
    document.getElementById("surveyForm").style.display = "block";
    
    document.getElementById("currentLangName").textContent = lang.toUpperCase();
    
    if (typeof updateTranslations === "function") {
        updateTranslations(lang);
    }
    
    resetForm();
}

function updateProgressBar() {
    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    const total = document.querySelectorAll(".section").length;
    const percent = Math.round(((currentSectionIndex + 1) / total) * 100);
    bar.style.width = percent + "%";
    text.textContent = percent + "%";
}

function showSection(n) {
    document.querySelectorAll(".section").forEach((sec, i) => {
        sec.style.display = (i === n) ? "block" : "none";
    });
    currentSectionIndex = n;
    updateProgressBar();
}

function nextSection() {
    const total = document.querySelectorAll(".section").length;
    if (currentSectionIndex < total - 1) {
        showSection(currentSectionIndex + 1);
    }
}

function prevSection() {
    if (currentSectionIndex > 0) {
        showSection(currentSectionIndex - 1);
    }
}

function initStars() {
    document.querySelectorAll(".stars").forEach(container => {
        const name = container.dataset.name;
        const hidden = container.parentElement.querySelector(`input[name="${name}"]`);
        
        container.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.className = "star";
            star.textContent = "★";
            star.dataset.value = i;
            star.onclick = () => {
                hidden.value = i;
                container.querySelectorAll(".star").forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= i ? "#facc15" : "#cbd5e1";
                });
            };
            container.appendChild(star);
        }
    });
}

function resetForm() {
    document.getElementById("mainForm").reset();
    currentSectionIndex = 0;
    showSection(0);
    initStars();
}

// Form Submit
document.getElementById("mainForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    data.date = new Date().toLocaleString("tr-TR");
    
    fetch(GOOGLE_SCRIPT_URL + "?data=" + encodeURIComponent(JSON.stringify(data)))
        .then(r => r.json())
        .then(() => {
            document.getElementById("surveyForm").style.display = "none";
            document.getElementById("thankYou").style.display = "block";
        })
        .catch(() => alert("Gönderim hatası oluştu."));
});

document.addEventListener("DOMContentLoaded", () => {
    showSection(0);
    initStars();
});

// Global erişim
window.setLanguage = setLanguage;
window.nextSection = nextSection;
window.prevSection = prevSection;
