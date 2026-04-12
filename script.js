// ============================================================================
// CONCORDIA CELES HOTEL - FRONTEND SCRIPT
// CLEAN FINAL VERSION
// KVKK MODAL + STAR RATING + SECTION NAVIGATION + FORM SUBMISSION
// ============================================================================

// GOOGLE SCRIPT URL
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

var currentSectionIndex = 0;

// ---------------------------------------------------------------------------
// SECTIONS
// ---------------------------------------------------------------------------
function getSections() {
    return Array.prototype.slice.call(document.querySelectorAll('.section'));
}

function updateProgressBar() {
    var progressBar = document.getElementById('progressBar');
    var progressText = document.getElementById('progressText');
    var sections = getSections();

    if (!progressBar || !progressText || sections.length < 2) return;

    var percent = Math.round((currentSectionIndex / (sections.length - 1)) * 100);
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

function showSection(index) {
    var sections = getSections();
    if (!sections.length) return;

    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;

    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.toggle('active', i === index);
    }

    currentSectionIndex = index;
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentSection() {
    var sections = getSections();
    var active = sections[currentSectionIndex];
    if (!active) return true;

    // 1) Required alanlar
    var requiredFields = active.querySelectorAll('[required]');
    var processedRadioNames = [];

    for (var i = 0; i < requiredFields.length; i++) {
        var el = requiredFields[i];

        if (el.type === 'radio') {
            if (processedRadioNames.indexOf(el.name) !== -1) continue;
            processedRadioNames.push(el.name);

            var group = active.querySelectorAll('input[name="' + el.name + '"]');
            var checked = false;

            for (var j = 0; j < group.length; j++) {
                if (group[j].checked) {
                    checked = true;
                    break;
                }
            }

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

    // 2) Yıldız puanları
    var hiddenRatings = active.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (var k = 0; k < hiddenRatings.length; k++) {
        if (!String(hiddenRatings[k].value || '').trim()) {
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

    var stars = container.querySelectorAll('.star');
    for (var i = 0; i < stars.length; i++) {
        var starValue = parseInt(stars[i].getAttribute('data-value'), 10);
        stars[i].classList.toggle('selected', starValue <= value);
    }
}

function initStars() {
    var containers = document.querySelectorAll('.rating-item .stars[data-name]');

    for (var c = 0; c < containers.length; c++) {
        var container = containers[c];

        if (container.getAttribute('data-ready') === '1') {
            continue;
        }
        container.setAttribute('data-ready', '1');

        var fieldName = container.getAttribute('data-name');
        var hiddenInput = container.parentElement.querySelector(
            'input[type="hidden"][name="' + fieldName + '"]'
        );

        // 5 yıldız oluştur: label + radio
        var html = '';
        for (var i = 5; i >= 1; i--) {
            html +=
                '<label class="star" data-value="' + i + '">' +
                    '<input type="radio" name="' + fieldName + '_rating" value="' + i + '">' +
                    '<span>★</span>' +
                '</label>';
        }
        container.innerHTML = html;

        var radios = container.querySelectorAll('input[type="radio"]');
        var stars = container.querySelectorAll('.star');

        function updateStars() {
            var checked = container.querySelector('input[type="radio"]:checked');
            var value = checked ? parseInt(checked.value, 10) : 0;

            if (hiddenInput) {
                hiddenInput.value = value ? String(value) : '';
            }

            for (var j = 0; j < stars.length; j++) {
                var starValue = parseInt(stars[j].getAttribute('data-value'), 10);
                stars[j].classList.toggle('selected', starValue <= value);
            }
        }

        for (var k = 0; k < radios.length; k++) {
            radios[k].addEventListener('change', updateStars);
        }

        // label tıklaması her zaman çalışsın
        stars.forEach(function (star) {
            star.addEventListener('click', function () {
                var radio = star.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        if (hiddenInput) hiddenInput.value = '';
        updateStars();
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
    var processedRadioNames = [];

    for (var i = 0; i < requiredFields.length; i++) {
        var el = requiredFields[i];

        if (el.type === 'radio') {
            if (processedRadioNames.indexOf(el.name) !== -1) continue;
            processedRadioNames.push(el.name);

            var group = form.querySelectorAll('input[name="' + el.name + '"]');
            var checked = false;

            for (var j = 0; j < group.length; j++) {
                if (group[j].checked) {
                    checked = true;
                    break;
                }
            }

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
    for (var k = 0; k < hiddenRatings.length; k++) {
        if (!String(hiddenRatings[k].value || '').trim()) {
            alert('Lütfen tüm departman sorularını puanlayın.');
            return false;
        }
    }

    return true;
}

async function submitSurvey(form) {
    var data = collectFormData(form);

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
        var surveyForm = document.getElementById('surveyForm');
        var languageSelector = document.getElementById('languageSelector');
        if (surveyForm) surveyForm.style.display = 'block';
        if (languageSelector) languageSelector.style.display = 'none';
        initStars();
        showSection(0);
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
