**✅ Sorunu Anladım.**

Dil değişimi çalışmıyor çünkü:
- `data-translate` attribute'ları HTML'de yeterince kullanılmamış.
- `translations.js` ile `script.js` arasında senkronizasyon sorunu var.
- Muhtemelen eski inline script hala karışıyor.

---

### Şu Anda Yapman Gereken: **3 Dosyayı Tamamen Yenile**

### 1. `translations.js` (Tam 6 Dil — Yeni)

Bu dosyayı **tamamen** aşağıdaki kodla değiştir:

```javascript
// translations.js
const translations = {
    tr: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Misafir Memnuniyet Anketi",
        generalInfo: "GENEL BİLGİLER",
        frontOffice: "ÖN BÜRO & RESEPSİYON",
        fullName: "Ad Soyad *",
        gender: "Cinsiyetiniz *",
        female: "Kadın",
        male: "Erkek",
        nationality: "Uyruğu *",
        selectOption: "Seçiniz...",
        roomNumber: "Oda Numarası *",
        checkIn: "Giriş Tarihi *",
        checkOut: "Çıkış Tarihi *",
        email: "Mail Adresi",
        kvkkText: "Kişisel verilerimin Concordia Celes Hotel tarafından misafir memnuniyeti amacıyla işlenmesine onay veriyorum.",
        kvkkLink: "KVKK Aydınlatma Metni",
        next: "İleri →",
        back: "← Geri",
        submit: "Anketi Gönder",
        thankYouTitle: "Teşekkür Ederiz!",
        thankYouMessage: "Değerli görüşleriniz bizim için çok önemli.",
        newSurvey: "Yeni Anket"
    },
    en: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Guest Satisfaction Survey",
        generalInfo: "GENERAL INFORMATION",
        frontOffice: "FRONT OFFICE & RECEPTION",
        fullName: "Full Name *",
        gender: "Gender *",
        female: "Female",
        male: "Male",
        nationality: "Nationality *",
        selectOption: "Select...",
        roomNumber: "Room Number *",
        checkIn: "Check-in Date *",
        checkOut: "Check-out Date *",
        email: "Email Address",
        kvkkText: "I consent to the processing of my personal data by Concordia Celes Hotel for guest satisfaction.",
        kvkkLink: "KVKK Disclosure Text",
        next: "Next →",
        back: "← Back",
        submit: "Submit Survey",
        thankYouTitle: "Thank You!",
        thankYouMessage: "Your feedback is very valuable to us.",
        newSurvey: "New Survey"
    },
    de: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Gästezufriedenheitsumfrage",
        generalInfo: "ALLGEMEINE INFORMATIONEN",
        frontOffice: "REZEPTION & FRONT OFFICE",
        fullName: "Vor- und Nachname *",
        gender: "Geschlecht *",
        female: "Weiblich",
        male: "Männlich",
        nationality: "Nationalität *",
        selectOption: "Auswählen...",
        roomNumber: "Zimmernummer *",
        checkIn: "Anreisedatum *",
        checkOut: "Abreisedatum *",
        email: "E-Mail Adresse",
        kvkkText: "Ich bin mit der Verarbeitung meiner Daten zur Gästezufriedenheit einverstanden.",
        kvkkLink: "Datenschutzerklärung",
        next: "Weiter →",
        back: "← Zurück",
        submit: "Umfrage senden",
        thankYouTitle: "Vielen Dank!",
        thankYouMessage: "Ihr Feedback ist uns sehr wichtig.",
        newSurvey: "Neue Umfrage"
    },
    ru: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Анкета удовлетворенности",
        generalInfo: "ОБЩАЯ ИНФОРМАЦИЯ",
        frontOffice: "РЕСЕПШН И ФРОНТ-ОФИС",
        fullName: "ФИО *",
        gender: "Пол *",
        female: "Женский",
        male: "Мужской",
        nationality: "Гражданство *",
        selectOption: "Выберите...",
        roomNumber: "Номер комнаты *",
        checkIn: "Дата заезда *",
        checkOut: "Дата выезда *",
        email: "Email",
        kvkkText: "Даю согласие на обработку моих данных для измерения удовлетворенности гостей.",
        kvkkLink: "Политика конфиденциальности",
        next: "Далее →",
        back: "← Назад",
        submit: "Отправить анкету",
        thankYouTitle: "Спасибо!",
        thankYouMessage: "Ваше мнение очень важно для нас.",
        newSurvey: "Новая анкета"
    },
    pl: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Ankieta satysfakcji gości",
        generalInfo: "INFORMACJE OGÓLNE",
        frontOffice: "RECEPCJA I FRONT OFFICE",
        fullName: "Imię i Nazwisko *",
        gender: "Płeć *",
        female: "Kobieta",
        male: "Mężczyzna",
        nationality: "Narodowość *",
        selectOption: "Wybierz...",
        roomNumber: "Numer pokoju *",
        checkIn: "Data zameldowania *",
        checkOut: "Data wymeldowania *",
        email: "Email",
        kvkkText: "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu pomiaru satysfakcji gości.",
        kvkkLink: "Polityka prywatności",
        next: "Dalej →",
        back: "← Wstecz",
        submit: "Wyślij ankietę",
        thankYouTitle: "Dziękujemy!",
        thankYouMessage: "Twoja opinia jest dla nas bardzo ważna.",
        newSurvey: "Nowa ankieta"
    },
    ro: {
        hotelName: "Concordia Celes Hotel",
        surveyTitle: "Chestionar de satisfacție",
        generalInfo: "INFORMAȚII GENERALE",
        frontOffice: "RECEPȚIE & FRONT OFFICE",
        fullName: "Nume complet *",
        gender: "Gen *",
        female: "Femeie",
        male: "Bărbat",
        nationality: "Naționalitate *",
        selectOption: "Selectați...",
        roomNumber: "Număr cameră *",
        checkIn: "Data check-in *",
        checkOut: "Data check-out *",
        email: "Email",
        kvkkText: "Îmi dau acordul pentru prelucrarea datelor mele personale în scopul măsurării satisfacției oaspeților.",
        kvkkLink: "Politica de confidențialitate",
        next: "Următorul →",
        back: "← Înapoi",
        submit: "Trimite chestionarul",
        thankYouTitle: "Mulțumim!",
        thankYouMessage: "Opinia dumneavoastră este foarte importantă pentru noi.",
        newSurvey: "Chestionar nou"
    }
};

window.updateTranslations = function(lang) {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
};
```

### 2. `script.js` dosyasını da güncelle (Aşağıdaki ile değiştir)

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

let currentLang = 'tr';
let currentSectionIndex = 0;

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('languageSelector').style.display = 'none';
    document.getElementById('surveyForm').style.display = 'block';
    
    document.getElementById('currentLangName').textContent = lang.toUpperCase();
    
    if (typeof updateTranslations === "function") {
        updateTranslations(lang);
    }
    
    resetForm();
}

function updateProgressBar() {
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const total = document.querySelectorAll('.section').length;
    const percent = Math.round(((currentSectionIndex + 1) / total) * 100);
    bar.style.width = percent + '%';
    text.textContent = percent + '%';
}

function showSection(n) {
    document.querySelectorAll('.section').forEach((sec, i) => {
        sec.style.display = i === n ? 'block' : 'none';
    });
    currentSectionIndex = n;
    updateProgressBar();
}

function nextSection() {
    const total = document.querySelectorAll('.section').length;
    if (currentSectionIndex < total - 1) showSection(currentSectionIndex + 1);
}

function prevSection() {
    if (currentSectionIndex > 0) showSection(currentSectionIndex - 1);
}

function initStars() {
    document.querySelectorAll('.stars').forEach(container => {
        const name = container.dataset.name;
        const hidden = container.parentElement.querySelector(`input[name="${name}"]`);
        container.innerHTML = Array.from({length:5}, (_,i) => 
            `<span class="star" data-value="${i+1}">★</span>`
        ).join('');
        
        container.querySelectorAll('.star').forEach(star => {
            star.onclick = () => {
                const val = star.dataset.value;
                hidden.value = val;
                container.querySelectorAll('.star').forEach(s => {
                    s.style.color = parseInt(s.dataset.value) <= val ? '#facc15' : '#cbd5e1';
                });
            };
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
document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    data.date = new Date().toLocaleString('tr-TR');
    
    fetch(GOOGLE_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(data)))
        .then(() => {
            document.getElementById('surveyForm').style.display = 'none';
            document.getElementById('thankYou').style.display = 'block';
        })
        .catch(() => alert('Gönderim hatası'));
});

document.addEventListener('DOMContentLoaded', () => {
    showSection(0);
    initStars();
});

window.setLanguage = setLanguage;
window.nextSection = nextSection;
window.prevSection = prevSection;
```

---

**Şimdi ne yapacaksın?**

1. `translations.js` dosyasını yukarıdaki kodla **tamamen değiştir**.
2. `script.js` dosyasını da yukarıdaki kodla **tamamen değiştir**.
3. Sayfayı **Ctrl + Shift + R** ile yenile.
4. İngilizce butonuna tıkla.

Hala Türkçe kalırsa, `index.html` dosyasının en üst kısmından **ilk 100 satırını** buraya kopyala (dil seçimi ve header kısmını göreyim).

Deneme sonucunu söyle.
