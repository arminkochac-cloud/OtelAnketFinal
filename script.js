// ============================================================================
// CONCORDIA CELES HOTEL - FRONTEND SCRIPT
// CLEAN FINAL VERSION
// KVKK MODAL + STAR RATING + SECTION NAVIGATION + FORM SUBMISSION
// ============================================================================

const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';
// Yukarıya kendi çalışan /exec URL'nizi koyun.

let currentSectionIndex = 0;

function getSections() {
    return Array.from(document.querySelectorAll('.section'));
}

function updateProgressBar() {
    var progressBar = document.getElementById('progressBar');
    var progressText = document.getElementById('progressText');
    var sections = getSections();

    if (!progressBar || !progressText || sections.length < 2) return;

    var percent = Math.round(((currentSectionIndex + 1) / sections.length) * 100);
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

function showSection(index) {
    var sections = getSections();
    if (!sections.length) return;

    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;

    sections.forEach(function (sec, i) {
        sec.classList.toggle('active', i === index);
    });

    currentSectionIndex = index;
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentSection() {
    var sections = getSections();
    var active = sections[currentSectionIndex];
    if (!active) return true;

    // Aktif bölümdeki required alanlar
    var requiredFields = active.querySelectorAll('[required]');
    for (var i = 0; i < requiredFields.length; i++) {
        var el = requiredFields[i];

        if (el.type === 'radio') {
            var group = active.querySelectorAll('input[name="' + el.name + '"]');
            var checked = Array.from(group).some(function (r) { return r.checked; });
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

    // Sadece aktif bölümdeki yıldızlar dolu mu?
    var hiddenRatings = active.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (var j = 0; j < hiddenRatings.length; j++) {
        if (!String(hiddenRatings[j].value || '').trim()) {
            alert('Lütfen bu bölümdeki tüm soruları puanlayın.');
            return false;
        }
    }

    return true;
}

// HTML'de butonlar section numarası gönderiyor:
// nextSection(1) => section2
// nextSection(2) => section3
function nextSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 1;
    }

    if (!validateCurrentSection()) return;
    showSection(sectionNumber);
}

function prevSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 1;
    }

    showSection(Math.max(0, sectionNumber - 2));
}

// ---------------------------------------------------------------------------
// KVKK MODAL
// ---------------------------------------------------------------------------
function showKvkk() {
    var modal = document.getElementById('kvkkModal');
    if (modal) modal.style.display = 'block';
}

function closeKvkk() {
    var modal = document.getElementById('kvkkModal');
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', function (e) {
    var modal = document.getElementById('kvkkModal');
    if (modal && e.target === modal) {
        closeKvkk();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeKvkk();
    }
});

// ---------------------------------------------------------------------------
// STAR RATING
// Sadece .rating-item içindeki .stars[data-name] alanlarında çalışır
// KVKK kısmına uygulanmaz
// ---------------------------------------------------------------------------
function syncStarContainer(container) {
    var fieldName = container.getAttribute('data-name');
    var hiddenInput = container.parentElement.querySelector('input[type="hidden"][name="' + fieldName + '"]');
    var value = parseInt((hiddenInput && hiddenInput.value) ? hiddenInput.value : '0', 10) || 0;

    var labels = container.querySelectorAll('.star');
    for (var i = 0; i < labels.length; i++) {
        var starValue = parseInt(labels[i].getAttribute('data-value'), 10);
        labels[i].classList.toggle('selected', starValue <= value);
    }
}

function initStars() {
    document.querySelectorAll('.rating-item .stars[data-name]').forEach(container => {
        if (container.dataset.ready === '1') return;
        container.dataset.ready = '1';

        const fieldName = container.getAttribute('data-name');
        const hiddenInput = container.parentElement.querySelector(
            'input[type="hidden"][name="' + fieldName + '"]'
        );

        // 5 yıldız oluştur
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += '<button type="button" class="star" data-value="' + i + '" aria-label="' + i + ' yıldız">★</button>';
        }
        container.innerHTML = html;

        const stars = Array.from(container.querySelectorAll('.star'));

        function setRating(value) {
            if (hiddenInput) hiddenInput.value = String(value);

            stars.forEach(function (star) {
                const starValue = parseInt(star.getAttribute('data-value'), 10);
                star.classList.toggle('selected', starValue <= value);
            });
        }

        stars.forEach(function (star) {
            const value = parseInt(star.getAttribute('data-value'), 10);

            star.addEventListener('click', function (e) {
                e.preventDefault();
                setRating(value);
            });
        });

        // başlangıçta boş olsun
        if (hiddenInput) hiddenInput.value = '';
    });
}

        syncStarContainer(container);
    }
}

// ---------------------------------------------------------------------------
// CHAR COUNTER
// ---------------------------------------------------------------------------
function initCharCounter() {
    var textarea = document.querySelector('textarea[name="generalComments"]');
    var counter = document.querySelector('.char-count');

    if (!textarea || !counter) return;

    function update() {
        counter.textContent = textarea.value.length + ' / 500';
    }

    textarea.addEventListener('input', update);
    update();
}

// ---------------------------------------------------------------------------
// DATES
// ---------------------------------------------------------------------------
function setDefaultDates() {
    var checkIn = document.getElementById('checkInDate');
    var checkOut = document.getElementById('checkOutDate');

    if (!checkIn || !checkOut) return;

    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var todayStr = yyyy + '-' + mm + '-' + dd;

    checkIn.min = todayStr;
    checkOut.min = todayStr;

    checkIn.addEventListener('change', function () {
        if (checkIn.value) {
            checkOut.min = checkIn.value;
            if (checkOut.value && checkOut.value < checkIn.value) {
                checkOut.value = checkIn.value;
            }
        }
    });
}

// ---------------------------------------------------------------------------
// FORM DATA / SUBMISSION
// ---------------------------------------------------------------------------
function collectFormData(form) {
    var fd = new FormData(form);
    var data = {};

    fd.forEach(function (value, key) {
        data[key] = value;
    });

    var kvkk = document.getElementById('kvkkOnay');
    data.kvkkOnay = kvkk ? kvkk.checked : false;

    data.date = new Date().toLocaleString('tr-TR');

    return data;
}

function validateEntireForm(form) {
    if (!form) return false;

    var requiredFields = form.querySelectorAll('[required]');
    var processedRadioNames = new Set();

    for (var i = 0; i < requiredFields.length; i++) {
        var el = requiredFields[i];

        if (el.type === 'radio') {
            if (processedRadioNames.has(el.name)) continue;
            processedRadioNames.add(el.name);

            var group = form.querySelectorAll('input[name="' + el.name + '"]');
            var checked = Array.from(group).some(function (r) { return r.checked; });
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

    // Tüm yıldız alanları dolu mu?
    var hiddenRatings = form.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (var j = 0; j < hiddenRatings.length; j++) {
        if (!String(hiddenRatings[j].value || '').trim()) {
            alert('Lütfen tüm departman sorularını puanlayın.');
            return false;
        }
    }

    return true;
}

async function submitSurvey(form) {
    var data = collectFormData(form);

    // KVKK zorunlu olsun istiyorsanız açın:
    // if (!data.kvkkOnay) {
    //     alert('KVKK onayı gereklidir.');
    //     return;
    // }

    try {
        var url = GOOGLE_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(data));
        var res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (!res.ok) {
            throw new Error('HTTP ' + res.status);
        }

        var json = await res.json();

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
    var survey = document.getElementById('surveyForm');
    var thank = document.getElementById('thankYou');

    if (survey) survey.style.display = 'none';
    if (thank) thank.style.display = 'block';
}

function resetForm() {
    var form = document.getElementById('mainForm');
    var thank = document.getElementById('thankYou');
    var survey = document.getElementById('surveyForm');

    if (form) form.reset();
    if (thank) thank.style.display = 'none';
    if (survey) survey.style.display = 'block';

    currentSectionIndex = 0;
    showSection(0);
    initStars();
    initCharCounter();
}

// ---------------------------------------------------------------------------
// LANGUAGE HELPERS
// ---------------------------------------------------------------------------
if (typeof window.changeLanguage !== 'function') {
    window.changeLanguage = function () {
        console.warn('changeLanguage() translations.js içinde tanımlı değil.');
    };
}

if (typeof window.setLanguage !== 'function') {
    window.setLanguage = function () {
        console.warn('setLanguage() translations.js içinde tanımlı değil.');
        var surveyForm = document.getElementById('surveyForm');
        var languageSelector = document.getElementById('languageSelector');
        if (surveyForm) surveyForm.style.display = 'block';
        if (languageSelector) languageSelector.style.display = 'none';
    };
}

// ---------------------------------------------------------------------------
// DOM READY
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    initStars();
    initCharCounter();
    setDefaultDates();
    showSection(0);

    var form = document.getElementById('mainForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateEntireForm(form)) return;
            submitSurvey(form);
        });
    }
});

// ---------------------------------------------------------------------------
// GLOBAL FUNCTIONS
// ---------------------------------------------------------------------------
window.nextSection = nextSection;
window.prevSection = prevSection;
window.showKvkk = showKvkk;
window.closeKvkk = closeKvkk;
window.resetForm = resetForm;
window.initStars = initStars;
