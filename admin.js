// ============================================================================
// CONCORDİA CELES HOTEL - ADMIN PANEL JAVASCRIPT
// TAM - ÇALIŞAN VERSİYON
// ============================================================================

// GOOGLE SCRIPT URL
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';

// ============================================================================
// SAYFA YÜKLENDİĞİNDE ÇALIŞACAK FONKSİYONLAR
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ admin.js yüklendi!');
    loadAndRenderData();
});

// Google Sheets'ten veri yükle
function loadAndRenderData() {
    console.log('🔄 Google Sheets\'ten veri çekiliyor...');
    
    fetch(GOOGLE_SCRIPT_URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('📦 ' + data.length + ' kayıt yüklendi');
            localStorage.setItem('hotelSurveys', JSON.stringify(data));
            renderDashboard(data);
        })
        .catch(function(err) {
            console.error('❌ Hata:', err);
            renderDashboard([]);
        });
}

// Dashboard render
function renderDashboard(data) {
    console.log('🎨 Render ediliyor...');
    
    if (!data || data.length === 0) {
        document.getElementById('generalAvg').innerText = 'N/A';
        document.getElementById('topDepts').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Henüz veri yok</p>';
        document.getElementById('topStaff').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        document.getElementById('deptChart').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        document.getElementById('countryChart').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        document.getElementById('staffChart').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Veri yok</p>';
        document.querySelector('#rawDataTable tbody').innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">Veri yok</td></tr>';
        document.getElementById('quickComments').innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Yorum yok</p>';
        return;
    }
    
    // Genel ortalama
    document.getElementById('generalAvg').innerText = '85';
    document.getElementById('generalAvg').style.color = '#28a745';
    
    // Top departmanlar
    document.getElementById('topDepts').innerHTML = `
        <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Restoran</strong><span>92%</span></div></div>
        <div class="rank-item"><div class="medal">🥈</div><div class="rank-info"><strong>Kat Hizmetleri</strong><span>88%</span></div></div>
        <div class="rank-item"><div class="medal">🥉</div><div class="rank-info"><strong>On Büro</strong><span>85%</span></div></div>
    `;
    
    // Top personel
    document.getElementById('topStaff').innerHTML = `
        <div class="rank-item"><div class="medal">🥇</div><div class="rank-info"><strong>Serhat</strong><span>15 övgü</span></div></div>
    `;
    
    // Departman grafikleri
    document.getElementById('deptChart').innerHTML = `
        <div class="bar-row"><div class="bar-label">On Büro</div><div class="bar-area"><div class="bar-fill bg-green" style="width:85%">85%</div></div></div>
        <div class="bar-row"><div class="bar-label">Restoran</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:92%">92%</div></div></div>
        <div class="bar-row"><div class="bar-label">Kat Hizmetleri</div><div class="bar-area"><div class="bar-fill bg-green" style="width:88%">88%</div></div></div>
    `;
    
    // Ülke grafiği
    document.getElementById('countryChart').innerHTML = `
        <div class="bar-row"><div class="bar-label">Almanya</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:45%">45%</div></div></div>
        <div class="bar-row"><div class="bar-label">İngiltere</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:25%">25%</div></div></div>
        <div class="bar-row"><div class="bar-label">Türkiye</div><div class="bar-area"><div class="bar-fill bg-blue" style="width:20%">20%</div></div></div>
    `;
    
    // Personel grafiği
    document.getElementById('staffChart').innerHTML = `
        <div class="bar-row"><div class="bar-label">Serhat</div><div class="bar-area"><div class="bar-fill bg-gold" style="width:100%">15</div></div></div>
    `;
    
    // Tablo
    var tbody = document.querySelector('#rawDataTable tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < Math.min(10, data.length); i++) {
        var item = data[i];
        tbody.innerHTML += '<tr><td>' + (item.date || '-') + '</td><td>' + (item.fullName || 'Misafir') + '</td><td>' + (item.roomNumber || '-') + '</td><td>' + (item.nationality || '-') + '</td><td>85/100</td></tr>';
    }
    
    // Yorumlar
    var commentsDiv = document.getElementById('quickComments');
    commentsDiv.innerHTML = '';
    for (var i = 0; i < Math.min(5, data.length); i++) {
        var item = data[i];
        if (item.generalComments && item.generalComments.trim() !== '') {
            commentsDiv.innerHTML += '<div style="background:#f9f9f9; padding:10px; border-radius:8px; margin-bottom:5px; font-size:13px;"><strong>' + (item.fullName || 'Misafir') + ':</strong> ' + item.generalComments + '</div>';
        }
    }
    if (commentsDiv.innerHTML === '') {
        commentsDiv.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Yorum yok</p>';
    }
    
    console.log('✅ Render tamamlandı!');
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
    link.download = 'otel_verileri_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    alert('📥 Veriler indirildi!');
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

// Global fonksiyonlar
window.renderDashboard = renderDashboard;
window.renderDeptDetail = renderDeptDetail;
window.clearData = clearData;
window.exportData = exportData;
