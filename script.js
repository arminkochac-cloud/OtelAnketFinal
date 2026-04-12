// ============================================================================
// CONCORDIA CELES HOTEL - FRONTEND SCRIPT
// CLEAN FINAL VERSION
// KVKK MODAL + STAR RATING + SECTION NAVIGATION + FORM SUBMISSION
// ============================================================================

// GOOGLE SCRIPT URL
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';
var currentSectionIndex = 0;

// ---------------------------------------------------------------------------
// FORM SECTIONS
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

    // Required alanlar
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

    // Yıldız puanları
    var hiddenRatings = active.querySelectorAll('.rating-item input[type="hidden"][name]');
    for (var k = 0; k < hiddenRatings.length; k++) {
        if (!String(hiddenRatings[k].value || '').trim()) {
            alert('Lütfen bu bölümdeki tüm soruları puanlayın.');
            return false;
        }
    }

    return true;
}

// Butonlar 1-based section number gönderiyor
// nextSection(2) => section2
// prevSection(1) => section1
function nextSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 1;
    }

    if (!validateCurrentSection()) return;
    showSection(sectionNumber - 1);
}

function prevSection(sectionNumber) {
    if (typeof sectionNumber === 'undefined') {
        sectionNumber = currentSectionIndex + 1;
    }

    showSection(Math.max(0, sectionNumber - 1));
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
            syncStarContainer(container);
            continue;
        }

        container.setAttribute('data-ready', '1');

        var fieldName = container.getAttribute('data-name');
        var hiddenInput = container.parentElement.querySelector(
            'input[type="hidden"][name="' + fieldName + '"]'
        );

        // Önce container'ı temizle
        container.innerHTML = '';

        // 5 yıldız oluştur (DOM ile, string HTML yok)
        for (var i = 5; i >= 1; i--) {
            (function (value) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'star';
                btn.setAttribute('data-value', String(value));
                btn.setAttribute('aria-label', value + ' yıldız');
                btn.textContent = '★';

                btn.addEventListener('click', function (e) {
                    e.preventDefault();

                    if (hiddenInput) {
                        hiddenInput.value = String(value);
                    }

                    syncStarContainer(container);
                });

                btn.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });

                container.appendChild(btn);
            })(i);
        }

        // Eğer önceden değer varsa işaretle
        if (hiddenInput) {
            hiddenInput.value = hiddenInput.value || '';
        }

        syncStarContainer(container);
    }
}
function syncStarContainer(container) {
    var fieldName = container.getAttribute('data-name');
    var hiddenInput = container.parentElement.querySelector(
        'input[type="hidden"][name="' + fieldName + '"]'
    );

    var value = parseInt((hiddenInput && hiddenInput.value) ? hiddenInput.value : '0', 10) || 0;

    var stars = container.querySelectorAll('.star');
    for (var i = 0; i < stars.length; i++) {
        var starValue = parseInt(stars[i].getAttribute('data-value'), 10);
        stars[i].classList.toggle('selected', starValue <= value);
    }
}

        for (var s = 0; s < stars.length; s++) {
            (function (starEl) {
                var value = parseInt(starEl.getAttribute('data-value'), 10);

                starEl.addEventListener('click', function (e) {
                    e.preventDefault();
                    setRating(value);
                });

                starEl.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setRating(value);
                    }
                });
            })(stars[s]);
        }

        if (hiddenInput) hiddenInput.value = '';
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
// DATE HELPERS
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
// FORM SUBMISSION
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
}

// ---------------------------------------------------------------------------
// APP BUILD
// ---------------------------------------------------------------------------
function q(name, label) {
    return ''
        + '<div class="rating-item">'
        + '<label>' + label + '</label>'
        + '<div class="stars" data-name="' + name + '"></div>'
        + '<input type="hidden" name="' + name + '">'
        + '</div>';
}

function renderApp() {
    var html = '';

    html += '<div class="container">';
    html += '  <div class="survey-form" id="surveyForm">';

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
    html += '        <div class="section-title"><span class="section-icon">👤</span><h2>GENEL BİLGİLER</h2></div>';

    html += '        <div class="form-group"><label>Ad Soyad *</label><input type="text" name="fullName" required></div>';

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

    html += '        <div class="form-group"><label>Oda Numarası *</label><input type="text" name="roomNumber" required placeholder="Örn: 305"></div>';

    html += '        <div class="form-row">';
    html += '          <div class="form-group"><label>Giriş Tarihi *</label><input type="date" name="checkIn" id="checkInDate" required></div>';
    html += '          <div class="form-group"><label>Çıkış Tarihi *</label><input type="date" name="checkOut" id="checkOutDate" required></div>';
    html += '        </div>';

    html += '        <div class="form-group"><label>Mail Adresi</label><input type="email" name="email" placeholder="ornek@email.com"></div>';

    html += '        <div class="form-group">';
    html += '          <div class="kvkk-box">';
    html += '            <label class="kvkk-label">';
    html += '              <input type="checkbox" name="kvkkOnay" id="kvkkOnay">';
    html += '              <span>Kişisel verilerimin Concordia Celes Hotel tarafından misafir memnuniyeti amacıyla işlenmesine onay veriyorum. <a href="#" onclick="showKvkk(); return false;">📄 KVKK Aydınlatma Metni</a></span>';
    html += '            </label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="btn-group"><div></div><button type="button" class="btn btn-next" onclick="nextSection(2)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 2
    html += '      <div class="section" id="section2">';
    html += '        <div class="section-title"><span class="section-icon">🛎️</span><h2>ÖN BÜRO RESEPSİYON</h2></div>';
    html += q('welcomeGreeting', 'Giriş Karşılama');
    html += q('checkInProcess', 'Check-In İşlemleri');
    html += q('facilityInfo', 'Tesis Hakkında Bilgilendirme');
    html += q('frontDeskCare', 'Personelin İlgi ve Nezaketi');
    html += q('bellboyService', 'Bellboy Hizmetleri');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(1)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(3)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 3
    html += '      <div class="section" id="section3">';
    html += '        <div class="section-title"><span class="section-icon">🤝</span><h2>GUEST RELATION</h2></div>';
    html += q('grWelcomeQuality', 'Karşılama Kalitesi');
    html += q('problemSolving', 'Sorunları Çözüme Kavuşturma');
    html += q('guestFollowUp', 'Misafir Takibi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(2)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(4)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 4
    html += '      <div class="section" id="section4">';
    html += '        <div class="section-title"><span class="section-icon">🧹</span><h2>KAT HİZMETLERİ</h2></div>';
    html += q('initialRoomCleaning', 'İlk Varışınızda Oda Temizliği');
    html += q('roomAppearance', 'Oda Fiziki Görünümü ve Konforu');
    html += q('dailyRoomCleaning', 'Konaklama Süresince Oda Temizliği ve Düzeni');
    html += q('minibarService', 'Minibar Hizmeti');
    html += q('publicAreaCleaning', 'Genel Alan Temizliği');
    html += q('beachPoolCleaning', 'Sahil ve Havuz Çevre Temizliği');
    html += q('housekeepingStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(3)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(5)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 5
    html += '      <div class="section" id="section5">';
    html += '        <div class="section-title"><span class="section-icon">🍽️</span><h2>MUTFAK</h2></div>';
    html += q('breakfastVariety', 'Kahvaltı Büfesi Çeşitliliği');
    html += q('breakfastQuality', 'Kahvaltı Büfesi Sunumu ve Kalitesi');
    html += q('lunchVariety', 'Öğle Yemeği Büfesi Çeşitliliği');
    html += q('lunchQuality', 'Öğle Yemeği Sunumu ve Kalitesi');
    html += q('dinnerVariety', 'Akşam Yemeği Büfesi Çeşitliliği');
    html += q('dinnerQuality', 'Akşam Yemeği Sunumu ve Kalitesi');
    html += q('alacarteQuality', 'A La Carte Restaurant Yemeği Sunumu ve Kalitesi');
    html += q('kitchenHygiene', 'Mutfağın Hijyeni ve Temizliği');
    html += q('foodStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(4)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(6)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 6
    html += '      <div class="section" id="section6">';
    html += '        <div class="section-title"><span class="section-icon">🍸</span><h2>BARLAR</h2></div>';
    html += q('poolBarQuality', 'Pool Bar Servis Kalitesi');
    html += q('lobbyBarQuality', 'Lobby Bar Servis Kalitesi');
    html += q('snackBarQuality', 'Snack Bar Servis Kalitesi');
    html += q('drinkQuality', 'İçki Kalitesi ve Sunumu');
    html += q('barHygiene', 'Barların Hijyen ve Temizliği');
    html += q('barStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(5)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(7)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 7
    html += '      <div class="section" id="section7">';
    html += '        <div class="section-title"><span class="section-icon">🍴</span><h2>RESTAURANT HİZMETLERİ</h2></div>';
    html += q('restaurantLayout', 'Restaurant Düzeni ve Kalitesi');
    html += q('restaurantCapacity', 'Restaurant Yer Yeterliliği');
    html += q('restaurantHygiene', 'Restaurant Hijyen ve Temizliği');
    html += q('snackbarRestaurant', 'Snackbar Restaurant Hizmeti');
    html += q('alacarteRestaurant', 'Alacarte Restaurant Hizmeti ve Personel İlgisi');
    html += q('restaurantStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(6)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(8)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 8
    html += '      <div class="section" id="section8">';
    html += '        <div class="section-title"><span class="section-icon">🔧</span><h2>TEKNİK SERVİS</h2></div>';
    html += q('roomTechnicalSystems', 'Oda Teknik Sistemleri');
    html += q('maintenanceResponse', 'Arıza Bildirimi ve Giderme');
    html += q('environmentLighting', 'Çevre Aydınlatma ve Düzeni');
    html += q('poolWaterCleaning', 'Havuz Suyu Temizliği');
    html += q('technicalStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(7)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(9)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 9
    html += '      <div class="section" id="section9">';
    html += '        <div class="section-title"><span class="section-icon">🎭</span><h2>EĞLENCE HİZMETLERİ</h2></div>';
    html += q('daytimeActivities', 'Animasyon Ekibi ile Gündüz Aktiviteleri');
    html += q('sportsAreas', 'Aktivite ve Spor Alanları ve Ekipmanları');
    html += q('eveningShows', 'Akşam Aktiviteleri ve Showlar');
    html += q('miniclubActivities', 'Miniclub Aktiviteleri');
    html += q('entertainmentStaffCare', 'Personelin İlgi ve Nezaketi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(8)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(10)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 10
    html += '      <div class="section" id="section10">';
    html += '        <div class="section-title"><span class="section-icon">⭐</span><h2>DİĞER HİZMETLER</h2></div>';
    html += q('landscaping', 'Genel Düzenleme / Peyzaj');
    html += q('spaServices', 'Sauna-Hamam Hizmetleri');
    html += q('shopBehavior', 'Hotel Genel Esnaf Davranışları');
    html += q('priceQuality', 'Fiyat Kalitesi ve İlişkisi');
    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(9)">← Geri</button><button type="button" class="btn btn-next" onclick="nextSection(11)">İleri →</button></div>';
    html += '      </div>';

    // SECTION 11
    html += '      <div class="section" id="section11">';
    html += '        <div class="section-title"><span class="section-icon">📝</span><h2>ÖNERİLERİNİZ</h2></div>';

    html += '        <div class="form-group">';
    html += '          <label>Otelimizde Daha Önce Bulundunuz Mu? *</label>';
    html += '          <div class="yes-no-buttons">';
    html += '            <label class="yn-btn"><input type="radio" name="previousStay" value="Evet" required><span>Evet</span></label>';
    html += '            <label class="yn-btn"><input type="radio" name="previousStay" value="Hayır"><span>Hayır</span></label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="form-group"><label>Hizmetinden Dolayı Övgüye Bulunduğunuz Personelin İsmi</label><input type="text" name="praisedStaff"></div>';

    html += '        <div class="form-group"><label>Genel Düşünce ve Yorumlarınız (0-500 karakter)</label><textarea name="generalComments" maxlength="500" rows="4"></textarea><small class="char-count">0 / 500</small></div>';

    html += '        <div class="form-group">';
    html += '          <label>Tekrar Gelir Misiniz? *</label>';
    html += '          <div class="yes-no-buttons">';
    html += '            <label class="yn-btn"><input type="radio" name="willReturn" value="Evet" required><span>Evet</span></label>';
    html += '            <label class="yn-btn"><input type="radio" name="willReturn" value="Hayır"><span>Hayır</span></label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="form-group">';
    html += '          <label>Bizi Çevrenize Tavsiye Eder Misiniz? *</label>';
    html += '          <div class="yes-no-buttons">';
    html += '            <label class="yn-btn"><input type="radio" name="wouldRecommend" value="Evet" required><span>Evet</span></label>';
    html += '            <label class="yn-btn"><input type="radio" name="wouldRecommend" value="Hayır"><span>Hayır</span></label>';
    html += '          </div>';
    html += '        </div>';

    html += '        <div class="btn-group"><button type="button" class="btn btn-prev" onclick="prevSection(10)">← Geri</button><button type="submit" class="btn btn-submit">✅ Anketi Gönder</button></div>';
    html += '      </div>';

    html += '    </form>';
    html += '  </div>';
    html += '</div>';

    document.getElementById('app').innerHTML = html;

    // Events
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
// DOM READY
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    renderApp();
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
