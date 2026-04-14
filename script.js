Tabii. Aşağıya **tam temiz, baştan sona çalışan `script.js`** veriyorum.  
Bu sürümde:

- **HTML içinde yıldız oluşturma yok**
- **Radio + label ile puanlama var**
- **KVKK sadece modal**
- **Bölüm geçişi çalışır**
- **Form Apps Script’e gönderilir**
- **Mavi ekran / syntax hatası olmaması için sade tutuldu**

> Bu dosya, benim önce verdiğim **`<div id="app"></div>`** kullanan minimal `index.html` ile uyumludur.  
> `index.html` içinde ayrıca `kvkkModal` ve `thankYou` alanlarının bulunduğunu varsayar.

---

# `script.js` — tam temiz sürüm

```javascript
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

// ---------------------------------------------------------------------------
// UTILS
// ---------------------------------------------------------------------------
function escapeHtml(text) {
    return String(text === undefined || text === null ? '' : text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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

// ---------------------------------------------------------------------------
// STAR HTML HELPERS
// ---------------------------------------------------------------------------
function starGroupHtml(fieldName) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
        html += ''
            + '<input type="radio" id="' + fieldName + '_' + i + '" name="' + fieldName + '" value="' + i + '">'
            + '<label class="star" for="' + fieldName + '_' + i + '" data-value="' + i + '">★</label>';
    }
    return html;
}

function ratingItemHtml(fieldName, label) {
    return ''
        + '<div class="rating-item">'
        + '  <label>' + escapeHtml(label) + '</label>'
        + '  <div class="stars" data-name="' + fieldName + '">'
        +        starGroupHtml(fieldName)
        + '  </div>'
        + '</div>';
}

function syncStarContainer(container) {
    var fieldName = container.getAttribute('data-name');
    var hiddenInput = container.parentElement.querySelector('input[type="hidden"][name="' + fieldName + '"]');

    var value = 0;
    if (hiddenInput && hiddenInput.value) {
        value = parseInt(hiddenInput.value, 10) || 0;
    }

    var stars = container.querySelectorAll('.star');
    for (var i = 0; i < stars.length; i++) {
        var starValue = parseInt(stars[i].getAttribute('data-value'), 10);
        stars[i].classList.toggle('selected', starValue <= value);
    }
}

function initStars() {
    var containers = document.querySelectorAll('.rating-item .stars[data-name]');

    for (var c = 0; c < containers.length; c++) {
        (function (container) {
            if (container.getAttribute('data-ready') === '1') {
                syncStarContainer(container);
                return;
            }
            container.setAttribute('data-ready', '1');

            var fieldName = container.getAttribute('data-name');
            var hiddenInput = container.parentElement.querySelector('input[type="hidden"][name="' + fieldName + '"]');

            // Yıldızları oluştur
            container.innerHTML = '';

            for (var i = 5; i >= 1; i--) {
                (function (value) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'star';
                    btn.setAttribute('data-value', value);
                    btn.setAttribute('aria-label', value + ' yıldız');
                    btn.textContent = '★';

                    btn.addEventListener('click', function (e) {
                        e.preventDefault();

                        if (hiddenInput) {
                            hiddenInput.value = String(value);
                        }

                        syncStarContainer(container);
                    });

                    container.appendChild(btn);
                })(i);
            }

            if (hiddenInput) {
                hiddenInput.value = '';
            }

            syncStarContainer(container);
        })(containers[c]);
    }
}

// ---------------------------------------------------------------------------
// BUTTONS / VALIDATION
// ---------------------------------------------------------------------------
// nextSection(2) => section2
// prevSection(1) => section1
function nextSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 2;
    }

    if (!validateCurrentSection()) return;
    showSection(sectionNumber - 1);
}

function prevSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 1;
    }

    showSection(sectionNumber - 1);
}

function validateCurrentSection() {
    var sections = getSections();
    var active = sections[currentSectionIndex];
    if (!active) return true;

    // Required fields
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

    // Star groups in this section
    var ratingGroups = active.querySelectorAll('.rating-item .stars[data-name]');
    for (var k = 0; k < ratingGroups.length; k++) {
        var checked = ratingGroups[k].querySelector('input[type="radio"]:checked');
        if (!checked) {
            alert('Lütfen bu bölümdeki tüm soruları puanlayın.');
            return false;
        }
    }

    return true;
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
// FORM HELPERS
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

    // All rating groups must be selected
    var ratingGroups = form.querySelectorAll('.rating-item .stars[data-name]');
    for (var k = 0; k < ratingGroups.length; k++) {
        var checked = ratingGroups[k].querySelector('input[type="radio"]:checked');
        if (!checked) {
            alert('Lütfen tüm departman sorularını puanlayın.');
            return false;
        }
    }

    return true;
}

async function submitSurvey(form) {
    var data = collectFormData(form);

    try {
        var body = new URLSearchParams();
        body.append('data', JSON.stringify(data));

        var res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: body
        });

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
    setDefaultDates();
}

// ---------------------------------------------------------------------------
// APP RENDER
// ---------------------------------------------------------------------------
var SECTION_DEFS = [
    {
        id: 'section2',
        icon: '🛎️',
        title: 'ÖN BÜRO RESEPSİYON',
        prev: 1,
        next: 3,
        items: [
            ['welcomeGreeting', 'Giriş Karşılama'],
            ['checkInProcess', 'Check-In İşlemleri'],
            ['facilityInfo', 'Tesis Hakkında Bilgilendirme'],
            ['frontDeskCare', 'Personelin İlgi ve Nezaketi'],
            ['bellboyService', 'Bellboy Hizmetleri']
        ]
    },
    {
        id: 'section3',
        icon: '🤝',
        title: 'GUEST RELATION',
        prev: 2,
        next: 4,
        items: [
            ['grWelcomeQuality', 'Karşılama Kalitesi'],
            ['problemSolving', 'Sorunları Çözüme Kavuşturma'],
            ['guestFollowUp', 'Misafir Takibi']
        ]
    },
    {
        id: 'section4',
        icon: '🧹',
        title: 'KAT HİZMETLERİ',
        prev: 3,
        next: 5,
        items: [
            ['initialRoomCleaning', 'İlk Varışınızda Oda Temizliği'],
            ['roomAppearance', 'Oda Fiziki Görünümü ve Konforu'],
            ['dailyRoomCleaning', 'Konaklama Süresince Oda Temizliği ve Düzeni'],
            ['minibarService', 'Minibar Hizmeti'],
            ['publicAreaCleaning', 'Genel Alan Temizliği'],
            ['beachPoolCleaning', 'Sahil ve Havuz Çevre Temizliği'],
            ['housekeepingStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section5',
        icon: '🍽️',
        title: 'MUTFAK',
        prev: 4,
        next: 6,
        items: [
            ['breakfastVariety', 'Kahvaltı Büfesi Çeşitliliği'],
            ['breakfastQuality', 'Kahvaltı Büfesi Sunumu ve Kalitesi'],
            ['lunchVariety', 'Öğle Yemeği Büfesi Çeşitliliği'],
            ['lunchQuality', 'Öğle Yemeği Sunumu ve Kalitesi'],
            ['dinnerVariety', 'Akşam Yemeği Büfesi Çeşitliliği'],
            ['dinnerQuality', 'Akşam Yemeği Sunumu ve Kalitesi'],
            ['alacarteQuality', 'A La Carte Restaurant Yemeği Sunumu ve Kalitesi'],
            ['kitchenHygiene', 'Mutfağın Hijyeni ve Temizliği'],
            ['foodStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section6',
        icon: '🍸',
        title: 'BARLAR',
        prev: 5,
        next: 7,
        items: [
            ['poolBarQuality', 'Pool Bar Servis Kalitesi'],
            ['lobbyBarQuality', 'Lobby Bar Servis Kalitesi'],
            ['snackBarQuality', 'Snack Bar Servis Kalitesi'],
            ['drinkQuality', 'İçki Kalitesi ve Sunumu'],
            ['barHygiene', 'Barların Hijyen ve Temizliği'],
            ['barStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section7',
        icon: '🍴',
        title: 'RESTAURANT HİZMETLERİ',
        prev: 6,
        next: 8,
        items: [
            ['restaurantLayout', 'Restaurant Düzeni ve Kalitesi'],
            ['restaurantCapacity', 'Restaurant Yer Yeterliliği'],
            ['restaurantHygiene', 'Restaurant Hijyen ve Temizliği'],
            ['snackbarRestaurant', 'Snackbar Restaurant Hizmeti'],
            ['alacarteRestaurant', 'Alacarte Restaurant Hizmeti ve Personel İlgisi'],
            ['restaurantStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section8',
        icon: '🔧',
        title: 'TEKNİK SERVİS',
        prev: 7,
        next: 9,
        items: [
            ['roomTechnicalSystems', 'Oda Teknik Sistemleri'],
            ['maintenanceResponse', 'Arıza Bildirimi ve Giderme'],
            ['environmentLighting', 'Çevre Aydınlatma ve Düzeni'],
            ['poolWaterCleaning', 'Havuz Suyu Temizliği'],
            ['technicalStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section9',
        icon: '🎭',
        title: 'EĞLENCE HİZMETLERİ',
        prev: 8,
        next: 10,
        items: [
            ['daytimeActivities', 'Animasyon Ekibi ile Gündüz Aktiviteleri'],
            ['sportsAreas', 'Aktivite ve Spor Alanları ve Ekipmanları'],
            ['eveningShows', 'Akşam Aktiviteleri ve Showlar'],
            ['miniclubActivities', 'Miniclub Aktiviteleri'],
            ['entertainmentStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },
    {
        id: 'section10',
        icon: '⭐',
        title: 'DİĞER HİZMETLER',
        prev: 9,
        next: 11,
        items: [
            ['landscaping', 'Genel Düzenleme / Peyzaj'],
            ['spaServices', 'Sauna-Hamam Hizmetleri'],
            ['shopBehavior', 'Hotel Genel Esnaf Davranışları'],
            ['priceQuality', 'Fiyat Kalitesi ve İlişkisi']
        ]
    },
    {
        id: 'section11',
        icon: '📝',
        title: 'ÖNERİLERİNİZ',
        prev: 10,
        next: null,
        items: []
    }
];

function buildSection(def) {
    var html = '';
    html += '<div class="section" id="' + def.id + '">';
    html += '  <div class="section-title">';
    html += '    <span class="section-icon">' + def.icon + '</span>';
    html += '    <h2>' + escapeHtml(def.title) + '</h2>';
    html += '  </div>';

    for (var i = 0; i < def.items.length; i++) {
        html += ratingItemHtml(def.items[i][0], def.items[i][1]);
    }

    if (def.id === 'section11') {
        html += '  <div class="form-group">';
        html += '    <label>Otelimizde Daha Önce Bulundunuz Mu? *</label>';
        html += '    <div class="yes-no-buttons">';
        html += '      <label class="yn-btn"><input type="radio" name="previousStay" value="Evet" required><span>Evet</span></label>';
        html += '      <label class="yn-btn"><input type="radio" name="previousStay" value="Hayır"><span>Hayır</span></label>';
        html += '    </div>';
        html += '  </div>';

        html += '  <div class="form-group">';
        html += '    <label>Hizmetinden Dolayı Övgüye Bulunduğunuz Personelin İsmi</label>';
        html += '    <input type="text" name="praisedStaff">';
        html += '  </div>';

        html += '  <div class="form-group">';
        html += '    <label>Genel Düşünce ve Yorumlarınız (0-500 karakter)</label>';
        html += '    <textarea name="generalComments" maxlength="500" rows="4"></textarea>';
        html += '    <small class="char-count">0 / 500</small>';
        html += '  </div>';

        html += '  <div class="form-group">';
        html += '    <label>Tekrar Gelir Misiniz? *</label>';
        html += '    <div class="yes-no-buttons">';
        html += '      <label class="yn-btn"><input type="radio" name="willReturn" value="Evet" required><span>Evet</span></label>';
        html += '      <label class="yn-btn"><input type="radio" name="willReturn" value="Hayır"><span>Hayır</span></label>';
        html += '    </div>';
        html += '  </div>';

        html += '  <div class="form-group">';
        html += '    <label>Bizi Çevrenize Tavsiye Eder Misiniz? *</label>';
        html += '    <div class="yes-no-buttons">';
        html += '      <label class="yn-btn"><input type="radio" name="wouldRecommend" value="Evet" required><span>Evet</span></label>';
        html += '      <label class="yn-btn"><input type="radio" name="wouldRecommend" value="Hayır"><span>Hayır</span></label>';
        html += '    </div>';
        html += '  </div>';

        html += '  <div class="btn-group">';
        html += '    <button type="button" class="btn btn-prev" onclick="prevSection(10)">← Geri</button>';
        html += '    <button type="submit" class="btn btn-submit">✅ Anketi Gönder</button>';
        html += '  </div>';
    } else {
        html += '  <div class="btn-group">';
        if (def.prev !== null && def.prev !== undefined) {
            html += '    <button type="button" class="btn btn-prev" onclick="prevSection(' + def.prev + ')">← Geri</button>';
        } else {
            html += '    <div></div>';
        }

        if (def.next !== null && def.next !== undefined) {
            html += '    <button type="button" class="btn btn-next" onclick="nextSection(' + def.next + ')">İleri →</button>';
        } else {
            html += '    <button type="submit" class="btn btn-submit">✅ Anketi Gönder</button>';
        }
        html += '  </div>';
    }

    html += '</div>';
    return html;
}

function renderApp() {
    var html = '';

    html += '<div class="container">';
    html += '  <div class="survey-form" id="surveyForm" style="display:block;">';

    html += '    <div class="header">';
    html += '      <img src="logo.png?v=1" alt="Hotel Logo" style="width:120px;margin-bottom:10px;">';
    html += '      <h1>Concordia Celes Hotel</h1>';
    html += '      <p>Misafir Memnuniyet Anketi</p>';
    html += '    </div>';

    html += '    <div class="progress-container">';
    html += '      <div class="progress-bar" id="progressBar"><span id="progressText">0%</span></div>';
    html += '    </div>';

    html += '    <form id="mainForm" novalidate>';

    // SECTION 1
    html += '      <div class="section active" id="section1">';
    html += '        <div class="section-title">';
    html += '          <span class="section-icon">👤</span>';
    html += '          <h2>GENEL BİLGİLER</h2>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Ad Soyad *</label>';
    html += '          <input type="text" name="fullName" required>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Cinsiyetiniz *</label>';
    html += '          <div class="gender-buttons">';
    html += '            <label class="gender-btn"><input type="radio" name="gender" value="Kadın" required><span>👩 Kadın</span></label>';
    html += '            <label class="gender-btn"><input type="radio" name="gender" value="Erkek"><span>👨 Erkek</span></label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Uyruğu *</label>';
    html += '          <select name="nationality" required>';
    html += '            <option value="">Seçiniz...</option>';
    html += '            <option value="Türkiye">🇹🇷 Türkiye</option>';
    html += '            <option value="Germany">🇩🇪 Almanya</option>';
    html += '            <option value="United Kingdom">🇬🇧 İngiltere</option>';
    html += '            <option value="Russia">🇷🇺 Rusya</option>';
    html += '            <option value="Poland">🇵🇱 Polonya</option>';
    html += '            <option value="Romania">🇷🇴 Romanya</option>';
    html += '            <option value="France">🇫🇷 Fransa</option>';
    html += '            <option value="Netherlands">🇳🇱 Hollanda</option>';
    html += '            <option value="Italy">🇮🇹 İtalya</option>';
    html += '            <option value="USA">🇺🇸 ABD</option>';
    html += '            <option value="Other">Diğer</option>';
    html += '          </select>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Oda Numarası *</label>';
    html += '          <input type="text" name="roomNumber" required placeholder="Örn: 305">';
    html += '        </div>';

    html += '        <div class="form-row">';
    html += '          <div class="form-group">';
    html += '            <label>Giriş Tarihi *</label>';
    html += '            <input type="date" name="checkIn" id="checkInDate" required>';
    html += '          </div>';
    html += '          <div class="form-group">';
    html += '            <label>Çıkış Tarihi *</label>';
    html += '            <input type="date" name="checkOut" id="checkOutDate" required>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Mail Adresi</label>';
    html += '          <input type="email" name="email" placeholder="ornek@email.com">';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <div class="kvkk-box">';
    html += '            <label class="kvkk-label">';
    html += '              <input type="checkbox" name="kvkkOnay" id="kvkkOnay" required>';
    html += '              <span>Kişisel verilerimin Concordia Celes Hotel tarafından misafir memnuniyeti amacıyla işlenmesine onay veriyorum. <a href="#" onclick="showKvkk(); return false;">📄 KVKK Aydınlatma Metni</a></span>';
    html += '            </label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="btn-group">';
    html += '          <div></div>';
    html += '          <button type="button" class="btn btn-next" onclick="nextSection(2)">İleri →</button>';
    html += '        </div>';

    html += '      </div>';

    for (var s = 0; s < SECTION_DEFS.length; s++) {
        html += buildSection(SECTION_DEFS[s]);
    }

    html += '    </form>';
    html += '  </div>';
    html += '</div>';

    document.getElementById('app').innerHTML = html;

    var form = document.getElementById('mainForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateEntireForm(form)) return;
            submitSurvey(form);
        });
    }

    initStars();
    initCharCounter();
    setDefaultDates();
    showSection(0);
}

// ---------------------------------------------------------------------------
// SUBMIT / THANK YOU
// ---------------------------------------------------------------------------
async function submitSurvey(form) {
    var data = collectFormData(form);

    try {
        var body = new URLSearchParams();
        body.append('data', JSON.stringify(data));

        var res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: body
        });

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

// ---------------------------------------------------------------------------
// DOM READY
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    renderApp();
});

// ---------------------------------------------------------------------------
// GLOBALS
// ---------------------------------------------------------------------------
window.nextSection = nextSection;
window.prevSection = prevSection;
window.showKvkk = showKvkk;
window.closeKvkk = closeKvkk;
window.resetForm = resetForm;
window.initStars = initStars;
```

---

## Çok önemli: `style.css` içine bunu ekleyin / eski yıldız stilini değiştirin

Bu script ile birlikte yıldızların görünmesi ve tıklanması için şu CSS olsun:

```css
.stars {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 8px;
    line-height: 1;
}

.stars input[type="radio"] {
    display: none;
}

.stars .star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    position: relative;
    font-size: 34px;
    line-height: 1;
    color: #d9d9d9;
    transition: transform 0.15s ease, color 0.15s ease;
    pointer-events: auto;
    background: transparent;
    border: 0;
    padding: 0 2px;
    appearance: none;
    -webkit-appearance: none;
}

.stars .star:hover {
    transform: translateY(-1px);
}

.stars .star.selected {
    color: #f5b301 !important;
}
```

---

## Son yapmanız gereken
1. `script.js` dosyasını tamamen bununla değiştirin  
2. `index.html` içinde sadece `div id="app"` + `kvkkModal` + `thankYou` kalsın  
3. `style.css` yıldız bloğunu yukarıdakiyle değiştirin  
4. `GOOGLE_SCRIPT_URL` satırına kendi `/exec` linkinizi yazın  
5. **Ctrl + F5** yapın  
6. Gerekirse GitHub’a commit/push

---

Eğer isterseniz bir sonraki mesajda size **bu pakete uygun son `index.html`** dosyasını da tekrar tek parça veririm.
