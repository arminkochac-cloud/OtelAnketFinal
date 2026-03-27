var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFoskU9T87ar-74jYgM_N2NTUmy4S72jsll2FRcBpjb9hmgyBlpXzishNQS_sVw3Ujgg/exec';

var currentSection = 1;
var totalSections = 11;

document.addEventListener('DOMContentLoaded', function() {
    initStars();
    
    // Bugünün tarihini otomatik ayarla
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var todayStr = yyyy + '-' + mm + '-' + dd;

    // Yarının tarihini hesapla
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var yyyy2 = tomorrow.getFullYear();
    var mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var dd2 = String(tomorrow.getDate()).padStart(2, '0');
    var tomorrowStr = yyyy2 + '-' + mm2 + '-' + dd2;

    // Tarihleri ata
    var checkIn = document.getElementById('checkInDate');
    var checkOut = document.getElementById('checkOutDate');
    if(checkIn) checkIn.value = todayStr;
    if(checkOut) checkOut.value = tomorrowStr;

    var form = document.getElementById('mainForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            data.date = new Date().toLocaleString('tr-TR');
            
            // LocalStorage yedek
            var surveys = JSON.parse(
                localStorage.getItem('hotelSurveys') || '[]'
            );
            surveys.push(data);
            localStorage.setItem(
                'hotelSurveys', 
                JSON.stringify(surveys)
            );
            
            // Google Sheets'e gonder
            var encodedData = encodeURIComponent(
                JSON.stringify(data)
            );

            // Fetch ile gönder
            fetch(GOOGLE_SCRIPT_URL + '?data=' + encodedData, {
                method: 'GET',
                mode: 'no-cors'
            }).then(function() {
                console.log('Fetch ile gonderildi!');
            }).catch(function() {
                // Fetch başarısız olursa Image ile dene
                var img = new Image();
                img.src = GOOGLE_SCRIPT_URL + 
                    '?data=' + encodedData;
                console.log('Image ile gonderildi!');
            });
            
            // Tesekkur ekrani
            document.getElementById('surveyForm')
                .style.display = 'none';
            document.getElementById('thankYou')
                .style.display = 'block';
        });
    }

    // Modal dışına tıklayınca kapat
    document.addEventListener('click', function(e) {
        var modal = document.getElementById('kvkkModal');
        if(e.target === modal) {
            closeKvkk();
        }
    });
});

function initStars() {
    document.querySelectorAll('.stars').forEach(
        function(container) {
            if(container.children.length === 0) {
                for(var i=1; i<=5; i++) {
                    var s = document.createElement('span');
                    s.className = 'star';
                    s.dataset.value = i;
                    s.textContent = '★';
                    container.appendChild(s);
                }
            }
            var hiddenInput = document.querySelector(
                'input[name="' + container.dataset.name + '"]'
            );
            var stars = container.querySelectorAll('.star');
            if(hiddenInput && hiddenInput.value) {
                highlightStars(stars, hiddenInput.value);
            }
            stars.forEach(function(star) {
                star.addEventListener('mouseenter', function() {
                    highlightStars(stars, star.dataset.value);
                });
                star.addEventListener('mouseleave', function() {
                    highlightStars(
                        stars, 
                        hiddenInput ? hiddenInput.value : 0
                    );
                });
                star.addEventListener('click', function() {
                    if(hiddenInput) {
                        hiddenInput.value = star.dataset.value;
                    }
                    highlightStars(stars, star.dataset.value);
                });
            });
        }
    );
}

function highlightStars(stars, value) {
    stars.forEach(function(s) {
        s.classList.toggle(
            'selected',
            parseInt(s.dataset.value) <= parseInt(value || 0)
        );
    });
}

function nextSection(current) {
    var section = document.getElementById('section' + current);
    
    // KVKK kontrolü (sadece section 1)
    if(current === 1) {
        var kvkk = document.getElementById('kvkkOnay');
        if(kvkk && !kvkk.checked) {
            alert("Lütfen KVKK metnini onaylayın!");
            return;
        }
    }
    
    // Text ve select kontrol
    var inputs = section.querySelectorAll(
        'input[type="text"][required], select[required]'
    );
    var bos = false;
    inputs.forEach(function(input) {
        if(input.value.trim() === '') {
            bos = true;
        }
    });
    if(bos) {
        alert("Lutfen zorunlu alanlari doldurun.");
        return;
    }
    
    // Radio kontrol
    var radioGroups = {};
    section.querySelectorAll(
        'input[type="radio"][required]'
    ).forEach(function(radio) {
        radioGroups[radio.name] = true;
    });
    
    for(var name in radioGroups) {
        var checked = section.querySelector(
            'input[name="' + name + '"]:checked'
        );
        if(!checked) {
            alert("Lutfen bir secim yapin.");
            return;
        }
    }
    
    // Ileri git
    document.getElementById('section' + current)
        .classList.remove('active');
    document.getElementById('section' + (current + 1))
        .classList.add('active');
    
    var progressPct = ((current + 1) / totalSections * 100);
    document.getElementById('progressBar').style.width = 
        progressPct + '%';
    document.getElementById('progressText').textContent = 
        Math.round(progressPct) + '%';
    
    window.scrollTo({top: 0, behavior: 'smooth'});
    initStars();
}

function prevSection(current) {
    document.getElementById('section' + current)
        .classList.remove('active');
    document.getElementById('section' + (current - 1))
        .classList.add('active');
    
    var pct = ((current - 2) / totalSections * 100);
    document.getElementById('progressBar').style.width = 
        pct + '%';
    document.getElementById('progressText').textContent = 
        Math.round(pct) + '%';
}

function resetForm() {
    document.getElementById('mainForm').reset();
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('thankYou').style.display = 'none';
    document.getElementById('languageSelector').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
    currentSection = 1;
    document.querySelectorAll('.section').forEach(function(s) {
        s.classList.remove('active');
    });
    document.getElementById('section1').classList.add('active');

    // Tarihleri sıfırla
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var todayStr = yyyy + '-' + mm + '-' + dd;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var yyyy2 = tomorrow.getFullYear();
    var mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var dd2 = String(tomorrow.getDate()).padStart(2, '0');
    var tomorrowStr = yyyy2 + '-' + mm2 + '-' + dd2;

    var checkIn = document.getElementById('checkInDate');
    var checkOut = document.getElementById('checkOutDate');
    if(checkIn) checkIn.value = todayStr;
    if(checkOut) checkOut.value = tomorrowStr;
}

// KVKK Fonksiyonları
function showKvkk() {
    document.getElementById('kvkkModal')
        .style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeKvkk() {
    document.getElementById('kvkkModal')
        .style.display = 'none';
    document.body.style.overflow = 'auto';
}
