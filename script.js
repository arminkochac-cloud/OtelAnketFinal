'use strict';
console.log('🟢 script.js yüklendi.');

let currentStep = 1;
const totalSteps = 3;

function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    currentStep = n;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  showStep(currentStep + 1);
}

function prevStep() {
  showStep(currentStep - 1);
}

function validateStep(step) {
  const section = document.querySelector(`.step[data-step="${step}"]`);
  if (!section) return true;
  const required = section.querySelectorAll('[required]');
  for (const el of required) {
    if (el.type === 'checkbox' && !el.checked) {
      alert('Lütfen zorunlu onayı verin.');
      el.focus();
      return false;
    }
    if (el.type === 'hidden' && !el.value) {
      alert('Lütfen yıldızlarla puanlama yapın.');
      return false;
    }
    if (!el.value.trim()) {
      alert('Lütfen zorunlu alanları doldurun.');
      el.focus();
      return false;
    }
  }
  return true;
}

function initStars() {
  console.log('⭐ Yıldızlar başlatılıyor...');
  document.querySelectorAll('.stars').forEach(container => {
    if (container.dataset.ready === '1') return;
    container.dataset.ready = '1';
    const fieldName = container.dataset.field;
    const hiddenInput = container.parentElement.querySelector(`input[name="${fieldName}"]`);
    if (!hiddenInput) return;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = '★';
      star.dataset.value = i;
      container.appendChild(star);
      star.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const val = parseInt(this.dataset.value);
        container.querySelectorAll('.star').forEach((s, idx) => {
          s.classList.toggle('active', idx < val);
        });
        hiddenInput.value = val;
        console.log(`✅ ${fieldName} = ${val}`);
      });
    }
  });
  console.log('✅ Yıldız sistemi hazır.');
}

function updateProgress() {
  const pct = Math.round((currentStep / totalSteps) * 100);
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = pct + '%';
}

async function submitForm() {
  if (!validateStep(currentStep)) return;
  const form = document.getElementById('anketForm');
  const data = Object.fromEntries(new FormData(form));
  data.date = new Date().toLocaleString('tr-TR');
  const btn = document.querySelector('.btn.submit');
  btn.disabled = true;
  btn.textContent = 'Gönderiliyor...';
  try {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    document.getElementById('anketForm').style.display = 'none';
    document.getElementById('thankScreen').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert('Bağlantı hatası. Lütfen tekrar deneyin.');
    btn.disabled = false;
    btn.textContent = '✅ Gönder';
  }
}

window.openKvkk = () => document.getElementById('kvkkModal').style.display = 'flex';
window.closeKvkk = () => document.getElementById('kvkkModal').style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  updateProgress();
  console.log('🚀 Sistem hazır.');
});
