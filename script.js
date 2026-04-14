'use strict';
console.log('✅ script.js yüklendi.');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';
let currentStep = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM yüklendi, sistem başlatılıyor...');
    initStars();
    updateProgress();
    showStep(0);
    console.log('🚀 Sistem hazır.');
});

function showStep(index) {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;
    currentStep = Math.max(0, Math.min(index, sections.length - 1));
    sections.forEach((sec, i) => sec.classList.toggle('active', i === currentStep));
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    showStep(currentStep + 1);
}
function prevStep() { showStep(currentStep - 1); }

function validateStep(step) {
    const section = document.querySelectorAll('.section')[step];
    if (!section) return true;
    const required = section.querySelectorAll('[required]');
    for (const el of required) {
        if (el.type === 'checkbox' && !el.checked) { alert('KVKK onayı gerekli.'); return false; }
        if (el.type === 'hidden' && !el.value) { alert('Lütfen yıldızlarla puanlayın.'); return false; }
        if (!el.value.trim()) { alert('Zorunlu alanları doldurun.'); el.focus(); return false; }
    }
    return true;
}

function initStars() {
    console.log('⭐ Yıldız sistemi (LTR) başlatılıyor...');
    document.querySelectorAll('.stars').forEach(container => {
        if (container.dataset.ready === '1') return;
        container.dataset.ready = '1';
        
        // Radio'ları gizle
        container.querySelectorAll('input[type="radio"]').forEach(r => r.style.display = 'none');

        // Yıldızları temizle ve yeniden oluştur (1'den 5'e)
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '★';
            star.dataset.value = i;
            container.appendChild(star); // Sola ekler, sırayla dizilir
        }
        
        const stars = container.querySelectorAll('.star');
        const hidden = container.parentElement.querySelector('input[type="hidden"]') || 
                       container.querySelector('input[type="hidden"]');
        if (!hidden) return;

        stars.forEach((star, index) => {
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const val = index + 1; // 1, 2, 3, 4, 5
                hidden.value = val;
                
                // SOL'DAN SAĞ'A DOLDURMA MANTIĞI
                stars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
                console.log(`✅ Puan: ${val}/5 (Soldan sağa)`);
            });
        });
    });
    console.log('✅ Yıldız sistemi düzgün çalışıyor.');
}
function updateProgress() {
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const total = document.querySelectorAll('.section').length;
    if (bar && text && total > 0) {
        const pct = Math.round(((currentStep + 1) / total) * 100);
        bar.style.width = pct + '%';
        text.textContent = pct + '%';
    }
}

async function submitSurvey() {
    if (!validateStep(currentStep)) return;
    const form = document.querySelector('form');
    if (!form) return;
    const data = Object.fromEntries(new FormData(form));
    document.querySelectorAll('.stars input[type="hidden"]').forEach(h => data[h.name] = h.value);
    
    const btn = document.querySelector('.btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Gönderiliyor...'; }
    
    try {
        await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) });
        document.getElementById('surveyForm').style.display = 'none';
        document.getElementById('thankYou').style.display = 'block';
        console.log('📤 Başarıyla gönderildi.');
    } catch (err) {
        alert('Bağlantı hatası.');
        if (btn) { btn.disabled = false; btn.textContent = '✅ Gönder'; }
    }
}

window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitSurvey = submitSurvey;
window.showKvkk = () => document.getElementById('kvkkModal').style.display = 'flex';
window.closeKvkk = () => document.getElementById('kvkkModal').style.display = 'none';
window.resetForm = () => location.reload();
