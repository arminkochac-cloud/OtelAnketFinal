**✅ Sorunu net olarak gördüm.**

Console’daki hata çok kritik: **`currentSectionIndex has already been declared`**. Bu, kodunun **hem `index.html` içinde inline script** olarak hem de ayrı `script.js` dosyasında tanımlanmasından kaynaklanıyor. Bu yüzden dil değişimi de dahil birçok şey çalışmıyor.

---

### Hemen Yapman Gereken Düzeltme (Adım Adım):

### 1. `index.html` dosyasını aç

En altta, `<!-- KVKK MODAL -->` kısmından sonra gelen **büyük `<script>` bloğunu** (yaklaşık 100+ satır olan `let currentSectionIndex = 0;` ile başlayan kısmı) **tamamen sil**.

Yani şu kısmı sil:

```html
<script>
let currentSectionIndex = 0;
... (tüm fonksiyonlar ve DOMContentLoaded kısmı)
</script>
```

### 2. Aşağıdaki dosyaları güncelle

#### A) `translations.js` (Yeni dosya veya mevcut dosyayı tamamen değiştir)

```javascript
const translations = {
    tr: { /* ... önceki mesajımdaki tr çevirileri aynı kalabilir ... */ },
    en: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Guest Satisfaction Survey",
        generalInfo: "GENERAL INFORMATION",
        fullName: "Full Name *",
        gender: "Gender *",
        female: "Female",
        male: "Male",
        nationality: "Nationality *",
        selectOption: "Please Select...",
        roomNumber: "Room Number *",
        checkIn: "Check-in Date *",
        checkOut: "Check-out Date *",
        email: "Email Address",
        kvkkText: "I consent to the processing of my personal data for guest satisfaction purposes.",
        next: "Next",
        back: "Back",
        submit: "Submit",
        frontOffice: "FRONT OFFICE & RECEPTION",
        welcomeGreeting: "Welcome Greeting",
        checkInProcess: "Check-in Procedures",
        facilityInfo: "Information About the Facility",
        frontDeskCare: "Staff Care and Courtesy",
        bellboyService: "Bellboy Services",
        thankYouTitle: "Thank You!",
        thankYouMessage: "Your opinion is very valuable to us.",
        newSurvey: "New Survey",
        yes: "Yes",
        no: "No"
    },
    // de, ru, pl, ro dillerini de aynı şekilde ekleyebilirim ama önce bunu çalıştıralım
};

window.updateTranslations = function(lang) {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
};
```

#### B) `script.js` dosyasını **tamamen** aşağıdaki kodla değiştir:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

let currentLang = 'tr';
let currentSectionIndex = 0;

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('languageSelector').style.display = 'none';
    document.getElementById('surveyForm').style.display = 'block';
    
    if (typeof updateTranslations === 'function') {
        updateTranslations(lang);
    }
    
    document.getElementById('currentLangName').textContent = lang.toUpperCase();
    resetForm();
}

function updateProgressBar() {
    const progress = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const totalSections = document.querySelectorAll('.section').length;
    if (!progress || !text) return;
    const percent = Math.round(((currentSectionIndex + 1) / totalSections) * 100);
    progress.style.width = percent + '%';
    text.textContent = percent + '%';
}

function showSection(n) {
    document.querySelectorAll('.section').forEach((sec, i) => {
        sec.style.display = (i === n) ? 'block' : 'none';
    });
    currentSectionIndex = n;
    updateProgressBar();
}

function nextSection() {
    const sections = document.querySelectorAll('.section');
    if (currentSectionIndex < sections.length - 1) {
        showSection(currentSectionIndex + 1);
    }
}

function prevSection() {
    if (currentSectionIndex > 0) {
        showSection(currentSectionIndex - 1);
    }
}

function initStars() {
    document.querySelectorAll('.stars').forEach(container => {
        const name = container.dataset.name;
        const hidden = container.parentElement.querySelector(`input[name="${name}"]`);
        container.innerHTML = [1,2,3,4,5].map(i => 
            `<span class="star" data-value="${i}">★</span>`
        ).join('');
        
        container.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', () => {
                const val = star.dataset.value;
                hidden.value = val;
                container.querySelectorAll('.star').forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= parseInt(val) ? '#ffd700' : '#ddd';
                });
            });
        });
    });
}

function resetForm() {
    document.getElementById('mainForm').reset();
    currentSectionIndex = 0;
    showSection(0);
    initStars();
}

// Submit
document.getElementById('mainForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    data.date = new Date().toLocaleString('tr-TR');
    
    try {
        await fetch(GOOGLE_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(data)));
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('thankYou').style.display = 'block';
    } catch (err) {
        alert('Gönderim hatası');
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    showSection(0);
    initStars();
});

window.setLanguage = setLanguage;
window.nextSection = nextSection;
window.prevSection = prevSection;
```

---

**Şimdi yap:**

1. `index.html` dosyasındaki eski `<script>` bloğunu sil.
2. `translations.js` ve `script.js` dosyalarını yukarıdaki kodlarla güncelle.
3. Sayfayı **Ctrl + Shift + R** ile sert yenile.

Sonucu ve yeni console hatalarını buraya yaz. 

Dil değişimi bu sefer çalışması lazım. Hazır mısın?
