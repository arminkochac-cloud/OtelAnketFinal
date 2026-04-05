// ============================================================================
// CONCORDIA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// SHEET YAPINIZA GÖRE GÜNCELLENMİŞ SÜRÜM
// ============================================================================

console.log('✅ admin.js başlatıldı!');

var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

// ---------------------------------------------------------------------------
// DEPARTMAN GRUPLARI
// ---------------------------------------------------------------------------
var DEPARTMENT_GROUPS = {
    frontOffice: {
        label: 'Ön Büro ve Resepsiyon',
        fields: [
            ['welcomeGreeting', 'Karşılama'],
            ['checkInProcess', 'Check-in Süreci'],
            ['facilityInfo', 'Tesis Bilgisi'],
            ['frontDeskCare', 'Resepsiyon İlgi'],
            ['bellboyService', 'Bellboy Hizmeti'],
            ['grWelcomeQuality', 'Misafir İlişkileri Karşılama'],
            ['problemSolving', 'Sorun Çözme'],
            ['guestFollowUp', 'Misafir Takibi']
        ]
    },
    housekeeping: {
        label: 'Kat Hizmetleri',
        fields: [
            ['initialRoomCleaning', 'İlk Oda Temizliği'],
            ['roomAppearance', 'Oda Görünümü'],
            ['dailyRoomCleaning', 'Günlük Oda Temizliği'],
            ['minibarService', 'Minibar Hizmeti'],
            ['publicAreaCleaning', 'Genel Alan Temizliği'],
            ['beachPoolCleaning', 'Plaj / Havuz Temizliği'],
            ['housekeepingStaffCare', 'Kat Hizmetleri İlgi']
        ]
    },
    foodServices: {
        label: 'Yiyecek Hizmetleri',
        fields: [
            ['breakfastVariety', 'Kahvaltı Çeşidi'],
            ['breakfastQuality', 'Kahvaltı Kalitesi'],
            ['lunchVariety', 'Öğle Yemeği Çeşidi'],
            ['lunchQuality', 'Öğle Yemeği Kalitesi'],
            ['dinnerVariety', 'Akşam Yemeği Çeşidi'],
            ['dinnerQuality', 'Akşam Yemeği Kalitesi'],
            ['alacarteQuality', 'A la Carte Kalitesi'],
            ['kitchenHygiene', 'Mutfak Hijyeni'],
            ['foodStaffCare', 'Yiyecek Personeli İlgi']
        ]
    },
    barsServices: {
        label: 'Barlar',
        fields: [
            ['poolBarQuality', 'Havuz Bar Kalitesi'],
            ['lobbyBarQuality', 'Lobby Bar Kalitesi'],
            ['snackBarQuality', 'Snack Bar Kalitesi'],
            ['drinkQuality', 'İçecek Kalitesi'],
            ['barHygiene', 'Bar Hijyeni'],
            ['barStaffCare', 'Bar Personeli İlgi']
        ]
    },
    restaurantServices: {
        label: 'Restoran Hizmetleri',
        fields: [
            ['restaurantLayout', 'Restoran Düzeni'],
            ['restaurantCapacity', 'Restoran Kapasitesi'],
            ['restaurantHygiene', 'Restoran Hijyeni'],
            ['snackbarRestaurant', 'Snack Bar / Restoran'],
            ['alacarteRestaurant', 'A la Carte Restoran'],
            ['restaurantStaffCare', 'Restoran Personeli İlgi']
        ]
    },
    technicalService: {
        label: 'Teknik Servis',
        fields: [
            ['roomTechnicalSystems', 'Oda Teknik Sistemleri'],
            ['maintenanceResponse', 'Bakım Müdahale Hızı'],
            ['environmentLighting', 'Ortam Aydınlatması'],
            ['poolWaterCleaning', 'Havuz Suyu Temizliği'],
            ['technicalStaffCare', 'Teknik Personel İlgi']
        ]
    },
    entertainmentServices: {
        label: 'Eğlence Hizmetleri',
        fields: [
            ['daytimeActivities', 'Gündüz Aktiviteleri'],
            ['sportsAreas', 'Spor Alanları'],
            ['eveningShows', 'Akşam Şovları'],
            ['miniclubActivities', 'Mini Club Aktiviteleri'],
            ['entertainmentStaffCare', 'Animasyon Personeli İlgi']
        ]
    },
    otherServices: {
        label: 'Diğer Hizmetler',
        fields: [
            ['landscaping', 'Peyzaj'],
            ['spaServices', 'Spa Hizmetleri'],
            ['shopBehavior', 'Mağaza Davranışı'],
            ['priceQuality', 'Fiyat / Kalite']
        ]
    }
};

// Tüm rating alanlarını otomatik topla
var RATING_FIELDS = [];
for (var deptKey in DEPARTMENT_GROUPS) {
    if (!Object.prototype.hasOwnProperty.call(DEPARTMENT_GROUPS, deptKey)) continue;
    var fields = DEPARTMENT_GROUPS[deptKey].fields;
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i][0];
        if (RATING_FIELDS.indexOf(key) === -1) {
            RATING_FIELDS.push(key);
        }
    }
}

// ---------------------------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// ---------------------------------------------------------------------------
function pickEl(selectors) {
    for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
    }
    return null;
}

function setHTML(selectors, html) {
    var el = pickEl(selectors);
    if (el) el.innerHTML = html;
}

function setText(selectors, text) {
    var el = pickEl(selectors);
    if (el) el.textContent = text;
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

    // 1-5 ise 100'lü sisteme çevir
    if (n >= 0 && n <= 5) return n * 20;

    // 1-10 ise 100'lü sisteme çevir
    if (n > 5 && n <= 10) return n * 10;

    // 1-100 ise direkt kullan
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

function buildGroupedStats(rows, fieldName) {
    var map = {};

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var label = String(row[fieldName] || '-').trim() || '-';

        if (!map[label]) {
            map[label] = { label: label, count: 0, total: 0, scoreCount: 0 };
        }

        map[label].count++;

        if (typeof row.score === 'number' && !isNaN(row.score)) {
            map[label].total += row.score;
            map[label].scoreCount++;
        }
    }

    var arr = [];
    for (var k in map) {
        if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
        var obj = map[k];
        obj.avg = obj.scoreCount ? (obj.total / obj.scoreCount) : null;
        arr.push(obj);
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
            var rowScore = averageOfFields(rows[i].raw, group.fields);
            if (rowScore !== null) {
                total += rowScore;
                count++;
            }
        }

        if (count > 0) {
            arr.push({
                key: deptKey,
                label: group.label,
                avg: total / count,
                count: count
            });
        }
    }

    arr.sort(function(a, b) {
        return b.avg - a.avg;
    });

    return arr;
}

function buildStaffStats(rows) {
    var map = {};

    for (var i = 0; i < rows.length; i++) {
        var rawVal = firstExistingValue(rows[i].raw, ['praisedStaff']) || rows[i].praisedStaff || '';
        rawVal = String(rawVal).trim();
        if (!rawVal) continue;

        var parts = rawVal.split(/[,;\/&]+|\s+ve\s+/i);

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
        if (!Object.prototype.hasOwnProperty.call(map, key)) continue;
        arr.push(map[key]);
    }

    arr.sort(function(a, b) {
        return b.count - a.count;
    });

    return arr;
}

function getAverage(rows) {
    var total = 0;
    var count = 0;

    for (var i = 0; i < rows.length; i++) {
        if (typeof rows[i].score === 'number' && !isNaN(rows[i].score)) {
            total += rows[i].score;
            count++;
        }
    }

    return count ? (total / count) : null;
}

function hideLoadingTexts() {
    var all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.children.length === 0) {
            var txt = (el.textContent || '').trim();
            if (txt === 'Yükleniyor...' || txt === 'Veri yükleniyor...') {
                el.textContent = '';
            }
        }
    }
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
                    '<strong>' + escapeHtml(items[i].label) + '</strong>' +
                    '<span>' + escapeHtml(valueTextFn(items[i])) + '</span>' +
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
    for (var j = 0; j < Math.min(5, items.length); j++) {
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

    var deptSelect = pickEl(['#deptSelect']);
    if (deptSelect) {
        deptSelect.addEventListener('change', renderDeptDetail);
    }

    loadAndRenderData();
});

// ---------------------------------------------------------------------------
// VERİ ÇEK
// ---------------------------------------------------------------------------
async function loadAndRenderData() {
    try {
        console.log('🔄 Veri yükleniyor...');

        var response = await fetch(GOOGLE_SCRIPT_URL, { cache: 'no-store' });
        console.log('📡 Response alındı:', response.status);

        if (!response.ok) {
            throw new Error('HTTP Hatası: ' + response.status);
        }

        var text = await response.text();
        var data;

        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error('JSON parse hatası:', text);
            throw err;
        }

        if (!Array.isArray(data)) {
            data = data.data || data.records || data.items || [];
        }

        console.log('✅ ' + data.length + ' kayıt geldi');

        localStorage.setItem('hotelSurveys', JSON.stringify(data));
        renderDashboard(data);

    } catch (err) {
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
    }
}

// ---------------------------------------------------------------------------
// DASHBOARD RENDER
// ---------------------------------------------------------------------------
function normalizeRecord(item) {
    item = item || {};

    return {
        raw: item,
        date: firstExistingValue(item, ['tarih', 'date', 'timestamp']) || '-',
        fullName: firstExistingValue(item, ['fullName', 'adSoyad', 'name', 'isim']) || 'Misafir',
        roomNumber: firstExistingValue(item, ['roomNumber', 'odaNo', 'room', 'oda']) || '-',
        nationality: firstExistingValue(item, ['nationality', 'ulkesi', 'country']) || '-',
        praisedStaff: firstExistingValue(item, ['praisedStaff']) || '',
        generalComments: firstExistingValue(item, ['generalComments', 'yorum', 'comment', 'notes']) || '',
        score: computeOverallScore(item),
        department: 'Genel'
    };
}

function renderDashboard(data) {
    var rows;

    if (Array.isArray(data)) {
        rows = data.map(normalizeRecord);
        window.__hotelRows = rows;
    } else {
        rows = window.__hotelRows || [];
    }

    console.log('🎨 renderDashboard çalıştı! Veri sayısı:', rows.length);

    // Genel Ortalama
    var avg = getAverage(rows);
    setText(['#generalAvg', '#generalAverage', '#avgScore', '.general-avg'], rows.length ? String(Math.round(avg || 0)) : '0');

    // Stats
    var deptStats = buildDepartmentStats(rows);
    var staffStats = buildStaffStats(rows);
    var countryStats = buildGroupedStats(rows, 'nationality');

    // Top Departmanlar
    var topDeptsEl = pickEl(['#topDepts']);
    renderRankList(topDeptsEl, deptStats, function(item) {
        return Math.round(item.avg) + ' puan';
    }, 'Veri yok');

    // Top Personel
    var topStaffEl = pickEl(['#topStaff']);
    renderRankList(topStaffEl, staffStats, function(item) {
        return item.count + ' övgü';
    }, 'Veri yok');

    // Departman Grafikleri
    var deptChartEl = pickEl(['#deptChart']);
    renderBars(deptChartEl, deptStats, function(item) {
        return item.avg;
    }, 'bg-green', 'Veri yok');

    // Ülke Analizi
    var countryChartEl = pickEl(['#countryChart']);
    renderBars(countryChartEl, countryStats, function(item) {
        return item.count;
    }, 'bg-blue', 'Veri yok');

    // En Çok Övgü Alan Personel
    var staffChartEl = pickEl(['#staffChart']);
    renderBars(staffChartEl, staffStats, function(item) {
        return item.count;
    }, 'bg-gold', 'Veri yok');

    // Tablo
    var tbody = pickEl(['#rawDataTable tbody']);
    if (tbody) {
        if (rows.length > 0) {
            var tableHtml = '';
            for (var i = 0; i < Math.min(20, rows.length); i++) {
                var item = rows[i];
                tableHtml +=
                    '<tr>' +
                        '<td>' + escapeHtml(item.date) + '</td>' +
                        '<td>' + escapeHtml(item.fullName) + '</td>' +
                        '<td>' + escapeHtml(item.roomNumber) + '</td>' +
                        '<td>' + escapeHtml(item.department) + '</td>' +
                        '<td>' + (item.score !== null ? escapeHtml(String(Math.round(item.score))) : '-') + '</td>' +
                        '<td>' + escapeHtml(item.generalComments || '-') + '</td>' +
                    '</tr>';
            }
            tbody.innerHTML = tableHtml;
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999; padding:30px;">Veri yok</td></tr>';
        }
    }

    // Yorumlar
    var commentsDiv = pickEl(['#quickComments']);
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

    hideLoadingTexts();
    console.log('✅ RENDER TAMAMLANDI!');
}

// ---------------------------------------------------------------------------
// DEPARTMAN DETAY ANALİZİ
// ---------------------------------------------------------------------------
function renderDeptDetail() {
    var deptSelect = pickEl(['#deptSelect']);
    var el = pickEl(['#deptDetailChart']);

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

    var rows = window.__hotelRows || [];
    if (!rows.length) {
        el.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Veri yok</p>';
        return;
    }

    var items = [];
    for (var i = 0; i < group.fields.length; i++) {
        var key = group.fields[i][0];
        var label = group.fields[i][1];

        var sum = 0;
        var count = 0;

        for (var j = 0; j < rows.length; j++) {
            var n = normalizeRatingValue(rows[j].raw[key]);
            if (n !== null) {
                sum += n;
                count++;
            }
        }

        if (count > 0) {
            items.push({
                label: label,
                avg: sum / count
            });
        }
    }

    if (!items.length) {
        el.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Veri yok</p>';
        return;
    }

    var html = '';
    var maxVal = 0;
    for (var x = 0; x < items.length; x++) {
        if (items[x].avg > maxVal) maxVal = items[x].avg;
    }
    if (maxVal === 0) maxVal = 1;

    for (var y = 0; y < items.length; y++) {
        var width = Math.max(5, Math.round((items[y].avg / maxVal) * 100));
        html +=
            '<div class="bar-row" style="display:flex;align-items:center;gap:10px;margin:8px 0;">' +
                '<div class="bar-label" style="min-width:130px;">' + escapeHtml(items[y].label) + '</div>' +
                '<div class="bar-area" style="flex:1;background:#e5e7eb;border-radius:999px;overflow:hidden;height:24px;">' +
                    '<div class="bar-fill bg-green" style="width:' + width + '%;height:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;color:#fff;font-size:12px;font-weight:700;">' +
                        escapeHtml(String(Math.round(items[y].avg))) +
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
// GLOBAL
// ---------------------------------------------------------------------------
window.renderDashboard = renderDashboard;
window.renderDeptDetail = renderDeptDetail;
window.clearData = clearData;
window.exportData = exportData;
window.loadAndRenderData = loadAndRenderData;

console.log('✅ Tüm fonksiyonlar tanımlandı!');
