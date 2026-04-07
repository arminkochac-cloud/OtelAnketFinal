// ============================================================================
// CONCORDIA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// TAM DÜZELTİLMİŞ SÜRÜM
// - Sizin Sheet sütunlarınıza göre
// - 100'lü puan sistemiyle
// - Departman, personel ve grafiklerle
// ============================================================================

console.log('✅ admin.js başlatıldı!');

// Google Apps Script Web App URL
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

// ---------------------------------------------------------------------------
// DEPARTMAN GRUPLARI
// ---------------------------------------------------------------------------
var DEPARTMENT_GROUPS = {
    frontOffice: {
        label: 'Ön Büro & Resepsiyon',
        fields: [
            ['welcomeGreeting', 'Giriş Karşılama'],
            ['checkInProcess', 'C/In İşlemleri'],
            ['facilityInfo', 'Tesis Hakkında Bilgilendirme'],
            ['frontDeskCare', 'Personelin İlgi ve Nezaketi'],
            ['bellboyService', 'Bellboy Hizmetleri']
        ]
    },

    guestRelation: {
        label: 'Guest Relation',
        fields: [
            ['grWelcomeQuality', 'Karşılama Kalitesi'],
            ['problemSolving', 'Sorunları Çözüme Kavuşturma'],
            ['guestFollowUp', 'Misafir Takibi']
        ]
    },

    housekeeping: {
        label: 'Kat Hizmetleri',
        fields: [
            ['initialRoomCleaning', 'İlk Varışınızda Oda Temizliği'],
            ['roomAppearance', 'Oda Fiziki Görünümü ve Konforu'],
            ['dailyRoomCleaning', 'Konaklama Süresince Oda Temizliği ve Düzeni'],
            ['minibarService', 'Minibar Hizmeti'],
            ['publicAreaCleaning', 'Genel Alan Temizliği'],
            ['beachPoolCleaning', 'Sahil ve Havuz Çevre Temizliği'],
            ['housekeepingStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },

    foodServices: {
        label: 'Yiyecek Hizmetleri & Mutfak',
        fields: [
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

    barsServices: {
        label: 'Servis & Barlar',
        fields: [
            ['poolBarQuality', 'Pool Bar Servis Kalitesi'],
            ['lobbyBarQuality', 'Lobby Bar Servis Kalitesi'],
            ['snackBarQuality', 'Snack Bar Servis Kalitesi'],
            ['drinkQuality', 'İçki Kalitesi ve Sunumu'],
            ['barHygiene', 'Barların Hijyen ve Temizliği'],
            ['barStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },

    restaurantServices: {
        label: 'Restaurant Hizmetleri',
        fields: [
            ['restaurantLayout', 'Restaurant Düzeni ve Kalitesi'],
            ['restaurantCapacity', 'Restaurant Yer Yeterliliği'],
            ['restaurantHygiene', 'Restaurant Hijyen ve Temizliği'],
            ['snackbarRestaurant', 'Snackbar Restaurant Hizmeti'],
            ['alacarteRestaurant', 'Alacarte Restaurant Hizmeti ve Personel İlgisi'],
            ['restaurantStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },

    technicalService: {
        label: 'Teknik Servis',
        fields: [
            ['roomTechnicalSystems', 'Oda Teknik Sistemleri'],
            ['maintenanceResponse', 'Arıza Bildirimi ve Giderme'],
            ['environmentLighting', 'Çevre Aydınlatma ve Düzeni'],
            ['poolWaterCleaning', 'Havuz Suyu Temizliği'],
            ['technicalStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },

    entertainmentServices: {
        label: 'Eğlence Hizmetleri',
        fields: [
            ['daytimeActivities', 'Animasyon Ekibi ile Gündüz Aktiviteleri'],
            ['sportsAreas', 'Aktivite ve Spor Alanları ve Ekipmanları'],
            ['eveningShows', 'Akşam Aktiviteleri ve Showlar'],
            ['miniclubActivities', 'Miniclub Aktiviteleri'],
            ['entertainmentStaffCare', 'Personelin İlgi ve Nezaketi']
        ]
    },

    otherServices: {
        label: 'Diğer Hizmetler',
        fields: [
            ['landscaping', 'Genel Düzenlenme / Peyzaj'],
            ['spaServices', 'Sauna-Hamam Hizmetleri'],
            ['shopBehavior', 'Hotel Genel Esnaf Davranışları'],
            ['priceQuality', 'Fiyat Kalitesi ve İlişkisi']
        ]
    }
};

// Tüm puan alanları
var RATING_FIELDS = [];
for (var deptKey in DEPARTMENT_GROUPS) {
    if (!Object.prototype.hasOwnProperty.call(DEPARTMENT_GROUPS, deptKey)) continue;
    var grp = DEPARTMENT_GROUPS[deptKey];
    for (var i = 0; i < grp.fields.length; i++) {
        var fieldKey = grp.fields[i][0];
        if (RATING_FIELDS.indexOf(fieldKey) === -1) {
            RATING_FIELDS.push(fieldKey);
        }
    }
}

// ---------------------------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// ---------------------------------------------------------------------------
function pickEl(selector) {
    return document.querySelector(selector);
}

function setText(selector, text) {
    var el = pickEl(selector);
    if (el) el.textContent = text;
}

function setHTML(selector, html) {
    var el = pickEl(selector);
    if (el) el.innerHTML = html;
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function firstExistingValue(item, keys) {
    if (!item) return '';
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (item[key] !== undefined && item[key] !== null && String(item[key]).trim() !== '') {
            return item[key];
        }
    }
    return '';
}

function normalizeRatingValue(value) {
    if (value === undefined || value === null || String(value).trim() === '') return null;

    var n = parseFloat(String(value).replace(',', '.'));
    if (isNaN(n)) return null;

    // 1-5 ölçeği ise 100'lük sisteme çevir
    if (n >= 0 && n <= 5) return n * 20;

    // 1-10 ölçeği ise 100'lük sisteme çevir
    if (n > 5 && n <= 10) return n * 10;

    // Zaten 100'lük sistemse olduğu gibi kullan
    if (n > 10 && n <= 100) return n;

    return null;
}

function averageOfFields(item, fields) {
    var values = [];
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i][0];
        var n = normalizeRatingValue(item[key]);
        if (n !== null) values.push(n);
    }

    if (!values.length) return null;

    var sum = 0;
    for (var j = 0; j < values.length; j++) {
        sum += values[j];
    }
    return sum / values.length;
}

function computeOverallScore(item) {
    return averageOfFields(item, RATING_FIELDS);
}

// YENİ: genel ortalama hesaplama
function calculateGeneralAverage(rows) {
    var total = 0;
    var count = 0;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i].raw || rows[i];

        var rowValues = [];
        for (var j = 0; j < RATING_FIELDS.length; j++) {
            var key = RATING_FIELDS[j];
            var n = normalizeRatingValue(row[key]);
            if (n !== null) {
                rowValues.push(n);
            }
        }

        if (rowValues.length > 0) {
            var sum = 0;
            for (var k = 0; k < rowValues.length; k++) {
                sum += rowValues[k];
            }
            total += sum / rowValues.length;
            count++;
        }
    }

    return count ? (total / count) : null;
}

function groupByKey(rows, keyName) {
    var map = {};

    for (var i = 0; i < rows.length; i++) {
        var label = String(rows[i][keyName] || '-').trim() || '-';

        if (!map[label]) {
            map[label] = { label: label, count: 0 };
        }
        map[label].count++;
    }

    var arr = [];
    for (var k in map) {
        if (Object.prototype.hasOwnProperty.call(map, k)) {
            arr.push(map[k]);
        }
    }

    arr.sort(function(a, b) {
        return b.count - a.count;
    });

    return arr;
}

function buildDepartmentStats(rows) {
    var arr = [];

    for (var deptKey in DEPARTMENT_GROUPS) {
        if (!Object.prototype.hasOwnProperty.call(DEPARTMENT_GROUPS, deptKey)) continue;

        var group = DEPARTMENT_GROUPS[deptKey];
        var total = 0;
        var count = 0;

        for (var i = 0; i < rows.length; i++) {
            var score = averageOfFields(rows[i].raw, group.fields);
            if (score !== null) {
                total += score;
                count++;
            }
        }

        arr.push({
            key: deptKey,
            label: group.label,
            avg: count ? (total / count) : 0,
            count: count
        });
    }

    arr.sort(function(a, b) {
        return b.avg - a.avg;
    });

    return arr;
}

function buildStaffStats(rows) {
    var map = {};

    for (var i = 0; i < rows.length; i++) {
        var raw = String(firstExistingValue(rows[i].raw, ['praisedStaff']) || '').trim();
        if (!raw) continue;

        // Birden fazla isim varsa ayır
        var parts = raw.split(/[,;/&]+|\s+ve\s+/i);

        for (var j = 0; j < parts.length; j++) {
            var name = String(parts[j]).replace(/\s+/g, ' ').trim();
            if (!name) continue;

            if (!map[name]) {
                map[name] = { label: name, count: 0 };
            }
            map[name].count++;
        }
    }

    var arr = [];
    for (var key in map) {
        if (Object.prototype.hasOwnProperty.call(map, key)) {
            arr.push(map[key]);
        }
    }

    arr.sort(function(a, b) {
        return b.count - a.count;
    });

    return arr;
}

function getDominantDepartment(item) {
    var bestLabel = '-';
    var bestScore = -1;

    for (var deptKey in DEPARTMENT_GROUPS) {
        if (!Object.prototype.hasOwnProperty.call(DEPARTMENT_GROUPS, deptKey)) continue;

        var group = DEPARTMENT_GROUPS[deptKey];
        var score = averageOfFields(item, group.fields);

        if (score !== null && score > bestScore) {
            bestScore = score;
            bestLabel = group.label;
        }
    }

    return bestLabel;
}

function parseMaybeDate(str) {
    if (!str) return null;

    var d = new Date(str);
    if (!isNaN(d.getTime())) return d;

    var s = String(str).trim();
    var m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (m) {
        var day = parseInt(m[1], 10);
        var month = parseInt(m[2], 10) - 1;
        var year = parseInt(m[3], 10);
        if (year < 100) year += 2000;

        var d2 = new Date(year, month, day);
        if (!isNaN(d2.getTime())) return d2;
    }

    return null;
}

function applyTimeFilter(rows) {
    var filterEl = pickEl('#timeFilter');
    if (!filterEl) return rows;

    var val = filterEl.value || 'all';
    if (val === 'all') return rows;

    var days = parseInt(val, 10);
    if (isNaN(days)) return rows;

    var now = new Date();
    var cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    var filtered = [];
    var parseCount = 0;

    for (var i = 0; i < rows.length; i++) {
        var d = parseMaybeDate(rows[i].date);
        if (d) {
            parseCount++;
            if (d >= cutoff) filtered.push(rows[i]);
        } else {
            // Tarih parse edilemiyorsa, veriyi kaybetmemek için dahil et
            filtered.push(rows[i]);
        }
    }

    if (parseCount === 0) return rows;
    return filtered;
}

function hideLoadingTexts() {
    document.querySelectorAll('.loading').forEach(function(el) {
        el.style.display = 'none';
    });

    document.querySelectorAll('body *').forEach(function(el) {
        if (el.children.length === 0) {
            var txt = (el.textContent || '').trim();
            if (txt === 'Yükleniyor...' || txt === 'Veri yükleniyor...') {
                el.textContent = '';
            }
        }
    });
}

function renderRankList(el, items, valueTextFn, emptyText) {
    if (!el) return;

    if (!items || items.length === 0) {
        el.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">' + emptyText + '</p>';
        return;
    }

    var medals = ['🥇', '🥈', '🥉'];
    var html = '';

    for (var i = 0; i < Math.min(3, items.length); i++) {
        html +=
            '<div class="rank-item" style="display:flex;align-items:center;gap:10px;padding:8px 0;">' +
                '<div class="medal" style="font-size:18px;">' + medals[i] + '</div>' +
                '<div class="rank-info" style="display:flex;flex-direction:column;">' +
                    '<strong style="margin-bottom:2px;">' + escapeHtml(items[i].label) + '</strong>' +
                    '<span style="color:#555;">' + escapeHtml(valueTextFn(items[i])) + '</span>' +
                '</div>' +
            '</div>';
    }

    el.innerHTML = html;
}

function renderBars(el, items, valueFn, colorClass, emptyText) {
    if (!el) return;

    if (!items || items.length === 0) {
        el.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">' + emptyText + '</p>';
        return;
    }

    var maxVal = 0;
    for (var i = 0; i < items.length; i++) {
        var v = valueFn(items[i]);
        if (v > maxVal) maxVal = v;
    }
    if (maxVal === 0) maxVal = 1;

    var html = '';
    for (var j = 0; j < items.length; j++) {
        var val = valueFn(items[j]);
        var width = Math.max(5, Math.round((val / maxVal) * 100));

        html +=
            '<div class="bar-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;">' +
                '<div class="bar-label" style="min-width:130px;">' + escapeHtml(items[j].label) + '</div>' +
                '<div class="bar-area" style="flex:1;background:#e5e7eb;border-radius:999px;overflow:hidden;height:24px;">' +
                    '<div class="bar-fill ' + colorClass + '" style="width:' + width + '%;height:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;color:#fff;font-size:12px;font-weight:700;">' +
                        escapeHtml(String(Math.round(val))) +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    el.innerHTML = html;
}

// ---------------------------------------------------------------------------
// SAYFA YÜKLENDİĞİNDE
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yüklendi');

    var timeFilter = pickEl('#timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            renderDashboard();
        });
    }

    var deptSelect = pickEl('#deptSelect');
    if (deptSelect) {
        deptSelect.addEventListener('change', renderDeptDetail);
    }

    loadAndRenderData();
});

// ---------------------------------------------------------------------------
// VERİYİ ÇEK
// ---------------------------------------------------------------------------
function loadAndRenderData() {
    console.log('🔄 Veri yükleniyor...');

    fetch(GOOGLE_SCRIPT_URL, { cache: 'no-store' })
        .then(function(response) {
            console.log('📡 Response alındı:', response.status);
            if (!response.ok) {
                throw new Error('HTTP Hatası: ' + response.status);
            }
            return response.text();
        })
        .then(function(text) {
            var data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error('JSON parse hatası. Gelen veri:', text);
                throw err;
            }

            if (!Array.isArray(data)) {
                data = data.data || data.records || data.items || [];
            }

            console.log('✅ ' + data.length + ' kayıt geldi');

            localStorage.setItem('hotelSurveys', JSON.stringify(data));
            renderDashboard(data);
        })
        .catch(function(err) {
            console.error('❌ Veri yükleme hatası:', err);

            try {
                var cached = JSON.parse(localStorage.getItem('hotelSurveys') || '[]');
                if (cached.length) {
                    console.log('⚠️ Cache verisi ile render ediliyor:', cached.length);
                    renderDashboard(cached);
                    return;
                }
            } catch (e) {}

            renderDashboard([]);
        });
}

// ---------------------------------------------------------------------------
// SATIR NORMALİZASYONU
// ---------------------------------------------------------------------------
function normalizeRecord(item) {
    item = item || {};

    return {
        raw: item,
        date: firstExistingValue(item, ['tarih', 'date', 'timestamp']) || '',
        fullName: firstExistingValue(item, ['fullName', 'adSoyad', 'name', 'isim']) || 'Misafir',
        roomNumber: firstExistingValue(item, ['roomNumber', 'odaNo', 'room', 'oda']) || '-',
        nationality: firstExistingValue(item, ['nationality', 'ulkesi', 'country']) || '-',
        praisedStaff: firstExistingValue(item, ['praisedStaff']) || '',
        generalComments: firstExistingValue(item, ['generalComments', 'yorum', 'comment', 'notes']) || '',
        score: computeOverallScore(item),
        department: getDominantDepartment(item)
    };
}

// ---------------------------------------------------------------------------
// DASHBOARD RENDER
// ---------------------------------------------------------------------------
function renderDashboard(data) {
    var rawRows;

    if (Array.isArray(data)) {
        rawRows = data.map(normalizeRecord);
        window.__hotelRawRows = rawRows;
    } else {
        rawRows = window.__hotelRawRows || [];
    }

    var rows = applyTimeFilter(rawRows);

    console.log('🎨 renderDashboard çalıştı! Veri sayısı:', rows.length);

    // Genel Ortalama
    var avg = calculateGeneralAverage(rows);
    setText('#generalAvg', rows.length ? String(Math.round(avg || 0)) : '0');

    // İstatistikler
    var deptStats = buildDepartmentStats(rows);
    var staffStats = buildStaffStats(rows);
    var countryStats = groupByKey(rows, 'nationality');

    // En iyi departmanlar
    var topDeptsEl = pickEl('#topDepts');
    renderRankList(
        topDeptsEl,
        deptStats.slice(0, 3),
        function(item) {
            return Math.round(item.avg) + '% (' + item.count + ' anket)';
        },
        'Veri yok'
    );

    // En çok övülen personel
    var topStaffEl = pickEl('#topStaff');
    renderRankList(
        topStaffEl,
        staffStats.slice(0, 3),
        function(item) {
            return item.count + ' övgü';
        },
        'Veri yok'
    );

    // Departman ortalamaları
    var deptChartEl = pickEl('#deptChart');
    renderBars(
        deptChartEl,
        deptStats,
        function(item) {
            return item.avg;
        },
        'bg-green',
        'Veri yok'
    );

    // Ülke analizi
    var countryChartEl = pickEl('#countryChart');
    renderBars(
        countryChartEl,
        countryStats,
        function(item) {
            return item.count;
        },
        'bg-blue',
        'Veri yok'
    );

    // En çok övgü alan personel grafiği
    var staffChartEl = pickEl('#staffChart');
    renderBars(
        staffChartEl,
        staffStats,
        function(item) {
            return item.count;
        },
        'bg-gold',
        'Veri yok'
    );

    // Ham veri tablosu
    var tbody = document.querySelector('#rawDataTable tbody');
    if (tbody) {
        if (rows.length > 0) {
            var tableHtml = '';
            for (var i = 0; i < Math.min(20, rows.length); i++) {
                var item = rows[i];
                tableHtml +=
                    '<tr>' +
                        '<td>' + escapeHtml(item.fullName) + '</td>' +
                        '<td>' + escapeHtml(item.roomNumber) + '</td>' +
                        '<td>' + escapeHtml(item.department) + '</td>' +
                        '<td>' + (item.score !== null ? escapeHtml(String(Math.round(item.score))) : '-') + '</td>' +
                        '<td>' + escapeHtml(item.generalComments || '-') + '</td>' +
                    '</tr>';
            }
            tbody.innerHTML = tableHtml;
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#999; padding:30px;">Veri yok</td></tr>';
        }
    }

    // Son yorumlar
    var commentsDiv = pickEl('#quickComments');
    if (commentsDiv) {
        var comments = [];
        for (var c = 0; c < rows.length; c++) {
            if (rows[c].generalComments && String(rows[c].generalComments).trim() !== '') {
                comments.push(rows[c]);
            }
        }

        if (comments.length > 0) {
            var commentsHtml = '';
            for (var k = 0; k < Math.min(5, comments.length); k++) {
                commentsHtml +=
                    '<div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:8px; font-size:13px;">' +
                        '<strong>' + escapeHtml(comments[k].fullName) + ':</strong> ' +
                        escapeHtml(comments[k].generalComments) +
                    '</div>';
            }
            commentsDiv.innerHTML = commentsHtml;
        } else {
            commentsDiv.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Yorum yok</p>';
        }
    }

    // Loading yazıları
    hideLoadingTexts();

    console.log('✅ RENDER TAMAMLANDI!');
}

// ---------------------------------------------------------------------------
// DEPARTMAN DETAY ANALİZİ
// ---------------------------------------------------------------------------
function renderDeptDetail() {
    var deptSelect = pickEl('#deptSelect');
    var el = pickEl('#deptDetailChart');

    if (!el) return;

    if (!deptSelect || !deptSelect.value) {
        el.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Lütfen bir departman seçin</p>';
        return;
    }

    var group = DEPARTMENT_GROUPS[deptSelect.value];
    if (!group) {
        el.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Departman bulunamadı</p>';
        return;
    }

    var rows = applyTimeFilter(window.__hotelRawRows || []);
    if (!rows.length) {
        el.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Veri yok</p>';
        return;
    }

    var items = [];
    for (var i = 0; i < group.fields.length; i++) {
        var key = group.fields[i][0];
        var label = group.fields[i][1];

        var total = 0;
        var count = 0;

        for (var j = 0; j < rows.length; j++) {
            var n = normalizeRatingValue(rows[j].raw[key]);
            if (n !== null) {
                total += n;
                count++;
            }
        }

        items.push({
            label: label,
            avg: count ? (total / count) : 0
        });
    }

    var maxVal = 0;
    for (var m = 0; m < items.length; m++) {
        if (items[m].avg > maxVal) maxVal = items[m].avg;
    }
    if (maxVal === 0) maxVal = 1;

    var html = '';
    for (var x = 0; x < items.length; x++) {
        var width = Math.max(5, Math.round((items[x].avg / maxVal) * 100));
        html +=
            '<div class="bar-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;">' +
                '<div class="bar-label" style="min-width:130px;">' + escapeHtml(items[x].label) + '</div>' +
                '<div class="bar-area" style="flex:1;background:#e5e7eb;border-radius:999px;overflow:hidden;height:24px;">' +
                    '<div class="bar-fill bg-green" style="width:' + width + '%;height:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;color:#fff;font-size:12px;font-weight:700;">' +
                        escapeHtml(String(Math.round(items[x].avg))) +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    el.innerHTML = html;
}

// ---------------------------------------------------------------------------
// VERİ TEMİZLE / DIŞA AKTAR
// ---------------------------------------------------------------------------
function clearData() {
    if (confirm('⚠️ Tüm verileri silmek istediğinizden emin misiniz?')) {
        localStorage.removeItem('hotelSurveys');
        window.__hotelRawRows = [];
        location.reload();
    }
}

function exportData() {
    var data = localStorage.getItem('hotelSurveys') || '[]';
    var blob = new Blob([data], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'otel_verileri.json';
    link.click();
    alert('📥 Veriler indirildi!');
}

// ---------------------------------------------------------------------------
// GLOBAL FONKSİYONLAR
// ---------------------------------------------------------------------------
window.renderDashboard = renderDashboard;
window.renderDeptDetail = renderDeptDetail;
window.clearData = clearData;
window.exportData = exportData;
window.loadAndRenderData = loadAndRenderData;

// Eski HTML yapıları için uyumluluk
window.renderDashboardInternal = renderDashboard;
window.renderDeptDetailInternal = renderDeptDetail;

console.log('✅ Tüm fonksiyonlar tanımlandı!');
