// ============================================================================
// CONCORDIA CELES HOTEL - FRONTEND SCRIPT
// CLEAN FINAL VERSION
// Render app into #app
// Radio + label star rating
// KVKK modal
// Section navigation
// Form submission to Apps Script
// ============================================================================

var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

var currentSectionIndex = 0;
Anladım.  
Siz **KVKK’da yıldız istemiyorsunuz**; orası sadece **metin / modal** olacak.  
Yıldızlar ise **sadece departman sorularında** görünecek.

Ayrıca şu an yaşadığınız problem, büyük ihtimalle **frontend `script.js` içinde yıldızları oluşturacak kodun eksik ya da bozuk olması**.

Aşağıya size **KVKK’yı sadece modal yapan, departman sorularına yıldızları ekleyen, bölüm geçişlerini ve form gönderimini de yöneten temiz `script.js`** veriyorum.

> Bu kodu **frontend `script.js`** dosyanızın tamamı ile değiştirin.  
> **Apps Script backend (Code.gs)** ile karıştırmayın.

function getSections() {
    return Array.from(document.querySelectorAll('.section'));
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const sections = getSections();

    if (!progressBar || !progressText || sections.length < 2) return;

    const percent = Math.round((currentSectionIndex / (sections.length - 1)) * 100);
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

function showSection(index) {
    const sections = getSections();
    if (!sections.length) return;

    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;

    sections.forEach((sec, i) => {
        sec.classList.toggle('active', i === index);
    });

    currentSectionIndex = index;
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentSection() {
    const sections = getSections();
    const active = sections[currentSectionIndex];
    if (!active) return true;

    // 1) Normal required alanlar
    const requiredFields = active.querySelectorAll('[required]');
    for (const el of requiredFields) {
        if (el.type === 'radio') {
            const group = active.querySelectorAll(`input[name="${el.name}"]`);
            const checked = Array.from(group).some(r => r.checked);
            if (!checked) {
                alert('Lütfen zorunlu alanları doldurun.');
                return false;
            }
        } else if (el.type === 'checkbox') {
            if (!el.checked) {
                alert('Lütfen zorunlu alanları doldurun.');
                return false;
            }
        } else if (!String(el.value || '').trim()) {
            alert('Lütfen zorunlu alanları doldurun.');
            el.focus();
            return false;
        }
    }

    // 2) Departman puanları zorunlu olsun
    const hiddenRatings = active.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (const hidden of hiddenRatings) {
        if (!String(hidden.value || '').trim()) {
            alert('Lütfen bu bölümdeki tüm soruları puanlayın.');
            return false;
        }
    }

    return true;
}

// HTML'deki butonlar sizin yapınıza göre section numarası gönderiyor
// nextSection(1) => section2
// nextSection(2) => section3
function nextSection(sectionNumber = currentSectionIndex + 1) {
    if (!validateCurrentSection()) return;
    showSection(sectionNumber);
}

function prevSection(sectionNumber = currentSectionIndex + 1) {
    showSection(Math.max(0, sectionNumber - 2));
}

// ==============================
// KVKK MODAL
// ==============================
function showKvkk() {
    const modal = document.getElementById('kvkkModal');
    if (modal) modal.style.display = 'block';
}

function closeKvkk() {
    const modal = document.getElementById('kvkkModal');
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', function (e) {
    const modal = document.getElementById('kvkkModal');
    if (e.target === modal) closeKvkk();
});

// ==============================
// STAR RATING OLUŞTURMA
// Sadece .rating-item içindeki .stars[data-name] alanlarına uygulanır
// KVKK kısmına uygulanmaz
// ==============================
function initStars() {
    document.querySelectorAll('.rating-item .stars[data-name]').forEach(container => {
        if (container.dataset.ready === '1') return;
        container.dataset.ready = '1';

        const fieldName = container.getAttribute('data-name');
        const hiddenInput = container.parentElement.querySelector(`input[type="hidden"][name="${fieldName}"]`);

        // 5 yıldız oluştur
        let html = '';
        for (let i = 5; i >= 1; i--) {
            html += `
                <label class="star" data-value="${i}" title="${i} yıldız">
                    <input type="radio" name="${fieldName}_rating" value="${i}">
                    <span>★</span>
                </label>
            `;
        }
        container.innerHTML = html;

        const radios = container.querySelectorAll(`input[name="${fieldName}_rating"]`);

        function updateStars() {
            const checked = Array.from(radios).find(r => r.checked);
            const value = checked ? parseInt(checked.value, 10) : 0;

            if (hiddenInput) hiddenInput.value = value || '';

            container.querySelectorAll('.star').forEach(label => {
                const radio = label.querySelector('input[type="radio"]');
                const radioVal = parseInt(radio.value, 10);
                label.classList.toggle('selected', radioVal <= value);
            });
        }

        radios.forEach(radio => {
            radio.addEventListener('change', updateStars);
        });

        // İlk durumu temizle
        updateStars();
    });
}

// ==============================
// CHAR COUNTER
// ==============================
function initCharCounter() {
    const textarea = document.querySelector('textarea[name="generalComments"]');
    const counter = document.querySelector('.char-count');

    if (!textarea || !counter) return;

    const update = () => {
        counter.textContent = `${textarea.value.length} / 500`;
    };

    textarea.addEventListener('input', update);
    update();
}

// ==============================
// FORM GÖNDERİMİ
// ==============================
function collectFormData(form) {
    const fd = new FormData(form);
    const data = {};

    for (const [key, value] of fd.entries()) {
        data[key] = value;
    }

    // checkbox
    const kvkk = document.getElementById('kvkkOnay');
    data.kvkkOnay = kvkk ? kvkk.checked : false;

    return data;
}

async function submitSurvey(form) {
    const data = collectFormData(form);

    // KVKK onayı zorunlu olsun istiyorsanız açın:
    // if (!data.kvkkOnay) { alert('KVKK onayı gereklidir.'); return; }

    try {
        const url = GOOGLE_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(data));
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (!res.ok) {
            throw new Error('HTTP ' + res.status);
        }

        const json = await res.json();
        if (json.status === 'success') {
            showThankYou();
        } else {
            alert('Gönderim hatası: ' + (json.message || 'Bilinmeyen hata'));
        }
    } catch (err) {
        console.error(err);
        alert('Anket gönderilemedi. Lütfen tekrar deneyin.');
    }
}

function showThankYou() {
    const survey = document.getElementById('surveyForm');
    const thank = document.getElementById('thankYou');

    if (survey) survey.style.display = 'none';
    if (thank) thank.style.display = 'block';
}

function resetForm() {
    const form = document.getElementById('mainForm');
    const thank = document.getElementById('thankYou');
    const survey = document.getElementById('surveyForm');

    if (form) form.reset();
    if (thank) thank.style.display = 'none';
    if (survey) survey.style.display = 'block';

    currentSectionIndex = 0;
    showSection(0);
    initStars();
    initCharCounter();
}

// ==============================
// EK AYARLAR
// ==============================
function setDefaultDates() {
    const checkIn = document.getElementById('checkInDate');
    const checkOut = document.getElementById('checkOutDate');

    if (checkIn && checkOut) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        checkIn.min = todayStr;
        checkOut.min = todayStr;

        checkIn.addEventListener('change', () => {
            if (checkIn.value) {
                checkOut.min = checkIn.value;
                if (checkOut.value && checkOut.value < checkIn.value) {
                    checkOut.value = checkIn.value;
                }
            }
        });
    }
}

// ==============================
// DOM READY
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    initStars();
    initCharCounter();
    setDefaultDates();
    showSection(0);

    const form = document.getElementById('mainForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateCurrentSection()) return;
            submitSurvey(form);
        });
    }

    const printDate = document.getElementById('printDate');
    if (printDate) {
        printDate.textContent = new Date().toLocaleString('tr-TR');
    }
});
```

---

## Çok önemli
Bu kodda:

- **KVKK bölümünde yıldız yok**
- **Yıldızlar sadece departman sorularında var**
- **KVKK metni sadece modal olarak açılır**
- **Departman puanları seçilebilir hale gelir**
- **Bölüm geçişleri çalışır**
- **Form gönderimi Apps Script’e gider**

---

## CSS tarafı için küçük ek
Sizde `style.css` içinde aşağıdaki blok olsun:

```css
.stars {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
}

.stars .star {
    cursor: pointer;
    font-size: 32px;
    line-height: 1;
    color: #d9d9d9;
    transition: transform 0.15s ease, color 0.15s ease;
}

.stars .star:hover {
    transform: translateY(-1px);
}

.stars .star.selected span {
    color: var(--warning-color);
}

.stars .star input {
    display: none;
}
```

---

## Son kontrol
Sizde KVKK metni için şu olmalı:

```html
<a href="#" onclick="showKvkk(); return false;">KVKK Aydınlatma Metni</a>
```

ve modal:

```html
<div id="kvkkModal"> ... </div>
```

---

İsterseniz bir sonraki mesajda size bu dosyanın **tam sizin index.html yapınıza uyumlu son sürümünü** de hazırlayayım.
