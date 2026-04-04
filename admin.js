// ============================================================================
// CONCORDİA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// ============================================================================

// GOOGLE SCRIPTS URL (Son deploy URL'inizi buraya yapıştırın)
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTqaJ46w-ffPiBB7S8h-3dlC-d7XZnl-NzJCb6SHCbbf5UKCFW8W9fp0jE1KVsXGzY0g/exec
// 
// ============================================================================
// SAYFA YÜKLENDİĞİNDE ÇALIŞACAK FONKSİYONLAR
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Google Sheets'ten veri çekmeyi dene
        loadFromGoogleSheets();
        
        // Dashboard'u render et
        renderDashboardInternal();
        
        console.log('✅ Admin panel başarıyla yüklendi!');
    } catch (e) {
        console.error('❌ Yükleme hatası:', e);
    }
});

// ============================================================================
// GOOGLE SHEETS'TEN VERİ ÇEKME
// ============================================================================

function loadFromGoogleSheets() {
    // URL ayarlanmamışsa yerel veri kullan
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('...')) {
        console.log('⚠️ Google Script URL ayarlanmamış, yerel veri kullanılıyor');
        return;
    }
    
    fetch(GOOGLE_SCRIPT_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data && data.length > 0) {
                localStorage.setItem('hotelSurveys', JSON.stringify(data));
                console.log('✅ Google Sheets\'ten ' + data.length + ' kayıt yüklendi');
                renderDashboardInternal();
            }
        })
        .catch(function(err) {
            console.log('⚠️ Google Sheets bağlantı hatası, yerel veri kullanılıyor:', err);
        });
}

// ============================================================================
// TÜM SORU ALANLARI (index.html ile birebir eşleşmeli)
// ============================================================================

var ALL_FIELDS = [
    'girisKarsilama', 'checkInIslem', 'tesisBilgi', 'onBuroNezaket', 'bellboy',
    'grKararlama', 'sorunCozum', 'misafirTakip',
    'katIlkTemizlik', 'katGorunum', 'katGunlukTemizlik', 'minibar', 'genelAlan', 'sahilHavuz', 'katNezaket',
    'kahvaltiCesit', 'kahvaltiSunum', 'ogleCesit', 'ogleSunum', 'aksamCesit', 'aksamSunum', 'alacartYemek', 'mutfakHijyen', 'yiyecekNezaket',
    'pollBar', 'lobbyBar', 'snackBar', 'ickiKalite', 'barHijyen', 'barNezaket',
    'restDuzen', 'restYer', 'restHijyen', 'snackRest', 'alacartRest', 'restNezaket',
    'teknikSistem', 'ariza', 'cevreAydinlatma', 'havuzSu', 'teknikNezaket',
    'animasyonGunduz', 'sporAlan', 'showlar', 'miniclub', 'eglenceNezaket',
    'peyzaj', 'spa', 'esnaf', 'fiyatKalite'
];

// ============================================================================
// DEPARTMAN GRUPLARI
// ============================================================================

var DEPT_MAP = {
    'On Büro': ['girisKarsilama', 'checkInIslem', 'tesisBilgi', 'onBuroNezaket', 'bellboy'],
    'Guest Relation': ['grKararlama', 'sorunCozum', 'misafirTakip'],
    'Kat Hizmetleri': ['katIlkTemizlik', 'katGorunum', 'katGunlukTemizlik', 'minibar', 'genelAlan', 'sahilHavuz', 'katNezaket'],
    'Yiyecek': ['kahvaltiCesit', 'kahvaltiSunum', 'ogleCesit', 'ogleSunum', 'aksamCesit', 'aksamSunum', 'alacartYemek', 'mutfakHijyen', 'yiyecekNezaket'],
    'Barlar': ['pollBar', 'lobbyBar', 'snackBar', 'ickiKalite', 'barHijyen', 'barNezaket'],
    'Restoran': ['restDuzen', 'restYer', 'restHijyen', 'snackRest', 'alacartRest', 'restNezaket'],
    'Teknik': ['teknikSistem', 'ariza', 'cevreAydinlatma', 'havuzSu', 'teknikNezaket'],
    'Eğlence': ['animasyonGunduz', 'sporAlan', 'showlar', 'miniclub', 'eglenceNezaket'],
    'Diğer': ['peyzaj', 'spa', 'esnaf', 'fiyatKalite']
};

// ============================================================================
// DEPARTMAN DETAY SORULARI (Türkçe etiketler)
// ============================================================================

var DEPT_DETAIL = {
    'frontOffice': [
        ['Giriş Karşılama', 'girisKarsilama'],
        ['Check-In İşlemleri', 'checkInIslem'],
        ['Tesis Hakkında Bilgilendirme', 'tesisBilgi'],
        ['Personelin İlgi ve Nezaket', 'onBuroNezaket'],
        ['Bellboy Hizmetleri', 'bellboy']
    ],
    'guestRelation': [
        ['Karşılama Kalitesi', 'grKararlama'],
        ['Sorunları Çözme', 'sorunCozum'],
        ['Misafir Takibi', 'misafirTakip']
    ],
    'housekeeping': [
        ['İlk Varışınızda Oda Temizliği', 'katIlkTemizlik'],
        ['Oda Fiziki Görünümü ve Konforu', 'katGorunum'],
        ['Konaklama Süresince Oda Temizliği', 'katGunlukTemizlik'],
        ['Minibar Hizmeti', 'minibar'],
        ['Genel Alan Temizliği', 'genelAlan'],
        ['Sahil ve Havuz Çevre Temizliği', 'sahilHavuz'],
        ['Personelin İlgi ve Nezaket', 'katNezaket']
    ],
    'foodServices': [
        ['Kahvaltı Büfesi Çeşitliliği', 'kahvaltiCesit'],
        ['Kahvaltı Büfesi Sunumu ve Kalitesi', 'kahvaltiSunum'],
        ['Öğle Yemeği Büfesi Çeşitliliği', 'ogleCesit'],
        ['Öğle Yemeği Sunumu ve Kalitesi', 'ogleSunum'],
        ['Akşam Yemeği Büfesi Çeşitliliği', 'aksamCesit'],
        ['Akşam Yemeği Sunumu ve Kalitesi', 'aksamSunum'],
        ['Alacart Restaurant Yemeği', 'alacartYemek'],
        ['Mutfak Hijyen ve Temizliği', 'mutfakHijyen'],
        ['Personelin İlgi ve Nezaket', 'yiyecekNezaket']
    ],
    'barsServices': [
        ['Pool Bar Servis Kalitesi', 'pollBar'],
        ['Lobby Bar Servis Kalitesi', 'lobbyBar'],
        ['Snack Bar Servis Kalitesi', 'snackBar'],
        ['İçki Kalitesi ve Sunumu', 'ickiKalite'],
        ['Barların Hijyen ve Temizliği', 'barHijyen'],
        ['Personelin İlgi ve Nezaket', 'barNezaket']
    ],
    'restaurantServices': [
        ['Restaurant Düzeni ve Kalitesi', 'restDuzen'],
        ['Restaurant Yer Yeterliliği', 'restYer'],
        ['Restaurant Hijyen ve Temizliği', 'restHijyen'],
        ['Snackbar Restaurant Hizmeti', 'snackRest'],
        ['Alacart Restaurant Hizmeti', 'alacartRest'],
        ['Personelin İlgi ve Nezaket', 'restNezaket']
    ],
    'technicalService': [
        ['Oda Teknik Sistemleri', 'teknikSistem'],
        ['Arıza Bildirimi ve Giderme', 'ariza'],
        ['Çevre Aydınlatma ve Düzeni', 'cevreAydinlatma'],
        ['Havuz Suyu Temizliği', 'havuzSu'],
        ['Personelin İlgi ve Nezaket', 'teknikNezaket']
    ],
    'entertainmentServices': [
        ['Animasyon Ekibi ile Gündüz Aktiviteleri', 'animasyonGunduz'],
        ['Aktivite ve Spor Alanları', 'sporAlan'],
        ['Akşam Aktiviteleri ve Showlar', 'showlar'],
        ['Miniclub Aktiviteleri', 'miniclub'],
        ['Personelin İlgi ve Nezaket', 'eglenceNezaket']
    ],
    'otherServices': [
        ['Genel Düzenleme / Peyzaj', 'peyzaj'],
        ['Sauna-Hamam Hizmetleri', 'spa'],
        ['Otel Genel Esnaf Davranışları', 'esnaf'],
        ['Fiyat Kalitesi ve İlişkisi', 'fiyatKalite']
    ]
};

// ============================================================================
// ANA DASHBOARD RENDER FONKSİYONU
// ============================================================================

function renderDashboardInternal() {
    var rawDataStr = localStorage.getItem('hotelSurveys');
    var rawData = rawDataStr ? JSON.parse(rawDataStr) : [];
    
    // Veri yoksa uyarı göster
    if (rawData.length === 0) {
        var dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.innerHTML = '<div class="card full-width" style="text-align:center; padding:50px;"><h2>📭 Veri Yok</h2><p style="color:#666; margin-top:15px;">Anketi doldurup gönderdikten sonra burası dolacak.</p><br><a href="index.html" style="color:#1a1a3e; font-weight:600;">📋 Ankete Git</a></div>';
        }
        return;
    }

    var filterType = document.getElementById('timeFilter');
    var selectedFilter = filterType ? filterType.value : 'monthly';
    var filteredData = filterByTime(rawData, selectedFilter);
    
    // Tüm grafikleri ve tabloları render et
    calcAvg(filteredData);
    calcTopPerformers(filteredData);
    drawDeptScores(filteredData);
    renderDeptDetailInternal();
    drawCountryChart(filteredData);
    drawStaffChart(filteredData);
    drawTable(filteredData);
    drawComments(filteredData);
    
    console.log('✅ Dashboard render edildi. Toplam kayıt: ' + filteredData.length);
}

// Global fonksiyon olarak da tanımla (HTML'den çağrılabilir olması için)
window.renderDashboardInternal = renderDashboardInternal;
window.renderDashboard = renderDashboardInternal;

// ============================================================================
// ZAMAN FİLTRESİ
// ============================================================================

function filterByTime(data, type) {
    var now = new Date();
    return data.filter(function(item) {
        if (!item.date) return false;
        
        var dateStr = item.date;
        
        // Tarih formatını düzelt (DD.MM.YYYY → YYYY-MM-DD)
        if (dateStr.indexOf('.') > -1) {
            var parts = dateStr.split(' ')[0].split('.');
            if (parts.length === 3) {
                dateStr = parts[2] + '-' + parts[1] + '-' + parts[0];
            }
        }
        
        var itemDate = new Date(dateStr);
        if (isNaN(itemDate)) return false;
        
        var diffDays = Math.ceil(Math.abs(now - itemDate) / (1000 * 60 * 60 * 24));
        
        if (type === 'all') return true;
        if (type === 'daily') return diffDays <= 1;
        if (type === 'weekly') return diffDays <= 7;
        if (type === 'monthly') return diffDays <= 30;
        if (type === 'yearly') return diffDays <= 365;
        
        return true;
    });
}

// ============================================================================
// GENEL ORTALAMA HESAPLAMA
// ============================================================================

function calcAvg(data) {
    var el = document.getElementById('generalAvg');
    if (!el) return;
    
    var totalScore = 0;
    var count = 0;
    
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < ALL_FIELDS.length; j++) {
            var val = data[i][ALL_FIELDS[j]];
            if (val && val !== '' && !isNaN(val)) {
                totalScore += parseInt(val);
                count++;
            }
        }
    }
    
    if (count === 0) {
        el.innerText = 'N/A';
        el.style.color = '#999';
        return;
    }
    
    var avg = totalScore / count;
    var scaled = Math.round((avg / 5) * 100);
    
    el.innerText = scaled;
    
    // Renk kodu
    if (scaled >= 80) {
        el.style.color = '#28a745'; // Yeşil
    } else if (scaled >= 60) {
        el.style.color = '#ffc107'; // Sarı
    } else {
        el.style.color = '#dc3545'; // Kırmızı
    }
}

// ============================================================================
// EN İYİ 3 DEPARTMAN VE PERSONEL HESAPLAMA
// ============================================================================

function calcTopPerformers(data) {
    // DEPARTMAN PUANLARI
    var deptScores = [];
    var deptNames = Object.keys(DEPT_MAP);
    
    for (var d = 0; d < deptNames.length; d++) {
        var name = deptNames[d];
        var fields = DEPT_MAP[name];
        var sum = 0;
        var n = 0;
        
        for (var i = 0; i < data.length; i++) {
            for (var f = 0; f < fields.length; f++) {
                var val = data[i][fields[f]];
                if (val && val !== '' && !isNaN(val)) {
                    sum += parseInt(val);
                    n++;
                }
            }
        }
        
        if (n > 0) {
            deptScores.push({
                name: name,
                score: sum / n
            });
        }
    }
    
    // Sırala (yüksekten düşüğe)
    deptScores.sort(function(a, b) {
        return b.score - a.score;
    });
    
    // İlk 3'ü al
    var topDepts = deptScores.slice(0, 3).map(function(d) {
        return {
            name: d.name,
            val: Math.round((d.score / 5) * 100) + '%'
        };
    });
    
    drawMedals('topDepts', topDepts);

    // PERSONEL ÖVGÜLERİ
    var staffCounts = {};
    
    for (var i = 0; i < data.length; i++) {
        var ps = data[i].praisedStaff;
        if (ps && ps.trim() !== '') {
            var names = ps.split(',');
            for (var k = 0; k < names.length; k++) {
                var nm = names[k].trim();
                if (nm) {
                    staffCounts[nm] = (staffCounts[nm] || 0) + 1;
                }
            }
        }
    }
    
    var staffArr = [];
    for (var key in staffCounts) {
        staffArr.push({
            name: key,
            val: staffCounts[key] + ' övgü'
        });
    }
    
    staffArr.sort(function(a, b) {
        return parseInt(b.val) - parseInt(a.val);
    });
    
    drawMedals('topStaff', staffArr.slice(0, 3));
}

// ============================================================================
// MADALYA ÇİZİMİ (TOP 3)
// ============================================================================

function drawMedals(containerId, items) {
    var el = document.getElementById(containerId);
    if (!el) return;
    
    el.innerHTML = '';
    
    if (items.length === 0) {
        el.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        return;
    }
    
    var medals = ['🥇', '🥈', '🥉'];
    
    for (var i = 0; i < items.length; i++) {
        el.innerHTML += 
            '<div class="rank-item">' +
                '<div class="medal">' + medals[i] + '</div>' +
                '<div class="rank-info">' +
                    '<strong>' + items[i].name + '</strong>' +
                    '<span>' + items[i].val + '</span>' +
                '</div>' +
            '</div>';
    }
}

// ============================================================================
// DEPARTMAN PUANLARI GRAFİĞİ
// ============================================================================

function drawDeptScores(data) {
    var el = document.getElementById('deptChart');
    if (!el) return;
    
    var html = '';
    var deptNames = Object.keys(DEPT_MAP);
    
    for (var d = 0; d < deptNames.length; d++) {
        var name = deptNames[d];
        var fields = DEPT_MAP[name];
        var sum = 0;
        var n = 0;
        
        for (var i = 0; i < data.length; i++) {
            for (var f = 0; f < fields.length; f++) {
                var val = data[i][fields[f]];
                if (val && !isNaN(val)) {
                    sum += parseInt(val);
                    n++;
                }
            }
        }
        
        var avg = n > 0 ? Math.round((sum / n / 5) * 100) : 0;
        
        if (n > 0) {
            html += makeBar(name, avg);
        }
    }
    
    el.innerHTML = html || '<p style="color:#999; text-align:center; padding:20px;">Henüz puan girilmemiş.</p>';
}

// ============================================================================
// DEPARTMAN DETAY ANALİZİ
// ============================================================================

function renderDeptDetailInternal() {
    var deptSelectEl = document.getElementById('deptSelect');
    if (!deptSelectEl) return;

    var dept = deptSelectEl.value;
    var el = document.getElementById('deptDetailChart');

    if (!dept || dept === '') {
        if (el) el.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Lütfen bir departman seçin.</p>';
        return;
    }

    // Veriyi oku
    var rawDataStr = localStorage.getItem('hotelSurveys');
    var data = rawDataStr ? JSON.parse(rawDataStr) : [];
    
    var filterType = document.getElementById('timeFilter');
    var selectedFilter = filterType ? filterType.value : 'monthly';
    data = filterByTime(data, selectedFilter);

    // Soruları bul
    var questions = DEPT_DETAIL[dept];

    if (!questions) {
        if (el) el.innerHTML = '<p style="color:red; text-align:center; padding:20px;">Departman bulunamadı: ' + dept + '</p>';
        return;
    }

    var html = '';
    var count = 0;

    for (var q = 0; q < questions.length; q++) {
        var label = questions[q][0];
        var field = questions[q][1];
        var sum = 0;
        var n = 0;
        
        for (var i = 0; i < data.length; i++) {
            var val = data[i][field];
            if (val && val !== '' && !isNaN(val)) {
                sum += parseInt(val);
                n++;
            }
        }
        
        if (n > 0) {
            var score = Math.round((sum / n / 5) * 100);
            html += makeBar(label, score);
            count++;
        }
    }

    if (count === 0) {
        html = '<p style="color:#999; text-align:center; padding:20px;">Bu departman için henüz puan girilmedi.</p>';
    }

    if (el) el.innerHTML = html;
}

// Global fonksiyon olarak da tanımla
window.renderDeptDetailInternal = renderDeptDetailInternal;
window.renderDeptDetail = renderDeptDetailInternal;

// ============================================================================
// ÜLKE GRAFİĞİ
// ============================================================================

function drawCountryChart(data) {
    var counts = {};
    
    for (var i = 0; i < data.length; i++) {
        var nat = data[i].nationality;
        if (nat && nat.trim() !== '') {
            counts[nat] = (counts[nat] || 0) + 1;
        }
    }
    
    var total = data.length;
    var el = document.getElementById('countryChart');
    if (!el) return;
    
    var html = '';
    
    for (var key in counts) {
        var pct = Math.round((counts[key] / total) * 100);
        html += makeBar(key, pct);
    }
    
    el.innerHTML = html || '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
}

// ============================================================================
// PERSONEL GRAFİĞİ
// ============================================================================

function drawStaffChart(data) {
    var counts = {};
    
    for (var i = 0; i < data.length; i++) {
        var ps = data[i].praisedStaff;
        if (ps && ps.trim() !== '') {
            var names = ps.split(',');
            for (var k = 0; k < names.length; k++) {
                var nm = names[k].trim();
                if (nm) {
                    counts[nm] = (counts[nm] || 0) + 1;
                }
            }
        }
    }
    
    var el = document.getElementById('staffChart');
    if (!el) return;
    
    var html = '';
    
    for (var key in counts) {
        // Her övgü için 20 puan (görsel amaçlı)
        html += makeBar(key, counts[key] * 20);
    }
    
    el.innerHTML = html || '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
}

// ============================================================================
// BAR ÇİZİCİ FONKSİYON
// ============================================================================

function makeBar(label, value) {
    // Renk sınıfı belirle
    var colorClass = 'bg-blue';
    if (value >= 90) {
        colorClass = 'bg-gold';
    } else if (value >= 70) {
        colorClass = 'bg-green';
    } else if (value >= 50) {
        colorClass = 'bg-blue';
    } else {
        colorClass = 'bg-purple';
    }
    
    // Value'u sınırla (0-100 arası)
    var displayValue = Math.min(100, Math.max(0, value));
    
    return '<div class="bar-row">' +
        '<div class="bar-label">' + label + '</div>' +
        '<div class="bar-area">' +
            '<div class="bar-fill ' + colorClass + '" style="width:' + displayValue + '%">' + displayValue + '%</div>' +
        '</div>' +
    '</div>';
}

// ============================================================================
// HAM VERİ TABLOSU
// ============================================================================

function drawTable(data) {
    var tbody = document.querySelector('#rawDataTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Son 10 kaydı göster
    var max = data.length > 10 ? 10 : data.length;
    
    for (var i = 0; i < max; i++) {
        var item = data[i];
        var tarih = item.date ? item.date.split(' ')[0] : '-';
        var ad = item.fullName || '-';
        var oda = item.roomNumber || '-';
        var departman = item.fiyatKalite || '-';
        
        tbody.innerHTML += 
            '<tr>' +
                '<td>' + tarih + '</td>' +
                '<td>' + ad + '</td>' +
                '<td>' + oda + '</td>' +
                '<td>' + departman + '/5</td>' +
            '</tr>';
    }
    
    // Veri yoksa uyarı
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999; padding:30px;">Veri bulunamadı</td></tr>';
    }
}

// ============================================================================
// YORUMLAR BÖLÜMÜ
// ============================================================================

function drawComments(data) {
    var div = document.getElementById('quickComments');
    if (!div) return;
    
    div.innerHTML = '';
    
    var commentCount = 0;
    
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        
        if (item.generalComments && item.generalComments.trim() !== '') {
            var name = item.fullName || 'Misafir';
            var comment = item.generalComments;
            
            div.innerHTML += 
                '<div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:5px; font-size:13px; border-left:3px solid #1a1a3e;">' +
                    '<strong>' + name + ':</strong> ' + comment +
                '</div>';
            
            commentCount++;
            
            // Maksimum 5 yorum göster
            if (commentCount >= 5) break;
        }
    }
    
    if (commentCount === 0) {
        div.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Henüz yorum yok</p>';
    }
}

// ============================================================================
// VERİLERİ TEMİZLE
// ============================================================================

function clearData() {
    if (confirm('⚠️ TÜM VERİLERİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?\n\nBu işlem geri alınamaz!')) {
        localStorage.removeItem('hotelSurveys');
        
        // Başarı mesajı göster
        var alert = document.getElementById('successAlert');
        if (alert) {
            alert.textContent = '🗑️ Veriler temizlendi!';
            alert.className = 'alert alert-success show';
            setTimeout(function() {
                alert.className = 'alert alert-success';
            }, 3000);
        }
        
        // Sayfayı yenile
        setTimeout(function() {
            location.reload();
        }, 1000);
    }
}

// ============================================================================
// VERİLERİ DIŞA AKTAR (INDIR)
// ============================================================================

function exportData() {
    var data = JSON.parse(localStorage.getItem('hotelSurveys') || '[]');
    
    if (data.length === 0) {
        alert('⚠️ İndirilecek veri yok!');
        return;
    }
    
    // JSON olarak indir
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'otel_anke_verileri_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    // Başarı mesajı göster
    var alert = document.getElementById('successAlert');
    if (alert) {
        alert.textContent = '📥 Veriler başarıyla indirildi! (' + data.length + ' kayıt)';
        alert.className = 'alert alert-success show';
        setTimeout(function() {
            alert.className = 'alert alert-success';
        }, 3000);
    }
    
    console.log('✅ ' + data.length + ' kayıt indirildi');
}

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================

// LocalStorage'dan veri al
function getSurveyData() {
    return JSON.parse(localStorage.getItem('hotelSurveys') || '[]');
}

// LocalStorage'a veri kaydet
function saveSurveyData(data) {
    localStorage.setItem('hotelSurveys', JSON.stringify(data));
}

// Tarih formatını düzelt
function formatDate(dateString) {
    if (!dateString) return '-';
    
    var date = new Date(dateString);
    if (isNaN(date)) return dateString;
    
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    
    return day + '.' + month + '.' + year;
}

// ============================================================================
// KONSOL MESAJI (Başarı)
// ============================================================================

console.log('✅ Concordia Celes Hotel Admin Panel yüklendi!');
console.log('📊 Veri kaynağı: LocalStorage + Google Sheets (opsiyonel)');
console.log('🔗 Google Script URL:', GOOGLE_SCRIPT_URL);
