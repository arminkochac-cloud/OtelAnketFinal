<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏨 Otel Misafir Anket Sistemi</title>

    <link rel="stylesheet" href="style.css?v=1">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="container">

    <!-- DİL SEÇİMİ -->
    <div class="language-selector" id="languageSelector">
        <div class="lang-header">
            <img src="logo.png?v=1" alt="Hotel Logo" style="width:150px; margin-bottom:15px;">
            <h2>Select Language / Dil Seçin</h2>
        </div>

        <div class="lang-grid">
            <button type="button" class="lang-btn" onclick="setLanguage('tr')">
                <span class="flag">🇹🇷</span>
                <span>Türkçe</span>
            </button>
            <button type="button" class="lang-btn" onclick="setLanguage('en')">
                <span class="flag">🇬🇧</span>
                <span>English</span>
            </button>
            <button type="button" class="lang-btn" onclick="setLanguage('de')">
                <span class="flag">🇩🇪</span>
                <span>Deutsch</span>
            </button>
            <button type="button" class="lang-btn" onclick="setLanguage('ru')">
                <span class="flag">🇷🇺</span>
                <span>Русский</span>
            </button>
            <button type="button" class="lang-btn" onclick="setLanguage('pl')">
                <span class="flag">🇵🇱</span>
                <span>Polski</span>
            </button>
            <button type="button" class="lang-btn" onclick="setLanguage('ro')">
                <span class="flag">🇷🇴</span>
                <span>Română</span>
            </button>
        </div>
    </div>

    <!-- ANA ANKET FORMU -->
    <div class="survey-form" id="surveyForm" style="display:none;">

        <!-- HEADER -->
        <div class="header">
            <img src="logo.png?v=1" alt="Hotel Logo" style="width:120px; margin-bottom:10px;">
            <h1 data-translate="hotelName">Concordia Celes Hotel</h1>
            <p data-translate="surveyTitle">Misafir Memnuniyet Anketi</p>
            <div class="lang-change" onclick="changeLanguage()">
                🌐 <span id="currentLangName">Türkçe</span>
            </div>
        </div>

        <!-- İLERLEME ÇUBUĞU -->
        <div class="progress-container">
            <div class="progress-bar" id="progressBar">
                <span id="progressText">0%</span>
            </div>
        </div>

        <form id="mainForm" novalidate>

            <!-- ========== BÖLÜM 1: GENEL BİLGİLER ========== -->
            <div class="section active" id="section1">
                <div class="section-title">
                    <span class="section-icon">👤</span>
                    <h2 data-translate="generalInfo">GENEL BİLGİLER</h2>
                </div>

                <div class="form-group">
                    <label data-translate="fullName">Ad Soyad *</label>
                    <input type="text" name="fullName" required>
                </div>

                <div class="form-group">
                    <label data-translate="gender">Cinsiyetiniz *</label>
                    <div class="gender-buttons">
                        <label class="gender-btn">
                            <input type="radio" name="gender" value="Kadın" required>
                            <span>👩 <span data-translate="female">Kadın</span></span>
                        </label>
                        <label class="gender-btn">
                            <input type="radio" name="gender" value="Erkek">
                            <span>👨 <span data-translate="male">Erkek</span></span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label data-translate="nationality">Uyruğu *</label>
                    <select name="nationality" required>
                        <option value="" data-translate="selectOption">Seçiniz...</option>
                        <option value="Türkiye">🇹🇷 Türkiye</option>
                        <option value="Germany">🇩🇪 Almanya</option>
                        <option value="United Kingdom">🇬🇧 İngiltere</option>
                        <option value="Russia">🇷🇺 Rusya</option>
                        <option value="Poland">🇵🇱 Polonya</option>
                        <option value="Romania">🇷🇴 Romanya</option>
                        <option value="France">🇫🇷 Fransa</option>
                        <option value="Netherlands">🇳🇱 Hollanda</option>
                        <option value="Italy">🇮🇹 İtalya</option>
                        <option value="USA">🇺🇸 ABD</option>
                        <option value="Other" data-translate="other">Diğer</option>
                    </select>
                </div>

                <div class="form-group">
                    <label data-translate="roomNumber">Oda Numarası *</label>
                    <input type="text" name="roomNumber" required placeholder="Örn: 305">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label data-translate="checkIn">Giriş Tarihi *</label>
                        <input type="date" name="checkIn" required id="checkInDate">
                    </div>
                    <div class="form-group">
                        <label data-translate="checkOut">Çıkış Tarihi *</label>
                        <input type="date" name="checkOut" required id="checkOutDate">
                    </div>
                </div>

                <div class="form-group">
                    <label data-translate="email">Mail Adresi</label>
                    <input type="email" name="email" placeholder="ornek@email.com">
                </div>

                <!-- KVKK ONAY -->
                <div class="form-group">
                    <div class="kvkk-box">
                        <label class="kvkk-label">
                            <input type="checkbox" name="kvkkOnay" id="kvkkOnay" required>
                            <span>
                                <span data-translate="kvkkText">
                                    Kişisel verilerimin Concordia Celes Hotel tarafından misafir memnuniyeti amacıyla işlenmesine onay veriyorum.
                                </span>
                                <a href="#" onclick="showKvkk(); return false;">
                                    📄 <span data-translate="kvkkLink">KVKK Aydınlatma Metni</span>
                                </a>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="btn-group">
                    <div></div>
                    <button type="button" class="btn btn-next" onclick="nextSection(1)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 2: ÖN BÜRO & RESEPSİYON ========== -->
            <div class="section" id="section2">
                <div class="section-title">
                    <span class="section-icon">🛎️</span>
                    <h2 data-translate="frontOffice">ÖN BÜRO RESEPSİYON</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="welcomeGreeting">Giriş Karşılama</label>
                    <div class="stars" data-name="welcomeGreeting"></div>
                    <input type="hidden" name="welcomeGreeting">
                </div>

                <div class="rating-item">
                    <label data-translate="checkInProcess">Check-In İşlemleri</label>
                    <div class="stars" data-name="checkInProcess"></div>
                    <input type="hidden" name="checkInProcess">
                </div>

                <div class="rating-item">
                    <label data-translate="facilityInfo">Tesis Hakkında Bilgilendirme</label>
                    <div class="stars" data-name="facilityInfo"></div>
                    <input type="hidden" name="facilityInfo">
                </div>

                <div class="rating-item">
                    <label data-translate="frontDeskCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="frontDeskCare"></div>
                    <input type="hidden" name="frontDeskCare">
                </div>

                <div class="rating-item">
                    <label data-translate="bellboyService">Bellboy Hizmetleri</label>
                    <div class="stars" data-name="bellboyService"></div>
                    <input type="hidden" name="bellboyService">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(2)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(2)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 3: GUEST RELATION ========== -->
            <div class="section" id="section3">
                <div class="section-title">
                    <span class="section-icon">🤝</span>
                    <h2 data-translate="guestRelation">GUEST RELATION</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="grWelcomeQuality">Misafir ile İletişimi</label>
                    <div class="stars" data-name="grWelcomeQuality"></div>
                    <input type="hidden" name="grWelcomeQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="problemSolving">Bilgilendirme Yeterliliği</label>
                    <div class="stars" data-name="problemSolving"></div>
                    <input type="hidden" name="problemSolving">
                </div>

                <div class="rating-item">
                    <label data-translate="guestFollowUp">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="guestFollowUp"></div>
                    <input type="hidden" name="guestFollowUp">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(3)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(3)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 4: KAT HİZMETLERİ ========== -->
            <div class="section" id="section4">
                <div class="section-title">
                    <span class="section-icon">🧹</span>
                    <h2 data-translate="housekeeping">KAT HİZMETLERİ</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="initialRoomCleaning">İlk Varışınızda Oda Temizliği</label>
                    <div class="stars" data-name="initialRoomCleaning"></div>
                    <input type="hidden" name="initialRoomCleaning">
                </div>

                <div class="rating-item">
                    <label data-translate="roomAppearance">Oda Fiziki Görünümü ve Konforu</label>
                    <div class="stars" data-name="roomAppearance"></div>
                    <input type="hidden" name="roomAppearance">
                </div>

                <div class="rating-item">
                    <label data-translate="dailyRoomCleaning">Konaklama Süresince Oda Temizliği ve Düzeni</label>
                    <div class="stars" data-name="dailyRoomCleaning"></div>
                    <input type="hidden" name="dailyRoomCleaning">
                </div>

                <div class="rating-item">
                    <label data-translate="minibarService">Minibar Hizmeti</label>
                    <div class="stars" data-name="minibarService"></div>
                    <input type="hidden" name="minibarService">
                </div>

                <div class="rating-item">
                    <label data-translate="publicAreaCleaning">Genel Alan Temizliği</label>
                    <div class="stars" data-name="publicAreaCleaning"></div>
                    <input type="hidden" name="publicAreaCleaning">
                </div>

                <div class="rating-item">
                    <label data-translate="beachPoolCleaning">Sahil ve Havuz Çevre Temizliği</label>
                    <div class="stars" data-name="beachPoolCleaning"></div>
                    <input type="hidden" name="beachPoolCleaning">
                </div>

                <div class="rating-item">
                    <label data-translate="housekeepingStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="housekeepingStaffCare"></div>
                    <input type="hidden" name="housekeepingStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(4)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(4)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 5: MUTFAK ========== -->
            <div class="section" id="section5">
                <div class="section-title">
                    <span class="section-icon">🍽️</span>
                    <h2 data-translate="foodServices">MUTFAK</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="breakfastVariety">Kahvaltı Büfesi Çeşitliliği</label>
                    <div class="stars" data-name="breakfastVariety"></div>
                    <input type="hidden" name="breakfastVariety">
                </div>

                <div class="rating-item">
                    <label data-translate="lunchVariety">Öğle Yemeği Büfesi Çeşitliliği</label>
                    <div class="stars" data-name="lunchVariety"></div>
                    <input type="hidden" name="lunchVariety">
                </div>

                <div class="rating-item">
                    <label data-translate="dinnerVariety">Akşam Yemeği Büfesi Çeşitliliği</label>
                    <div class="stars" data-name="dinnerVariety"></div>
                    <input type="hidden" name="dinnerVariety">
                </div>

                <div class="rating-item">
                    <label data-translate="alacarteQuality">Alacart Restaurant Yemek Sunumu ve Kalitesi</label>
                    <div class="stars" data-name="alacarteQuality"></div>
                    <input type="hidden" name="alacarteQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="kitchenHygiene">Mutfağın Hijyen ve Temizliği</label>
                    <div class="stars" data-name="kitchenHygiene"></div>
                    <input type="hidden" name="kitchenHygiene">
                </div>

                <div class="rating-item">
                    <label data-translate="foodStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="foodStaffCare"></div>
                    <input type="hidden" name="foodStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(5)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(5)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 6: BARLAR ========== -->
            <div class="section" id="section6">
                <div class="section-title">
                    <span class="section-icon">🍸</span>
                    <h2 data-translate="barsServices">BARLAR</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="poolBarQuality">Pool Bar Servis Kalitesi</label>
                    <div class="stars" data-name="poolBarQuality"></div>
                    <input type="hidden" name="poolBarQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="lobbyBarQuality">Lobby Bar Servis Kalitesi</label>
                    <div class="stars" data-name="lobbyBarQuality"></div>
                    <input type="hidden" name="lobbyBarQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="snackBarQuality">Snack Bar Servis Kalitesi</label>
                    <div class="stars" data-name="snackBarQuality"></div>
                    <input type="hidden" name="snackBarQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="drinkQuality">İçki Kalitesi ve Sunumu</label>
                    <div class="stars" data-name="drinkQuality"></div>
                    <input type="hidden" name="drinkQuality">
                </div>

                <div class="rating-item">
                    <label data-translate="barHygiene">Barların Hijyen ve Temizliği</label>
                    <div class="stars" data-name="barHygiene"></div>
                    <input type="hidden" name="barHygiene">
                </div>

                <div class="rating-item">
                    <label data-translate="barStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="barStaffCare"></div>
                    <input type="hidden" name="barStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(6)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(6)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 7: RESTAURANT HİZMETLERİ ========== -->
            <div class="section" id="section7">
                <div class="section-title">
                    <span class="section-icon">🍴</span>
                    <h2 data-translate="restaurantServices">RESTAURANT HİZMETLERİ</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="restaurantLayout">Restaurant Düzeni ve Kalitesi</label>
                    <div class="stars" data-name="restaurantLayout"></div>
                    <input type="hidden" name="restaurantLayout">
                </div>

                <div class="rating-item">
                    <label data-translate="restaurantCapacity">Restaurant Yer Yeterliliği</label>
                    <div class="stars" data-name="restaurantCapacity"></div>
                    <input type="hidden" name="restaurantCapacity">
                </div>

                <div class="rating-item">
                    <label data-translate="restaurantHygiene">Restaurant Hijyen ve Temizliği</label>
                    <div class="stars" data-name="restaurantHygiene"></div>
                    <input type="hidden" name="restaurantHygiene">
                </div>

                <div class="rating-item">
                    <label data-translate="snackbarRestaurant">Snackbar Restaurant Hizmeti</label>
                    <div class="stars" data-name="snackbarRestaurant"></div>
                    <input type="hidden" name="snackbarRestaurant">
                </div>

                <div class="rating-item">
                    <label data-translate="alacarteRestaurant">Alacart Restaurant Hizmeti ve Personel İlgisi</label>
                    <div class="stars" data-name="alacarteRestaurant"></div>
                    <input type="hidden" name="alacarteRestaurant">
                </div>

                <div class="rating-item">
                    <label data-translate="restaurantStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="restaurantStaffCare"></div>
                    <input type="hidden" name="restaurantStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(7)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(7)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 8: TEKNİK SERVİS ========== -->
            <div class="section" id="section8">
                <div class="section-title">
                    <span class="section-icon">🔧</span>
                    <h2 data-translate="technicalService">TEKNİK SERVİS</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="roomTechnicalSystems">Oda Teknik Sistemleri</label>
                    <div class="stars" data-name="roomTechnicalSystems"></div>
                    <input type="hidden" name="roomTechnicalSystems">
                </div>

                <div class="rating-item">
                    <label data-translate="maintenanceResponse">Arıza Bildirimi ve Giderme</label>
                    <div class="stars" data-name="maintenanceResponse"></div>
                    <input type="hidden" name="maintenanceResponse">
                </div>

                <div class="rating-item">
                    <label data-translate="environmentLighting">Çevre Aydınlatma ve Düzeni</label>
                    <div class="stars" data-name="environmentLighting"></div>
                    <input type="hidden" name="environmentLighting">
                </div>

                <div class="rating-item">
                    <label data-translate="poolWaterCleaning">Havuz Suyu Temizliği</label>
                    <div class="stars" data-name="poolWaterCleaning"></div>
                    <input type="hidden" name="poolWaterCleaning">
                </div>

                <div class="rating-item">
                    <label data-translate="technicalStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="technicalStaffCare"></div>
                    <input type="hidden" name="technicalStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(8)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(8)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 9: EĞLENCE HİZMETLERİ ========== -->
            <div class="section" id="section9">
                <div class="section-title">
                    <span class="section-icon">🎭</span>
                    <h2 data-translate="entertainmentServices">EĞLENCE HİZMETLERİ</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="daytimeActivities">Animasyon Ekibi ile Gündüz Aktiviteleri</label>
                    <div class="stars" data-name="daytimeActivities"></div>
                    <input type="hidden" name="daytimeActivities">
                </div>

                <div class="rating-item">
                    <label data-translate="sportsAreas">Aktivite ve Spor Alanları ve Ekipmanları</label>
                    <div class="stars" data-name="sportsAreas"></div>
                    <input type="hidden" name="sportsAreas">
                </div>

                <div class="rating-item">
                    <label data-translate="eveningShows">Akşam Aktiviteleri ve Showlar</label>
                    <div class="stars" data-name="eveningShows"></div>
                    <input type="hidden" name="eveningShows">
                </div>

                <div class="rating-item">
                    <label data-translate="miniclubActivities">Miniclub Aktiviteleri</label>
                    <div class="stars" data-name="miniclubActivities"></div>
                    <input type="hidden" name="miniclubActivities">
                </div>

                <div class="rating-item">
                    <label data-translate="entertainmentStaffCare">Personelin İlgi ve Nezaketi</label>
                    <div class="stars" data-name="entertainmentStaffCare"></div>
                    <input type="hidden" name="entertainmentStaffCare">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(9)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(9)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 10: DİĞER HİZMETLER ========== -->
            <div class="section" id="section10">
                <div class="section-title">
                    <span class="section-icon">⭐</span>
                    <h2 data-translate="otherServices">DİĞER HİZMETLER</h2>
                </div>

                <div class="rating-item">
                    <label data-translate="landscaping">Genel Düzenleme / Peyzaj</label>
                    <div class="stars" data-name="landscaping"></div>
                    <input type="hidden" name="landscaping">
                </div>

                <div class="rating-item">
                    <label data-translate="spaServices">Sauna-Hamam Hizmetleri</label>
                    <div class="stars" data-name="spaServices"></div>
                    <input type="hidden" name="spaServices">
                </div>

                <div class="rating-item">
                    <label data-translate="shopBehavior">Hotel Genel Esnaf Davranışları</label>
                    <div class="stars" data-name="shopBehavior"></div>
                    <input type="hidden" name="shopBehavior">
                </div>

                <div class="rating-item">
                    <label data-translate="priceQuality">Fiyat Kalitesi ve İlişkisi</label>
                    <div class="stars" data-name="priceQuality"></div>
                    <input type="hidden" name="priceQuality">
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(10)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="button" class="btn btn-next" onclick="nextSection(10)">
                        <span data-translate="next">İleri</span> →
                    </button>
                </div>
            </div>

            <!-- ========== BÖLÜM 11: ÖNERİLER ========== -->
            <div class="section" id="section11">
                <div class="section-title">
                    <span class="section-icon">📝</span>
                    <h2 data-translate="suggestions">ÖNERİLERİNİZ</h2>
                </div>

                <div class="form-group">
                    <label data-translate="previousStay">Otelimizde Daha Önce Bulundunuz Mu? *</label>
                    <div class="yes-no-buttons">
                        <label class="yn-btn">
                            <input type="radio" name="previousStay" value="Evet" required>
                            <span data-translate="yes">Evet</span>
                        </label>
                        <label class="yn-btn">
                            <input type="radio" name="previousStay" value="Hayır">
                            <span data-translate="no">Hayır</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label data-translate="praisedStaff">Hizmetinden Dolayı Övgüye Bulunduğunuz Personelin İsmi</label>
                    <input type="text" name="praisedStaff" placeholder="">
                </div>

                <div class="form-group">
                    <label data-translate="generalComments">Genel Düşünce ve Yorumlarınız (0-500 karakter)</label>
                    <textarea name="generalComments" maxlength="500" rows="4"></textarea>
                    <small class="char-count">0 / 500</small>
                </div>

                <div class="form-group">
                    <label data-translate="willReturnQuestion">Tekrar Gelir Misiniz? *</label>
                    <div class="yes-no-buttons">
                        <label class="yn-btn">
                            <input type="radio" name="willReturn" value="Evet" required>
                            <span data-translate="yes">Evet</span>
                        </label>
                        <label class="yn-btn">
                            <input type="radio" name="willReturn" value="Hayır">
                            <span data-translate="no">Hayır</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label data-translate="wouldRecommend">Bizi Çevrenize Tavsiye Eder Misiniz? *</label>
                    <div class="yes-no-buttons">
                        <label class="yn-btn">
                            <input type="radio" name="wouldRecommend" value="Evet" required>
                            <span data-translate="yes">Evet</span>
                        </label>
                        <label class="yn-btn">
                            <input type="radio" name="wouldRecommend" value="Hayır">
                            <span data-translate="no">Hayır</span>
                        </label>
                    </div>
                </div>

                <div class="btn-group">
                    <button type="button" class="btn btn-prev" onclick="prevSection(11)">
                        ← <span data-translate="back">Geri</span>
                    </button>
                    <button type="submit" class="btn btn-submit">
                        ✅ <span data-translate="submit">Anketi Gönder</span>
                    </button>
                </div>
            </div>

        </form>
    </div>

    <!-- TEŞEKKÜR SAYFASI -->
    <div class="thank-you" id="thankYou" style="display:none;">
        <div class="thank-icon">🎉</div>
        <h2 data-translate="thankYouTitle">Teşekkür Ederiz!</h2>
        <p data-translate="thankYouMessage">Değerli görüşleriniz bizim için çok önemli.</p>
        <button class="btn" type="button" onclick="resetForm()">
            <span data-translate="newSurvey">Yeni Anket</span>
        </button>
    </div>

</div>

<!-- KVKK MODAL -->
<div id="kvkkModal" style="
    display:none;
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    background:rgba(0,0,0,0.7);
    z-index:9999;
    overflow-y:auto;
    padding:20px;
">
    <div style="
        background:white;
        margin:20px auto;
        padding:30px;
        max-width:600px;
        border-radius:15px;
    ">
        <h2 style="color:#1a1a3e;">🔒 KVKK Aydınlatma Metni</h2>
        <hr>

        <p><b>Veri Sorumlusu:</b><br>
        Concordia Celes Hotel<br>
        info@concordiaceles.com</p>

        <p><b>Toplanan Kişisel Veriler:</b><br>
        Ad Soyad, Cinsiyet, Uyruk, Oda Numarası, Giriş-Çıkış Tarihi, E-posta Adresi, Memnuniyet Puanları</p>

        <p><b>İşleme Amacı:</b><br>
        Misafir memnuniyetini ölçmek ve hizmet kalitesini artırmak</p>

        <p><b>Saklama Süresi:</b><br>
        Verileriniz 2 yıl süreyle saklanacaktır.</p>

        <p><b>Haklarınız:</b><br>
        ✅ Verilerinize erişim hakkı<br>
        ✅ Düzeltme talep etme hakkı<br>
        ✅ Silme talep etme hakkı<br>
        ✅ İşlemeye itiraz hakkı</p>

        <p><b>İletişim:</b><br>
        📧 info@concordiaceles.com<br>
        🌐 www.concordiaceles.com</p>

        <button type="button" onclick="closeKvkk()" style="
            background:#1a1a3e;
            color:white;
            padding:12px 30px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-size:16px;
            margin-top:15px;
            width:100%;
        ">
            ✓ Anladım, Kapat
        </button>
    </div>
</div>

<!-- SCRIPTS -->
<script src="translations.js?v=1"></script>
<script src="script.js?v=1"></script>

</body>
</html>
