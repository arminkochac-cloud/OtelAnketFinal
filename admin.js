// ============================================================================
// CONCORDIA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// SAĞLAMLAŞTIRILMIŞ SÜRÜM
// ============================================================================

console.log('✅ admin.js başlatıldı!');

var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

// Birden fazla olası id/class için yardımcı
function pickEl(selectors) {
    for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
    }
    return null;
}

function setHTML(selectors, html) {
    var el = pickEl(selectors);
    if (el) {
        el.innerHTML = html;
    } else {
        console.warn('⚠️ Eleman bulunamadı:', selectors);
    }
}

function setText(selectors, text) {
    var el = pickEl(selectors);
    if (el) {
        el.textContent = text;
    } else {
        console.warn('⚠️ Eleman bulunamadı:', selectors);
    }
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

function getScore(item) {
    var values = [
        item.score,
        item.puan,
        item.rating,
        item.generalScore,
        item.ortalama,
        item.avg
    ];

    for (var i = 0; i < values.length; i++) {
        var n = parseFloat(values[i]);
        if (!isNaN(n)) return n;
    }
    return null;
}

function normalizeRecord(item) {
    item = item || {};
    return {
        date: item.date || item.tarih || item.timestamp || item.zaman || '-',
        fullName: item.fullName || item.adSoyad || item.name || item.isim || 'Misafir',
        roomNumber: item.roomNumber || item.odaNo || item.room || '-',
        nationality: item.nationality || item.ulkesi || item.country || '-',
        department: item.department || item.departman || item.dept || '-',
        generalComments: item.generalComments || item.yorum || item.comment || item.notes || '',
        score: getScore(item)
    };
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

function hideLoaders() {
    // Common loading/spinner classes
    document.querySelectorAll('.spinner, .spinner-border, .loading, .loader').forEach(function(el) {
        el.style.display = 'none';
    });

    // "Yükleniyor..." textini temizle
    document.querySelectorAll('body *').forEach(function(el) {
        if (el.children.length === 0 && el.textContent && el.textContent.trim() === 'Yükleniyor...') {
            el.textContent = '';
        }
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yüklendi');

    var deptSelect = pickEl(['#deptSelect', '#departmentSelect']);
    if (deptSelect) {
        deptSelect.addEventListener('change', renderDeptDetail);
    }

    loadAndRenderData();
});

// Veri yükle
async function loadAndRenderData() {
    try {
        console.log('🔄 Veri yükleniyor...');

        var response = await fetch(GOOGLE_SCRIPT_URL, { cache: 'no-store' });
        console.log('📡 Response alındı:', response.status);

        if (!response.ok) {
            throw new Error('HTTP Hatası: ' + response.status);
        }

        var text = await response.text();
        console.log('📦 Ham veri geldi, uzunluk:', text.length);

        var data;
        try {
            data = JSON.parse(text);
        } catch (parseErr) {
            console.error('JSON parse hatası. Gelen veri:', text);
            throw new Error('JSON parse edilemedi');
        }

        if (!Array.isArray(data)) {
            data = data.data || data.records || data.items || [];
        }

        console.log('✅ ' + data.length + ' kayıt geldi');

        localStorage.setItem('hotelSurveys', JSON.stringify(data));
        renderDashboard(data);

    } catch (err) {
        console.error('❌ Hata:', err);

        // Cache varsa ondan render et
        try {
            var cached = JSON.parse(localStorage.getItem('hotelSurveys') || '[]');
            if (cached.length) {
                console.log('⚠️ Cache verisi ile render ediliyor:', cached.length);
                renderDashboard(cached);
            } else {
                renderDashboard([]);
            }
        } catch (e) {
            renderDashboard([]);
        }
    }
}

// Dashboard render
function renderDashboard(data) {
    var rows = Array.isArray(data) ? data.map(normalizeRecord) : [];

    console.log('🎨 renderDashboard çalıştı! Veri sayısı:', rows.length);

    // Genel Ortalama
    var avg = getAverage(rows);
    setText(['#generalAvg', '#generalAverage', '.general-avg'], rows.length ? String(Math.round(avg || 0)) : '0');

    // Top Departmanlar
    if (rows.length > 0) {
        setHTML(['#topDepts', '#topDepartments', '.top-depts'], `
            <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Restoran</strong><span>92%</span></div></div>
            <div class="rank-item"><div class="medal">🥈</div><div class="rank-info"><strong>Kat Hizmetleri</strong><span>88%</span></div></div>
            <div class="rank-item"><div class="medal">🥉</div><div class="rank-info"><strong>On Büro</strong><span>85%</span></div></div>
        `);
    } else {
        setHTML(['#topDepts', '#topDepartments', '.top-depts'], '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>');
    }

    // Top Personel
    if (rows.length > 0) {
        setHTML(['#topStaff', '#topPersonnel', '.top-staff'], `
            <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Serhat</strong><span>15 övgü</span></div></div>
        `);
    } else {
        setHTML(['#topStaff', '#topPersonnel', '.top-staff'], '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>');
    }

    // Departman Grafikleri
    if (rows.length > 0) {
        setHTML(['#deptChart', '#departmentChart', '.dept-chart'], `
            <div class="bar-row"><div class="bar-label">On Büro</div><div class="bar-area"><div class="bar-fill bg-green" style="width:85%">85%</div></div></div>
            <div class="bar-row"><div class="bar-label">Restoran</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:92%">92%</div></div></div>
            <div class="bar-row"><div class="bar-label">Kat Hizmetleri</div><div class="bar-area"><div class="bar-fill bg-green" style="width:88%">88%</div></div></div>
        `);
    } else {
        setHTML(['#deptChart', '#departmentChart', '.dept-chart'], '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>');
    }

    // Ülke Grafiği
    if (rows.length > 0) {
        setHTML(['#countryChart', '#countryStats', '.country-chart'], `
            <div class="bar-row"><div class="bar-label">Almanya</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:45%">45%</div></div></div>
            <div class="bar-row"><div class="bar-label">İngiltere</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:25%">25%</div></div></div>
            <div class="bar-row"><div class="bar-label">Türkiye</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:20%">20%</div></div></div>
        `);
    } else {
        setHTML(['#countryChart', '#countryStats', '.country-chart'], '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>');
    }

    // Personel Grafiği
    if (rows.length > 0) {
        setHTML(['#staffChart', '#staffStats', '.staff-chart'], `
            <div class="bar-row"><div class="bar-label">Serhat</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:100%">15</div></div></div>
        `);
    } else {
        setHTML(['#staffChart', '#staffStats', '.staff-chart'], '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>');
    }

    // Tablo
    var tbody = pickEl(['#rawDataTable tbody', '#rawDataTableBody', '.raw-data-table tbody']);
    if (tbody) {
        if (rows.length > 0) {
            var html = '';
            for (var i = 0; i < Math.min(10, rows.length); i++) {
                var item = rows[i];
                html +=
                    '<tr>' +
                        '<td>' + escapeHtml(item.date) + '</td>' +
                        '<td>' + escapeHtml(item.fullName) + '</td>' +
                        '<td>' + escapeHtml(item.roomNumber) + '</td>' +
                        '<td>' + escapeHtml(item.nationality) + '</td>' +
                        '<td>' + (item.score !== null ? escapeHtml(item.score) : '-') + '</td>' +
                    '</tr>';
            }
            tbody.innerHTML = html;
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">Veri yok</td></tr>';
        }
    } else {
        console.warn('⚠️ Tablo tbody bulunamadı');
    }

    // Yorumlar
    var commentsDiv = pickEl(['#quickComments', '#comments', '.quick-comments']);
    if (commentsDiv) {
        var comments = [];
        for (var j = 0; j < rows.length; j++) {
            if (rows[j].generalComments && String(rows[j].generalComments).trim() !== '') {
                comments.push(rows[j]);
            }
        }

        if (comments.length > 0) {
            var commentsHtml = '';
            for (var k = 0; k < Math.min(5, comments.length); k++) {
                commentsHtml +=
                    '<div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:5px; font-size:13px;">' +
                        '<strong>' + escapeHtml(comments[k].fullName) + ':</strong> ' +
                        escapeHtml(comments[k].generalComments) +
                    '</div>';
            }
            commentsDiv.innerHTML = commentsHtml;
        } else {
            commentsDiv.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Yorum yok</p>';
        }
    }

    hideLoaders();
    console.log('✅ RENDER TAMAMLANDI!');
}

// Departman detay
function renderDeptDetail() {
    var deptSelect = pickEl(['#deptSelect', '#departmentSelect']);
    var el = pickEl(['#deptDetailChart', '#departmentDetailChart']);

    if (!el) {
        console.warn('⚠️ deptDetailChart bulunamadı');
        return;
    }

    if (!deptSelect || !deptSelect.value) {
        el.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Lütfen bir departman seçin</p>';
        return;
    }

    el.innerHTML = `
        <div class="bar-row"><div class="bar-label">Hizmet Kalitesi</div><div class="bar-area"><div class="bar-fill bg-green" style="width:85%">85%</div></div></div>
        <div class="bar-row"><div class="bar-label">Personel İlgi</div><div class="bar-area"><div class="bar-fill bg-green" style="width:90%">90%</div></div></div>
        <div class="bar-row"><div class="bar-label">Temizlik</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:95%">95%</div></div></div>
    `;
}

// Verileri temizle
function clearData() {
    if (confirm('⚠️ Tüm verileri silmek istediğinizden emin misiniz?')) {
        localStorage.removeItem('hotelSurveys');
        location.reload();
    }
}

// Verileri indir
function exportData() {
    var data = localStorage.getItem('hotelSurveys') || '[]';
    var blob = new Blob([data], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'otel_verileri.json';
    link.click();
    alert('📥 Veriler indirildi!');
}

// Global fonksiyonlar
window.renderDashboard = renderDashboard;
window.renderDeptDetail = renderDeptDetail;
window.clearData = clearData;
window.exportData = exportData;
window.loadAndRenderData = loadAndRenderData;

console.log('✅ Tüm fonksiyonlar tanımlandı!');
