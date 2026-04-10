// ============================================================================
// CONCORDİA CELES HOTEL - ADMIN PANEL JAVASCRIPT (MODERN SÜRÜM)
// YENİ METRİKLER: Tekrar Gelme, Tavsiye, Yeni/Mevcut Misafir
// ============================================================================
console.log('🚀 admin.js MODERN yüklendi');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';
const SCALE = 20; // 1-5 → 100 dönüşümü

// 📌 KOLON EŞLEŞTİRME (Google Sheets başlıklarınızla aynı olmalı)
const COL = {
  willReturn: ['Tekrar Gelir Misiniz?', 'willReturn', 'tekrarGelirMisiniz'],
  wouldRecommend: ['Bizi Çevrenize Tavsiye Eder misiniz?', 'wouldRecommend', 'tavsiyeEderMisiniz'],
  previousStay: ['Otelimizde Daha Önce Bulundunuz Mu?', 'previousStay', 'dahaOnceBulundunuzMu'],
  praisedStaff: ['Hizmetinden Dolayı Övgüye Bulunduğunuz Personelin İsmi', 'praisedStaff', 'personelOvgu'],
  comments: ['Genel Düşünce ve Yorumlarınız', 'generalComments', 'yorum', 'oneri'],
  fullName: ['Ad Soyad', 'fullName', 'isim'],
  nationality: ['Ülke', 'nationality', 'ulke'],
  roomNumber: ['Oda No', 'roomNumber', 'oda'],
  date: ['Tarih', 'tarih', 'date']
};

const DEPT_MAP = {
  "Ön Büro & Resepsiyon": ["welcomeGreeting","checkInProcess","facilityInfo","frontDeskCare","bellboyService"],
  "Guest Relations": ["grWelcomeQuality","problemSolving","guestFollowUp"],
  "Kat Hizmetleri": ["initialRoomCleaning","roomAppearance","dailyRoomCleaning","minibarService","publicAreaCleaning","beachPoolCleaning","housekeepingStaffCare"],
  "Yiyecek & Mutfak": ["breakfastVariety","breakfastQuality","lunchVariety","lunchQuality","dinnerVariety","dinnerQuality","alacarteQuality","kitchenHygiene","foodStaffCare"],
  "Servis & Barlar": ["poolBarQuality","lobbyBarQuality","snackBarQuality","drinkQuality","barHygiene","barStaffCare"],
  "Restoran Hizmetleri": ["restaurantLayout","restaurantCapacity","restaurantHygiene","snackbarRestaurant","alacarteRestaurant","restaurantStaffCare"],
  "Teknik Servis": ["roomTechnicalSystems","maintenanceResponse","environmentLighting","poolWaterCleaning","technicalStaffCare"],
  "Eğlence & Animasyon": ["daytimeActivities","sportsAreas","eveningShows","miniclubActivities","entertainmentStaffCare"],
  "Diğer Hizmetler": ["landscaping","spaServices","shopBehavior","priceQuality"]
};

function getVal(row, keys) {
  for (let k of keys) if (row[k] !== undefined && row[k] !== null) return row[k];
  return null;
}

function parseYesNo(val) {
  if (!val) return null;
  let v = val.toString().toLowerCase().trim();
  if (['evet', 'yes', 'e', '1', 'true'].includes(v)) return true;
  if (['hayır', 'hayir', 'no', 'h', '0', 'false'].includes(v)) return false;
  return null;
}

document.addEventListener('DOMContentLoaded', () => loadDashboard());

async function loadDashboard() {
    try {
        const res = await fetch(SCRIPT_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        console.log(`📦 ${validData.length} kayıt alındı`);
        localStorage.setItem('hotelSurveys', JSON.stringify(validData));
        renderDashboard(processData(validData));
    } catch (err) {
        console.error('❌ Hata:', err);
        renderDashboard({ generalAvg:0, returnRate:0, recommendRate:0, newPct:0, returningPct:0, deptStats:[], staffStats:[], comments:[], rawData:[] });
    }
}

function processData(data) {
    let deptScores = {}, staffCounts = {}, allScores = [];
    let retYes=0, retTot=0, recYes=0, recTot=0, prevYes=0, prevTot=0;
    let comments = [];

    data.forEach(row => {
        // Puanlar
        for(let k in row) { let v=parseFloat(row[k]); if(!isNaN(v)&&v>0) allScores.push(v<=5?v*SCALE:v); }
        
        // Departmanlar
        for(let dept in DEPT_MAP) {
            let dVals = DEPT_MAP[dept].map(c=>parseFloat(row[c])).filter(v=>!isNaN(v)&&v>0).map(v=>v<=5?v*SCALE:v);
            if(dVals.length) { let avg=dVals.reduce((a,b)=>a+b,0)/dVals.length; (deptScores[dept]=deptScores[dept]||[]).push(avg); }
        }

        // Personel
        let staff = getVal(row, COL.praisedStaff);
        if(staff && staff.trim().toLowerCase()!=='boş') {
            staff.split(/[,;ve&\n]/).map(n=>n.trim()).filter(n=>n.length>2).forEach(n=>staffCounts[n]=(staffCounts[n]||0)+1);
        }

        // Yeni Metrikler
        let willRet = parseYesNo(getVal(row, COL.willReturn));
        if(willRet!==null) { retTot++; if(willRet) retYes++; }
        let wouldRec = parseYesNo(getVal(row, COL.wouldRecommend));
        if(wouldRec!==null) { recTot++; if(wouldRec) recYes++; }
        let prevStay = parseYesNo(getVal(row, COL.previousStay));
        if(prevStay!==null) { prevTot++; if(prevStay) prevYes++; }

        // Yorumlar
        let c = getVal(row, COL.comments);
        if(c && c.trim().length>3) comments.push({name:getVal(row,COL.fullName)||'Misafir', text:c});
    });

    let generalAvg = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : 0;
    let returnRate = retTot ? Math.round((retYes/retTot)*100) : 0;
    let recommendRate = recTot ? Math.round((recYes/recTot)*100) : 0;
    let returningPct = prevTot ? Math.round((prevYes/prevTot)*100) : 0;
    let newPct = 100 - returningPct;

    let deptStats = Object.keys(deptScores).map(d=>({name:d, avg:Math.round(deptScores[d].reduce((a,b)=>a+b,0)/deptScores[d].length), count:deptScores[d].length})).sort((a,b)=>b.avg-a.avg);
    let staffStats = Object.keys(staffCounts).map(n=>({name:n, count:staffCounts[n]})).sort((a,b)=>b.count-a.count);

    return { generalAvg, returnRate, recommendRate, newPct, returningPct, deptStats, staffStats, comments, rawData:data };
}

function renderDashboard(s) {
    document.getElementById('generalAvg').textContent = s.generalAvg;
    document.getElementById('generalAvg').style.color = s.generalAvg>=85?'var(--success)':s.generalAvg>=70?'var(--warning)':'var(--danger)';

    document.getElementById('returnRate').textContent = s.returnRate+'%';
    document.getElementById('returnBar').style.width = s.returnRate+'%';
    document.getElementById('returnSub').textContent = `${s.rawData.filter(r=>parseYesNo(getVal(r,COL.willReturn))!==null).length} anket bazlı`;

    document.getElementById('recommendRate').textContent = s.recommendRate+'%';
    document.getElementById('recommendBar').style.width = s.recommendRate+'%';
    document.getElementById('recommendSub').textContent = `${s.rawData.filter(r=>parseYesNo(getVal(r,COL.wouldRecommend))!==null).length} anket bazlı`;

    document.getElementById('newGuestPct').textContent = s.newPct+'%';
    document.getElementById('returningGuestPct').textContent = s.returningPct+'%';
    document.getElementById('guestBar').style.width = s.returningPct+'%';

    document.getElementById('topDepts').innerHTML = s.deptStats.slice(0,3).map((d,i)=>`<div class="rank-item"><span>${['🥇','🥈','🥉'][i]} ${d.name}</span><span class="badge badge-success">${d.avg}%</span></div>`).join('') || '<p style="color:var(--text-light);text-align:center;padding:15px">Veri yok</p>';
    document.getElementById('topStaff').innerHTML = s.staffStats.slice(0,3).map((d,i)=>`<div class="rank-item"><span>${['🥇','🥈',''][i]} ${d.name}</span><span class="badge badge-warning">${d.count} övgü</span></div>`).join('') || '<p style="color:var(--text-light);text-align:center;padding:15px">Veri yok</p>';

    document.getElementById('deptChart').innerHTML = s.deptStats.slice(0,5).map(d=>`<div class="chart-row"><span>${d.name}</span><span>${d.avg}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${d.avg}%;background:${d.avg>=85?'var(--success)':d.avg>=70?'var(--warning)':'var(--danger)'}"></div></div>`).join('') || '<p style="color:var(--text-light);text-align:center;padding:15px">Veri yok</p>';

    document.getElementById('quickComments').innerHTML = s.comments.slice(-5).reverse().map(c=>`<div style="background:#f8fafc;padding:10px;border-radius:8px;margin-bottom:8px;font-size:13px;"><strong>${c.name}:</strong> ${c.text.substring(0,120)}${c.text.length>120?'...':''}</div>`).join('') || '<p style="color:var(--text-light);text-align:center;padding:15px">Yorum yok</p>';

    let tbody = document.querySelector('#rawDataTable tbody');
    tbody.innerHTML = '';
    if(s.rawData.length) {
        s.rawData.slice(-10).reverse().forEach(r=>{
            let sc=0,cnt=0; for(let k in r){let v=parseFloat(r[k]);if(!isNaN(v)&&v>0){sc+=(v<=5?v*SCALE:v);cnt++;}}
            tbody.innerHTML+=`<tr><td>${getVal(r,COL.date)||'-'}</td><td>${getVal(r,COL.fullName)||'-'}</td><td>${getVal(r,COL.roomNumber)||'-'}</td><td>${getVal(r,COL.nationality)||'-'}</td><td>${cnt?Math.round(sc/cnt):'-'} /100</td><td>${(getVal(r,COL.comments)||'-').substring(0,25)}...</td></tr>`;
        });
    } else {
        tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-light)">Veri yok</td></tr>';
    }
    console.log('✅ MODERN PANEL HAZIR');
}

window.renderDeptDetail = function() {
    let el=document.getElementById('deptDetailChart'), dept=document.getElementById('deptSelect')?.value;
    if(!el) return;
    el.innerHTML = dept ? `<div class="chart-row"><span>Hizmet Kalitesi</span><span>85%</span></div><div class="bar-track"><div class="bar-fill" style="width:85%;background:var(--success)"></div></div><div class="chart-row" style="margin-top:8px"><span>Personel İlgi</span><span>90%</span></div><div class="bar-track"><div class="bar-fill" style="width:90%;background:var(--success)"></div></div><div class="chart-row" style="margin-top:8px"><span>Temizlik</span><span>95%</span></div><div class="bar-track"><div class="bar-fill" style="width:95%;background:var(--success)"></div></div>` : '<p style="text-align:center;color:var(--text-light);padding:20px">Lütfen departman seçin</p>';
};
window.clearData = function() { if(confirm('⚠️ Tüm veriler silinsin mi?')){localStorage.removeItem('hotelSurveys');location.reload();} };
window.exportData = function() { let d=localStorage.getItem('hotelSurveys')||'[]', a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([d],{type:'application/json'})); a.download='otel_verileri.json'; a.click(); };
