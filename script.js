const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIa9CA3zdU8pLQPvHxEUQpk3umjLjh_tWeYzQKCDnVWdcEToA0GwnlkL1zsx8LpeI3pw/exec';

let currentSection = 1;
const totalSections = 11;

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getSectionElement(sectionNumber) {
    return document.getElementById('section' + sectionNumber);
}

function getAllSections() {
    return Array.from(document.querySelectorAll('.section'));
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (!progressBar || !progressText) return;

    const percent = Math.round((currentSection / totalSections) * 100);
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

function showSection(sectionNumber) {
    const number = Math.max(1, Math.min(totalSections, Number(sectionNumber) || 1));
    const sections = getAllSections();

    sections.forEach(section => {
        section.classList.toggle('active', section.id === 'section' + number);
    });

    currentSection = number;
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateSection(sectionNumber) {
    const section = getSectionElement(sectionNumber);
    if (!section) return true;

    const requiredFields = section.querySelectorAll('[required]');
    const processedRadioNames = new Set();

    for (const field of requiredFields) {
        if (field.type === 'radio') {
            if (processedRadioNames.has(field.name)) continue;
            processedRadioNames.add(field.name);

            const group = section.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
            const checked = Array.from(group).some(radio => radio.checked);

            if (!checked) {
                alert('Lütfen zorunlu alanları doldurun.');
                return false;
            }
        } else if (field.type === 'checkbox') {
            if (!field.checked) {
                alert('Lütfen zorunlu alanları doldurun.');
                return false;
            }
        } else if (!String(field.value || '').trim()) {
            alert('Lütfen zorunlu alanları doldurun.');
            field.focus();
            return false;
        }
    }

    const ratingInputs = section.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (const hidden of ratingInputs) {
        if (!String(hidden.value || '').trim()) {
            alert('Lütfen bu bölümdeki tüm soruları puanlayın.');
            return false;
        }
    }

    return true;
}

function validateAllSections() {
    for (let i = 1; i <= totalSections; i++) {
        if (!validateSection(i)) {
            showSection(i);
            return false;
        }
    }
    return true;
}

function nextSection(sectionNumber = currentSection) {
    if (!validateSection(sectionNumber)) return;
    showSection(sectionNumber + 1);
}

function prevSection(sectionNumber = currentSection) {
    showSection(sectionNumber - 1);
}

function initStars() {
    document.querySelectorAll('.stars').forEach(container => {
        const fieldName = container.getAttribute('data-name');
        if (!fieldName) return;

        const hiddenInput = container.parentElement.querySelector(`input[type="hidden"][name="${fieldName}"]`);

        if (container.dataset.initialized !== '1') {
            container.dataset.initialized = '1';

            if (container.children.length === 0) {
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.className = 'star';
                    star.dataset.value = i;
                    star.setAttribute('role', 'button');
                    star.setAttribute('tabindex', '0');
                    star.setAttribute('aria-label', `${i} yıldız`);
                    star.textContent = '★';
                    container.appendChild(star);
                }
            }

            const stars = container.querySelectorAll('.star');

            stars.forEach(star => {
                star.addEventListener('mouseenter', () => {
                    highlightStars(stars, star.dataset.value);
                });

                star.addEventListener('mouseleave', () => {
                    highlightStars(stars, hiddenInput ? hiddenInput.value : 0);
                });

                star.addEventListener('click', () => {
                    if (hiddenInput) {
                        hiddenInput.value = star.dataset.value;
                    }
                    highlightStars(stars, star.dataset.value);
                });

                star.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (hiddenInput) {
                            hiddenInput.value = star.dataset.value;
                        }
                        highlightStars(stars, star.dataset.value);
                    }
                });
            });
        }

        const stars = container.querySelectorAll('.star');
        highlightStars(stars, hiddenInput ? hiddenInput.value : 0);
    });
}

function highlightStars(stars, value) {
    const rating = parseInt(value || 0, 10);

    stars.forEach(star => {
        star.classList.toggle(
            'selected',
            parseInt(star.dataset.value, 10) <= rating
        );
    });
}

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
    if (modal && e.target === modal) {
        closeKvkk();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeKvkk();
    }
});

function setDefaultDates() {
    const checkIn = document.querySelector('input[name="checkIn"]');
    const checkOut = document.querySelector('input[name="checkOut"]');

    if (!checkIn || !checkOut) return;

    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    if (!checkIn.value) checkIn.value = formatDate(threeDaysAgo);
    if (!checkOut.value) checkOut.value = formatDate(today);

    checkIn.min = formatDate(threeDaysAgo);
    checkOut.min = formatDate(threeDaysAgo);

    checkIn.addEventListener('change', () => {
        if (checkIn.value) {
            checkOut.min = checkIn.value;
            if (checkOut.value && checkOut.value < checkIn.value) {
                checkOut.value = checkIn.value;
            }
        }
    });
}

function collectFormData(form) {
    const data = {};
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        data[key] = value;
    });

    const now = new Date();
    const tarih = now.toLocaleString('tr-TR');

    data.tarih = tarih;
    data.date = tarih;

    return data;
}

async function submitSurvey(form) {
    const data = collectFormData(form);
    const url = GOOGLE_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(data));

    try {
        await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-store'
        });

        showThankYou();
    } catch (error) {
        console.error('Anket gönderilemedi:', error);

        try {
            const img = new Image();
            img.src = url + '&_=' + Date.now();
        } catch (e) {
            console.error(e);
        }

        showThankYou();
    }
}

function showThankYou() {
    const surveyForm = document.getElementById('surveyForm');
    const thankYou = document.getElementById('thankYou');

    if (surveyForm) surveyForm.style.display = 'none';
    if (thankYou) thankYou.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    const form = document.getElementById('mainForm');
    const surveyForm = document.getElementById('surveyForm');
    const thankYou = document.getElementById('thankYou');
    const languageSelector = document.getElementById('languageSelector');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (form) form.reset();
    if (surveyForm) surveyForm.style.display = 'none';
    if (thankYou) thankYou.style.display = 'none';
    if (languageSelector) languageSelector.style.display = 'block';

    if (progressBar) progressBar.style.width = '0%';
    if (progressText) progressText.textContent = '0%';

    currentSection = 1;
    showSection(1);

    setDefaultDates();
    initStars();
}

document.addEventListener('DOMContentLoaded', function () {
    initStars();
    setDefaultDates();
    showSection(1);

    const form = document.getElementById('mainForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateAllSections()) return;
            submitSurvey(form);
        });
    }
});

window.nextSection = nextSection;
window.prevSection = prevSection;
window.showKvkk = showKvkk;
window.closeKvkk = closeKvkk;
window.resetForm = resetForm;
window.initStars = initStars;
window.showThankYou = showThankYou;
