import pytz
import pandas as pd
import streamlit as st
import plotly.express as px
from datetime import datetime, timedelta

# ============================================================
SHEET_ID = "1P3UY9PEFN8csOUPjWMKZHJRhqReLPajZfLdg7jJQ54k"
# ============================================================

DEPARTMENTS = {
    "ÖN BÜRO RESEPSİYON": [
        "welcomeGreeting", "checkInProcess", "facilityInfo",
        "frontDeskCare", "bellboyService"
    ],
    "GUEST RELATION": [
        "grWelcomeQuality", "problemSolving", "guestFollowUp"
    ],
    "KAT HİZMETLERİ": [
        "initialRoomCleaning", "roomAppearance", "dailyRoomCleaning",
        "minibarService", "publicAreaCleaning", "beachPoolCleaning",
        "housekeepingStaffCare"
    ],
    "YİYECEK HİZMETLERİ & MUTFAK": [
        "breakfastVariety", "breakfastQuality",
        "lunchVariety", "lunchQuality",
        "dinnerVariety", "dinnerQuality",
        "alacarteQuality", "kitchenHygiene", "foodStaffCare"
    ],
    "SERVİS ve BARLAR": [
        "poolBarQuality", "lobbyBarQuality", "snackBarQuality",
        "drinkQuality", "barHygiene", "barStaffCare"
    ],
    "RESTAURANT HİZMETLERİ": [
        "restaurantLayout", "restaurantCapacity", "restaurantHygiene",
        "snackbarRestaurant", "alacarteRestaurant", "restaurantStaffCare"
    ],
    "TEKNİK SERVİS": [
        "roomTechnicalSystems", "maintenanceResponse",
        "environmentLighting", "poolWaterCleaning", "technicalStaffCare"
    ],
    "EĞLENCE HİZMETLERİ": [
        "daytimeActivities", "sportsAreas", "eveningShows",
        "miniclubActivities", "entertainmentStaffCare"
    ],
    "DİĞER HİZMETLER": [
        "landscaping", "spaServices", "shopBehavior", "priceQuality"
    ],
}

QUESTION_LABELS = {
    "welcomeGreeting": "Giriş Karşılama",
    "checkInProcess": "Check-In İşlemleri",
    "facilityInfo": "Tesis Hakkında Bilgilendirme",
    "frontDeskCare": "Personelin İlgi ve Nezaketi",
    "bellboyService": "Bellboy Hizmetleri",
    "grWelcomeQuality": "Karşılama Kalitesi",
    "problemSolving": "Sorunları Çözüme Kavuşturma",
    "guestFollowUp": "Misafir Takibi",
    "initialRoomCleaning": "İlk Varışta Oda Temizliği",
    "roomAppearance": "Oda Fiziki Görünümü ve Konforu",
    "dailyRoomCleaning": "Konaklama Süresince Oda Temizliği",
    "minibarService": "Minibar Hizmeti",
    "publicAreaCleaning": "Genel Alan Temizliği",
    "beachPoolCleaning": "Sahil ve Havuz Çevre Temizliği",
    "housekeepingStaffCare": "Personelin İlgi ve Nezaketi",
    "breakfastVariety": "Kahvaltı Büfesi Çeşitliliği",
    "breakfastQuality": "Kahvaltı Büfesi Sunumu ve Kalitesi",
    "lunchVariety": "Öğle Yemeği Büfesi Çeşitliliği",
    "lunchQuality": "Öğle Yemeği Sunumu ve Kalitesi",
    "dinnerVariety": "Akşam Yemeği Büfesi Çeşitliliği",
    "dinnerQuality": "Akşam Yemeği Sunumu ve Kalitesi",
    "alacarteQuality": "Alacart Yemek Sunumu ve Kalitesi",
    "kitchenHygiene": "Mutfağın Hijyen ve Temizliği",
    "foodStaffCare": "Personelin İlgi ve Nezaketi",
    "poolBarQuality": "Pool Bar Servis Kalitesi",
    "lobbyBarQuality": "Lobby Bar Servis Kalitesi",
    "snackBarQuality": "Snack Bar Servis Kalitesi",
    "drinkQuality": "İçki Kalitesi ve Sunumu",
    "barHygiene": "Barların Hijyen ve Temizliği",
    "barStaffCare": "Personelin İlgi ve Nezaketi",
    "restaurantLayout": "Restaurant Düzeni ve Kalitesi",
    "restaurantCapacity": "Restaurant Yer Yeterliliği",
    "restaurantHygiene": "Restaurant Hijyen ve Temizliği",
    "snackbarRestaurant": "Snackbar Restaurant Hizmeti",
    "alacarteRestaurant": "Alacart Restaurant Hizmeti",
    "restaurantStaffCare": "Personelin İlgi ve Nezaketi",
    "roomTechnicalSystems": "Oda Teknik Sistemleri",
    "maintenanceResponse": "Arıza Bildirimi ve Giderme",
    "environmentLighting": "Çevre Aydınlatma ve Düzeni",
    "poolWaterCleaning": "Havuz Suyu Temizliği",
    "technicalStaffCare": "Personelin İlgi ve Nezaketi",
    "daytimeActivities": "Gündüz Aktiviteleri",
    "sportsAreas": "Spor Alanları ve Ekipmanları",
    "eveningShows": "Akşam Showları",
    "miniclubActivities": "Miniclub Aktiviteleri",
    "entertainmentStaffCare": "Personelin İlgi ve Nezaketi",
    "landscaping": "Genel Düzenleme / Peyzaj",
    "spaServices": "Sauna-Hamam Hizmetleri",
    "shopBehavior": "Hotel Genel Esnaf Davranışları",
    "priceQuality": "Fiyat Kalitesi ve İlişkisi",
}

COL_MAP = {
    'girisKarsilama': 'welcomeGreeting',
    'checkInIslem': 'checkInProcess',
    'tesisBilgi': 'facilityInfo',
    'onBuroNezaket': 'frontDeskCare',
    'bellboy': 'bellboyService',
    'grKararlama': 'grWelcomeQuality',
    'sorunCozum': 'problemSolving',
    'misafirTakip': 'guestFollowUp',
    'katIlkTemizlik': 'initialRoomCleaning',
    'katGorunum': 'roomAppearance',
    'katGunlukTemizlik': 'dailyRoomCleaning',
    'minibar': 'minibarService',
    'genelAlan': 'publicAreaCleaning',
    'sahilHavuz': 'beachPoolCleaning',
    'katNezaket': 'housekeepingStaffCare',
    'kahvaltiCesit': 'breakfastVariety',
    'kahvaltiSunum': 'breakfastQuality',
    'ogleCesit': 'lunchVariety',
    'ogleSunum': 'lunchQuality',
    'aksamCesit': 'dinnerVariety',
    'aksamSunum': 'dinnerQuality',
    'alacartYemek': 'alacarteQuality',
    'mutfakHijyen': 'kitchenHygiene',
    'yiyecekNezaket': 'foodStaffCare',
    'pollBar': 'poolBarQuality',
    'lobbyBar': 'lobbyBarQuality',
    'snackBar': 'snackBarQuality',
    'ickiKalite': 'drinkQuality',
    'barHijyen': 'barHygiene',
    'barNezaket': 'barStaffCare',
    'restDuzen': 'restaurantLayout',
    'restYer': 'restaurantCapacity',
    'restHijyen': 'restaurantHygiene',
    'snackRest': 'snackbarRestaurant',
    'alacartRest': 'alacarteRestaurant',
    'restNezaket': 'restaurantStaffCare',
    'teknikSistem': 'roomTechnicalSystems',
    'ariza': 'maintenanceResponse',
    'cevreAydinlatma': 'environmentLighting',
    'havuzSu': 'poolWaterCleaning',
    'teknikNezaket': 'technicalStaffCare',
    'animasyonGunduz': 'daytimeActivities',
    'sporAlan': 'sportsAreas',
    'showlar': 'eveningShows',
    'miniclub': 'miniclubActivities',
    'eglenceNezaket': 'entertainmentStaffCare',
    'peyzaj': 'landscaping',
    'spa': 'spaServices',
    'esnaf': 'shopBehavior',
    'fiyatKalite': 'priceQuality',
    'onceGeldiniz': 'previousStay',
    'tekrarGelir': 'willReturn',
    'tavsiye': 'wouldRecommend',
}


@st.cache_data(ttl=60)
def load_data() -> pd.DataFrame:
    try:
        url = (
            f"https://docs.google.com/spreadsheets/d/"
            f"{SHEET_ID}/export?format=csv"
        )
        df = pd.read_csv(url, on_bad_lines='skip')

        if df.empty:
            return df

        # Sütun adlarını düzelt
        df = df.rename(columns=COL_MAP)

        # Başlık satırını temizle
        # (bazen "A1: tarih" gibi gelir)
        df.columns = [
            c.split(': ')[-1] if ': ' in str(c) else c
            for c in df.columns
        ]

        # Tarih kolonunu bul
        for col in ["tarih", "date", "submittedAt", "created_at"]:
            if col in df.columns:
                df["dt"] = pd.to_datetime(
                    df[col], errors="coerce", dayfirst=True
                )
                break
        else:
            df["dt"] = pd.Timestamp.now()

        return df

    except Exception as e:
        st.error(f"❌ Google Sheets bağlantı hatası: {e}")
        return pd.DataFrame()


def get_rating_cols(df):
    cols = []
    for keys in DEPARTMENTS.values():
        for k in keys:
            if k in df.columns:
                cols.append(k)
    return list(set(cols))


def to_numeric(df, cols):
    for c in cols:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    return df


def get_max_score(df, cols):
    if not cols:
        return 5.0
    mx = df[cols].max().max()
    if pd.isna(mx) or mx <= 0:
        return 5.0
    if mx <= 5:
        return 5.0
    if mx <= 10:
        return 10.0
    return 100.0


def scale100(value, max_score):
    if not value or pd.isna(value) or value <= 0:
        return 0
    return int(round((value / max_score) * 100))


def filter_by_time(df, mode):
    if df.empty or "dt" not in df.columns:
        return df
    now = pd.Timestamp.now()
    limits = {
        "Günlük": 1, "Haftalık": 7,
        "Aylık": 30, "Yıllık": 365
    }
    if mode in limits:
        start = now - timedelta(days=limits[mode])
        return df[df["dt"] >= start]
    return df


def dept_avg(df, metric):
    rows = []
    for dep, keys in DEPARTMENTS.items():
        present = [k for k in keys if k in df.columns]
        if not present:
            continue
        vals = df[present].replace(0, pd.NA)
        if metric == "Toplam":
            score = float(
                vals.sum(axis=1, skipna=True).sum(skipna=True)
            )
        else:
            score = float(
                vals.mean(axis=1, skipna=True).mean(skipna=True)
            )
        # 5'ten 100'e çevir
        score_100 = round((score / 5) * 100, 1) \
            if pd.notna(score) else 0.0
        rows.append({
            "Departman": dep,
            "Skor": score_100
        })

    if not rows:
        return pd.DataFrame(columns=["Departman", "Skor"])

    return pd.DataFrame(rows).sort_values(
        "Skor", ascending=False
    ).reset_index(drop=True)
def question_avg(df, dep, metric):
    keys = [
        k for k in DEPARTMENTS.get(dep, [])
        if k in df.columns
    ]
    rows = []
    for k in keys:
        s = df[k].replace(0, pd.NA)
        v = s.sum(skipna=True) if metric == "Toplam" \
            else s.mean(skipna=True)
        # 5'ten 100'e çevir
        v_100 = round((float(v) / 5) * 100, 1) \
            if pd.notna(v) else 0.0
        rows.append({
            "Soru": QUESTION_LABELS.get(k, k),
            "Skor": v_100
        })

    if not rows:
        return pd.DataFrame(columns=["Soru", "Skor"])

    return pd.DataFrame(rows).sort_values(
        "Skor", ascending=False
    ).reset_index(drop=True)


def top_staff(df, n=10):
    if "praisedStaff" not in df.columns:
        return pd.DataFrame(columns=["Personel", "Övgü Sayısı"])
    s = df["praisedStaff"].fillna("").astype(str).str.strip()
    s = s[s != ""]
    if s.empty:
        return pd.DataFrame(columns=["Personel", "Övgü Sayısı"])
    names = []
    for x in s:
        names.extend([p.strip() for p in x.split(",") if p.strip()])
    vc = pd.Series(names).value_counts().head(n).reset_index()
    vc.columns = ["Personel", "Övgü Sayısı"]
    return vc


def country_avg(df, metric, cols):
    if "nationality" not in df.columns or not cols:
        return pd.DataFrame(columns=["Ülke", "Skor"])
    tmp = df.copy()
    tmp["Ülke"] = tmp["nationality"].fillna(
        "Bilinmiyor"
    ).astype(str)
    tmp["_avg"] = tmp[cols].replace(
        0, pd.NA
    ).mean(axis=1, skipna=True)
    if metric == "Toplam":
        g = tmp.groupby("Ülke")["_avg"].sum(min_count=1)
    else:
        g = tmp.groupby("Ülke")["_avg"].mean()
    return g.reset_index().rename(
        columns={"_avg": "Skor"}
    ).sort_values("Skor", ascending=False)


def time_trend(df, mode, metric):
    rows = []
    df = df.copy()
    fmt = {
        "Günlük": lambda s: s.dt.strftime("%Y-%m-%d"),
        "Haftalık": lambda s: s.dt.to_period("W").astype(str),
        "Aylık": lambda s: s.dt.to_period("M").astype(str),
        "Yıllık": lambda s: s.dt.to_period("Y").astype(str),
        "Tümü": lambda s: s.dt.to_period("M").astype(str),
    }
    df["Bucket"] = fmt.get(mode, fmt["Aylık"])(df["dt"])
    for dep, keys in DEPARTMENTS.items():
        present = [k for k in keys if k in df.columns]
        if not present:
            continue
        vals = df[present].replace(0, pd.NA)
        if metric == "Toplam":
            df["_s"] = vals.sum(axis=1, skipna=True)
            g = df.groupby("Bucket")["_s"].sum(
                min_count=1
            ).reset_index()
        else:
            df["_s"] = vals.mean(axis=1, skipna=True)
            g = df.groupby("Bucket")["_s"].mean().reset_index()
        g["Departman"] = dep
        g = g.rename(columns={"_s": "Skor"})
        rows.append(g)
    if not rows:
        return pd.DataFrame(
            columns=["Bucket", "Skor", "Departman"]
        )
    return pd.concat(rows, ignore_index=True).sort_values(
        ["Bucket", "Departman"]
    )


# ============================================================
# ARAYÜZ
# ============================================================
st.set_page_config(
    page_title="🏨 Otel Yönetim Paneli",
    page_icon="🏨",
    layout="wide"
)

st.markdown("""
    <div style='
        background: linear-gradient(135deg, #1a1a3e, #2d2d7e);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    '>
        <img src='https://arminkochac-cloud.github.io/OtelAnketFinal/logo.png' 
        width='120' 
        style='margin-bottom:15px; 
        background:white; 
        padding:10px; 
        border-radius:10px;'>
        
        <h1 style='
            color:white; 
            font-size:2.5em;
            margin:10px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        '>
            Concordia Celes Hotel
        </h1>
        
        <h3 style='
            color:#FFD700; 
            font-size:1.2em;
            margin:5px 0;
        '>
            ⭐⭐⭐⭐⭐
        </h3>
        
        <p style='
            color:#ccc;
            font-size:1.1em;
            margin:10px 0 0 0;
        '>
            📊 Misafir Memnuniyet Yönetim Paneli
        </p>
    </div>
""", unsafe_allow_html=True)

df_all = load_data()

if df_all.empty:
    st.warning("⚠️ Henüz veri yok!")
    st.stop()

if "dt" in df_all.columns:
    df_all = df_all[df_all["dt"].notna()].copy()

rating_cols_all = get_rating_cols(df_all)
df_all = to_numeric(df_all, rating_cols_all)
max_score = get_max_score(df_all, rating_cols_all)

# Sidebar
with st.sidebar:
    st.markdown("### ⚙️ Filtreler")
    time_mode = st.radio(
        "📅 Zaman Filtresi",
        ["Günlük", "Haftalık", "Aylık", "Yıllık", "Tümü"],
        index=4
    )
    metric_mode = st.selectbox(
        "📐 Hesaplama Kriteri",
        ["Ortalama", "Toplam"],
        index=0
    )
    st.markdown("---")
    if st.button("🔄 Veriyi Yenile"):
        st.cache_data.clear()
        st.rerun()
    st.markdown("---")
    st.markdown(f"📋 **Toplam Anket:** {len(df_all)}")
    turkey_tz = pytz.timezone('Europe/Istanbul')
turkey_time = datetime.now(turkey_tz)
st.markdown(
    f"🕐 **Son Güncelleme:** "
    f"{turkey_time.strftime('%H:%M:%S')}"
)

df = filter_by_time(df_all, time_mode).copy()
rating_cols = get_rating_cols(df)
df = to_numeric(df, rating_cols)

# 1) ÖZET
st.markdown("## 📈 Genel Özet")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        label="📋 Toplam Anket",
        value=len(df_all),
        delta=f"{len(df)} ({time_mode})"
    )

with col2:
    if rating_cols and not df.empty:
        vals = df[rating_cols].replace(0, pd.NA)
        genel = float(
            vals.mean(axis=1, skipna=True).mean(skipna=True)
        )
        puan = scale100(genel, max_score)
    else:
        puan = 0
    st.metric(
        label="⭐ Genel Puan (100 üzerinden)",
        value=f"{puan}/100"
    )

with col3:
    if "willReturn" in df.columns:
        donus = df["willReturn"].astype(str).str.lower()
        evet = donus.isin(["evet", "yes", "да"]).sum()
        hayir = donus.isin(["hayır", "hayir", "no", "нет"]).sum()
        oran = int((evet / len(df) * 100)) if len(df) > 0 else 0
        st.metric(
            label="🔄 Tekrar Gelir",
            value=f"%{oran}",
            delta=f"✅ {evet} Evet | ❌ {hayir} Hayır"
        )
    else:
        st.metric(label="🔄 Tekrar Gelir", value="N/A")

with col4:
    if "wouldRecommend" in df.columns:
        tav = df["wouldRecommend"].astype(str).str.lower()
        evet2 = tav.isin(["evet", "yes", "да"]).sum()
        hayir2 = tav.isin(
            ["hayır", "hayir", "no", "нет"]
        ).sum()
        oran2 = int(
            (evet2 / len(df) * 100)
        ) if len(df) > 0 else 0
        st.metric(
            label="👍 Tavsiye Eder",
            value=f"%{oran2}",
            delta=f"✅ {evet2} Evet | ❌ {hayir2} Hayır"
        )
    else:
        st.metric(label="👍 Tavsiye Eder", value="N/A")
st.divider()

# 2) EN İYİ DEPARTMAN & PERSONEL
st.markdown("## 🏆 En İyi Departman & Personel")
dep_df = dept_avg(df, metric_mode)
staff_df = top_staff(df, 3)
medals = ["🥇", "🥈", "🥉"]
colors = ["#FFD700", "#C0C0C0", "#CD7F32"]

col_a, col_b = st.columns(2)

with col_a:
    st.markdown("### 🏢 En İyi 3 Departman")
    if dep_df.empty:
        st.info("Veri bulunamadı.")
    else:
        for i, row in enumerate(dep_df.head(3).itertuples()):
            c = colors[i]
            st.markdown(f"""
                <div style='background:{c}22;
                border-left:4px solid {c};
                padding:10px; margin:5px 0;
                border-radius:5px;'>
                    <b>{medals[i]} {row.Departman}</b>
                    <span style='float:right;
                    font-weight:bold;'>
                        {row.Skor:.1f}/100
                    </span>
                </div>
            """, unsafe_allow_html=True)
with col_b:
    st.markdown("### 👤 En Çok Övülen 3 Personel")
    if staff_df.empty:
        st.info("Henüz övülen personel yok.")
    else:
        for i, row in enumerate(staff_df.head(3).itertuples()):
            c = colors[i]
            st.markdown(f"""
                <div style='background:{c}22;
                border-left:4px solid {c};
                padding:10px; margin:5px 0;
                border-radius:5px;'>
                    <b>{medals[i]} {row.Personel}</b>
                    <span style='float:right;
                    font-weight:bold;'>
                        {row._2} övgü
                    </span>
                </div>
            """, unsafe_allow_html=True)

st.divider()

# 3) DEPARTMAN GRAFİĞİ
st.markdown("## 📊 Departman Puanları")
if dep_df.empty:
    st.info("Grafik için veri yok.")
else:
    fig1 = px.bar(
        dep_df, x="Departman", y="Skor",
        color="Skor",
        color_continuous_scale="RdYlGn",
        title=f"Departman Skorları ({time_mode})",
        text="Skor"
    )
    fig1.update_traces(
        texttemplate='%{text:.2f}',
        textposition='outside'
    )
    fig1.update_layout(showlegend=False, height=450)
    st.plotly_chart(fig1, use_container_width=True)

st.divider()

# 4) SORU BAZLI
st.markdown("## 🔍 Soru Bazlı Analiz")
dep_choice = st.selectbox(
    "Departman Seçin",
    list(DEPARTMENTS.keys()),
    index=0
)
q_df = question_avg(df, dep_choice, metric_mode)
if q_df.empty:
    st.info("Seçilen departman için veri yok.")
else:
    fig2 = px.bar(
        q_df, x="Soru", y="Skor",
        color="Skor",
        color_continuous_scale="RdYlGn",
        title=f"{dep_choice} — Soru Bazlı",
        text="Skor"
    )
    fig2.update_traces(
        texttemplate='%{text:.2f}',
        textposition='outside'
    )
    fig2.update_layout(showlegend=False, height=400)
    st.plotly_chart(fig2, use_container_width=True)

st.divider()
# Repeat Guest kartı
col5, col6 = st.columns(2)

with col5:
    if "previousStay" in df.columns:
        prev = df["previousStay"].astype(str).str.lower()
        evet_prev = prev.isin(
            ["evet", "yes", "да"]
        ).sum()
        hayir_prev = prev.isin(
            ["hayır", "hayir", "no", "нет"]
        ).sum()
        oran_prev = int(
            (evet_prev / len(df) * 100)
        ) if len(df) > 0 else 0
        st.metric(
            label="🏨 Daha Önce Geldi mi?",
            value=f"%{oran_prev}",
            delta=f"✅ {evet_prev} Evet | ❌ {hayir_prev} Hayır"
        )
    else:
        st.metric(label="🏨 Daha Önce Geldi mi?", value="N/A")

with col6:
    if "previousStay" in df.columns:
        prev = df["previousStay"].astype(str).str.lower()
        repeat = prev.isin(["evet", "yes", "да"]).sum()
        new_guest = prev.isin(
            ["hayır", "hayir", "no", "нет"]
        ).sum()
        st.markdown(f"""
            <div style='background:#e8f5e9;
            border-left:4px solid #4CAF50;
            padding:15px; border-radius:5px;'>
                <b>🔄 Repeat Guest Analizi</b><br><br>
                ✅ <b>Repeat Guest:</b> {repeat} kişi<br>
                🆕 <b>Yeni Misafir:</b> {new_guest} kişi<br>
                📊 <b>Repeat Oranı:</b> 
                %{int((repeat/len(df)*100)) 
                if len(df) > 0 else 0}
            </div>
        """, unsafe_allow_html=True)

st.divider()

# 5) ÜLKE
st.markdown("## 🌍 Ülke Bazlı Analiz")
c_df = country_avg(df, metric_mode, rating_cols)
if c_df.empty:
    st.info("Ülke verisi bulunamadı.")
else:
    fig3 = px.bar(
        c_df.head(20), x="Ülke", y="Skor",
        color="Skor",
        color_continuous_scale="Blues",
        title="Ülke Bazlı Memnuniyet",
        text="Skor"
    )
    fig3.update_traces(
        texttemplate='%{text:.2f}',
        textposition='outside'
    )
    fig3.update_layout(showlegend=False, height=400)
    st.plotly_chart(fig3, use_container_width=True)

st.divider()

# 6) PERSONEL
st.markdown("## 👏 Personel Övgü Analizi")
staff_all = top_staff(df, 20)
if staff_all.empty:
    st.info("Övülen personel verisi yok.")
else:
    fig4 = px.bar(
        staff_all, x="Personel", y="Övgü Sayısı",
        color="Övgü Sayısı",
        color_continuous_scale="Greens",
        title="En Çok Övülen Personel",
        text="Övgü Sayısı"
    )
    fig4.update_traces(textposition='outside')
    fig4.update_layout(showlegend=False, height=400)
    st.plotly_chart(fig4, use_container_width=True)

st.divider()

# 7) TREND
st.markdown("## 📈 Zaman Trend Analizi")
trend_df = time_trend(df, time_mode, metric_mode)
if trend_df.empty:
    st.info("Trend için yeterli veri yok.")
else:
    fig5 = px.line(
        trend_df, x="Bucket", y="Skor",
        color="Departman",
        title=f"Departman Trend ({time_mode})",
        markers=True
    )
    fig5.update_layout(height=500)
    st.plotly_chart(fig5, use_container_width=True)

st.divider()

# 8) YORUMLAR
st.markdown("## 💬 Misafir Yorumları")
if "generalComments" in df.columns:
    comments = (
        df["generalComments"]
        .fillna("").astype(str).str.strip()
    )
    comments = comments[comments != ""]
    st.markdown(f"**Toplam Yorum: {len(comments)}**")
    for idx, comment in comments.head(50).items():
        name = df.loc[idx, "fullName"] \
            if "fullName" in df.columns else "Misafir"
        country = df.loc[idx, "nationality"] \
            if "nationality" in df.columns else ""
        st.markdown(f"""
            <div style='background:#f8f9fa;
            border-left:3px solid #1a73e8;
            padding:10px; margin:8px 0;
            border-radius:5px;'>
                <b>👤 {name}</b>
                {'🌍 ' + str(country) if country else ''}
                <br>
                <small style='color:#666;'>{comment}</small>
            </div>
        """, unsafe_allow_html=True)
else:
    st.info("Yorum verisi bulunamadı.")

st.divider()

# 9) HAM VERİ
st.markdown("## 📋 Ham Veri Tablosu")
show_cols = [
    c for c in [
        "dt", "fullName", "gender", "nationality",
        "roomNumber", "checkIn", "checkOut",
        "praisedStaff", "generalComments",
        "previousStay", "willReturn", "wouldRecommend"
    ] if c in df.columns
]

if show_cols:
    st.dataframe(
        df[show_cols].sort_values("dt", ascending=False)
        if "dt" in df.columns else df[show_cols],
        use_container_width=True,
        height=400
    )

# Excel İndir
try:
    import io
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False, engine='openpyxl')
    buffer.seek(0)
    st.download_button(
        label="📥 Excel Olarak İndir",
        data=buffer,
        file_name=f"anket_{datetime.now().strftime('%Y%m%d')}.xlsx",
        mime="application/vnd.ms-excel"
    )
except Exception:
    st.info("Excel için openpyxl gerekli.")

st.divider()

st.markdown("""
    <div style='text-align:center; color:#999; padding:20px;'>
        🏨 Concordia Celes Hotel — Misafir Memnuniyet Sistemi
    </div>
""", unsafe_allow_html=True)
