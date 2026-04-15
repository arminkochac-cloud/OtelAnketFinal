'use strict';
console.log('✅ script.js yüklendi.');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXQnpJIwj4vvKbSrEVJUmKWGQxJyJiKls2m-hLbMdHpD0cBSewzGGYPe3gtkhBWGR/exec';
let currentStep = 1;
const totalSteps = 3;

// 🌐 6 DİL SÖZLÜĞÜ
const i18n = {
  tr: { pageTitle:"Misafir Anketi", hotelName:"Concordia Celes Hotel", surveyTitle:"Misafir Memnuniyet Anketi", step1Title:"👤 Genel Bilgiler", fullName:"Ad Soyad *", fullNamePh:"Adınız Soyadınız", roomNo:"Oda Numarası *", roomNoPh:"Örn: 305", checkIn:"Giriş Tarihi *", checkOut:"Çıkış Tarihi *", kvkkText:"KVKK Aydınlatma Metni", kvkkLink:"Metni Gör", nextBtn:"İleri →", prevBtn:"← Geri", step2Title:"⭐ Değerlendirme", receptionLabel:"Resepsiyon Hizmeti", checkinLabel:"Check-In İşlemleri", infoLabel:"Tesis Bilgilendirme", staffLabel:"Personel İlgisi & Nezaket", step3Title:"💬 Yorum & Gönder", commentLabel:"Öneri veya Şikayetiniz (İsteğe bağlı)", commentPh:"Düşüncelerinizi paylaşın...", submitBtn:"✅ Anketi Gönder", thankTitle:"Teşekkür Ederiz!", thankMsg:"Değerli görüşleriniz başarıyla kaydedildi.", newSurvey:"Yeni Anket", kvkkModalTitle:"KVKK Aydınlatma Metni", kvkkModalText:"Kişisel verileriniz anket değerlendirme ve hizmet kalitesi artırma amaçlarıyla işlenmektedir. Verileriniz 2 yıl süreyle saklanacak olup, dilediğiniz zaman silinmesini talep edebilirsiniz.", closeBtn:"Anladım, Kapat", alertRequired:"Lütfen zorunlu alanları doldurun.", alertKvkk:"Lütfen KVKK onayını verin.", alertStars:"Lütfen tüm soruları yıldızlarla puanlayın." },
  en: { pageTitle:"Guest Survey", hotelName:"Concordia Celes Hotel", surveyTitle:"Guest Satisfaction Survey", step1Title:"👤 General Info", fullName:"Full Name *", fullNamePh:"Your Full Name", roomNo:"Room Number *", roomNoPh:"e.g. 305", checkIn:"Check-in Date *", checkOut:"Check-out Date *", kvkkText:"KVKK Clarification Text", kvkkLink:"View Text", nextBtn:"Next →", prevBtn:"← Back", step2Title:"⭐ Evaluation", receptionLabel:"Reception Service", checkinLabel:"Check-in Process", infoLabel:"Facility Information", staffLabel:"Staff Care & Courtesy", step3Title:"💬 Feedback & Submit", commentLabel:"Suggestion or Complaint (Optional)", commentPh:"Share your thoughts...", submitBtn:"✅ Submit Survey", thankTitle:"Thank You!", thankMsg:"Your valuable feedback has been recorded.", newSurvey:"New Survey", kvkkModalTitle:"KVKK Clarification Text", kvkkModalText:"Your personal data is processed for survey evaluation and service quality improvement. Data will be kept for 2 years and can be deleted upon request.", closeBtn:"Understood, Close", alertRequired:"Please fill in required fields.", alertKvkk:"Please accept KVKK consent.", alertStars:"Please rate all questions with stars." },
  de: { pageTitle:"Gästebefragung", hotelName:"Concordia Celes Hotel", surveyTitle:"Gästebefragungsformular", step1Title:"👤 Allgemeine Infos", fullName:"Vor- und Nachname *", fullNamePh:"Ihr vollständiger Name", roomNo:"Zimmernummer *", roomNoPh:"z.B. 305", checkIn:"Anreisedatum *", checkOut:"Abreisedatum *", kvkkText:"KVKK-Hinweis", kvkkLink:"Text ansehen", nextBtn:"Weiter →", prevBtn:"← Zurück", step2Title:"⭐ Bewertung", receptionLabel:"Rezeptionsservice", checkinLabel:"Check-in", infoLabel:"Einrichtungsinformation", staffLabel:"Personalbetreuung", step3Title:"💬 Feedback & Absenden", commentLabel:"Vorschlag oder Beschwerde (Optional)", commentPh:"Teilen Sie Ihre Gedanken...", submitBtn:"✅ Umfrage absenden", thankTitle:"Vielen Dank!", thankMsg:"Ihr wertvolles Feedback wurde gespeichert.", newSurvey:"Neue Umfrage", kvkkModalTitle:"KVKK-Hinweis", kvkkModalText:"Ihre personenbezogenen Daten werden zur Umfrageauswertung und Serviceverbesserung verarbeitet. Daten werden 2 Jahre aufbewahrt und können auf Antrag gelöscht werden.", closeBtn:"Verstanden, Schließen", alertRequired:"Bitte füllen Sie die Pflichtfelder aus.", alertKvkk:"Bitte stimmen Sie der KVKK-Einwilligung zu.", alertStars:"Bitte bewerten Sie alle Fragen mit Sternen." },
  ru: { pageTitle:"Анкета гостя", hotelName:"Concordia Celes Hotel", surveyTitle:"Анкета удовлетворенности", step1Title:"👤 Общая информация", fullName:"ФИО *", fullNamePh:"Ваше полное имя", roomNo:"Номер комнаты *", roomNoPh:"Например: 305", checkIn:"Дата заезда *", checkOut:"Дата выезда *", kvkkText:"Текст KVKK", kvkkLink:"Посмотреть текст", nextBtn:"Далее →", prevBtn:"← Назад", step2Title:"⭐ Оценка", receptionLabel:"Услуги ресепшн", checkinLabel:"Процесс заселения", infoLabel:"Информация об объекте", staffLabel:"Внимание персонала", step3Title:"💬 Отзыв и отправка", commentLabel:"Предложение или жалоба (Необязательно)", commentPh:"Поделитесь своими мыслями...", submitBtn:"✅ Отправить анкету", thankTitle:"Спасибо!", thankMsg:"Ваш ценный отзыв успешно сохранен.", newSurvey:"Новая анкета", kvkkModalTitle:"Текст KVKK", kvkkModalText:"Ваши персональные данные обрабатываются для оценки анкеты и улучшения качества обслуживания. Данные хранятся 2 года и могут быть удалены по запросу.", closeBtn:"Понятно, Закрыть", alertRequired:"Пожалуйста, заполните обязательные поля.", alertKvkk:"Пожалуйста, примите согласие KVKK.", alertStars:"Пожалуйста, оцените все вопросы звездами." },
  pl: { pageTitle:"Ankieta gościa", hotelName:"Concordia Celes Hotel", surveyTitle:"Ankieta satysfakcji", step1Title:"👤 Informacje ogólne", fullName:"Imię i nazwisko *", fullNamePh:"Twoje pełne imię", roomNo:"Numer pokoju *", roomNoPh:"np. 305", checkIn:"Data przyjazdu *", checkOut:"Data wyjazdu *", kvkkText:"Tekst KVKK", kvkkLink:"Zobacz tekst", nextBtn:"Dalej →", prevBtn:"← Wstecz", step2Title:"⭐ Ocena", receptionLabel:"Usługi recepcji", checkinLabel:"Proces zameldowania", infoLabel:"Informacje o obiekcie", staffLabel:"Opieka personelu", step3Title:"💬 Opinia i wyślij", commentLabel:"Sugestia lub skarga (Opcjonalnie)", commentPh:"Podziel się swoimi myślami...", submitBtn:"✅ Wyślij ankietę", thankTitle:"Dziękujemy!", thankMsg:"Twoja cenna opinia została zapisana.", newSurvey:"Nowa ankieta", kvkkModalTitle:"Tekst KVKK", kvkkModalText:"Twoje dane osobowe są przetwarzane w celu oceny ankiety i poprawy jakości usług. Dane będą przechowywane przez 2 lata i mogą zostać usunięte na żądanie.", closeBtn:"Zrozumiałem, Zamknij", alertRequired:"Proszę wypełnić wymagane pola.", alertKvkk:"Proszę zaakceptować zgodę KVKK.", alertStars:"Proszę ocenić wszystkie pytania gwiazdkami." },
  ro: { pageTitle:"Chestionar oaspeți", hotelName:"Concordia Celes Hotel", surveyTitle:"Chestionar de satisfacție", step1Title:"👤 Informații generale", fullName:"Nume și prenume *", fullNamePh:"Numele dvs. complet", roomNo:"Număr cameră *", roomNoPh:"ex: 305", checkIn:"Data sosirii *", checkOut:"Data plecării *", kvkkText:"Text KVKK", kvkkLink:"Vezi textul", nextBtn:"Următorul →", prevBtn:"← Înapoi", step2Title:"⭐ Evaluare", receptionLabel:"Servicii recepție", checkinLabel:"Proces check-in", infoLabel:"Informații facilități", staffLabel:"Atenția personalului", step3Title:"💬 Feedback și trimite", commentLabel:"Sugestie sau plângere (Opțional)", commentPh:"Împărtășește-ți gândurile...", submitBtn:"✅ Trimite chestionarul", thankTitle:"Mulțumim!", thankMsg:"Feedback-ul tău valoros a fost înregistrat.", newSurvey:"Chestionar nou", kvkkModalTitle:"Text KVKK", kvkkModalText:"Datele dvs. cu caracter personal sunt procesate pentru evaluarea chestionarului și îmbunătățirea calității serviciilor. Datele vor fi păstrate 2 ani și pot fi șterse la cerere.", closeBtn:"Am înțeles, Închide", alertRequired:"Vă rugăm să completați câmpurile obligatorii.", alertKvkk:"Vă rugăm să acceptați consimțământul KVKK.", alertStars:"Vă rugăm să evaluați toate întrebările cu stele." }
};

// 🔹 DİL DEĞİŞTİRME
function setLang(lang) {
  if (!i18n[lang]) return;
  localStorage.setItem('surveyLang', lang);
  document.documentElement.lang = lang;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  console.log(`🌐 Dil: ${lang.toUpperCase()}`);
}

// 🔹 SAYFA YÜKLENDİĞİNDE
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('surveyLang') || 'tr';
  setLang(savedLang);
  initStars();
  updateProgress();
  showStep(1);
  console.log('🚀 Sistem hazır.');
});

// 🔹 ADIM GÖSTERME
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

// 🔹 İLERİ / GERİ (DÜZELTİLDİ)
function nextStep() {
  console.log('🔘 İleri butonu tıklandı. Adım:', currentStep);
  if (!validateStep(currentStep)) {
    console.warn('⛔ Validasyon başarısız.');
    return;
  }
  showStep(currentStep + 1);
}
function prevStep() { showStep(currentStep - 1); }

// 🔹 VALIDASYON (ESNEKLEŞTİRİLDİ)
function validateStep(step) {
  const section = document.querySelector(`.step[data-step="${step}"]`);
  if (!section) return true;
  const lang = localStorage.getItem('surveyLang') || 'tr';
  const required = section.querySelectorAll('[required]');
  
  for (const el of required) {
    if (el.type === 'checkbox' && !el.checked) {
      alert(i18n[lang].alertKvkk); el.focus(); return false;
    }
    if (el.type === 'hidden' && !el.value) {
      alert(i18n[lang].alertStars); return false;
    }
    if (el.type !== 'hidden' && !el.value.trim()) {
      alert(i18n[lang].alertRequired); el.focus(); return false;
    }
  }
  return true;
}

// 🔹 YILDIZ SİSTEMİ (KESİN LTR)
function initStars() {
  console.log('⭐ Yıldız sistemi başlatılıyor...');
  document.querySelectorAll('.stars').forEach(container => {
    if (container.dataset.ready === '1') return;
    container.dataset.ready = '1';
    container.style.direction = 'ltr';
    container.style.unicodeBidi = 'isolate';
    container.querySelectorAll('input[type="radio"]').forEach(r => r.style.display = 'none');
    
    if (!container.querySelector('.star')) {
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star'; star.textContent = '★'; star.dataset.value = i;
        container.appendChild(star);
      }
    }
    
    const stars = Array.from(container.querySelectorAll('.star'));
    const hidden = container.parentElement.querySelector('input[type="hidden"]');
    if (!hidden) return;
    
    stars.forEach((star, index) => {
      star.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const val = index + 1;
        hidden.value = val;
        stars.forEach((s, i) => s.classList.toggle('active', i < val));
        console.log(`✅ Puan: ${val}/5 | ${hidden.name}`);
      });
    });
  });
  console.log('✅ Yıldız sistemi aktif.');
}

// 🔹 İLERLEME ÇUBUĞU
function updateProgress() {
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  if (fill && text) {
    const pct = Math.round((currentStep / totalSteps) * 100);
    fill.style.width = pct + '%'; text.textContent = pct + '%';
  }
}

// 🔹 FORM GÖNDERİMİ
async function submitForm() {
  if (!validateStep(currentStep)) return;
  const form = document.getElementById('surveyForm');
  if (!form) return;
  const data = Object.fromEntries(new FormData(form));
  document.querySelectorAll('.stars input[type="hidden"]').forEach(h => { if(h.value) data[h.name] = h.value; });
  
  const btn = document.querySelector('.btn.submit');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  
  try {
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(data) });
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('thankScreen').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('📤 Gönderildi.');
  } catch (err) {
    alert('Bağlantı hatası.');
    if (btn) { btn.disabled = false; btn.textContent = i18n[localStorage.getItem('surveyLang')||'tr'].submitBtn; }
  }
}

// 🔹 GLOBAL EXPORT
window.nextStep = nextStep; window.prevStep = prevStep; window.submitForm = submitForm;
window.openKvkk = () => document.getElementById('kvkkModal').style.display = 'flex';
window.closeKvkk = () => document.getElementById('kvkkModal').style.display = 'none';
window.setLang = setLang;
