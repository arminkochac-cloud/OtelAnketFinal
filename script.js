document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.querySelector('textarea[name="generalComments"]');
    if(textarea) textarea.addEventListener('input', function() {});
});

function initStars() {
    document.querySelectorAll('.stars').forEach(function(container) {
        if(container.children.length === 0) {
            for(var i=1; i<=5; i++) {
                var s = document.createElement('span');
                s.className='star';
                s.dataset.value=i;
                s.textContent='★';
                container.appendChild(s);
            }
        }
        var hiddenInput = document.querySelector('input[name="' + container.dataset.name + '"]');
        var stars = container.querySelectorAll('.star');
        if(hiddenInput && hiddenInput.value) highlightStars(stars, hiddenInput.value);
        stars.forEach(function(star) {
            star.addEventListener('mouseenter', function() { highlightStars(stars, star.dataset.value); });
            star.addEventListener('mouseleave', function() { highlightStars(stars, hiddenInput ? hiddenInput.value : 0); });
            star.addEventListener('click', function() {
                if(hiddenInput) hiddenInput.value = star.dataset.value;
                highlightStars(stars, star.dataset.value);
            });
        });
    });
}
function highlightStars(stars, value) {
    stars.forEach(function(s) { s.classList.toggle('selected', parseInt(s.dataset.value) <= parseInt(value || 0)); });
}

var currentSection = 1;
var totalSections = 11;

function nextSection(current) {
    var section = document.getElementById('section'+current);
    var text = section.querySelector('input[type="text"][required]');
    if(text && text.value.trim()==="") { alert("Lutfen zorunlu alanlari doldurun."); return; }
    var requiredRadios = section.querySelectorAll('input[type="radio"][required]');
    if (requiredRadios.length > 0) {
        var radio = section.querySelector('input[type="radio"]:checked');
        if (!radio) { alert("Lutfen bir secim yapin."); return; }
    }
    document.getElementById('section'+current).classList.remove('active');
    document.getElementById('section'+(current+1)).classList.add('active');
    var progressPct = ((current+1) / totalSections * 100);
    document.getElementById('progressBar').style.width = progressPct + '%';
    document.getElementById('progressText').textContent = Math.round(progressPct) + '%';
    window.scrollTo({top:0, behavior:'smooth'});
}
function prevSection(current) {
    document.getElementById('section'+current).classList.remove('active');
    document.getElementById('section'+(current-1)).classList.add('active');
    document.getElementById('progressBar').style.width = (((current-2)/totalSections * 100)) + '%';
    document.getElementById('progressText').textContent = Math.round(((current-2)/totalSections * 100)) + '%';
}

// ✅ URL DEĞİŞKENİ DOĞRU ŞEKİLDE TANIMLANDI
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxFZEcebGWpUR1xjiFmcaKsfOnrW-31rSmdoLIhjppc_YbTpqOJYHzQKJ2eJIL9LMUwZQ/exec';

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var data = {};
    formData.forEach(function(value, key) {
        data[key] = value;
    });
    data.date = new Date().toLocaleString('tr-TR');
    data.id = Date.now();

    // 1. LocalStorage'a kaydet (Yedek)
    var surveys = JSON.parse(localStorage.getItem('hotelSurveys') || '[]');
    surveys.push(data);
    localStorage.setItem('hotelSurveys', JSON.stringify(surveys));

    // 2. Google Sheets'e gonder
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function() {
        console.log('Google Sheets kayit basarili');
    }).catch(function(err) {
        console.error('Google Sheets hata:', err);
    });

    // 3. Tesekkur Ekrani
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('thankYou').style.display = 'block';
});

function resetForm() {
    document.getElementById('mainForm').reset();
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('thankYou').style.display = 'none';
    document.getElementById('languageSelector').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
}
