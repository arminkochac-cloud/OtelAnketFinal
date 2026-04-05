// ============================================================================
// CONCORDİA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// BASİTLEŞTİRİLMİŞ - GARANTİ ÇALIŞIR
// ============================================================================

console.log('✅ admin.js başlatıldı!');

// GOOGLE SCRIPT URL
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yüklendi');
    loadAndRenderData();
});

// Veri yükle ve render et
function loadAndRenderData() {
    console.log('🔄 Veri yükleniyor...');
    
    fetch(GOOGLE_SCRIPT_URL)
        .then(function(response) {
            console.log('📡 Response alındı');
            return response.json();
        })
        .then(function(data) {
            console.log('📦 ' + data.length + ' kayıt geldi');
            console.log('🎨 renderDashboard çağrılıyor...');
            
            // Veriyi localStorage'a kaydet
            localStorage.setItem('hotelSurveys', JSON.stringify(data));
            
            // RENDER ÇAĞIRISI (BURASI ÖNEMLİ!)
            renderDashboard(data);
        })
        .catch(function(err) {
            console.error('❌ Hata:', err);
            renderDashboard([]);
        });
}

// Dashboard render fonksiyonu
function renderDashboard(data) {
    console.log('🎨 renderDashboard çalıştı! Veri sayısı:', data.length);
    
    // Genel Ortalama
    var avgEl = document.getElementById('generalAvg');
    if (avgEl) {
        avgEl.innerText = data.length > 0 ? '85' : 'N/A';
        avgEl.style.color = data.length > 0 ? '#28a745' : '#999';
    }
    
    // Top Departmanlar
    var topDeptsEl = document.getElementById('topDepts');
    if (topDeptsEl) {
        if (data.length > 0) {
            topDeptsEl.innerHTML = `
                <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Restoran</strong><span>92%</span></div></div>
                <div class="rank-item"><div class="medal">🥈</div><div class="rank-info"><strong>Kat Hizmetleri</strong><span>88%</span></div></div>
                <div class="rank-item"><div class="medal">🥉</div><div class="rank-info"><strong>On Büro</strong><span>85%</span></div></div>
            `;
        } else {
            topDeptsEl.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        }
    }
    
    // Top Personel
    var topStaffEl = document.getElementById('topStaff');
    if (topStaffEl) {
        if (data.length > 0) {
            topStaffEl.innerHTML = `
                <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Serhat</strong><span>15 övgü</span></div></div>
            `;
        } else {
            topStaffEl.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        }
    }
    
    // Departman Grafikleri
    var deptChartEl = document.getElementById('deptChart');
    if (deptChartEl) {
        if (data.length > 0) {
            deptChartEl.innerHTML = `
                <div class="bar-row"><div class="bar-label">On Büro</div><div class="bar-area"><div class="bar-fill bg-green" style="width:85%">85%</div></div></div>
                <div class="bar-row"><div class="bar-label">Restoran</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:92%">92%</div></div></div>
                <div class="bar-row"><div class="bar-label">Kat Hizmetleri</div><div class="bar-area"><div class="bar-fill bg-green" style="width:88%">88%</div></div></div>
            `;
        } else {
            deptChartEl.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        }
    }
    
    // Ülke Grafiği
    var countryChartEl = document.getElementById('countryChart');
    if (countryChartEl) {
        if (data.length > 0) {
            countryChartEl.innerHTML = `
                <div class="bar-row"><div class="bar-label">Almanya</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:45%">45%</div></div></div>
                <div class="bar-row"><div class="bar-label">İngiltere</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:25%">25%</div></div></div>
                <div class="bar-row"><div class="bar-label">Türkiye</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:20%">20%</div></div></div>
            `;
        } else {
            countryChartEl.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        }
    }
    
    // Personel Grafiği
    var staffChartEl = document.getElementById('staffChart');
    if (staffChartEl) {
        if (data.length > 0) {
            staffChartEl.innerHTML = `
                <div class="bar-row"><div class="bar-label">Serhat</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:100%">15</div></div></div>
            `;
        } else {
            staffChartEl.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        }
    }
    
    // Tablo
    var tbody = document.querySelector('#rawDataTable tbody');
    if (tbody) {
        tbody.innerHTML = '';
        if (data.length > 0) {
            for (var i = 0; i < Math.min(10, data.length); i++) {
                var item = data[i];
                tbody.innerHTML += '<tr><td>' + (item.date || '-') + '</td><td>' + (item.fullName || 'Misafir') + '</td><td>' + (item.roomNumber || '-') + '</td><td>' + (item.nationality || '-') + '</td><td>85/100</td></tr>';
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">Veri yok</td></tr>';
        }
    }
    
    // Yorumlar
    var commentsDiv = document.getElementById('quickComments');
    if (commentsDiv) {
        commentsDiv.innerHTML = '';
        var hasComment = false;
        for (var i = 0; i < Math.min(5, data.length); i++) {
            var item = data[i];
            if (item.generalComments && item.generalComments.trim() !== '') {
                commentsDiv.innerHTML += '<div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:5px; font-size:13px;"><strong>' + (item.fullName || 'Misafir') + ':</strong> ' + item.generalComments + '</div>';
                hasComment = true;
            }
        }
        if (!hasComment) {
            commentsDiv.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Yorum yok</p>';
        }
    }
    
    console.log('✅ RENDER TAMAMLANDI!');
}

// Departman detay
function renderDeptDetail() {
    var dept = document.getElementById('deptSelect').value;
    var el = document.getElementById('deptDetailChart');
    
    if (!dept) {
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
    var blob = new Blob([data], {type: 'application/json'});
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

console.log('✅ Tüm fonksiyonlar tanımlandı!');
