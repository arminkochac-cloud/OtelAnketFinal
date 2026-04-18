var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIa9CA3zdU8pLQPvHxEUQpk3umjLjh_tWeYzQKCDnVWdcEToA0GwnlkL1zsx8LpeI3pw/exec';

var currentSection = 1;
var totalSections = 11;

document.addEventListener('DOMContentLoaded', function() {
    
    var form = document.getElementById('mainForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            data.tarih = new Date().toLocaleString('tr-TR');
            
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
            var img = new Image();
            img.src = GOOGLE_SCRIPT_URL + 
                '?data=' + encodedData;
            console.log('Gonderildi!');
            
            // Tesekkur ekrani
            document.getElementById('surveyForm')
                .style.display = 'none';
            document.getElementById('thankYou')
                .style.display = 'block';
        });
    }
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
}
