/* ==========================================================================
   ISLAMIC APP - HYBRID ENGINE (v1.0.0 Build 2026)
   Copyright © 2026 Surya Ardiansyah. All Rights Reserved.
   ========================================================================== */

let allSurahs = [];
let currentSurahData = null;
let currentAyatIndex = 0;
let isPlaying = false;
let isSideBySide = false;
let currentArabicFontSize = 26;
let isKaraokeEnabled = true;
let selectedQoriKey = localStorage.getItem("selected_qori_key") || "05";
let bookmarks = [];
let lastRead = null;
let searchQuery = "";

// SHOLAT & AZAN AUDIO STATE
let currentCity = "Bogor";
let prayerTimesData = null;
let monthlyPrayerData = [];
let countdownInterval = null;
let isAzanAudioEnabled = false;
let activeAzanPrayerName = "";
let khatamJuzList = new Array(30).fill(false);
let swRegistration = null;

// DOA & KISAH STATE
let currentDoaCategory = "all";
let favoriteDoaIds = [];
let currentDailyItem = null;
let selectedKisahItem = null;

// AUDIO OBJECTS
const audioObj = new Audio();
const azanAudioObj = new Audio("makkah.mp3");

// DATABASE KISAH 25 NABI
const kisahnabiDatabase = [
  { id: 1, name: "Adam AS", arabic: "آدَمُ", era: "Manusia Pertama", location: "Surga & Bumi", miracle: "Diciptakan langsung oleh Allah dari tanah & diajarkan nama-nama benda", summary: "Manusia dan Nabi pertama yang diciptakan Allah SWT. Diturunkan ke bumi bersama Hawa untuk menjadi khalifah.", story: "Nabi Adam AS diciptakan dari tanah dan ditiupkan ruh oleh Allah. Beliau diajarkan ilmu tentang nama-nama segala benda yang tidak diketahui para malaikat. Setelah diperdaya iblis untuk memakan buah Khuldi, beliau bertaubat dan dikirim ke bumi untuk memimpin umat manusia." },
  { id: 2, name: "Idris AS", arabic: "إِدْرِيسُ", era: "Keturunan Adam", location: "Babilonia & Mesir", miracle: "Nabi pertama yang pandai menulis dengan pena & menguasai ilmu astronomi", summary: "Nabi yang dikenal sangat tekun, cerdas, dan diberi wahyu berupa 30 sahifah.", story: "Nabi Idris AS adalah keturunan keenam Nabi Adam. Beliau dianugerahi kemahiran menulis dengan pena, menjahit pakaian, serta pengetahuan tentang ilmu perbintangan (astronomi) dan matematika." },
  { id: 3, name: "Nuh AS", arabic: "نُوحٌ", era: "Masa Banjir Bandang", location: "Mesopotamia", miracle: "Membuat Bahtera Raksasa yang menyelamatkan kaum beriman dari banjir bah", summary: "Berdakwah selama 950 tahun dengan penuh kesabaran menghadapi kaumnya yang pembangkang.", story: "Nabi Nuh AS berdakwah selama kurun waktu yang sangat panjang (950 tahun), namun hanya sedikit kaumnya yang beriman. Atas perintah Allah, beliau membangun bahtera raksasa sebelum banjir dahsyat memusnahkan kaum yang zalim." },
  { id: 4, name: "Hud AS", arabic: "هُودٌ", era: "Kaum 'Ad", location: "Al-Ahqaf (Yaman)", miracle: "Selamat dari angin topan dahsyat yang menghancurkan kaum 'Ad", summary: "Diutus kepada Kaum 'Ad yang sombong akan kekuatan fisik dan bangunan megah mereka.", story: "Nabi Hud AS mengingatkan Kaum 'Ad agar tidak menyembah berhala dan tidak menyombongkan keahlian mereka membangun istana tinggi. Kaum tersebut menolak hingga Allah mengirimkan angin taufan dingin yang sangat kencang selama 7 malam 8 hari." },
  { id: 5, name: "Shalih AS", arabic: "صَالِحٌ", era: "Kaum Tsamud", location: "Al-Hijr (Madain Shalih)", miracle: "Mengeluarkan Unta Betina mukjizat dari dalam batu karang besar", summary: "Diutus kepada Kaum Tsamud yang ahli memahat gunung menjadi rumah tinggal.", story: "Sebagai bukti kenabian, Allah mengeluarkan unta betina hamil dari celah batu besar atas doa Nabi Shalih. Namun kaum Tsamud menyembelih unta tersebut, sehingga Allah menimpakan azab berupa gempa dan gemuruh dahsyat." },
  { id: 6, name: "Ibrahim AS", arabic: "إِبْرَاهِيمُ", era: "Raja Namrud", location: "Babilonia & Makkah", miracle: "Tidak terbakar oleh kobaran api Raja Namrud & membangun Ka'bah", summary: "Bapak para Nabi (Abul Anbiya) yang mengedepankan ketauhidan dan keikhlasan pengorbanan.", story: "Nabi Ibrahim AS menghancurkan berhala-berhala Raja Namrud. Ketika dilemparkan ke dalam api raksasa, Allah memerintahkan api menjadi dingin dan menyelamatkannya. Beliau juga membangun Ka'bah bersama Nabi Ismail AS." },
  { id: 7, name: "Luth AS", arabic: "لُوطٌ", era: "Kaum Sodom", location: "Sodom (Yordania)", miracle: "Selamat dari hujan batu penyiksa Kaum Sodom", summary: "Diutus untuk meluruskan penyimpangan moral Kaum Sodom yang menentang fitrah.", story: "Nabi Luth AS berdakwah memperingatkan masyarakat Sodom agar menghentikan perbuatan keji sesama jenis. Karena penolakan mereka, Allah membalikkan kota tersebut dan menghujaninya dengan batu berapi." },
  { id: 8, name: "Ismail AS", arabic: "إِسْمَاعِيلُ", era: "Putra Ibrahim", location: "Makkah", miracle: "Munculnya sumber Mata Air Zamzam & digantikan dengan domba saat disembelih", summary: "Nabi yang menjadi teladan ketaatan kepada orang tua dan perintah Allah SWT.", story: "Kisah kepatuhan Nabi Ismail AS terlihat saat beliau bersedia disembelih oleh ayahnya demi menjalankan perintah Allah dalam mimpi, yang kemudian diganti dengan seekor kibas/domba syurga." },
  { id: 9, name: "Ishaq AS", arabic: "إِسْحَاقُ", era: "Putra Ibrahim & Sarah", location: "Kan'an (Palestina)", miracle: "Lahir dari ibu yang sudah sangat tua atas izin Allah", summary: "Nabi yang menurunkan garis keturunan para Nabi dari kalangan Bani Israil.", story: "Nabi Ishaq AS dilahirkan ketika ibunya, Sarah, sudah berusia sangat lanjut. Beliau dikenal sebagai nabi yang amat bijaksana dan berakhlak mulia di tanah Palestina." },
  { id: 10, name: "Ya'qub AS", arabic: "يَعْقُوبُ", era: "Ayah dari Nabi Yusuf", location: "Palestina & Mesir", miracle: "Penglihatannya pulih setelah diusapkan pakaian Nabi Yusuf", summary: "Dikenal juga dengan gelar Israil (Hamba Allah) yang sabar atas ujian perpisahan anak.", story: "Nabi Ya'qub AS menanggung kerinduan mendalam hingga matanya buta setelah ditinggal Yusuf AS. Kesabarannya membuahkan hasil saat ia kembali berkumpul bersama anak-anaknya di Mesir." },
  { id: 11, name: "Yusuf AS", arabic: "يُوسُفُ", era: "Kerajaan Mesir", location: "Mesir", miracle: "Ketampanan luar biasa & keahlian menafsirkan mimpi secara akurat", summary: "Kisah terbaik (Ahsanul Qashash) tentang perjalanan dari sumur tua hingga menjadi Menteri Keuangan Mesir.", story: "Nabi Yusuf AS dibuang oleh saudara-saudaranya ke sumur, dijual sebagai budak, difitnah hingga dipenjara, sebelum akhirnya menjadi penguasa Mesir berkat kemampuannya menafsirkan mimpi raja." },
  { id: 12, name: "Ayyub AS", arabic: "أَيُّوبُ", era: "Ujian Kesabaran", location: "Hauran (Syam)", miracle: "Kesehatan pulih total setelah menghentakkan kaki dan mandi air mukjizat", summary: "Simbol puncak kesabaran manusia dalam menghadapi cobaan harta, keluarga, dan penyakit berat.", story: "Nabi Ayyub AS diuji dengan habisnya harta benda, wafatnya anak-anak, dan penyakit kulit berat selama puluhan tahun. Beliau tidak pernah berhenti bersyukur hingga Allah memulihkan seluruh nikmatnya." },
  { id: 13, name: "Syuaib AS", arabic: "شُعَيْبٌ", era: "Kaum Madyan", location: "Madyan (Yordania)", miracle: "Selamat dari guncangan awan hitam berapi", summary: "Diutus meluruskan kecurangan takaran dan timbangan dalam perdagangan.", story: "Nabi Syuaib AS menegur Kaum Madyan yang suka mengurangi timbangan dan berbuat curang di pasar. Kaum yang ingkar dibinasakan dengan gempa dan hawa panas yang membakar." },
  { id: 14, name: "Musa AS", arabic: "مُوسَى", era: "Firaun Mesir", location: "Mesir & Sinai", miracle: "Tongkat menjadi ular raksasa & membelah Laut Merah", summary: "Nabi Kalimullah (yang berbicara langsung dengan Allah) yang membebaskan Bani Israil.", story: "Nabi Musa AS memimpin Bani Israil keluar dari kekejaman Firaun. Saat terdesak di tepi pantai, beliau memukulkan tongkatnya hingga Laut Merah terbelah menjadi jalan kering." },
  { id: 15, name: "Harun AS", arabic: "هَارُونُ", era: "Saudara Musa AS", location: "Mesir & Sinai", miracle: "Kefasihan lisan & kecakapan diplomasi pendamping Musa", summary: "Juru bicara dan pendamping setia Nabi Musa AS dalam menghadapi Firaun.", story: "Nabi Harun AS diangkat menjadi Nabi atas permohonan Musa AS karena kepandaian dan kefasihan bicaranya dalam meyakinkan Firaun dan membimbing kaumnya." },
  { id: 16, name: "Zulkifli AS", arabic: "ذُو الْكِفْلِ", era: "Raja yang Adil", location: "Damsyik (Syam)", miracle: "Kesanggupan menepati janji berpuasa siang hari & sholat malam tanpa amarah", summary: "Nabi yang teguh memegang janji untuk menjadi hakim adil bagi rakyatnya.", story: "Nabi Zulkifli AS sanggup memenuhi syarat menjadi raja yaitu sanggup berpuasa di siang hari, ibadah di malam hari, dan tidak pernah marah dalam menyelesaikan urusan rakyat." },
  { id: 17, name: "Daud AS", arabic: "داوُدُ", era: "Kerajaan Israil", location: "Palestina", miracle: "Menerima Kitab Zabur, melunakkan besi dengan tangan kosong & suara merdu", summary: "Raja sekaligus Nabi yang mengalahkan Jalut (Goliath) dan mahir membuat baju besi.", story: "Nabi Daud AS dianugerahi suara paling merdu yang membuat burung dan gunung ikut bertasbih. Beliau mampu melunakkan besi baja hanya dengan genggaman tangannya." },
  { id: 18, name: "Sulaiman AS", arabic: "سُلَيْمَانُ", era: "Kerajaan Agung", location: "Palestina", miracle: "Memahami bahasa hewan (semut/burung) & memerintah bangsa Jin serta angin", summary: "Raja teragung yang memiliki kerajaan terkaya dan terlengkap sepanjang sejarah.", story: "Nabi Sulaiman AS menguasai kerajaan spektakuler yang menundukkan jin, manusia, dan hewan. Beliau memimpin dengan bijaksana seperti dalam kisah Ratu Saba' (Bilqis)." },
  { id: 19, name: "Ilyas AS", arabic: "إِلْيَاسُ", era: "Penyembah Baal", location: "Baalbek (Lebanon)", miracle: "Mendatangkan kemarau panjang & menurunkan hujan atas izin Allah", summary: "Diutus memperingatkan Kaum Fenisia yang menyembah berhala Baal.", story: "Nabi Ilyas AS berdakwah di kota Baalbek. Karena kaumnya terus menyembah berhala Baal, Allah menimpakan kemarau panjang selama 3 tahun hingga mereka menyadari kesalahannya." },
  { id: 20, name: "Ilyasa AS", arabic: "إِلْيَسَعُ", era: "Penerus Ilyas AS", location: "Syria / Palestina", miracle: "Menyembuhkan penyakit orang sakit & menghidupkan orang mati atas izin Allah", summary: "Sahabat dan penerus perjuangan dakwah Nabi Ilyas AS.", story: "Nabi Ilyasa AS melanjutkan misi dakwah Nabi Ilyas AS menjaga ketauhidan Bani Israil dengan sifat sabar dan kepemimpinan yang adil." },
  { id: 21, name: "Yunus AS", arabic: "يُونُسُ", era: "Kaum Ninawa", location: "Ninawa (Irak)", miracle: "Selamat bertahan hidup di dalam perut Ikan Nun (Paus) di dasar laut", summary: "Terkenal dengan doa Dzan-Nun dalam kegelapan perut ikan.", story: "Nabi Yunus AS sempat meninggalkan kaumnya yang ingkar. Saat berada di laut, beliau ditelan ikan paus raksasa dan bertobat dengan doa zikir terkenal hingga dikeluarkan selamat ke pantai." },
  { id: 22, name: "Zakariya AS", arabic: "زَكَرِيَّا", era: "Pengasuh Maryam", location: "Baitul Maqdis", miracle: "Dikaruniai putra (Yahya) di usianya yang sangat tua", summary: "Nabi yang mengasuh Maryam (Ibunda Nabi Isa) dengan penuh ketaqwaan.", story: "Nabi Zakariya AS terus berdoa memohon keturunan tanpa putus asa meski usianya dan istrinya sudah sangat lanjut, hingga Allah mengabulkannya dengan kelahiran Nabi Yahya AS." },
  { id: 23, name: "Yahya AS", arabic: "يَحْيَى", era: "Putra Zakariya", location: "Palestina", miracle: "Diberi hikmah dan keilmuan syariat sejak masih anak-anak", summary: "Nabi yang sangat suci, penyayang, dan tegas mempertahankan hukum Allah.", story: "Nabi Yahya AS adalah nabi yang hidupnya sangat sederhana, penuh kasih sayang kepada sesama makhluk, dan berani menentang raja zalim yang hendak menikahi mahramnya." },
  { id: 24, name: "Isa AS", arabic: "عِيسَى", era: "Awal Masehi", location: "Palestina", miracle: "Lahir tanpa ayah, berbicara saat bayi, menyembuhkan buta/lepra & menerima Injil", summary: "Nabi Ruhullah yang diangkat ke langit dan akan turun kembali menjelang akhir zaman.", story: "Nabi Isa AS dilahirkan oleh Perawan Maryam atas kekuasaan Allah. Beliau membawa Injil dan menghidupkan orang mati atas izin Allah, lalu diangkat ke langit saat hendak dibunuh oleh musuhnya." },
  { id: 25, name: "Muhammad SAW", arabic: "مُحَمَّدٌ", era: "Nabi Terakhir (Khatamun Nabiyyin)", location: "Makkah & Madinah", miracle: "Al-Qur'anul Karim, Isra' Mi'raj, & pembelahan bulan", summary: "Nabi dan Rasul terakhir penutup para nabi yang diutus untuk seluruh alam (Rahmatan lil 'Alamin).", story: "Nabi Muhammad SAW adalah penutup para nabi. Menerima wahyu Al-Qur'an sebagai petunjuk abadi manusia, melakukan perjalanan Isra' Mi'raj menerima perintah Sholat 5 Waktu, dan berhasil menyatukan jazirah Arab dalam Islam." }
];

// DATABASE DOA & HADITS
const doaDatabase = [
  { id: "d1", category: "ramadhan", title: "Niat Puasa Ramadhan", arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى", latin: "Nawaitu shauma ghadin 'an adā'i fardhi syahri ramadhāna hādzihis sanati lillāhi ta'ālā.", translation: "Aku niat berpuasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta'ala.", source: "Fiqih Madzhab Syafi'i" },
  { id: "d2", category: "ramadhan", title: "Doa Buka Puasa (Versi Shahih)", arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", latin: "Dzahabadh-dhama'u wabtallatil 'urūqu wa tsabatal ajru insyā'allāh.", translation: "Telah hilang rasa haus, urat-urat telah basah, dan kepastian pahala telah ditetapkan insya Allah.", source: "HR. Abu Daud No. 2357" },
  { id: "d3", category: "ramadhan", title: "Niat Sholat Tarawih (Makmum)", arabic: "أُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مَأْمُوْمًا لِلَّهِ تَعَالَى", latin: "Ushallī sunnatat-tarāwīhi rak'ataini ma'mūman lillāhi ta'ālā.", translation: "Aku niat sholat sunnah Tarawih dua rakaat sebagai makmum karena Allah Ta'ala.", source: "Panduan Sholat Sunnah" },
  { id: "d4", category: "ramadhan", title: "Doa Malam Lailatul Qadar", arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", latin: "Allāhumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annī.", translation: "Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai maaf, maka maafkanlah aku.", source: "HR. Tirmidzi No. 3513" },
  { id: "d5", category: "harian", title: "Doa Sebelum Makan", arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ", latin: "Allāhumma bārik lanā fīmā razaqtanā wa qinā 'adzāban-nār.", translation: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa neraka.", source: "HR. Ibnu Sunni" },
  { id: "d6", category: "harian", title: "Doa Sebelum Tidur", arabic: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ", latin: "Bismikallāhumma ahyā wa bismika amūt.", translation: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati.", source: "HR. Bukhari No. 6312" },
  { id: "d7", category: "harian", title: "Doa Untuk Kedua Orang Tua", arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", latin: "Rabbighfirlī wa liwālidayya warhamhumā kamā rabbayānī shaghīrā.", translation: "Ya Rabbku, ampunilah aku dan kedua orang tuaku, dan kasihilah keduanya sebagaimana mereka merawatku di waktu kecil.", source: "QS. Al-Isra: 24" },
  { id: "d8", category: "harian", title: "Doa Kebaikan Dunia & Akhirat (Sapu Jagat)", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", latin: "Rabbanā ātinā fid-dunyā hasanatan wa fil-ākhirati hasanatan wa qinā 'adzāban-nār.", translation: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan lindungilah kami dari azab neraka.", source: "QS. Al-Baqarah: 201" },
  { id: "h1", category: "hadits", title: "Hadits 1: Niat dan Ikhlas", arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", latin: "Innamal a'mālu bin-niyyāt, wa innamā likullimri'in mā nawā.", translation: "Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.", source: "Hadits Arba'in No. 1 (HR. Bukhari & Muslim)" },
  { id: "h2", category: "hadits", title: "Hadits 3: Rukun Islam", arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ : شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ ، وَإِقَامِ الصَّلاَةِ ، وَإِيتَاءِ الزَّكَاةِ ، وَحَجِّ الْبَيْتِ ، وَصَوْمِ رَمَضَانَ", latin: "Buniyal-Islāmu 'alā khamsin: syahādati an lā ilāha illallāh wa anna Muhammadan rasūlullāh, wa iqāmis-shalāti, wa ītā'iz-zakāti, wa hajjil-baiti, wa shaumi ramadhāna.", translation: "Islam dibangun di atas lima perkara: bersaksi bahwa tidak ada tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan sholat, menunaikan zakat, berhaji ke Baitullah, dan berpuasa di bulan Ramadhan.", source: "Hadits Arba'in No. 3 (HR. Bukhari & Muslim)" }
];

// PEMETAAN JUZ KE SURAH AWAL
const juzMapping = {
  1: { surah: 1, ayat: 1 },    2: { surah: 2, ayat: 142 },
  3: { surah: 2, ayat: 253 },  4: { surah: 3, ayat: 93 },
  5: { surah: 4, ayat: 24 },   6: { surah: 4, ayat: 148 },
  7: { surah: 5, ayat: 82 },   8: { surah: 6, ayat: 111 },
  9: { surah: 7, ayat: 88 },   10: { surah: 8, ayat: 41 },
  11: { surah: 9, ayat: 93 },  12: { surah: 11, ayat: 6 },
  13: { surah: 12, ayat: 53 }, 14: { surah: 15, ayat: 1 },
  15: { surah: 17, ayat: 1 },  16: { surah: 18, ayat: 75 },
  17: { surah: 21, ayat: 1 },  18: { surah: 23, ayat: 1 },
  19: { surah: 25, ayat: 21 }, 20: { surah: 27, ayat: 56 },
  21: { surah: 29, ayat: 46 }, 22: { surah: 33, ayat: 31 },
  23: { surah: 36, ayat: 28 }, 24: { surah: 39, ayat: 32 },
  25: { surah: 41, ayat: 47 }, 26: { surah: 46, ayat: 1 },
  27: { surah: 51, ayat: 31 }, 28: { surah: 58, ayat: 1 },
  29: { surah: 67, ayat: 1 },  30: { surah: 78, ayat: 1 }
};

// PEMETAAN DAFTAR SURAH DI DALAM JUZ (PR 2)
const JUZ_SURAH_MAP = {
  1: [{id: 1, name: "Al-Fatihah"}, {id: 2, name: "Al-Baqarah (Ayat 1-141)"}],
  2: [{id: 2, name: "Al-Baqarah (Ayat 142-252)"}],
  3: [{id: 2, name: "Al-Baqarah (Ayat 253-286)"}, {id: 3, name: "Ali 'Imran (Ayat 1-92)"}],
  4: [{id: 3, name: "Ali 'Imran (Ayat 93-200)"}, {id: 4, name: "An-Nisa (Ayat 1-23)"}],
  5: [{id: 4, name: "An-Nisa (Ayat 24-147)"}],
  30: [
    {id: 78, name: "An-Naba"}, {id: 79, name: "An-Nazi'at"}, {id: 80, name: "'Abasa"}, {id: 81, name: "At-Takwir"},
    {id: 82, name: "Al-Infitar"}, {id: 83, name: "Al-Mutaffifin"}, {id: 84, name: "Al-Inshiqaq"}, {id: 85, name: "Al-Buruj"},
    {id: 86, name: "At-Tariq"}, {id: 87, name: "Al-A'la"}, {id: 88, name: "Al-Ghashiyah"}, {id: 89, name: "Al-Fajr"},
    {id: 90, name: "Al-Balad"}, {id: 91, name: "Ash-Shams"}, {id: 92, name: "Al-Layl"}, {id: 93, name: "Ad-Duha"},
    {id: 94, name: "Ash-Sharh"}, {id: 95, name: "At-Tin"}, {id: 96, name: "Al-'Alaq"}, {id: 97, name: "Al-Qadr"},
    {id: 98, name: "Al-Bayyinah"}, {id: 99, name: "Az-Zalzalah"}, {id: 100, name: "Al-'Adiyat"}, {id: 101, name: "Al-Qari'ah"},
    {id: 102, name: "At-Takathur"}, {id: 103, name: "Al-'Asr"}, {id: 104, name: "Al-Humazah"}, {id: 105, name: "Al-Fil"},
    {id: 106, name: "Quraysh"}, {id: 107, name: "Al-Ma'un"}, {id: 108, name: "Al-Kawthar"}, {id: 109, name: "Al-Kafirun"},
    {id: 110, name: "An-Nasr"}, {id: 111, name: "Al-Masad"}, {id: 112, name: "Al-Ikhlas"}, {id: 113, name: "Al-Falaq"}, {id: 114, name: "An-Nas"}
  ]
};

// DATABASE TAJWID PRESISI POPUP
const officialTajweedDatabase = {
  "g": { title: "Ghunnah Musyaddadah", colorClass: "bg-green-600", rule: "Wajib didengungkan 2 Harakat", desc: "Khusus berlaku pada huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ)." },
  "i": { title: "Idgham", colorClass: "bg-teal-600", rule: "Memasukkan bunyi Nun mati/Tanwin ke huruf berikutnya", desc: "Terjadi jika Nun mati/Tanwin bertemu huruf Idgham (ي ن م و / ل ر)." },
  "n": { title: "Ikhfa Haqiqi / Syafawi", colorClass: "bg-purple-600", rule: "Dibaca samar antara Izhar & Idgham + Dengung (2 Harakat)", desc: "Terjadi ketika Nun sukun/Tanwin bertemu 15 huruf Ikhfa." },
  "b": { title: "Iqlab", colorClass: "bg-pink-500", rule: "Bunyi Nun mati/Tanwin ditukar menjadi Mim (م) + Dengung", desc: "Terjadi ketika Nun sukun (نْ) atau Tanwin bertemu dengan huruf Ba (ب)." },
  "q": { title: "Qalqalah", colorClass: "bg-blue-500", rule: "Dipantulkan secara jelas dan mantap", desc: "Berlaku pada 5 huruf Qalqalah (ق ط ب ج د) saat bertanda sukun." },
  "o": { title: "Mad Wajib Muttashil", colorClass: "bg-red-500", rule: "Wajib dipanjangkan 4 hingga 5 Harakat", desc: "Terjadi ketika Mad Thabi'i bertemu huruf Hamzah dalam satu kata." },
  "j": { title: "Mad Jaiz Munfashil", colorClass: "bg-orange-500", rule: "Boleh dipanjangkan 2, 4, atau 5 Harakat", desc: "Terjadi ketika Mad Thabi'i bertemu huruf Hamzah pada kata terpisah." },
  "a": { title: "Mad 'Arid Lissukun", colorClass: "bg-amber-600", rule: "Dipanjangkan 2, 4, atau 6 Harakat saat Waqaf", desc: "Terjadi ketika bacaan Mad Thabi'i bertemu huruf hidup di akhir ayat." }
};

// ================= INISIALISASI UTAMA =================
document.addEventListener("DOMContentLoaded", () => {
  registerServiceWorker();
  loadLocalStorageData();
  populateJuzSelect();

  switchTab('home');

  fetchPrayerTimes(currentCity);
  calculateRamadhanCountdown();
  renderKhatamGrid();
  initNetworkStatusListener();
  loadDailyHighlightHybrid();
  renderDoaList();
  renderKisahList();
  syncKisahOnlineHybrid();
  updateHomeWidgetData();
  updateHomeKhatamWidget();

  setTimeout(() => {
    fetchSurahList().then(() => {
      const syncBanner = document.getElementById("home-sync-banner");
      if (syncBanner) syncBanner.classList.add("hidden");
    });
  }, 100);
});

// PR 1: DROPDOWN QARI HANDLER
function onQoriChange(qoriKey) {
  if (!qoriKey) return;
  selectedQoriKey = qoriKey;
  localStorage.setItem("selected_qori_key", qoriKey);

  const activeSurahNum = (currentSurahData && currentSurahData.number) ? currentSurahData.number : 1;
  fetchSurahDetail(activeSurahNum);
}

// PR 2: SELEKTOR SURAH PER JUZ HANDLER
function onJuzChange(juzNumber) {
  if (!juzNumber) return;
  openJuzSurahSelector(parseInt(juzNumber));
}

function openJuzSurahSelector(juzNum) {
  const modal = document.getElementById("juz-surah-selector-modal");
  const titleEl = document.getElementById("juz-selector-title");
  const listEl = document.getElementById("juz-surah-selector-list");

  if (!modal || !listEl) return;
  if (titleEl) titleEl.innerText = `📖 Pilih Surah dalam Juz ${juzNum}`;

  const surahList = JUZ_SURAH_MAP[juzNum] || [];

  let html = "";
  if (surahList.length > 0) {
    surahList.forEach((s) => {
      const sId = typeof s === 'object' ? s.id : s;
      const sName = typeof s === 'object' ? s.name : s;
      html += `
        <button onclick="selectSurahFromJuzModal(${sId})" 
          class="w-full text-left bg-stone-50 hover:bg-amber-100 border border-stone-200 p-2.5 rounded-xl transition flex justify-between items-center group">
          <span class="text-xs font-semibold text-stone-700 group-hover:text-amber-900">${sName}</span>
          <span class="text-xs text-amber-700 font-bold opacity-0 group-hover:opacity-100 transition">Baca ➔</span>
        </button>
      `;
    });
  } else {
    html = `<p class="text-xs text-stone-500 text-center py-4">Juz ${juzNum} siap dibaca.</p>`;
  }

  listEl.innerHTML = html;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeJuzSurahSelector() {
  const modal = document.getElementById("juz-surah-selector-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function selectSurahFromJuzModal(surahId) {
  closeJuzSurahSelector();
  const select = document.getElementById("surah-select");
  if (select) select.value = surahId;
  fetchSurahDetail(surahId);
}

// PR 3: NAVIGASI SURAH & MINI PLAYER JUMP TO
function getActiveSurahNumber() {
  if (currentSurahData && currentSurahData.number) return currentSurahData.number;
  const selectEl = document.getElementById("surah-select");
  if (selectEl && selectEl.value) return parseInt(selectEl.value);
  return 1;
}

function playNextSurah() {
  const current = getActiveSurahNumber();
  if (current < 114) {
    const nextSurah = current + 1;
    const select = document.getElementById("surah-select");
    if (select) select.value = nextSurah;
    fetchSurahDetail(nextSurah);
  } else {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert({ title: "Al-Qur'an", message: "Ini adalah surah terakhir (An-Nas)." });
    }
  }
}

function playPrevSurah() {
  const current = getActiveSurahNumber();
  if (current > 1) {
    const prevSurah = current - 1;
    const select = document.getElementById("surah-select");
    if (select) select.value = prevSurah;
    fetchSurahDetail(prevSurah);
  } else {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert({ title: "Al-Qur'an", message: "Ini adalah surah pertama (Al-Fatihah)." });
    }
  }
}

function togglePlayPauseAudio() {
  const btn = document.getElementById("btn-player-play-pause");
  const statusEl = document.getElementById("player-status-text");

  if (isPlaying) {
    audioObj.pause();
    isPlaying = false;
    if (btn) btn.innerHTML = "▶️";
    if (statusEl) statusEl.innerText = "Audio Jeda (Pause)";
  } else {
    playSpecificAyat(currentAyatIndex);
    if (btn) btn.innerHTML = "⏸️";
    if (statusEl) statusEl.innerText = "Memutar Audio...";
  }
}

function openJumpToModal() {
  const modal = document.getElementById("jump-to-modal");
  const selectEl = document.getElementById("jump-surah-select");

  if (selectEl && selectEl.children.length <= 1) {
    let optionsHtml = "";
    if (allSurahs && allSurahs.length > 0) {
      allSurahs.forEach(s => {
        optionsHtml += `<option value="${s.nomor}">${s.nomor}. ${s.namaLatin}</option>`;
      });
    } else {
      for (let i = 1; i <= 114; i++) {
        optionsHtml += `<option value="${i}">Surah ke-${i}</option>`;
      }
    }
    selectEl.innerHTML = optionsHtml;
  }

  if (selectEl) selectEl.value = getActiveSurahNumber();
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeJumpToModal() {
  const modal = document.getElementById("jump-to-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function executeJumpTo() {
  const surahSelect = document.getElementById("jump-surah-select");
  const ayatInput = document.getElementById("jump-ayat-input");

  const targetSurah = surahSelect ? parseInt(surahSelect.value) : 1;
  const targetAyat = ayatInput && ayatInput.value ? parseInt(ayatInput.value) : null;

  closeJumpToModal();

  const select = document.getElementById("surah-select");
  if (select) select.value = targetSurah;

  fetchSurahDetail(targetSurah).then(() => {
    if (targetAyat && targetAyat > 0) {
      setTimeout(() => {
        const ayatEl = document.getElementById(`ayat-card-${targetAyat - 1}`);
        if (ayatEl) {
          ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          ayatEl.classList.add('bg-amber-200/80', 'transition-all');
          setTimeout(() => ayatEl.classList.remove('bg-amber-200/80'), 2000);
        }
      }, 600);
    }
  });
}

// FETCH SURAH DETAIL (EQURAN.ID + QURAN.COM V4 + GADING + CACHE OFFLINE)
async function fetchSurahDetail(surahNumber) {
  if (typeof showLoading === "function") {
    try { showLoading(true); } catch (e) {}
  }

  // --- SAFE FALLBACK VARIABEL GLOBAL ---
  if (typeof currentSurahData === "undefined") window.currentSurahData = null;
  if (typeof selectedQoriKey === "undefined") window.selectedQoriKey = "05";
  if (typeof audioObj === "undefined") window.audioObj = null;
  if (typeof isPlaying === "undefined") window.isPlaying = false;
  if (typeof currentAyatIndex === "undefined") window.currentAyatIndex = 0;

  const cacheKey = `surah_detail_cache_v3_${surahNumber}`;
  let basicData = null;
  let versesWbw = [];

  // Tarik data Per Kata, Tajwid & Transliterasi dari Quran.com v4 lebih dulu/paralel
  // karena endpoint api.quran.com sangat stabil dan bisa dipakai sekaligus sebagai fallback utama!
  const fetchQuranComData = async () => {
    const [resChapter, resVerses] = await Promise.all([
      fetch(`https://api.quran.com/api/v4/chapters/${surahNumber}?language=id`),
      fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=id&words=true&translations=33&audio=7&word_fields=text_uthmani,text_uthmani_tajweed,translation,transliteration&per_page=300`
      )
    ]);

    if (!resChapter.ok || !resVerses.ok) {
      throw new Error("Quran.com v4 tidak merespons");
    }

    const chapterJson = await resChapter.json();
    const versesJson = await resVerses.json();
    return {
      chapter: chapterJson.chapter,
      verses: versesJson.verses || []
    };
  };

  let quranComPayload = null;
  try {
    quranComPayload = await fetchQuranComData();
    versesWbw = quranComPayload.verses;
  } catch (eQc) {
    console.warn("Gagal mengambil detail WBW Quran.com:", eQc);
  }

  try {
    // 1. Coba Server Utama: eQuran.id v2
    try {
      const resBasic = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
      if (resBasic.ok) {
        const jsonBasic = await resBasic.json();
        if (jsonBasic && jsonBasic.data && Array.isArray(jsonBasic.data.ayat)) {
          basicData = jsonBasic.data;
        }
      }
    } catch (ePrimary) {
      console.warn("eQuran.id gagal, beralih ke Quran.com v4:", ePrimary);
    }

    // 2. Fallback Server 2: Bangun langsung dari Quran.com v4 (Sudah membawa Arab, Latin, Terjemahan Kemenag #33, & Audio!)
    if (!basicData && quranComPayload && quranComPayload.chapter && quranComPayload.verses.length > 0) {
      const ch = quranComPayload.chapter;
      basicData = {
        nomor: ch.id,
        nama: ch.name_arabic,
        namaLatin: ch.name_simple,
        arti: ch.translated_name ? ch.translated_name.name : "",
        jumlahAyat: ch.verses_count,
        tempatTurun: ch.revelation_place === "makkah" ? "Mekah" : "Madinah",
        ayat: quranComPayload.verses.map((v, idx) => {
          const ayatNum = v.verse_number || idx + 1;
          const arabFull = v.words
            ? v.words.filter((w) => w.char_type_name === "word").map((w) => w.text_uthmani).join(" ")
            : "";
          const latinFull = v.words
            ? v.words
                .filter((w) => w.char_type_name === "word" && w.transliteration && w.transliteration.text)
                .map((w) => w.transliteration.text)
                .join(" ")
            : "";
          const indoText =
            v.translations && v.translations[0]
              ? v.translations[0].text.replace(/<[^>]*>/g, "")
              : "";

          let audioUrl = "";
          if (v.audio && v.audio.url) {
            audioUrl = v.audio.url.startsWith("http")
              ? v.audio.url
              : `https://verses.quran.com/${v.audio.url}`;
          }

          return {
            nomorAyat: ayatNum,
            teksArab: arabFull,
            teksLatin: latinFull,
            teksIndonesia: indoText,
            audio: {
              "05": audioUrl,
              "01": audioUrl
            }
          };
        })
      };
    }

    // 3. Fallback Server 3: Quran Gading API
    if (!basicData) {
      try {
        const resAlt = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
        if (resAlt.ok) {
          const jsonAlt = await resAlt.json();
          const d = jsonAlt.data;
          if (d && Array.isArray(d.verses)) {
            basicData = {
              nomor: d.number,
              nama: d.name.short,
              namaLatin: d.name.transliteration.id,
              arti: d.name.translation.id,
              jumlahAyat: d.numberOfVerses,
              tempatTurun: d.revelation.id,
              ayat: d.verses.map((v) => ({
                nomorAyat: v.number.inSurah,
                teksArab: v.text.arab,
                teksLatin: v.text.transliteration.en || "",
                teksIndonesia: v.translation.id,
                audio: {
                  "05": v.audio.primary,
                  "01": v.audio.secondary && v.audio.secondary[0] ? v.audio.secondary[0] : v.audio.primary
                }
              }))
            };
          }
        }
      } catch (eAlt) {
        console.warn("Server Gading gagal, memeriksa cache lokal:", eAlt);
      }
    }

    // 4. Fallback Cache Lokal (Offline Mode)
    if (!basicData) {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        basicData = JSON.parse(cachedRaw);
      }
    } else {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(basicData));
      } catch (eQuota) {}
    }

    if (!basicData) {
      throw new Error("Semua sumber data Al-Qur'an (eQuran, Quran.com, Gading) tidak dapat dijangkau.");
    }

    currentSurahData = {
      number: basicData.nomor,
      nama: basicData.nama,
      namaLatin: basicData.namaLatin,
      arti: basicData.arti,
      jumlahAyat: basicData.jumlahAyat,
      tempatTurun: basicData.tempatTurun,
      ayat: basicData.ayat.map((a, idx) => {
        const wbwObj = versesWbw[idx];
        const wbwWords = wbwObj ? wbwObj.words : [];
        const absoluteAyatNumber = wbwObj ? wbwObj.id : a.nomorAyat;

        let primaryAudio = "";
        if (a.audio) {
          const qKey = typeof selectedQoriKey !== "undefined" ? selectedQoriKey : "05";
          primaryAudio = a.audio[qKey] || a.audio["05"] || a.audio["01"] || Object.values(a.audio)[0] || "";
        }

        let finalWords = [];
        if (wbwWords && wbwWords.length > 0) {
          finalWords = wbwWords
            .filter((w) => w.char_type_name !== "end")
            .map((w) => ({
              ar: w.text_uthmani || w.text || "",
              arTajweed: w.text_uthmani_tajweed || w.text_uthmani || w.text || "",
              tr: w.translation ? w.translation.text : ""
            }));
        } else {
          const splitted = (a.teksArab || "").split(" ");
          finalWords = splitted.map((w) => ({
            ar: w,
            arTajweed: w,
            tr: ""
          }));
        }

        // Ambil transliterasi Latin dari eQuran.id atau rakit dari Quran.com jika kosong
        const quranComLatin =
          wbwWords && wbwWords.length > 0
            ? wbwWords
                .filter((w) => w.char_type_name === "word" && w.transliteration && w.transliteration.text)
                .map((w) => w.transliteration.text)
                .join(" ")
            : "";

        return {
          nomorAyat: a.nomorAyat,
          absoluteAyatNumber: absoluteAyatNumber,
          teksArab: a.teksArab,
          teksLatin: (a.teksLatin && a.teksLatin.trim()) || quranComLatin,
          teksIndonesia: a.teksIndonesia,
          defaultAudio: primaryAudio,
          words: finalWords
        };
      })
    };

    // Hentikan audio sebelumnya jika sedang diputar
    try {
      if (typeof audioObj !== "undefined" && audioObj && typeof audioObj.pause === "function") {
        audioObj.pause();
      }
    } catch (eAudio) {}

    isPlaying = false;
    currentAyatIndex = 0;

    // Update Elemen Tampilan UI
    const sAr = document.getElementById("surah-arabic-name");
    const sLt = document.getElementById("surah-latin-name");
    const sInf = document.getElementById("surah-info-badge");
    const pTitle = document.getElementById("player-surah-title");

    if (sAr) sAr.innerText = currentSurahData.nama;
    if (sLt) sLt.innerText = `${currentSurahData.namaLatin} • ${currentSurahData.arti}`;
    if (sInf) sInf.innerText = `${currentSurahData.jumlahAyat} Ayat • ${currentSurahData.tempatTurun}`;
    if (pTitle) pTitle.innerText = `${currentSurahData.namaLatin}`;

    // Sembunyikan banner background sync jika masih terbuka
    const bgBanner = document.getElementById("bg-sync-banner");
    if (bgBanner) bgBanner.classList.add("hidden");

    if (typeof renderAyats === "function") {
      renderAyats();
    }

    if (typeof updateQuickSurahButtonUI === "function") {
      updateQuickSurahButtonUI(currentSurahData.number);
    }
  } catch (err) {
    console.error("Fetch detail error:", err);
    const container = document.getElementById("ayats-container");
    if (container) {
      container.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-xs space-y-2">
          <p class="font-bold">⚠️ Gagal memuat surah (${err.message})</p>
          <button onclick="fetchSurahDetail(${surahNumber})" class="bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold">🔄 Coba Muat Ulang</button>
        </div>
      `;
    }
  } finally {
    if (typeof showLoading === "function") {
      try { showLoading(false); } catch (e) {}
    }
  }
}



// UPDATE WIDGET & RENDERER HELPER
function updateLastReadUI() {
  lastRead = JSON.parse(localStorage.getItem("quran_last_read") || "null");
  const titleEl = document.getElementById("home-last-read-title");
  const subEl = document.getElementById("home-last-read-sub");

  if (lastRead) {
    if (titleEl) titleEl.innerText = `Surah ${lastRead.surahName}`;
    if (subEl) subEl.innerText = `Ayat ${lastRead.ayatNumber}`;
  } else {
    if (titleEl) titleEl.innerText = "Belum Ada";
    if (subEl) subEl.innerText = "Klik untuk mulai baca";
  }
  updateHomeWidgetData();
}

function goToLastRead() {
  const lastReadData = JSON.parse(localStorage.getItem("quran_last_read") || "null");
  
  if (!lastReadData) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert({
        icon: "📖",
        title: "Terakhir Dibaca",
        message: "Belum ada penanda ayat. Silakan buka Al-Qur'an dan klik tombol '📖 Tandai' pada ayat yang dibaca.",
        confirmText: "Mengerti"
      });
    } else {
      alert("Belum ada penanda ayat. Silakan tandai ayat saat membaca Al-Qur'an.");
    }
    return;
  }

  // 1. Pindah otomatis ke Tab Al-Qur'an
  switchTab('quran');

  // 2. Set nilai dropdown Surah
  const select = document.getElementById("surah-select");
  if (select) select.value = lastReadData.surahNumber;

  // 3. Fetch detail surah lalu scroll ke ayat yang ditandai
  fetchSurahDetail(lastReadData.surahNumber).then(() => {
    setTimeout(() => {
      const ayatEl = document.getElementById(`ayat-card-${lastReadData.ayatNumber - 1}`);
      if (ayatEl) {
        ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Beri efek sorot emas sementara pada ayat target
        ayatEl.classList.add('bg-amber-200/80', 'ring-2', 'ring-amber-500', 'transition-all');
        setTimeout(() => {
          ayatEl.classList.remove('bg-amber-200/80');
        }, 2500);
      }
    }, 600);
  });
}

function updateHomeWidgetData() {
  const lastReadTitle = document.getElementById("home-last-read-title");
  const lastReadSub = document.getElementById("home-last-read-sub");
  
  if (lastRead && lastReadTitle && lastReadSub) {
    lastReadTitle.innerText = `Surah ${lastRead.surahName}`;
    lastReadSub.innerText = `Ayat ${lastRead.ayatNumber}`;
  }

  const bookmarkCountEl = document.getElementById("home-bookmark-count");
  const bookmarkPreviewEl = document.getElementById("home-bookmark-preview");
  if (bookmarkCountEl) bookmarkCountEl.innerText = `${bookmarks.length} Items`;
  if (bookmarkPreviewEl && bookmarks.length > 0) {
    const lastBm = bookmarks[bookmarks.length - 1];
    bookmarkPreviewEl.innerText = `Terbaru: ${lastBm.surahName} (Ayat ${lastBm.ayatNumber})`;
  }
}

function switchTab(tabName) {
  const tabs = ['home', 'quran', 'sholat', 'doa', 'kisah'];
  tabs.forEach(t => {
    const view = document.getElementById(`tab-${t}-view`);
    const btn = document.getElementById(`nav-btn-${t}`);
    if (view && btn) {
      if (t === tabName) {
        view.classList.remove('hidden');
        btn.classList.add('text-amber-400', 'font-bold');
        btn.classList.remove('text-stone-400');
      } else {
        view.classList.add('hidden');
        btn.classList.remove('text-amber-400', 'font-bold');
        btn.classList.add('text-stone-400');
      }
    }
  });

  const titleEl = document.getElementById("header-title");
  const subtitleEl = document.getElementById("header-subtitle");
  const searchBtn = document.getElementById("btn-header-search");
  const bookmarkBtn = document.getElementById("btn-header-bookmark");

  // PASTI MENAMPILKAN TOMBOL BOOKMARK AGAR BISA DIKLIK KAPAN SAJA
  if (bookmarkBtn) bookmarkBtn.classList.remove('hidden');

  if (tabName === 'home') {
    if (titleEl) titleEl.innerText = "Islamic App";
    if (subtitleEl) subtitleEl.innerText = "Dashboard Utama • v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
  } else if (tabName === 'quran') {
    if (titleEl) titleEl.innerText = "Al-Qur'an Digital";
    if (subtitleEl) subtitleEl.innerText = "Islamic App v1.0.0";
    if (searchBtn) searchBtn.classList.remove('hidden');
  } else {
    if (titleEl) titleEl.innerText = "Islamic App";
    if (subtitleEl) subtitleEl.innerText = "v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
  }
}

function updateAzanUIState() {
  const btnSholat = document.getElementById("toggle-azan-btn");
  const btnHome = document.getElementById("btn-toggle-azan-audio-home");
  
  const text = isAzanAudioEnabled ? "🔔 AKTIF" : "❌ NONAKTIF";
  const cls = isAzanAudioEnabled 
    ? "px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white transition flex items-center gap-1 shadow animate-pulse"
    : "px-3 py-1 rounded-full text-xs font-bold bg-stone-700 text-stone-300 transition flex items-center gap-1";

  if (btnSholat) { btnSholat.innerText = text; btnSholat.className = cls; }
  if (btnHome) { btnHome.innerText = text; btnHome.className = cls; }
}

function toggleAzanSetting() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  isAzanAudioEnabled = !isAzanAudioEnabled;
  localStorage.setItem("quran_azan_enabled", isAzanAudioEnabled);
  updateAzanUIState();
}

function populateJuzSelect() {
  const juzSelect = document.getElementById("juz-select");
  if (!juzSelect) return;
  let html = `<option value="">Pilih Juz</option>`;
  for (let i = 1; i <= 30; i++) {
    html += `<option value="${i}">Juz ${i}</option>`;
  }
  juzSelect.innerHTML = html;
}

function onSurahChange(surahNumber) {
  if (surahNumber) fetchSurahDetail(surahNumber);
}

function onModeChange(modeValue) {
  saveAndRender();
}

function loadLocalStorageData() {
  currentArabicFontSize = parseInt(localStorage.getItem("quran_font_size")) || 26;
  isKaraokeEnabled = localStorage.getItem("quran_karaoke") !== "false";
  selectedQoriKey = localStorage.getItem("selected_qori_key") || "05";
  
  const qoriEl = document.getElementById("qori-select");
  if (qoriEl) qoriEl.value = selectedQoriKey;

  isAzanAudioEnabled = localStorage.getItem("quran_azan_enabled") === "true";
  updateAzanUIState();

  bookmarks = JSON.parse(localStorage.getItem("quran_bookmarks")) || [];
  updateBookmarkUI();
  updateLastReadUI();
}

function saveSettings() {
  localStorage.setItem("quran_font_size", currentArabicFontSize);
  localStorage.setItem("selected_qori_key", selectedQoriKey);
}

function saveAndRender() {
  saveSettings();
  renderAyats();
}

async function fetchSurahList() {
  const cacheKey = "quran_surah_list_v2";
  let surahList = null;

  // 1. Coba Server Utama: eQuran.id v2
  try {
    const res = await fetch("https://equran.id/api/v2/surat");
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        surahList = json.data;
      }
    }
  } catch (e1) {
    console.warn("eQuran.id daftar surah gagal, beralih ke Quran.com v4:", e1);
  }

  // 2. Fallback Server 2: Quran.com v4 Chapters
  if (!surahList) {
    try {
      const resQc = await fetch("https://api.quran.com/api/v4/chapters?language=id");
      if (resQc.ok) {
        const jsonQc = await resQc.json();
        if (jsonQc && Array.isArray(jsonQc.chapters) && jsonQc.chapters.length > 0) {
          surahList = jsonQc.chapters.map((ch) => ({
            nomor: ch.id,
            nama: ch.name_arabic,
            namaLatin: ch.name_simple,
            jumlahAyat: ch.verses_count,
            tempatTurun: ch.revelation_place === "makkah" ? "Mekah" : "Madinah",
            arti: ch.translated_name ? ch.translated_name.name : ""
          }));
        }
      }
    } catch (e2) {
      console.warn("Quran.com daftar surah gagal, beralih ke Quran Gading:", e2);
    }
  }

  // 3. Fallback Server 3: Quran Gading API
  if (!surahList) {
    try {
      const resGading = await fetch("https://api.quran.gading.dev/surah");
      if (resGading.ok) {
        const jsonGading = await resGading.json();
        if (jsonGading && Array.isArray(jsonGading.data) && jsonGading.data.length > 0) {
          surahList = jsonGading.data.map((s) => ({
            nomor: s.number,
            nama: s.name.short,
            namaLatin: s.name.transliteration.id,
            jumlahAyat: s.numberOfVerses,
            tempatTurun: s.revelation.id,
            arti: s.name.translation.id
          }));
        }
      }
    } catch (e3) {
      console.warn("Quran Gading daftar surah gagal, memeriksa cache lokal:", e3);
    }
  }

  // 4. Fallback Cache Lokal (Offline Mode)
  if (!surahList) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) surahList = JSON.parse(cached);
    } catch (eCache) {}
  } else {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(surahList));
    } catch (eSave) {}
  }

  if (!surahList || surahList.length === 0) {
    console.error("Semua sumber daftar Surah gagal dimuat.");
    const select = document.getElementById("surah-select");
    if (select) {
      select.innerHTML = `<option value="1">1. Al-Fatihah (Offline)</option>`;
    }
    return fetchSurahDetail(1);
  }

  allSurahs = surahList;

  const select = document.getElementById("surah-select");
  if (select) {
    select.innerHTML = allSurahs
      .map(
        (s) => `<option value="${s.nomor}">${s.nomor}. ${s.namaLatin}</option>`
      )
      .join("");

    let initialSurah = 1;
    try {
      const savedLast = JSON.parse(localStorage.getItem("quran_last_read") || "null");
      if (savedLast && savedLast.surahNumber) {
        initialSurah = savedLast.surahNumber;
      } else if (typeof lastRead !== "undefined" && lastRead && lastRead.surahNumber) {
        initialSurah = lastRead.surahNumber;
      }
    } catch (e) {}

    select.value = initialSurah;
    return fetchSurahDetail(initialSurah);
  }
}


// Cache penyimpanan transliterasi bacaan Latin per surah
window.quranLatinTranslitCache = window.quranLatinTranslitCache || {};

async function ensureSurahLatinTransliteration(surahNumber) {
  if (!surahNumber) return;
  const cacheKey = `quran_latin_read_${surahNumber}`;

  // 1. Cek memori atau localStorage terlebih dahulu
  if (window.quranLatinTranslitCache[surahNumber]) return;
  const saved = localStorage.getItem(cacheKey);
  if (saved) {
    try {
      window.quranLatinTranslitCache[surahNumber] = JSON.parse(saved);
      renderAyats();
      return;
    } catch (e) {}
  }

  // 2. Ambil lafaz bacaan Latin (teksLatin) dari API eQuran.id v2
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    const json = await res.json();
    if (json && json.data && Array.isArray(json.data.ayat)) {
      const mapLatin = {};
      json.data.ayat.forEach((item) => {
        mapLatin[item.nomorAyat] = item.teksLatin || "";
      });
      window.quranLatinTranslitCache[surahNumber] = mapLatin;
      localStorage.setItem(cacheKey, JSON.stringify(mapLatin));
      renderAyats();
    }
  } catch (err) {
    console.warn("Gagal memuat bacaan Latin:", err);
  }
}

function renderAyats() {
  if (!currentSurahData) return;

  const modeEl = document.getElementById("mode-select");
  const container = document.getElementById("ayats-container");
  const legend = document.getElementById("tajweed-legend");
  const isShowLatin = document.getElementById("toggle-latin") ? document.getElementById("toggle-latin").checked : true;

  if (!modeEl || !container) return;
  const mode = modeEl.value;

  if (mode === "tajweed") {
    if (legend) legend.classList.remove("hidden");
  } else {
    if (legend) legend.classList.add("hidden");
  }

  // Cek apakah data bacaan Latin (teksLatin) sudah tersedia untuk surah ini
  const surahNum = currentSurahData.number || currentSurahData.nomor;
  const cachedSurahLatin = window.quranLatinTranslitCache[surahNum] || {};
  const hasAnyLatin = currentSurahData.ayat.some(
    (a) => (a.teksLatin && a.teksLatin.trim() !== "") || cachedSurahLatin[a.nomorAyat]
  );

  // Jika checkbox Latin aktif tapi teksLatin belum ada di objek surah, tarik otomatis sekali
  if (isShowLatin && !hasAnyLatin && surahNum) {
    ensureSurahLatinTransliteration(surahNum);
  }

  container.innerHTML = "";

  currentSurahData.ayat.forEach((ayat, idx) => {
    const card = document.createElement("div");
    card.id = `ayat-card-${idx}`;
    const isBookmarked = isAyatBookmarked(surahNum, ayat.nomorAyat);

    card.className = `bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm transition-all duration-300 ${
      isSideBySide ? 'grid grid-cols-2 gap-3 items-start' : 'flex flex-col space-y-3'
    }`;

    // HANYA ambil lafaz bacaan Latin (teksLatin), JANGAN pakai w.tr (arti per kata)
    const latinBacaanText =
      (ayat.teksLatin && ayat.teksLatin.trim()) ||
      cachedSurahLatin[ayat.nomorAyat] ||
      (isShowLatin ? "Memuat bacaan Latin..." : "");

    const latinBlockHTML =
      isShowLatin && latinBacaanText
        ? `<p dir="ltr" class="text-left text-xs italic text-amber-900 font-medium leading-relaxed mt-2 pt-1.5 border-t border-dashed border-stone-200">${latinBacaanText}</p>`
        : "";

    let arabicHTML = "";

    if (mode === "wbw" || mode === "word-by-word") {
      arabicHTML = `
        <div class="py-2 border-b border-stone-100 ${isSideBySide ? 'border-b-0' : ''}">
          <div dir="rtl" class="flex flex-wrap gap-x-3 gap-y-4">
            ${ayat.words.map((w, wordIdx) => `
              <div id="word-${idx}-${wordIdx}" class="flex flex-col items-center px-1.5 py-0.5 transition-all duration-150 rounded">
                <span class="font-quran text-stone-900 leading-normal" style="font-size: ${currentArabicFontSize}px;">${w.ar}</span>
                ${w.tr ? `<span class="text-[10px] text-stone-500 font-sans text-center leading-tight mt-0.5" dir="ltr">${w.tr}</span>` : ''}
              </div>
            `).join('')}
            <span class="font-quran text-amber-800 self-center text-base font-bold mr-auto">﴿${ayat.nomorAyat}﴾</span>
          </div>
          ${latinBlockHTML}
        </div>
      `;
    } else if (mode === "tajweed") {
      arabicHTML = `
        <div class="py-2 border-b border-stone-100 ${isSideBySide ? 'border-b-0' : ''}">
          <div dir="rtl" class="text-right font-quran leading-loose" style="font-size: ${currentArabicFontSize}px;">
            ${ayat.words.map((w, wordIdx) => {
              let tajweedRaw = w.arTajweed || w.ar;
              const cleanAr = (w.ar || "").replace(/'/g, "\\'").replace(/\n/g, "");
              const cleanTr = (w.tr || "").replace(/'/g, "\\'").replace(/\n/g, "");

              let processedText = tajweedRaw.replace(/<rule\s+class=["']?([^"'>]+)["']?>/gi, '<span class="$1">')
                                            .replace(/<\/rule>/gi, '</span>');

              processedText = processedText.replace(/class=["']?([^"'>]+)["']?/gi, (match, p1) => {
                let cls = p1.toLowerCase();
                if (cls.includes('ikhfa') || cls === 'n' || cls === 'ng') return 'class="n"';
                if (cls.includes('ghunnah') || cls === 'g') return 'class="g"';
                if (cls.includes('idgham') || cls === 'i') return 'class="i"';
                if (cls.includes('iqlab') || cls === 'b') return 'class="b"';
                if (cls.includes('qal') || cls === 'q') return 'class="q"';
                if (cls.includes('madd') || cls === 'o' || cls === 'm' || cls === 'j' || cls === 'a') return 'class="o"';
                return match;
              });

              return `<span id="word-${idx}-${wordIdx}" onclick="showTajweedModalFromElement(this, '${cleanAr}', '${cleanTr}')" class="cursor-pointer hover:bg-amber-100/60 px-0.5 rounded transition inline">${processedText}</span>`;
            }).join(' ')}
            <span class="text-amber-800 text-base font-sans font-bold inline-block mr-1">﴿${ayat.nomorAyat}﴾</span>
          </div>
          ${latinBlockHTML}
        </div>
      `;
    } else {
      arabicHTML = `
        <div class="py-2 border-b border-stone-100 ${isSideBySide ? 'border-b-0' : ''}">
          <div dir="rtl" class="text-right font-quran text-stone-900 leading-relaxed" style="font-size: ${currentArabicFontSize}px;">
            ${ayat.teksArab} <span class="text-amber-800 text-base font-sans font-bold inline-block mr-1">﴿${ayat.nomorAyat}﴾</span>
          </div>
          ${latinBlockHTML}
        </div>
      `;
    }

    let translationText = ayat.teksIndonesia;
    if (searchQuery.trim() !== "") {
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      translationText = translationText.replace(regex, `<mark class="bg-amber-300 px-0.5 rounded font-bold text-amber-950">$1</mark>`);
    }

    const translationHTML = `
      <div class="flex flex-col justify-center text-stone-700 space-y-1 ${isSideBySide ? 'border-l pl-3 border-stone-200 h-full' : 'pt-1'}">
        <div class="flex justify-between items-center">
          <span class="font-bold text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Ayat ${ayat.nomorAyat}</span>
          <div class="flex items-center space-x-1">
            <button onclick="saveLastRead(${surahNum}, '${currentSurahData.namaLatin}', ${ayat.nomorAyat})" class="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">📖 Tandai</button>
            <button onclick="toggleBookmark(${surahNum}, '${currentSurahData.namaLatin}', ${ayat.nomorAyat})" class="text-[10px] ${isBookmarked ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-amber-100'} px-2 py-0.5 rounded border border-stone-300">📌 ${isBookmarked ? 'Tersimpan' : 'Bookmark'}</button>
            <button onclick="playSpecificAyat(${idx})" class="text-[10px] bg-amber-700 text-white hover:bg-amber-800 px-2 py-0.5 rounded font-bold shadow-sm">🔊 Putar</button>
          </div>
        </div>
        <p class="text-xs leading-relaxed text-stone-600 pt-1">${translationText}</p>
      </div>
    `;

    card.innerHTML = arabicHTML + translationHTML;
    container.appendChild(card);
  });

  updateAudioUI();
}


function playSpecificAyat(index) {
  if (!currentSurahData) return;
  currentAyatIndex = index;
  const ayat = currentSurahData.ayat[currentAyatIndex];

  clearWordHighlights();

  if (ayat.defaultAudio) {
    audioObj.src = ayat.defaultAudio;
  } else {
    audioObj.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayat.absoluteAyatNumber}.mp3`;
  }

  audioObj.play().then(() => {
    isPlaying = true;
    updateAudioUI();
    highlightActiveAyat();
  }).catch(err => {
    isPlaying = false;
    updateAudioUI();
  });
}

audioObj.ontimeupdate = () => {
  if (!isKaraokeEnabled || !currentSurahData || !audioObj.duration) return;

  const ayat = currentSurahData.ayat[currentAyatIndex];
  if (!ayat || !ayat.words || !ayat.words.length) return;

  const currentTime = audioObj.currentTime;
  const totalDuration = audioObj.duration;

  const weights = calculateWordWeights(ayat.words);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let accumulatedTime = 0;
  let activeWordIndex = -1;

  for (let i = 0; i < ayat.words.length; i++) {
    const wordDuration = (weights[i] / totalWeight) * totalDuration;
    const startTime = accumulatedTime;
    const endTime = accumulatedTime + wordDuration;

    if (currentTime >= startTime && currentTime <= endTime) {
      activeWordIndex = i;
      break;
    }
    accumulatedTime = endTime;
  }

  ayat.words.forEach((_, wIdx) => {
    const wordEl = document.getElementById(`word-${currentAyatIndex}-${wIdx}`);
    if (wordEl) {
      if (wIdx === activeWordIndex) {
        wordEl.classList.add("karaoke-active");
      } else {
        wordEl.classList.remove("karaoke-active");
      }
    }
  });
};

function calculateWordWeights(words) {
  return words.map((w, idx) => {
    const cleanText = w.ar.replace(/[\u064B-\u065F\u0670]/g, "");
    let weight = Math.max(cleanText.length, 1.5);
    if (w.ar.includes("ۤ") || w.ar.includes("~") || w.ar.includes("آ")) weight += 7;
    if (idx === words.length - 1) weight += 4.5;
    return weight;
  });
}

function clearWordHighlights() {
  document.querySelectorAll(".karaoke-active").forEach(el => el.classList.remove("karaoke-active"));
}

audioObj.onended = () => {
  clearWordHighlights();
  if (currentSurahData && currentAyatIndex < currentSurahData.ayat.length - 1) {
    playSpecificAyat(currentAyatIndex + 1);
  } else {
    isPlaying = false;
    updateAudioUI();
  }
};

function updateAudioUI() {
  const pBtn = document.getElementById("btn-player-play-pause");
  const titleEl = document.getElementById("player-surah-title");
  const statusEl = document.getElementById("player-status-text");

  if (pBtn) pBtn.innerText = isPlaying ? "⏸️" : "▶️";

  if (currentSurahData) {
    if (titleEl) titleEl.innerText = `${currentSurahData.namaLatin}`;
    if (statusEl) statusEl.innerText = `Ayat ${currentAyatIndex + 1} • ${isPlaying ? 'Memutar...' : 'Audio Jeda'}`;
  }
}

function highlightActiveAyat() {
  if (!currentSurahData) return;
  currentSurahData.ayat.forEach((_, idx) => {
    const el = document.getElementById(`ayat-card-${idx}`);
    if (el) {
      if (idx === currentAyatIndex) {
        el.classList.add("ring-2", "ring-amber-500", "bg-amber-50/40");
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        el.classList.remove("ring-2", "ring-amber-500", "bg-amber-50/40");
      }
    }
  });
}

function showLoading(state) {
  const banner = document.getElementById("loading-banner");
  if (!banner) return;
  if (state) banner.classList.remove("hidden");
  else banner.classList.add("hidden");
}

function toggleLayoutMode() {
  isSideBySide = !isSideBySide;
  const btn = document.getElementById("btn-layout");
  if (btn) btn.innerText = isSideBySide ? "📜 Stacked" : "📱 Side Layout";
  renderAyats();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Fail:', err));
  }
}

/* ==========================================================================
   REST OF HELPER FUNCTIONS & TAB NAVIGATOR (FIXED FULL)
   ========================================================================== */

// 1. SISTEM PERPINDAHAN TAB NAVIGASI UTAMA (FIXED KLIK)
function switchTab(tabName) {
  const tabs = ['home', 'quran', 'sholat', 'doa', 'kisah'];
  tabs.forEach(t => {
    const view = document.getElementById(`tab-${t}-view`);
    const btn = document.getElementById(`nav-btn-${t}`);
    if (view && btn) {
      if (t === tabName) {
        view.classList.remove('hidden');
        btn.classList.add('text-amber-400', 'font-bold');
        btn.classList.remove('text-stone-400');
      } else {
        view.classList.add('hidden');
        btn.classList.remove('text-amber-400', 'font-bold');
        btn.classList.add('text-stone-400');
      }
    }
  });

  const titleEl = document.getElementById("header-title");
  const subtitleEl = document.getElementById("header-subtitle");
  const searchBtn = document.getElementById("btn-header-search");
  const bookmarkBtn = document.getElementById("btn-header-bookmark");

  if (tabName === 'home') {
    if (titleEl) titleEl.innerText = "Islamic App";
    if (subtitleEl) subtitleEl.innerText = "Dashboard Utama • v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
    if (bookmarkBtn) bookmarkBtn.classList.add('hidden');
  } else if (tabName === 'quran') {
    if (titleEl) titleEl.innerText = "Al-Qur'an Digital";
    if (subtitleEl) subtitleEl.innerText = "Islamic App v1.0.0";
    if (searchBtn) searchBtn.classList.remove('hidden');
    if (bookmarkBtn) bookmarkBtn.classList.remove('hidden');
  } else if (tabName === 'sholat') {
    if (titleEl) titleEl.innerText = "Jadwal Sholat & Puasa";
    if (subtitleEl) subtitleEl.innerText = "Islamic App v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
    if (bookmarkBtn) bookmarkBtn.classList.add('hidden');
  } else if (tabName === 'doa') {
    if (titleEl) titleEl.innerText = "Kumpulan Doa & Hadits";
    if (subtitleEl) subtitleEl.innerText = "Islamic App v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
    if (bookmarkBtn) bookmarkBtn.classList.add('hidden');
  } else if (tabName === 'kisah') {
    if (titleEl) titleEl.innerText = "Kisah 25 Nabi & Rasul";
    if (subtitleEl) subtitleEl.innerText = "Islamic App v1.0.0";
    if (searchBtn) searchBtn.classList.add('hidden');
    if (bookmarkBtn) bookmarkBtn.classList.add('hidden');
  }
}

// 2. PEMUAT DATABASES DOA & HADITS
function renderDoaList() {
  const container = document.getElementById("doa-cards-container");
  const searchEl = document.getElementById("doa-search-input");
  if (!container) return;

  const searchVal = searchEl ? searchEl.value.toLowerCase().trim() : "";

  let filtered = doaDatabase.filter(d => {
    const matchCategory = (currentDoaCategory === 'all') || (d.category === currentDoaCategory);
    const matchSearch = d.title.toLowerCase().includes(searchVal) || 
                        d.translation.toLowerCase().includes(searchVal) || 
                        d.latin.toLowerCase().includes(searchVal);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-stone-400 text-xs italic">Tidak ada doa atau hadits yang cocok.</div>`;
    return;
  }

  container.innerHTML = filtered.map(d => {
    const isFav = favoriteDoaIds.includes(d.id);
    return `
      <div class="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm space-y-2 text-xs transition hover:border-amber-400">
        <div class="flex justify-between items-start border-b border-stone-100 pb-1.5">
          <span class="font-bold text-amber-900 text-xs">${d.title}</span>
          <div class="flex items-center space-x-1">
            <button onclick="toggleFavDoa('${d.id}')" class="text-xs px-1.5 py-0.5 rounded border ${isFav ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-stone-50 border-stone-200 text-stone-400'}" title="Favorit">
              ${isFav ? '⭐' : '☆'}
            </button>
            <button onclick="copyDoaText('${d.id}')" class="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300" title="Salin Teks">
              📋 Salin
            </button>
          </div>
        </div>

        <div class="text-right font-quran text-stone-900 leading-relaxed py-1 text-lg">
          ${d.arabic}
        </div>

        <p class="text-[11px] text-amber-800 italic font-sans">${d.latin}</p>
        <p class="text-xs text-stone-700 leading-relaxed">${d.translation}</p>
        
        <div class="pt-1 text-[10px] text-stone-400 border-t border-stone-50 flex justify-between">
          <span>Sumber: ${d.source}</span>
          <span class="uppercase tracking-wider font-semibold text-amber-700">${d.category}</span>
        </div>
      </div>
    `;
  }).join('');
}

function filterDoaCategory(cat) {
  currentDoaCategory = cat;
  const categories = ['all', 'ramadhan', 'harian', 'hadits'];
  categories.forEach(c => {
    const btn = document.getElementById(`btn-cat-${c}`);
    if (btn) {
      if (c === cat) {
        btn.className = "bg-amber-700 text-white px-3 py-1 rounded-full shrink-0 font-semibold shadow-sm";
      } else {
        btn.className = "bg-stone-200 text-stone-700 hover:bg-amber-100 px-3 py-1 rounded-full shrink-0 font-semibold";
      }
    }
  });
  renderDoaList();
}

// 3. PEMUAT DATABASES KISAH NABI
function renderKisahList() {
  const container = document.getElementById("kisah-grid-container");
  const searchEl = document.getElementById("kisah-search-input");
  if (!container) return;

  const searchVal = searchEl ? searchEl.value.toLowerCase().trim() : "";

  let filtered = kisahnabiDatabase.filter(k => 
    k.name.toLowerCase().includes(searchVal) || 
    k.miracle.toLowerCase().includes(searchVal) || 
    k.summary.toLowerCase().includes(searchVal)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-stone-400 text-xs italic">Kisah Nabi tidak ditemukan.</div>`;
    return;
  }

  container.innerHTML = filtered.map(k => `
    <div onclick="openKisahDetail(${k.id})" class="bg-white p-3 rounded-xl border border-stone-200 shadow-sm hover:border-amber-500 cursor-pointer transition flex justify-between items-center group">
      <div class="space-y-1 max-w-[75%]">
        <div class="flex items-center space-x-1.5">
          <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">#${k.id}</span>
          <h4 class="font-bold text-xs text-stone-800 group-hover:text-amber-800">${k.name}</h4>
        </div>
        <p class="text-[10px] text-stone-500 line-clamp-1">${k.summary}</p>
      </div>
      <div class="text-right">
        <span class="font-quran text-lg text-amber-900 block leading-none">${k.arabic}</span>
        <span class="text-[9px] text-amber-700 font-semibold block mt-1">Baca ➔</span>
      </div>
    </div>
  `).join('');
}

async function syncKisahOnlineHybrid() {
  if (!navigator.onLine) return;
  try {
    const cachedKisah = localStorage.getItem("kisah_online_cache");
    if (!cachedKisah) {
      const res = await fetch("https://islamic-api-zh.vercel.app/api/kisahnabi");
      const json = await res.json();
      if (json && Array.isArray(json)) {
        localStorage.setItem("kisah_online_cache", JSON.stringify(json));
      }
    }
  } catch (err) {
    console.log("Kisah online sync skipped");
  }
}

function openKisahDetail(id) {
  let item = kisahnabiDatabase.find(k => k.id === id);
  if (!item) return;

  selectedKisahItem = item;

  const onlineCache = JSON.parse(localStorage.getItem("kisah_online_cache"));
  if (onlineCache) {
    const foundOnline = onlineCache.find(o => o.name && o.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()));
    if (foundOnline && foundOnline.story) {
      item.story = foundOnline.story;
    }
  }

  const titleEl = document.getElementById("kisah-modal-title");
  const subEl = document.getElementById("kisah-modal-subtitle");
  if (titleEl) titleEl.innerText = `Kisah ${item.name}`;
  if (subEl) subEl.innerText = `Nabi ke-${item.id} • Wilayah: ${item.location}`;

  const contentEl = document.getElementById("kisah-modal-content");
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-center space-y-1">
        <span class="font-quran text-2xl text-amber-900 block">${item.arabic}</span>
        <span class="text-[10px] font-bold text-amber-800 block">Garis Waktu: ${item.era}</span>
      </div>

      <div class="space-y-1 pt-1">
        <h5 class="font-bold text-amber-900 text-xs">✨ Mukjizat Utama:</h5>
        <p class="text-[11px] text-stone-700 bg-stone-100 p-2 rounded border border-stone-200">${item.miracle}</p>
      </div>

      <div class="space-y-1 pt-1">
        <h5 class="font-bold text-stone-900 text-xs">📜 Ringkasan Perjuangan Dakwah:</h5>
        <p class="text-xs text-stone-700 leading-relaxed">${item.story}</p>
      </div>
    `;
  }

  toggleKisahModal();
}

function toggleKisahModal() {
  const modal = document.getElementById("kisah-modal");
  if (modal) {
    modal.classList.toggle("hidden");
    modal.classList.toggle("flex");
  }
}

function copyKisahText() {
  if (!selectedKisahItem) return;
  const text = `📖 Kisah ${selectedKisahItem.name} (${selectedKisahItem.arabic})\n\n✨ Mukjizat: ${selectedKisahItem.miracle}\n\n📜 Ringkasan: ${selectedKisahItem.summary}\n\n(Dibagikan dari Islamic App)`;
  navigator.clipboard.writeText(text).then(() => {
    showCustomAlert({
      type: "alert",
      icon: "📋",
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "Berhasil Disalin",
      message: `Ringkasan Kisah ${selectedKisahItem.name} berhasil disalin!`,
      confirmText: "Mantap"
    });
  });
}

// ============================================================================
// 4. JADWAL SHOLAT RESMI KEMENAG RI (MYQURAN API V2) & ZONA WAKTU KOTA BESAR
// ============================================================================
const KEMENAG_CITIES = {
  Bogor:       { id: "1204", tz: "WIB",  offset: 7, lat: -6.5971, lng: 106.8060 },
  Jakarta:     { id: "1301", tz: "WIB",  offset: 7, lat: -6.2088, lng: 106.8456 },
  Bandung:     { id: "1219", tz: "WIB",  offset: 7, lat: -6.9175, lng: 107.6191 },
  Semarang:    { id: "1433", tz: "WIB",  offset: 7, lat: -6.9667, lng: 110.4167 },
  Yogyakarta:  { id: "1505", tz: "WIB",  offset: 7, lat: -7.7956, lng: 110.3695 },
  Surabaya:    { id: "1638", tz: "WIB",  offset: 7, lat: -7.2575, lng: 112.7521 },
  Medan:       { id: "0228", tz: "WIB",  offset: 7, lat:  3.5952, lng:  98.6722 },
  Palembang:   { id: "0816", tz: "WIB",  offset: 7, lat: -2.9761, lng: 104.7754 },
  Denpasar:    { id: "1709", tz: "WITA", offset: 8, lat: -8.6705, lng: 115.2126 },
  Makassar:    { id: "2622", tz: "WITA", offset: 8, lat: -5.1477, lng: 119.4327 },
  Banjarmasin: { id: "2213", tz: "WITA", offset: 8, lat: -3.3194, lng: 114.5908 },
  Manado:      { id: "2515", tz: "WITA", offset: 8, lat:  1.4748, lng: 124.8421 },
  Ambon:       { id: "3101", tz: "WIT",  offset: 9, lat: -3.6954, lng: 128.1814 },
  Jayapura:    { id: "3329", tz: "WIT",  offset: 9, lat: -2.5916, lng: 140.6690 }
};

let currentTimezoneLabel = "WIB";
let currentCityOffset = 7;

// Helper mendapatkan waktu saat ini sesuai zona waktu kota yang dipilih (WIB/WITA/WIT)
function getCityNowDate(offsetHours) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + offsetHours * 3600000);
}

async function fetchPrayerTimes(cityName) {
  const cityMeta = KEMENAG_CITIES[cityName] || KEMENAG_CITIES["Bogor"];
  currentCity = cityName in KEMENAG_CITIES ? cityName : "Bogor";
  currentTimezoneLabel = cityMeta.tz;
  currentCityOffset = cityMeta.offset;

  const hCity = document.getElementById("current-city-name");
  const imCity = document.getElementById("imsakiyah-city-title");
  const imSub = document.getElementById("imsakiyah-modal-subtitle");
  const tzLabel = document.getElementById("sholat-timezone-label");

  if (hCity) hCity.innerText = `🕌 ${currentCity} (${currentTimezoneLabel})`;
  if (imCity) imCity.innerText = `Wilayah ${currentCity} & Sekitarnya (${currentTimezoneLabel})`;
  if (imSub) imSub.innerText = `Wilayah ${currentCity} • Kemenag RI (${currentTimezoneLabel})`;
  if (tzLabel) tzLabel.innerText = currentTimezoneLabel;

  try {
    const cityNow = getCityNowDate(cityMeta.offset);
    const year = cityNow.getFullYear();
    const month = String(cityNow.getMonth() + 1).padStart(2, "0");
    const dayNum = cityNow.getDate();

    // Ambil jadwal resmi Bimas Islam Kemenag RI 1 bulan penuh
    const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityMeta.id}/${year}/${month}`);
    const json = await res.json();

    if (!json || !json.status || !json.data || !Array.isArray(json.data.jadwal)) {
      throw new Error("Format respon API Kemenag tidak valid");
    }

    const jadwalBulan = json.data.jadwal;
    monthlyPrayerData = jadwalBulan;

    // Cari jadwal tanggal hari ini berdasarkan zona waktu kota
    const todayStr = `${year}-${month}-${String(dayNum).padStart(2, "0")}`;
    const todaySchedule = jadwalBulan.find((j) => j.date === todayStr) || jadwalBulan[dayNum - 1] || jadwalBulan[0];

    // Samakan struktur key agar kompatibel dengan fitur lain di aplikasi
    prayerTimesData = {
      Imsak: todaySchedule.imsak,
      Fajr: todaySchedule.subuh,
      Sunrise: todaySchedule.terbit,
      Dhuha: todaySchedule.dhuha,
      Dhuhr: todaySchedule.dzuhur,
      Asr: todaySchedule.ashar,
      Maghrib: todaySchedule.maghrib,
      Isha: todaySchedule.isya
    };

    // Update tanggal Masehi & Hijriah
    const dateFormatted = `${dayNum} ${cityNow.toLocaleString("id-ID", { month: "short" })} ${year}`;
    const tmEl = document.getElementById("today-date-masehi");
    const hdEl = document.getElementById("today-date-hijri") || document.getElementById("current-hijri-date");
    if (tmEl) tmEl.innerText = dateFormatted;

    if (hdEl) {
      try {
        const hijriFmt = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(cityNow);
        hdEl.innerText = hijriFmt;
      } catch (e) {
        hdEl.innerText = todaySchedule.tanggal || dateFormatted;
      }
    }

    const imEl = document.getElementById("imsak-time-display");
    if (imEl) imEl.innerText = `${prayerTimesData.Imsak} ${currentTimezoneLabel}`;

    renderPrayerTimesList(prayerTimesData);
    renderImsakiyahTable(jadwalBulan);
    startPrayerCountdown(prayerTimesData);
  } catch (err) {
    console.error("Gagal memuat jadwal sholat Kemenag:", err);
    const container = document.getElementById("prayer-list-container");
    if (container) {
      container.innerHTML = `<p class="text-center text-red-600 py-2">Gagal mengambil jadwal Kemenag RI. Periksa koneksi internet.</p>`;
    }
  }
}

function renderPrayerTimesList(timings) {
  const listContainer = document.getElementById("prayer-list-container");
  if (!listContainer) return;

  const list = [
    { name: "Imsak", time: timings.Imsak },
    { name: "Subuh", time: timings.Fajr },
    { name: "Terbit / Syuruq", time: timings.Sunrise },
    { name: "Dhuha", time: timings.Dhuha },
    { name: "Dzuhur", time: timings.Dhuhr },
    { name: "Ashar", time: timings.Asr },
    { name: "Maghrib (Buka Puasa)", time: timings.Maghrib },
    { name: "Isya", time: timings.Isha }
  ].filter((item) => item.time);

  listContainer.innerHTML = list
    .map(
      (item) => `
    <div class="flex justify-between items-center p-2 rounded border border-stone-100 hover:bg-amber-50/50">
      <span class="font-semibold text-stone-700">${item.name}</span>
      <span class="font-bold text-amber-900">${item.time} ${currentTimezoneLabel}</span>
    </div>
  `
    )
    .join("");
}

function renderImsakiyahTable(data) {
  const tbody = document.getElementById("imsakiyah-table-body");
  if (!tbody || !Array.isArray(data)) return;

  const cityNow = getCityNowDate(currentCityOffset);
  const todayStr = `${cityNow.getFullYear()}-${String(cityNow.getMonth() + 1).padStart(2, "0")}-${String(cityNow.getDate()).padStart(2, "0")}`;

  tbody.innerHTML = data
    .map((d) => {
      const isToday = d.date === todayStr;
      // Format tanggal ringkas (misal "13 Nov")
      const labelDate = d.tanggal ? d.tanggal.split(", ").pop().slice(0, 6) : d.date;
      return `
      <tr class="${isToday ? "bg-amber-100 font-bold text-amber-950" : "hover:bg-stone-50"}">
        <td class="p-1.5">${labelDate}</td>
        <td class="p-1.5 text-amber-800 font-semibold">${d.imsak}</td>
        <td class="p-1.5">${d.subuh}</td>
        <td class="p-1.5 text-amber-800 font-semibold">${d.maghrib}</td>
      </tr>
    `;
    })
    .join("");
}

function startPrayerCountdown(timings) {
  if (countdownInterval) clearInterval(countdownInterval);

  const prayers = [
    { name: "Subuh", time: timings.Fajr },
    { name: "Dzuhur", time: timings.Dhuhr },
    { name: "Ashar", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isya", time: timings.Isha }
  ];

  function updateCountdown() {
    // Hitung selisih waktu berdasarkan jam lokal kota terpilih (WIB/WITA/WIT)
    const cityNow = getCityNowDate(currentCityOffset);
    let nextPrayer = null;

    for (let p of prayers) {
      if (!p.time) continue;
      const [hrs, mins] = p.time.split(":");
      const pDate = new Date(cityNow.getTime());
      pDate.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);

      if (pDate > cityNow) {
        nextPrayer = { name: p.name, date: pDate, timeStr: p.time };
        break;
      }
    }

    if (!nextPrayer && prayers[0].time) {
      const [hrs, mins] = prayers[0].time.split(":");
      const tomorrowSubuh = new Date(cityNow.getTime());
      tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
      tomorrowSubuh.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);
      nextPrayer = { name: "Subuh (Besok)", date: tomorrowSubuh, timeStr: prayers[0].time };
    }

    if (!nextPrayer) return;

    const npName = document.getElementById("next-prayer-name");
    const npTime = document.getElementById("next-prayer-time");
    const tzLabel = document.getElementById("sholat-timezone-label");
    const homeNextPrayer = document.getElementById("home-next-prayer");

    if (npName) npName.innerText = nextPrayer.name;
    if (npTime) npTime.innerText = nextPrayer.timeStr;
    if (tzLabel) tzLabel.innerText = currentTimezoneLabel;
    if (homeNextPrayer) homeNextPrayer.innerText = nextPrayer.name;

    const diffMs = Math.max(0, nextPrayer.date - cityNow);
    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diffMs % (1000 * 60)) / 1000);

    const cdStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    const npCountdown = document.getElementById("countdown-timer");
    const homeCountdown = document.getElementById("home-countdown");
    if (npCountdown) npCountdown.innerText = cdStr;
    if (homeCountdown) homeCountdown.innerText = cdStr;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

// 5. DOA/HADITS HIGHLIGHT BERANDA
async function loadDailyHighlightHybrid() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dateLabel = document.getElementById("daily-date-label");
  if (dateLabel) dateLabel.innerText = `${today.getDate()} ${today.toLocaleString('id-ID', { month: 'short' })}`;

  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const defaultIndex = dayOfYear % doaDatabase.length;
  currentDailyItem = doaDatabase[defaultIndex];

  const homeTitle = document.getElementById("home-daily-title");
  const homeAr = document.getElementById("home-daily-arabic");
  const homeTr = document.getElementById("home-daily-translation");
  
  if (homeTitle) homeTitle.innerText = currentDailyItem.title;
  if (homeAr) homeAr.innerText = currentDailyItem.arabic;
  if (homeTr) homeTr.innerText = currentDailyItem.translation;
}

	/* ==========================================================================
	   MODUL KHATAM RAMADHAN (SEQUENTIAL UNLOCK, SURAH CHECKLIST & MOTIVASI)
	   ========================================================================== */

	// Database Motivasi Per Juz (Juz 1 - 30)
	const KHATAM_MOTIVASI = [
	  "Awali langkah pertama dengan keikhlasan. Setiap huruf Al-Qur'an adalah 10 kebaikan!",
	  "Terus jaga konsistensimu. Juz 2 selesai, jiwa makin tenang!",
	  "Membaca Al-Qur'an adalah perniagaan yang tidak akan pernah rugi.",
	  "Sedikit demi sedikit, lama-lama khatam! Semangat Juz 4!",
	  "Al-Qur'an akan menjadi pemberi syafaat bagi pembacanya di hari kiamat.",
	  "Hati yang di dalamnya ada Al-Qur'an ibarat rumah yang makmur dan bercahaya.",
	  "Istiqamah itu berat, tapi hadiahnya Syurga. Selamat atas Juz 7!",
	  "Jadikan Al-Qur'an sahabat terdekatmu di setiap waktu.",
	  "Satu per tiga perjalanan menuju khatam! Luar biasa perjuanganmu!",
	  "Disiplin membaca Al-Qur'an membawa keberkahan pada waktu dan rezekimu.",
	  "Setiap ayat yang kau baca menyinari langkah hidupmu.",
	  "Teruskan tilawahmu, malaikat menaungi orang-orang yang mengaji.",
	  "Hampir separuh jalan! Pertahankan semangat ibadahmu!",
	  "Al-Qur'an adalah penawar rindu dan penenang hati yang gelisah.",
	  "Alhamdulillah pertengahan khatam (Juz 15) tercapai! Terus melaju!",
	  "Makin lanjut makin manis meresapi kalam-kalam Allah.",
	  "Jangan biarkan rasa lelah mengalahkan niat muliamu.",
	  "Keberkahan Ramadhan kian terasa bersama hiasan tilawah.",
	  "Sudah memasuki 10 juz terakhir! Semangat meraih Lailatul Qadar!",
	  "Jadikan Al-Qur'an kompas utama dalam setiap keputusan hidupmu.",
	  "Dua puluh juz terlampaui! Kemenangan sudah di depan mata!",
	  "Cahaya Al-Qur'an menentramkan jiwa dan melapangkan dada.",
	  "Perbanyak syukur atas hidayah dan kelancaran tilawah ini.",
	  "Fokus dan konsisten di fase-fase akhir Khatam Ramadhan!",
	  "Juz 25 tuntas! Selangkah lagi menuju puncak keberkahan!",
	  "Rasakan kedamaian yang menyusup di setiap kali membaca ayat-Nya.",
	  "Tinggal 3 Juz lagi! Pertahankan ritme tilawahmu!",
	  "Dekat dengan Al-Qur'an membuat hidup mulia di dunia dan akhirat.",
	  "Satu langkah lagi menuju Khatam 30 Juz! MasyaAllah!",
	  "ALHAMDULILLAH KHATAM! Semoga Al-Qur'an menjadi penerang jalan hidupmu selamanya!"
	];

	let currentSelectedJuz = 1;

	// 1. TOGGLE VISIBILITAS GRID JUZ
	function toggleKhatamGrid() {
	  const wrapper = document.getElementById("khatam-grid-wrapper");
	  const btn = document.getElementById("btn-toggle-khatam");
	  if (!wrapper || !btn) return;

	  if (wrapper.classList.contains("hidden")) {
		wrapper.classList.remove("hidden");
		btn.innerText = "👁️ Sembunyikan";
	  } else {
		wrapper.classList.add("hidden");
		btn.innerText = "👁️ Tampilkan";
	  }
	}

	// 2. RENDER GRID JUZ (SEQUENTIAL UNLOCK)
	function renderKhatamGrid() {
	  const container = document.getElementById("khatam-grid-container");
	  if (!container) return;

	  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
	  let completedCount = 0;
	  let html = "";

	  for (let i = 1; i <= 30; i++) {
		const isDone = !!khatamData[i]?.done;
		if (isDone) completedCount++;

		// Sequential Unlock: Juz 1 terbuka, Juz N terbuka jika N-1 sudah selesai
		const isUnlocked = (i === 1) || (khatamData[i - 1]?.done);

		let btnClass = "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60";
		let iconStatus = "🔒";

		if (isDone) {
		  btnClass = "bg-amber-600 text-white border-amber-700 font-bold shadow";
		  iconStatus = "✅";
		} else if (isUnlocked) {
		  btnClass = "bg-white text-stone-800 border-amber-300 hover:border-amber-500 font-semibold cursor-pointer shadow-sm";
		  iconStatus = "";
		}

		html += `
		  <button 
			onclick="${isUnlocked ? `openKhatamModal(${i})` : `showLockedAlert(${i})`}" 
			class="flex flex-col items-center justify-center p-2 rounded-xl border transition text-center ${btnClass}">
			<span class="text-[9px] block">Juz</span>
			<span class="text-sm font-bold leading-none">${i}</span>
			<span class="text-[9px] mt-0.5">${iconStatus}</span>
		  </button>
		`;
	  }

	  container.innerHTML = html;

	  const badge = document.getElementById("khatam-progress-badge");
	  const progressBar = document.getElementById("khatam-progress-bar");
	  const percent = Math.round((completedCount / 30) * 100);

	  if (badge) badge.innerText = `${completedCount} / 30 Juz (${percent}%)`;
	  if (progressBar) progressBar.style.width = `${percent}%`;

	  updateHomeKhatamWidget();
	}

	// 3. ALERT TERKUNCI
	function showLockedAlert(juzNum) {
	  if (typeof showCustomAlert === 'function') {
		showCustomAlert({
		  icon: "🔒",
		  iconBg: "bg-amber-100 text-amber-600",
		  title: "Juz Terkunci",
		  message: `Selesaikan Juz ${juzNum - 1} terlebih dahulu untuk membuka Juz ${juzNum}!`,
		  confirmText: "Siap"
		});
	  } else {
		alert(`🔒 Selesaikan Juz ${juzNum - 1} terlebih dahulu untuk membuka Juz ${juzNum}!`);
	  }
	}

	// 4. BUKA MODAL DETAIL JUZ
	function openKhatamModal(juzNum) {
	  currentSelectedJuz = juzNum;
	  window.currentSelectedJuz = juzNum;

	  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
	  const currentJuzData = khatamData[juzNum] || { done: false, note: "", surahs: {} };

	  const titleEl = document.getElementById("khatam-modal-title");
	  const quoteEl = document.getElementById("khatam-modal-quote");
	  const noteEl = document.getElementById("khatam-modal-note");
	  const btnEl = document.getElementById("btn-toggle-juz-status");

	  if (titleEl) titleEl.innerText = `📖 Target Juz ${juzNum}`;
	  if (quoteEl) quoteEl.innerText = `"${KHATAM_MOTIVASI[juzNum - 1] || KHATAM_MOTIVASI[0]}"`;
	  if (noteEl) noteEl.value = currentJuzData.note || "";

	  renderSurahChecklistModal(juzNum, currentJuzData.surahs || {});

	  if (btnEl) {
		if (currentJuzData.done) {
		  btnEl.innerText = "🔄 Batalkan / Tandai Belum Selesai";
		  btnEl.className = "w-full bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 rounded-lg text-xs shadow-md transition";
		} else {
		  btnEl.innerText = "✅ Tandai Selesai 1 Juz Penuh";
		  btnEl.className = "w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-lg text-xs shadow-md transition";
		}

		// Ikat klik tombol secara langsung ke juzNum yang sedang dibuka
		btnEl.onclick = function(e) {
		  e.preventDefault();
		  e.stopPropagation();
		  toggleFullJuzStatus(juzNum);
		};
	  }

	  const modal = document.getElementById("khatam-modal");
	  if (modal) {
		modal.classList.remove("hidden");
		modal.classList.add("flex");
	  }
	}

	// 5. RENDER CHECKLIST SURAH INDIVIDUAL
	function renderSurahChecklistModal(juzNum, savedSurahs) {
	  const container = document.getElementById("khatam-surah-list-container");
	  const progressText = document.getElementById("khatam-surah-progress-text");
	  if (!container) return;

	  const surahList = (typeof JUZ_SURAH_MAP !== 'undefined' && JUZ_SURAH_MAP[juzNum]) 
		? JUZ_SURAH_MAP[juzNum] 
		: [{id: 1, name: `Surah Bagian Juz ${juzNum}`}];

	  let checkedCount = 0;
	  let html = "";

	  surahList.forEach((s, idx) => {
		const isChecked = !!savedSurahs[idx];
		if (isChecked) checkedCount++;
		const sName = typeof s === 'object' ? s.name : s;

		html += `
		  <label class="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition">
			<input type="checkbox" onchange="toggleSurahInJuz(${juzNum}, ${idx})" ${isChecked ? 'checked' : ''} class="accent-amber-700 rounded w-3.5 h-3.5">
			<span class="${isChecked ? 'line-through text-stone-400 font-medium' : 'text-stone-700'}">${sName}</span>
		  </label>
		`;
	  });

	  container.innerHTML = html;
	  if (progressText) progressText.innerText = `${checkedCount}/${surahList.length} Surah`;
	}

	// 6. TOGGLE SURAH INDIVIDUAL
	function toggleSurahInJuz(juzNum, surahIndex) {
	  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
	  if (!khatamData[juzNum]) {
		khatamData[juzNum] = { done: false, note: "", surahs: {} };
	  }
	  if (!khatamData[juzNum].surahs) khatamData[juzNum].surahs = {};

	  khatamData[juzNum].surahs[surahIndex] = !khatamData[juzNum].surahs[surahIndex];

	  const surahList = (typeof JUZ_SURAH_MAP !== 'undefined' && JUZ_SURAH_MAP[juzNum]) ? JUZ_SURAH_MAP[juzNum] : [1];
	  const totalChecked = Object.values(khatamData[juzNum].surahs).filter(Boolean).length;

	  // Otomatis set selesai jika semua surah tercentang, dan batalkan selesai jika ada yang dilepas
	  khatamData[juzNum].done = (totalChecked === surahList.length);

	  localStorage.setItem("quran_khatam_data", JSON.stringify(khatamData));
	  
	  // Update tampilan tombol di dalam modal secara langsung
	  const btnEl = document.getElementById("btn-toggle-juz-status");
	  if (btnEl) {
		if (khatamData[juzNum].done) {
		  btnEl.innerText = "🔄 Batalkan / Tandai Belum Selesai";
		  btnEl.className = "w-full bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 rounded-lg text-xs shadow-md transition";
		} else {
		  btnEl.innerText = "✅ Tandai Selesai 1 Juz Penuh";
		  btnEl.className = "w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 rounded-lg text-xs shadow-md transition";
		}
	  }

	  renderSurahChecklistModal(juzNum, khatamData[juzNum].surahs);
	  renderKhatamGrid();
	  updateHomeKhatamWidget();
	}

		// 7. SIMPAN / BATALKAN STATUS 1 JUZ PENUH DARI TOMBOL UTAMA
	function toggleFullJuzStatus(juzNum) {
	  const targetJuz = Number(juzNum || currentSelectedJuz || window.currentSelectedJuz);
	  if (!targetJuz) return;

	  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
	  const currentJuzData = khatamData[targetJuz] || { done: false, note: "", surahs: {} };

	  const noteEl = document.getElementById("khatam-modal-note");
	  const newNote = noteEl ? noteEl.value : "";
	  const isDoneNew = !Boolean(currentJuzData.done);

	  if (isDoneNew) {
		// TANDAI SELESAI 1 JUZ PENUH -> Otomatis centang semua surah
		const updatedSurahs = {};
		const surahList = (typeof JUZ_SURAH_MAP !== 'undefined' && JUZ_SURAH_MAP[targetJuz]) ? JUZ_SURAH_MAP[targetJuz] : [1];
		surahList.forEach((_, idx) => {
		  updatedSurahs[idx] = true;
		});

		khatamData[targetJuz] = {
		  done: true,
		  note: newNote,
		  surahs: updatedSurahs,
		  updatedAt: new Date().toISOString()
		};
	  } else {
		// BATALKAN -> Hapus centang semua surah & set done = false
		khatamData[targetJuz] = {
		  done: false,
		  note: newNote,
		  surahs: {},
		  updatedAt: new Date().toISOString()
		};
	  }

	  localStorage.setItem("quran_khatam_data", JSON.stringify(khatamData));

	  closeKhatamModal();
	  renderKhatamGrid();
	  updateHomeKhatamWidget();
	}

	// Tetap sediakan alias nama fungsi lama agar HTML tetap kompatibel
	window.saveJuzStatusFromModal = function() {
	  toggleFullJuzStatus(currentSelectedJuz || window.currentSelectedJuz);
	};
	
	// 8. UPDATE WIDGET BERANDA
	function updateHomeKhatamWidget() {
	  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
	  
	  let completedCount = 0;
	  let nextJuzToRead = 1;

	  for (let i = 1; i <= 30; i++) {
		if (khatamData[i]?.done) {
		  completedCount++;
		} else {
		  if (nextJuzToRead === 1 && completedCount === i - 1) {
			nextJuzToRead = i;
		  }
		}
	  }

	  const percent = Math.round((completedCount / 30) * 100);
	  
	  const badgeEl = document.getElementById("home-khatam-badge");
	  const titleEl = document.getElementById("home-khatam-status-title");
	  const subEl = document.getElementById("home-khatam-status-sub");
	  const barEl = document.getElementById("home-khatam-progress-bar");

	  if (badgeEl) badgeEl.innerText = `${completedCount} / 30 Juz (${percent}%)`;
	  if (barEl) barEl.style.width = `${percent}%`;

	  if (completedCount === 30) {
		if (titleEl) titleEl.innerText = "🎉 ALHAMDULILLAH KHATAM 30 JUZ!";
		if (subEl) subEl.innerText = "Selamat! Semua target Juz Ramadhan telah tuntas.";
	  } else {
		if (titleEl) titleEl.innerText = `Target Selanjutnya: Juz ${nextJuzToRead}`;
		if (subEl) subEl.innerText = completedCount === 0 
		  ? "Awali langkah pertama tilawahmu hari ini!" 
		  : `${completedCount} Juz tuntas. Yuk tuntaskan Juz ${nextJuzToRead}!`;
	  }
	}

/* ==========================================================================
   SINKRONISASI BACAAN SURAH (HEADER & BAWAH DINAMIS) <-> TRACKER KHATAM JUZ
   ========================================================================== */

// Helper: Ambil nomor surah yang sedang aktif dibuka dari dropdown surah
function getActiveSurahNumber() {
  const selectEl = document.querySelector("select");
  if (selectEl && selectEl.value) return Number(selectEl.value);
  return 1;
}

// 1. FUNGSI UTAMA TOMBOL "TANDAI SELESAI" (HEADER & BAWAH)
function quickMarkCurrentSurahDone() {
  const surahNum = getActiveSurahNumber();
  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
  const completedSurahs = JSON.parse(localStorage.getItem("quran_completed_surahs")) || {};

  // Toggle status selesai untuk surah ini
  const isNowDone = !Boolean(completedSurahs[surahNum]);
  if (isNowDone) {
    completedSurahs[surahNum] = true;
  } else {
    delete completedSurahs[surahNum];
  }
  localStorage.setItem("quran_completed_surahs", JSON.stringify(completedSurahs));

  // Sinkronkan ke data JUZ_SURAH_MAP di Tracker Khatam
  if (typeof JUZ_SURAH_MAP !== "undefined") {
    for (let j = 1; j <= 30; j++) {
      const list = JUZ_SURAH_MAP[j] || [];
      list.forEach((item, idx) => {
        const itemId = typeof item === "object" ? Number(item.id) : Number(item);
        if (itemId === surahNum) {
          if (!khatamData[j]) khatamData[j] = { done: false, note: "", surahs: {} };
          if (!khatamData[j].surahs) khatamData[j].surahs = {};
          
          khatamData[j].surahs[idx] = isNowDone;

          // Cek apakah semua surah pada Juz j sudah tercentang
          const checkedCount = Object.values(khatamData[j].surahs).filter(Boolean).length;
          khatamData[j].done = (checkedCount === list.length);
        }
      });
    }
    localStorage.setItem("quran_khatam_data", JSON.stringify(khatamData));
  }

  // Perbarui tampilan kedua tombol (Header & Bawah) serta Grid Khatam
  syncSurahDoneButtonsUI();
  if (typeof renderKhatamGrid === "function") renderKhatamGrid();
  if (typeof updateHomeKhatamWidget === "function") updateHomeKhatamWidget();
}

// 2. SINKRONISASI TAMPILAN TOMBOL HEADER & TOMBOL DINAMIS DI BAWAH AYAT
function syncSurahDoneButtonsUI() {
  const surahNum = getActiveSurahNumber();
  const completedSurahs = JSON.parse(localStorage.getItem("quran_completed_surahs")) || {};
  const isDone = Boolean(completedSurahs[surahNum]);

  // A. Update Tombol Header Atas
  const btnTop = document.getElementById("btn-quick-mark-surah");
  const iconTop = document.getElementById("quick-surah-icon");
  const textTop = document.getElementById("quick-surah-text");

  if (btnTop && iconTop && textTop) {
    if (isDone) {
      btnTop.className = "bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-700 transition flex items-center gap-1 shadow-sm";
      iconTop.innerText = "✅";
      textTop.innerText = "Selesai Dibaca";
    } else {
      btnTop.className = "bg-stone-200 hover:bg-amber-600 hover:text-white text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-300 transition flex items-center gap-1";
      iconTop.innerText = "⬜";
      textTop.innerText = "Tandai Selesai";
    }
  }

  // B. Sisipkan / Perbarui Tombol Dinamis di Bagian Paling Bawah Daftar Ayat
  const ayatsContainer = document.getElementById("ayats-container");
  if (ayatsContainer && ayatsContainer.children.length > 0) {
    let bottomBox = document.getElementById("bottom-quick-mark-wrapper");
    if (!bottomBox) {
      bottomBox = document.createElement("div");
      bottomBox.id = "bottom-quick-mark-wrapper";
      bottomBox.className = "pt-3 pb-6 flex justify-center";
      ayatsContainer.appendChild(bottomBox);
    } else {
      // Pastikan posisinya selalu berada di paling bawah setelah ayat terakhir
      ayatsContainer.appendChild(bottomBox);
    }

    bottomBox.innerHTML = isDone
      ? `<button type="button" onclick="quickMarkCurrentSurahDone()" class="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2">
           <span>✅</span> <span>Surah Selesai Dibaca (Batalkan)</span>
         </button>`
      : `<button type="button" onclick="quickMarkCurrentSurahDone()" class="w-full max-w-xs bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2">
           <span>⬜</span> <span>Tandai Surah Ini Selesai</span>
         </button>`;
  }
}

// 3. OVERRIDE AMAN UNTUK RENDER GRID JUZ (JUZ 1 TERKUNCI SAMPAI ADA SURAH SELESAI)
const _originalRenderKhatamGrid = typeof renderKhatamGrid === "function" ? renderKhatamGrid : null;

function renderKhatamGrid() {
  const container = document.getElementById("khatam-grid-container");
  if (!container) return;

  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
  const completedSurahs = JSON.parse(localStorage.getItem("quran_completed_surahs")) || {};
  const hasAnyStartedSurah = Object.keys(completedSurahs).length > 0;

  let completedCount = 0;
  let html = "";

  for (let i = 1; i <= 30; i++) {
    const isDone = !!khatamData[i]?.done;
    if (isDone) completedCount++;

    // Juz 1 terbuka hanya jika sudah ada minimal 1 surah ditandai selesai (atau Juz 1 sudah punya progres)
    const juz1HasProgress = hasAnyStartedSurah || isDone || Object.values(khatamData[1]?.surahs || {}).some(Boolean);
    const isUnlocked = (i === 1) ? juz1HasProgress : Boolean(khatamData[i - 1]?.done);

    let btnClass = "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60";
    let iconStatus = "🔒";

    if (isDone) {
      btnClass = "bg-amber-600 text-white border-amber-700 font-bold shadow";
      iconStatus = "✅";
    } else if (isUnlocked) {
      btnClass = "bg-white text-stone-800 border-amber-300 hover:border-amber-500 font-semibold cursor-pointer shadow-sm";
      iconStatus = "";
    }

    const clickAction = isUnlocked
      ? `openKhatamModal(${i})`
      : (i === 1 ? `showJuz1LockedAlert()` : `showLockedAlert(${i})`);

    html += `
      <button 
        onclick="${clickAction}" 
        class="flex flex-col items-center justify-center p-2 rounded-xl border transition text-center ${btnClass}">
        <span class="text-[9px] block">Juz</span>
        <span class="text-sm font-bold leading-none">${i}</span>
        <span class="text-[9px] mt-0.5">${iconStatus}</span>
      </button>
    `;
  }

  container.innerHTML = html;

  const badge = document.getElementById("khatam-progress-badge");
  const progressBar = document.getElementById("khatam-progress-bar");
  const percent = Math.round((completedCount / 30) * 100);

  if (badge) badge.innerText = `${completedCount} / 30 Juz (${percent}%)`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  if (typeof updateHomeKhatamWidget === "function") updateHomeKhatamWidget();
}

function showJuz1LockedAlert() {
  const msg = "Mulai baca & tekan tombol 'Tandai Selesai' pada salah satu surah di Tab Al-Qur'an untuk membuka kunci Juz 1!";
  if (typeof showCustomAlert === "function") {
    showCustomAlert({
      icon: "🔒",
      iconBg: "bg-amber-100 text-amber-600",
      title: "Juz 1 Terkunci",
      message: msg,
      confirmText: "Siap"
    });
  } else {
    alert(`🔒 ${msg}`);
  }
}

// 4. PANTAU PERUBAHAN SURAH / AYAT OTOMATIS AGAR TOMBOL BAWAH SELALU MUNCUL
(function initSurahDoneObserver() {
  const ayatsContainer = document.getElementById("ayats-container");
  if (ayatsContainer) {
    const observer = new MutationObserver(() => {
      // Hindari loop tak terbatas saat menyisipkan tombol bawah
      if (!document.getElementById("bottom-quick-mark-wrapper") && ayatsContainer.children.length > 0) {
        syncSurahDoneButtonsUI();
      }
    });
    observer.observe(ayatsContainer, { childList: true });
  }

  // Jalankan sinkronisasi awal saat halaman dimuat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      syncSurahDoneButtonsUI();
      renderKhatamGrid();
    });
  } else {
    syncSurahDoneButtonsUI();
    renderKhatamGrid();
  }
})();

window.quickMarkCurrentSurahDone = quickMarkCurrentSurahDone;
window.showJuz1LockedAlert = showJuz1LockedAlert;
window.renderKhatamGrid = renderKhatamGrid;

// ============================================================================
// 7. KOMPAS QIBLAH REAL-TIME (ABSOLUTE MAGNETOMETER) & DETEKSI GPS KOTA
// ============================================================================
let targetQiblaBearing = null;
let smoothedHeading = null;
let qiblaSensorActive = false;

function calculateQiblaBearing(lat, lng) {
  const kaabaLat = 21.422487;
  const kaabaLng = 39.826206;

  const phiK = (kaabaLat * Math.PI) / 180;
  const lambdaK = (kaabaLng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  if (bearing < 0) bearing += 360;
  return bearing;
}

function getScreenOrientationAngle() {
  if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === "number") {
    return window.screen.orientation.angle;
  }
  if (typeof window.orientation === "number") {
    return window.orientation;
  }
  return 0;
}

function handleDeviceCompassOrientation(event) {
  if (targetQiblaBearing === null) return;

  let compassHeading = null;

  // 1. iOS Safari / WebKit
  if (typeof event.webkitCompassHeading === "number" && !isNaN(event.webkitCompassHeading)) {
    compassHeading = event.webkitCompassHeading;
  }
  // 2. Android Chrome / WebView (Absolut Utara Magnetik)
  else if (event.alpha !== null && typeof event.alpha === "number") {
    // Jika event bukan absolute dan sudah ada sensor absolute yang aktif, abaikan
    if (event.type === "deviceorientation" && event.absolute === false && window._hasAbsoluteCompass) {
      return;
    }
    if (event.type === "deviceorientationabsolute" || event.absolute === true) {
      window._hasAbsoluteCompass = true;
    }

    // Konversi sudut alpha berlawanan jarum jam ke arah kompas searah jarum jam + koreksi orientasi layar
    const screenAngle = getScreenOrientationAngle();
    compassHeading = (360 - event.alpha + screenAngle) % 360;
  }

  if (compassHeading === null || isNaN(compassHeading)) return;

  // Low-pass filter dengan penanganan batas 0°/360° agar jarum halus & tidak bergetar
  if (smoothedHeading === null) {
    smoothedHeading = compassHeading;
  } else {
    let delta = compassHeading - smoothedHeading;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    smoothedHeading = (smoothedHeading + delta * 0.25 + 360) % 360;
  }

  // Sudut putar jarum Ka'bah relatif terhadap arah kepala HP saat ini
  const needleRotation = (targetQiblaBearing - smoothedHeading + 360) % 360;

  const needle = document.getElementById("qibla-needle");
  const statusEl = document.getElementById("qibla-status-text");
  const degreeEl = document.getElementById("qibla-degree-label");

  if (needle) {
    needle.style.transition = "transform 120ms linear";
    needle.style.transform = `rotate(${needleRotation.toFixed(1)}deg)`;
  }

  const qiblaRounded = Math.round(targetQiblaBearing);
  const headingRounded = Math.round(smoothedHeading);

  if (degreeEl) {
    degreeEl.innerText = `Qiblah: ${qiblaRounded}° • Arah HP: ${headingRounded}°`;
  }

  // Hitung selisih sudut ke Ka'bah untuk memberi tahu user saat sudah tepat lurus
  let diffToKaaba = Math.abs(needleRotation > 180 ? 360 - needleRotation : needleRotation);
  if (statusEl) {
    if (diffToKaaba <= 5) {
      statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✅ TEPAT MENGARAH KE KA'BAH! (${qiblaRounded}°)</span>`;
    } else {
      const turnDir = needleRotation <= 180 ? "kanan ↻" : "kiri ↺";
      statusEl.innerText = `Putar HP ke ${turnDir} hingga ikon 🕋 lurus ke atas (N).`;
    }
  }
}

async function startCompassSensorListeners() {
  // Minta izin sensor kompas khusus iOS 13+ jika diperlukan
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== "granted") {
        const statusEl = document.getElementById("qibla-status-text");
        if (statusEl) statusEl.innerText = "Izin sensor kompas ditolak oleh perangkat.";
        return;
      }
    } catch (e) {
      console.warn("Permission sensor kompas:", e);
    }
  }

  if (!qiblaSensorActive) {
    window.addEventListener("deviceorientationabsolute", handleDeviceCompassOrientation, true);
    window.addEventListener("deviceorientation", handleDeviceCompassOrientation, true);
    qiblaSensorActive = true;
  }
}

function initQiblaCompass() {
  const statusEl = document.getElementById("qibla-status-text");
  const degreeEl = document.getElementById("qibla-degree-label");
  const needle = document.getElementById("qibla-needle");

  // Aktifkan listener sensor kompas langsung di dalam event klik tombol
  startCompassSensorListeners();

  // Gunakan koordinat kota terpilih sebagai cadangan cepat sebelum GPS selesai mengunci
  const fallbackCity = KEMENAG_CITIES[currentCity] || KEMENAG_CITIES["Bogor"];
  if (targetQiblaBearing === null) {
    targetQiblaBearing = calculateQiblaBearing(fallbackCity.lat, fallbackCity.lng);
    if (degreeEl) degreeEl.innerText = `Derajat Qiblah: ${Math.round(targetQiblaBearing)}° dari Utara`;
    if (needle) needle.style.transform = `rotate(${Math.round(targetQiblaBearing)}deg)`;
  }

  if (!navigator.geolocation) {
    if (statusEl) statusEl.innerText = `Menggunakan koordinat ${currentCity} (${Math.round(targetQiblaBearing)}°).`;
    return;
  }

  if (statusEl) statusEl.innerText = "Mengunci koordinat GPS & sensor kompas...";

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      targetQiblaBearing = calculateQiblaBearing(lat, lng);
      const qiblaAngle = Math.round(targetQiblaBearing);

      if (degreeEl) degreeEl.innerText = `Derajat Qiblah: ${qiblaAngle}° dari Utara`;
      if (statusEl) {
        statusEl.innerText = "Kompas aktif! Putar HP datar hingga ikon 🕋 lurus ke atas.";
      }

      if (needle && smoothedHeading === null) {
        needle.style.transform = `rotate(${qiblaAngle}deg)`;
      }
    },
    function () {
      if (statusEl) {
        statusEl.innerText = `GPS tidak aktif, memakai arah Qiblah ${currentCity} (${Math.round(targetQiblaBearing)}°).`;
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function detectLocationGPS() {
  if (!navigator.geolocation) {
    if (typeof showCustomAlert === "function") {
      showCustomAlert({
        icon: "⚠️",
        title: "GPS Tidak Didukung",
        message: "Perangkat Anda tidak mendukung fitur deteksi lokasi GPS."
      });
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Cari kota terdekat dari 14 kota besar Indonesia menggunakan rumus jarak Haversine
      let closestCity = "Jakarta";
      let minDist = Infinity;

      Object.entries(KEMENAG_CITIES).forEach(([cityName, meta]) => {
        const dLat = ((meta.lat - lat) * Math.PI) / 180;
        const dLng = ((meta.lng - lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((meta.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        if (dist < minDist) {
          minDist = dist;
          closestCity = cityName;
        }
      });

      const selectEl = document.getElementById("prayer-city-select");
      if (selectEl) selectEl.value = closestCity;

      changePrayerCity(closestCity);

      const tz = KEMENAG_CITIES[closestCity].tz;
      if (typeof showCustomAlert === "function") {
        showCustomAlert({
          icon: "📍",
          title: "Lokasi Terdeteksi",
          message: `Jadwal sholat Kemenag RI disesuaikan ke wilayah ${closestCity} (${tz}).`
        });
      }
    },
    () => {
      if (typeof showCustomAlert === "function") {
        showCustomAlert({
          icon: "📍",
          title: "Izin GPS Diperlukan",
          message: "Aktifkan izin lokasi (GPS) pada perangkat Anda untuk mendeteksi kota otomatis."
        });
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function changePrayerCity(cityName) {
  if (!cityName) return;
  currentCity = cityName;
  localStorage.setItem("quran_selected_city", cityName);
  fetchPrayerTimes(cityName);
}

// 8. MODAL MODAL LAINNYA
function openCustomAmalanModal() {
  const modal = document.getElementById("custom-amalan-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeCustomAmalanModal() {
  const modal = document.getElementById("custom-amalan-modal");
  if (modal) modal.classList.add("hidden");
}

function updateQadhaCount(change) {
  qadhaDaysCount += change;
  if (qadhaDaysCount < 0) qadhaDaysCount = 0;
  localStorage.setItem("quran_qadha_days", qadhaDaysCount);
  const valEl = document.getElementById("qadha-counter-val");
  if (valEl) valEl.innerText = qadhaDaysCount;
}

function toggleBookmark(surahNumber, surahName, ayatNumber) {
  // Cek apakah ayat sudah ada di daftar bookmark
  const index = bookmarks.findIndex(b => b.surahNumber === surahNumber && b.ayatNumber === ayatNumber);
  
  if (index > -1) {
    // Jika sudah ada, hapus dari bookmark
    bookmarks.splice(index, 1);
  } else {
    // Jika belum ada, tambahkan ke bookmark
    bookmarks.push({ 
      surahNumber: surahNumber, 
      surahName: surahName, 
      ayatNumber: ayatNumber 
    });
  }

  // 1. Simpan ke LocalStorage
  localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));

  // 2. Update Angka di Header & Modal Bookmark secara langsung
  updateBookmarkUI();

  // 3. Update Widget Bookmark di Beranda
  updateHomeWidgetData();

  // 4. Render ulang tombol di tampilan ayat agar status tombolnya berubah (Tersimpan/Bookmark)
  renderAyats();
}

function toggleSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) modal.classList.toggle("hidden");
}

function toggleSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (modal) modal.classList.toggle("hidden");
}

function toggleImsakiyahModal() {
  const modal = document.getElementById("imsakiyah-modal");
  if (modal) modal.classList.toggle("hidden");
}

function isAyatBookmarked(surahNumber, ayatNumber) {
  return bookmarks.some(b => b.surahNumber === surahNumber && b.ayatNumber === ayatNumber);
}

/* ==========================================================================
   PERBAIKAN PERMANEN FITUR BOOKMARK (FULL WORKING)
   ========================================================================== */

// 1. RENDER DAFTAR BOOKMARK DEGAN TOMBOL HAPUS SEMUA DI HEADER MODAL
function updateBookmarkUI() {
  const countEl = document.getElementById("bookmark-count");
  if (countEl) countEl.innerText = bookmarks.length;

  const container = document.getElementById("bookmark-list-container");
  if (!container) return;

  if (bookmarks.length === 0) {
    container.innerHTML = `
      <p class="text-stone-400 text-center py-6 text-xs italic">
        Belum ada bookmark tersimpan.<br>Klik 📌 Bookmark pada ayat untuk menyimpan.
      </p>`;
    return;
  }

  // Header Modal (Tombol Hapus Semua) + List Item Bookmark
  container.innerHTML = `
    <div class="flex justify-between items-center pb-2 mb-2 border-b border-stone-200">
      <span class="text-[11px] font-semibold text-stone-500">Koleksi (${bookmarks.length} Ayat)</span>
      <button onclick="clearAllBookmarks()" class="text-[10px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg border border-red-200 transition">
        🗑️ Hapus Semua
      </button>
    </div>
    <div class="space-y-2">
      ${bookmarks.map((b) => `
        <div class="flex justify-between items-center p-2.5 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 transition">
          <div>
            <span class="font-bold text-amber-900 text-xs">Surah ${b.surahName}</span>
            <span class="text-stone-500 text-[10px] block">Ayat ${b.ayatNumber}</span>
          </div>
          <div class="flex space-x-1.5">
            <button onclick="goToBookmark(${b.surahNumber}, ${b.ayatNumber})" class="bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm transition">
              Buka ➔
            </button>
            <button onclick="toggleBookmark(${b.surahNumber}, '${b.surahName}', ${b.ayatNumber})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold transition" title="Hapus Bookmark">
              ✕
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 2. FUNGSI HAPUS SEMUA BOOKMARK SEKALIGUS
function clearAllBookmarks() {
  if (bookmarks.length === 0) return;

  // Konfirmasi dialog keamanan
  if (confirm("Apakah Anda yakin ingin menghapus SEMUA daftar bookmark tersimpan?")) {
    bookmarks = []; // Kosongkan array
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks)); // Simpan perubahan ke LocalStorage
    
    updateBookmarkUI();        // Refresh UI Modal
    updateHomeWidgetData();   // Refresh Widget Beranda
    
    if (typeof renderAyats === 'function') {
      renderAyats();          // Refresh status ikon bookmark di kartu ayat (jika sedang membuka tab Al-Qur'an)
    }
  }
}

// 2. FUNGSI UTAMA BUKA AYAT DARI MODAL BOOKMARK
function goToBookmark(surahNumber, ayatNumber) {
  // A. Sembunyikan modal popup bookmark
  const modal = document.getElementById("bookmark-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  // B. Pindah aktif ke Tab Al-Qur'an
  if (typeof switchTab === 'function') {
    switchTab('quran');
  }

  // C. Update dropdown Pilihan Surah
  const select = document.getElementById("surah-select");
  if (select) select.value = surahNumber;

  // D. Fetch data surah dan scroll mulus ke lokasi ayat
  if (typeof fetchSurahDetail === 'function') {
    fetchSurahDetail(surahNumber);

    setTimeout(() => {
      const ayatEl = document.getElementById(`ayat-card-${ayatNumber - 1}`);
      if (ayatEl) {
        ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Efek sorotan warna emas sementara
        ayatEl.classList.add('bg-amber-200/80', 'ring-2', 'ring-amber-500', 'transition-all');
        setTimeout(() => {
          ayatEl.classList.remove('bg-amber-200/80');
        }, 2500);
      }
    }, 700);
  }
}

/* ==========================================================================
   FUNGSI MODAL & NAVIGASI BOOKMARK (LENGKAP & INTEGRATED)
   ========================================================================== */

// 1. TOGGLE BUKA/TUTUP MODAL BOOKMARK
function toggleBookmarkModal() {
  const modal = document.getElementById("bookmark-modal");
  if (!modal) return;

  if (typeof updateBookmarkUI === 'function') {
    updateBookmarkUI();
  }

  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// 2. WIDGET BOOKMARK DI BERANDA
function goToLatestBookmark() {
  toggleBookmarkModal();
}

// 3. FUNGSI "BUKA ➔" AYAT DARI DALAM MODAL
function goToBookmark(surahNumber, ayatNumber) {
  // Tutup modal
  const modal = document.getElementById("bookmark-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  // Pindah ke Tab Al-Qur'an
  if (typeof switchTab === 'function') {
    switchTab('quran');
  }

  // Set nilai dropdown Surah
  const select = document.getElementById("surah-select");
  if (select) select.value = surahNumber;

  // Render & scroll ke ayat tujuan
  if (typeof fetchSurahDetail === 'function') {
    fetchSurahDetail(surahNumber);

    setTimeout(() => {
      const ayatEl = document.getElementById(`ayat-card-${ayatNumber - 1}`);
      if (ayatEl) {
        ayatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ayatEl.classList.add('bg-amber-200/80', 'ring-2', 'ring-amber-500', 'transition-all');
        setTimeout(() => {
          ayatEl.classList.remove('bg-amber-200/80');
        }, 2500);
      }
    }, 700);
  }
}

/* ==========================================================================
   SISTEM MULTI-TANDAI AYAT (POPUP DAFTAR, LOMPAT KE AYAT, HAPUS SATUAN/SEMUA)
   ========================================================================== */
const MARKED_AYATS_STORAGE_KEY = "quran_marked_ayats_list_v1";

function getMarkedAyats() {
  try {
    const raw = localStorage.getItem(MARKED_AYATS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function setMarkedAyats(list) {
  localStorage.setItem(MARKED_AYATS_STORAGE_KEY, JSON.stringify(list));
  updateMarkedCountBadge();
}

function updateMarkedCountBadge() {
  const badge = document.getElementById("marked-count-badge");
  if (badge) {
    badge.innerText = getMarkedAyats().length;
  }
}

// Dipanggil saat tombol "📖 Tandai" di setiap kartu ayat diklik
function saveLastRead(surahNumber, surahName, ayatNumber) {
  const sNum = Number(surahNumber);
  const aNum = Number(ayatNumber);

  // 1. Tetap perbarui "quran_last_read" & updateLastReadUI() agar kartu beranda tidak berubah
  const newLastRead = {
    surahNumber: sNum,
    surahName: surahName,
    ayatNumber: aNum,
    timestamp: new Date().getTime()
  };
  localStorage.setItem("quran_last_read", JSON.stringify(newLastRead));
  if (typeof updateLastReadUI === "function") {
    updateLastReadUI();
  }

  // 2. Masukkan ke daftar riwayat multi-tanda (hindari duplikat surat & ayat yang sama)
  const list = getMarkedAyats();
  const existingIdx = list.findIndex(
    (item) => Number(item.surahNumber) === sNum && Number(item.ayatNumber) === aNum
  );

  if (existingIdx === -1) {
    const now = new Date();
    const timeLabel =
      now.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) +
      " • " +
      now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    list.unshift({
      surahNumber: sNum,
      surahName: surahName,
      ayatNumber: aNum,
      savedAt: timeLabel
    });
    setMarkedAyats(list);
  }

  // 3. Jika ayat yang ditandai lebih dari 1 (atau mengetuk ayat yang sudah ditandai), buka menu popup!
  if (list.length > 1 || existingIdx !== -1) {
    openMarkedAyatsModal();
  } else if (typeof showCustomAlert === "function") {
    showCustomAlert({
      icon: "📖",
      title: "Berhasil Ditandai",
      message: `Surah ${surahName} (Ayat ${aNum}) disimpan sebagai penanda bacaan.`
    });
  }
}

function openMarkedAyatsModal() {
  const modal = document.getElementById("marked-ayats-modal");
  if (!modal) return;
  renderMarkedAyatsList();
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeMarkedAyatsModal() {
  const modal = document.getElementById("marked-ayats-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function renderMarkedAyatsList() {
  const listContainer = document.getElementById("marked-ayats-list");
  const subtitleEl = document.getElementById("marked-ayats-subtitle");
  const clearAllBtn = document.getElementById("btn-clear-all-marked");
  if (!listContainer) return;

  const list = getMarkedAyats();
  if (subtitleEl) {
    subtitleEl.innerText = `${list.length} ayat ditandai • Klik untuk menuju ayat`;
  }
  if (clearAllBtn) {
    clearAllBtn.style.display = list.length > 0 ? "inline-flex" : "none";
  }

  if (list.length === 0) {
    listContainer.innerHTML = `
      <div class="py-8 text-center text-stone-400 text-xs">
        <p class="text-2xl mb-1">📖</p>
        <p>Belum ada ayat yang ditandai.</p>
        <p class="text-[10px] mt-1">Tekan tombol <b>📖 Tandai</b> pada ayat untuk menyimpannya di sini.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = list
    .map(
      (item) => `
    <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200 transition">
      <button onclick="jumpToMarkedAyat(${item.surahNumber}, ${item.ayatNumber})" class="flex-1 text-left">
        <div class="font-bold text-xs text-amber-950">Surah ${item.surahName} • Ayat ${item.ayatNumber}</div>
        <div class="text-[10px] text-stone-500 mt-0.5">${item.savedAt || "Tersimpan"}</div>
      </button>
      <button onclick="deleteSingleMarkedAyat(${item.surahNumber}, ${item.ayatNumber})" title="Hapus tanda ini" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-red-100 text-red-600 border border-stone-200 text-xs font-bold shrink-0 transition">
        ✕
      </button>
    </div>
  `
    )
    .join("");
}

function deleteSingleMarkedAyat(surahNumber, ayatNumber) {
  const updated = getMarkedAyats().filter(
    (item) => !(Number(item.surahNumber) === Number(surahNumber) && Number(item.ayatNumber) === Number(ayatNumber))
  );
  setMarkedAyats(updated);

  // Sinkronkan juga penanda terakhir di beranda
  if (updated.length > 0) {
    const latest = updated[0];
    localStorage.setItem(
      "quran_last_read",
      JSON.stringify({
        surahNumber: latest.surahNumber,
        surahName: latest.surahName,
        ayatNumber: latest.ayatNumber,
        timestamp: new Date().getTime()
      })
    );
  } else {
    localStorage.removeItem("quran_last_read");
  }
  if (typeof updateLastReadUI === "function") updateLastReadUI();

  renderMarkedAyatsList();
}

function clearAllMarkedAyats() {
  setMarkedAyats([]);
  localStorage.removeItem("quran_last_read");
  if (typeof updateLastReadUI === "function") updateLastReadUI();
  renderMarkedAyatsList();
}

async function jumpToMarkedAyat(surahNumber, ayatNumber) {
  closeMarkedAyatsModal();

  if (typeof switchTab === "function") {
    switchTab("quran");
  }

  const currentNum = currentSurahData ? currentSurahData.number || currentSurahData.nomor : null;
  if (Number(currentNum) !== Number(surahNumber)) {
    const surahSelect = document.getElementById("surah-select");
    if (surahSelect) surahSelect.value = String(surahNumber);
    if (typeof onSurahChange === "function") {
      await onSurahChange(String(surahNumber));
    }
  }

  setTimeout(() => {
    const targetCard = document.getElementById(`ayat-card-${Number(ayatNumber) - 1}`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      targetCard.classList.add("ring-2", "ring-amber-500", "bg-amber-50");
      setTimeout(() => {
        targetCard.classList.remove("ring-2", "ring-amber-500", "bg-amber-50");
      }, 2200);
    }
  }, 350);
}

document.addEventListener("DOMContentLoaded", updateMarkedCountBadge);

function showTajweedModalFromElement(element, wordAr, wordTr) {
  const VALID_KEYS = ["g", "i", "n", "b", "q", "o", "j"];
  let detectedKey = null;

  // 1. Cari class 1-huruf (g, i, n, b, q, o, j) pada elemen yang diklik, child-nya, atau parent-nya
  const candidates = [
    element,
    ...(element ? Array.from(element.querySelectorAll("*")) : []),
    element?.parentElement
  ].filter(Boolean);

  for (const node of candidates) {
    if (!node.classList) continue;
    const found = VALID_KEYS.find((k) => node.classList.contains(k));
    if (found) {
      detectedKey = found;
      break;
    }
  }

  // Fallback jika tidak ditemukan
  if (!detectedKey) detectedKey = "g";

  // 2. Kamus lengkap sesuai 7 legenda tajwid (g, i, n, b, q, o, j)
  const LEGEND_TAJWEED_DB = {
    g: {
      title: "Ghunnah Musyaddadah",
      rule: "Wajib didengungkan 2 Harakat (1 Alif) dari pangkal hidung.",
      desc: "Khusus berlaku pada huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ)."
    },
    i: {
      title: "Idgham (Bighunnah & Bilaghunnah)",
      rule: "Meleburkan bunyi Nun sukun/tanwin ke huruf berikutnya (dengung 2 harakat untuk ي ن م و, tanpa dengung untuk ل ر).",
      desc: "Berlaku apabila Nun sukun (نْ) atau tanwin bertemu salah satu huruf Idgham (ي ، ن ، م ، و ، ل ، ر)."
    },
    n: {
      title: "Ikhfa Haqiqi",
      rule: "Dibaca samar-samar antara Izhar dan Idgham disertai dengung 2 Harakat.",
      desc: "Berlaku apabila Nun sukun (نْ) atau tanwin bertemu salah satu dari 15 huruf Ikhfa (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك)."
    },
    b: {
      title: "Iqlab",
      rule: "Mengubah bunyi Nun sukun/tanwin menjadi Mim (م) disertai dengung 2 Harakat.",
      desc: "Berlaku apabila Nun sukun (نْ) atau tanwin bertemu dengan huruf Ba (ب)."
    },
    q: {
      title: "Qalqalah (Sughra & Kubra)",
      rule: "Dibaca memantul jelas saat huruf berharakat sukun asli maupun waqaf.",
      desc: "Berlaku pada 5 huruf Qalqalah: ق ، ط ، ب ، ج ، د (Baju Di Thoqo). Pantulan ringan di tengah kata dan kuat di akhir ayat."
    },
    o: {
      title: "Mad Wajib Muttashil",
      rule: "Wajib dipanjangkan 4 hingga 5 Harakat (2 sampai 2,5 Alif) secara bersambung.",
      desc: "Berlaku apabila huruf Mad (ا ، و ، ي) bertemu dengan huruf Hamzah (ء) dalam satu kata yang sama."
    },
    j: {
      title: "Mad Jaiz Munfashil",
      rule: "Dipanjangkan 2, 4, atau 5 Harakat (umumnya 4 Harakat).",
      desc: "Berlaku apabila huruf Mad (ا ، و ، ي) berada di akhir kata dan bertemu huruf Hamzah (ء) di awal kata berikutnya."
    }
  };

  // Gabungkan data dari officialTajweedDatabase (jika ada) dan LEGEND_TAJWEED_DB
  const db = typeof officialTajweedDatabase !== "undefined" ? officialTajweedDatabase : {};
  const officialInfo = db[detectedKey] || {};
  const fallbackInfo = LEGEND_TAJWEED_DB[detectedKey] || LEGEND_TAJWEED_DB["g"];

  const titleText = officialInfo.title || officialInfo.name || fallbackInfo.title;
  const ruleText = officialInfo.rule || officialInfo.cara || fallbackInfo.rule;
  const descText = officialInfo.desc || officialInfo.description || officialInfo.penjelasan || fallbackInfo.desc;

  // Ambil warna asli dari CSS kelas legenda (.g, .i, .n, .b, .q, .o, .j)
  const legendSpan = document.querySelector(`#tajweed-legend .${detectedKey}`);
  const badgeColor =
    officialInfo.color ||
    (legendSpan ? window.getComputedStyle(legendSpan).color : "") ||
    (element ? window.getComputedStyle(element).color : "#d97706");

  const modal = document.getElementById("tajweed-info-modal");
  if (!modal) return;

  const titleEl = document.getElementById("tajweed-modal-title");
  const badgeEl = document.getElementById("tajweed-modal-color-badge");
  const wordEl = document.getElementById("tajweed-modal-word");
  const transEl = document.getElementById("tajweed-modal-trans");
  const ruleEl = document.getElementById("tajweed-modal-rule");
  const descEl = document.getElementById("tajweed-modal-desc");

  if (titleEl) titleEl.innerText = titleText;
  if (badgeEl) badgeEl.style.backgroundColor = badgeColor;
  if (wordEl) wordEl.innerText = wordAr || element?.innerText?.trim() || "الكلمة";
  if (transEl) transEl.innerText = wordTr || "Kata Terpilih";
  if (ruleEl) ruleEl.innerText = ruleText;
  if (descEl) descEl.innerText = descText;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeKhatamModal() {
  const modal = document.getElementById("khatam-modal");
  if (modal) modal.classList.add("hidden");
}

function saveJuzStatusFromModal() {
  closeKhatamModal();
  renderKhatamGrid();
}

function updateHomeKhatamWidget() {
  const khatamData = JSON.parse(localStorage.getItem("quran_khatam_data")) || {};
  let completedCount = 0;
  for (let i = 1; i <= 30; i++) {
    if (khatamData[i]?.done) completedCount++;
  }
  const percent = Math.round((completedCount / 30) * 100);
  const badgeEl = document.getElementById("home-khatam-badge");
  const barEl = document.getElementById("home-khatam-progress-bar");
  if (badgeEl) badgeEl.innerText = `${completedCount} / 30 Juz (${percent}%)`;
  if (barEl) barEl.style.width = `${percent}%`;
}

/* ==========================================================================
   FUNGSI WIDGET BOOKMARK BERANDA (OPSI 2: AMAN & BISA DIKLIK)
   ========================================================================== */

function goToLatestBookmark() {
  // 1. Pastikan data bookmark terbaru di-render ke modal
  if (typeof updateBookmarkUI === 'function') {
    updateBookmarkUI();
  }

  // 2. Buka popup modal daftar bookmark lengkap
  const modal = document.getElementById("bookmark-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function handleSearch(keyword) {
  const container = document.getElementById("search-results-container");
  if (!container) return;

  const query = keyword.toLowerCase().trim();

  if (query.length === 0) {
    container.innerHTML = '<p class="text-stone-400 text-center py-4 italic text-xs">Ketik nama surah (misal: An-Nas atau 114)...</p>';
    return;
  }

  // Ambil daftar surah langsung dari elemen dropdown yang sudah berhasil ter-load di layar
  const surahDropdown = document.querySelector("select"); 
  if (!surahDropdown || surahDropdown.options.length === 0) {
    container.innerHTML = '<p class="text-amber-700 text-center py-4 italic text-xs">Daftar surah belum tersedia.</p>';
    return;
  }

  // Ubah opsi dropdown menjadi array dan saring sesuai ketikan
  const optionsArray = Array.from(surahDropdown.options);
  const results = optionsArray.filter(opt => 
    opt.text.toLowerCase().includes(query) || opt.value === query
  );

  if (results.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-stone-400 text-xs">
        <p>Surah "<strong>${keyword}</strong>" tidak ditemukan.</p>
      </div>`;
    return;
  }

  // Tampilkan hasil pencarian
  container.innerHTML = results.map(opt => `
    <div onclick="selectSurahFromSearch('${opt.value}')" class="p-2.5 bg-stone-50 hover:bg-amber-50 rounded-lg border border-stone-200 cursor-pointer transition flex justify-between items-center shadow-sm">
      <span class="font-bold text-xs text-amber-900">${opt.text}</span>
      <span class="text-[10px] text-amber-700 font-semibold">Buka ➔</span>
    </div>
  `).join('');
}

function selectSurahFromSearch(surahNumber) {
  toggleSearchModal();
  
  const surahDropdown = document.querySelector("select");
  if (surahDropdown) {
    surahDropdown.value = surahNumber;
    // Memicu event bawaan dropdown Anda agar surah otomatis berganti
    surahDropdown.dispatchEvent(new Event('change'));
  }
}

/* ==========================================================================
   PENYESUAIAN TANGGAL MASEHI & HIJRIAH (REAL-TIME AUTOMATIC)
   ========================================================================== */

function updateDateHeader() {
  const hijriEl = document.getElementById("today-date-hijri");
  const masehiEl = document.getElementById("today-date-masehi");

  const today = new Date();

  // 1. Format Tanggal Masehi (Contoh: 12 Nov 2026)
  if (masehiEl) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    masehiEl.innerText = today.toLocaleDateString('id-ID', options);
  }

  // 2. Format Tanggal Hijriah menggunakan Intl.DateTimeFormat bawaan browser
  if (hijriEl) {
    try {
      // Menggunakan kalendar islamic-umalqura bawaan JS (tanpa perlu fetch API luar)
      const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const hijriFormatted = hijriFormatter.format(today);
      hijriEl.innerText = `${hijriFormatted} H`;
    } catch (e) {
      // Fallback jika browser lama tidak mendukung islamic calendar
      hijriEl.innerText = "2 Jumadil Akhir 1448 H";
    }
  }
}

// Panggil fungsi saat aplikasi dimuat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateDateHeader);
} else {
  updateDateHeader();
}

/* ==========================================================================
   MODUL AMALAN HARIAN CUSTOM (CHECKLIST HARIAN + KELOLA TARGET + AUTO-RESET)
   ========================================================================== */

const DEFAULT_AMALAN_LIST = [
  { id: "amalan_1", text: "Sholat Fardhu 5 Waktu Tepat Waktu" },
  { id: "amalan_2", text: "Tilawah Al-Qur'an Harian" },
  { id: "amalan_3", text: "Dzikir Pagi & Petang" },
  { id: "amalan_4", text: "Sedekah Harian" }
];

// Helper: Tanggal hari ini (YYYY-MM-DD) untuk reset centang otomatis tiap hari
function getTodayAmalanKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Ambil daftar target amalan dari localStorage
function getAmalanItems() {
  const saved = localStorage.getItem("quran_amalan_items");
  if (!saved) {
    localStorage.setItem("quran_amalan_items", JSON.stringify(DEFAULT_AMALAN_LIST));
    return [...DEFAULT_AMALAN_LIST];
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_AMALAN_LIST];
  } catch (e) {
    return [...DEFAULT_AMALAN_LIST];
  }
}

// Ambil status centang khusus hari ini (otomatis reset jika tanggal berganti)
function getTodayAmalanCheckedMap() {
  const today = getTodayAmalanKey();
  const savedDate = localStorage.getItem("quran_amalan_checked_date");
  if (savedDate !== today) {
    localStorage.setItem("quran_amalan_checked_date", today);
    localStorage.setItem("quran_amalan_checked_map", JSON.stringify({}));
    return {};
  }
  try {
    return JSON.parse(localStorage.getItem("quran_amalan_checked_map")) || {};
  } catch (e) {
    return {};
  }
}

// 1. RENDER DAFTAR CHECKLIST AMALAN DI KARTU UTAMA
function renderAmalanChecklist() {
  const container = document.getElementById("amalan-checklist-container");
  const badgeEl = document.getElementById("amalan-count-badge");
  if (!container) return;

  const items = getAmalanItems();
  const checkedMap = getTodayAmalanCheckedMap();

  if (items.length === 0) {
    container.innerHTML = `<p class="text-[11px] text-stone-400 italic py-3 text-center">Belum ada target amalan. Klik <b>⚙️ Custom</b> untuk menambah.</p>`;
    if (badgeEl) badgeEl.innerText = "0/0 Selesai";
    return;
  }

  let doneCount = 0;
  let html = "";

  items.forEach((item) => {
    const isChecked = Boolean(checkedMap[item.id]);
    if (isChecked) doneCount++;

    html += `
      <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-amber-50/70 cursor-pointer transition select-none">
        <input type="checkbox" onchange="toggleAmalanCheck('${item.id}')" ${isChecked ? "checked" : ""} class="accent-amber-700 rounded w-3.5 h-3.5 shrink-0">
        <span class="text-xs leading-snug ${isChecked ? "line-through text-stone-400" : "text-stone-700 font-medium"}">${item.text}</span>
      </label>
    `;
  });

  container.innerHTML = html;
  if (badgeEl) badgeEl.innerText = `${doneCount}/${items.length} Selesai`;
}

// 2. TOGGLE CENTANG AMALAN HARIAN
function toggleAmalanCheck(amalanId) {
  const checkedMap = getTodayAmalanCheckedMap();
  checkedMap[amalanId] = !Boolean(checkedMap[amalanId]);
  localStorage.setItem("quran_amalan_checked_map", JSON.stringify(checkedMap));
  renderAmalanChecklist();
}

// 3. BUKA & TUTUP MODAL CUSTOM AMALAN
function openCustomAmalanModal() {
  const modal = document.getElementById("custom-amalan-modal");
  if (!modal) return;

  renderCustomAmalanManageList();
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const inputEl = document.getElementById("new-amalan-input");
  if (inputEl) {
    inputEl.value = "";
    setTimeout(() => inputEl.focus(), 100);
  }
}

function closeCustomAmalanModal() {
  const modal = document.getElementById("custom-amalan-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  renderAmalanChecklist();
}

// 4. RENDER DAFTAR AMALAN DI DALAM MODAL KELOLA
function renderCustomAmalanManageList() {
  const listEl = document.getElementById("custom-amalan-list-manage");
  if (!listEl) return;

  const items = getAmalanItems();
  if (items.length === 0) {
    listEl.innerHTML = `<p class="text-[11px] text-stone-400 italic text-center py-2">Daftar masih kosong.</p>`;
    return;
  }

  listEl.innerHTML = items.map((item, index) => `
    <div class="flex items-center justify-between gap-2 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs">
      <span class="text-stone-700 font-medium truncate">${index + 1}. ${item.text}</span>
      <button type="button" onclick="deleteAmalanItem('${item.id}')" class="text-red-500 hover:text-red-700 text-[11px] font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition shrink-0" title="Hapus Amalan">
        🗑️
      </button>
    </div>
  `).join("");
}

// 5. TAMBAH AMALAN CUSTOM BARU (TOMBOL + TAMBAH & ENTER)
function addNewAmalanItem() {
  const inputEl = document.getElementById("new-amalan-input");
  if (!inputEl) return;

  const rawText = inputEl.value.trim();
  if (!rawText) {
    inputEl.focus();
    return;
  }

  const items = getAmalanItems();
  const newItem = {
    id: "amalan_" + Date.now(),
    text: rawText
  };

  items.push(newItem);
  localStorage.setItem("quran_amalan_items", JSON.stringify(items));

  inputEl.value = "";
  inputEl.focus();

  renderCustomAmalanManageList();
  renderAmalanChecklist();
}

// 6. HAPUS ITEM AMALAN
function deleteAmalanItem(amalanId) {
  let items = getAmalanItems();
  items = items.filter((item) => item.id !== amalanId);
  localStorage.setItem("quran_amalan_items", JSON.stringify(items));

  const checkedMap = getTodayAmalanCheckedMap();
  delete checkedMap[amalanId];
  localStorage.setItem("quran_amalan_checked_map", JSON.stringify(checkedMap));

  renderCustomAmalanManageList();
  renderAmalanChecklist();
}

// Inisialisasi saat halaman dimuat + dukung tombol Enter pada input
(function initAmalanHarianModule() {
  const setup = () => {
    renderAmalanChecklist();
    const inputEl = document.getElementById("new-amalan-input");
    if (inputEl && !inputEl.dataset.enterBound) {
      inputEl.dataset.enterBound = "true";
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addNewAmalanItem();
        }
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

// Ekspos ke global window agar onclick di HTML selalu terhubung
window.openCustomAmalanModal = openCustomAmalanModal;
window.closeCustomAmalanModal = closeCustomAmalanModal;
window.addNewAmalanItem = addNewAmalanItem;
window.deleteAmalanItem = deleteAmalanItem;
window.toggleAmalanCheck = toggleAmalanCheck;

/* ==========================================================================
   MODUL CATATAN QADHA PUASA (COUNTER + LOCALSTORAGE + NOTIFIKASI LUNAS)
   ========================================================================== */

let qadhaDaysCount = parseInt(localStorage.getItem("quran_qadha_days"), 10) || 0;

function renderQadhaCounter() {
  const valEl = document.getElementById("qadha-counter-val");
  if (valEl) {
    valEl.innerText = qadhaDaysCount;
  }
}

function showQadhaLunasNotif() {
  const title = "Alhamdulillah, Qadha Puasa Lunas! 🎉";
  const message = "MasyaAllah, seluruh utang puasa Ramadhanmu telah lunas terbayar. Semoga Allah menerima amal ibadahmu dan memberkahi setiap langkahmu.";

  if (typeof showCustomAlert === "function") {
    showCustomAlert({
      icon: "🌙",
      iconBg: "bg-emerald-100 text-emerald-600",
      title: title,
      message: message,
      confirmText: "Aamiin, Alhamdulillah"
    });
  } else {
    alert(`${title}\n\n${message}`);
  }
}

function updateQadhaCount(delta) {
  const prevVal = qadhaDaysCount;
  const nextVal = qadhaDaysCount + Number(delta);

  // Cegah angka minus (minimal 0 hari)
  qadhaDaysCount = nextVal < 0 ? 0 : nextVal;
  window.qadhaDaysCount = qadhaDaysCount;

  localStorage.setItem("quran_qadha_days", String(qadhaDaysCount));
  renderQadhaCounter();

  // Munculkan pesan ucapan syukur HANYA saat berkurang dari > 0 menjadi tepat 0
  if (delta < 0 && prevVal > 0 && qadhaDaysCount === 0) {
    showQadhaLunasNotif();
  }
}

// Muat angka tersimpan saat aplikasi dibuka
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderQadhaCounter);
} else {
  renderQadhaCounter();
}

window.qadhaDaysCount = qadhaDaysCount;
window.updateQadhaCount = updateQadhaCount;

/* ==========================================================================
   MODUL DOA & HADITS DINAMIS (LIVE API + CACHE & FALLBACK OFFLINE OTOMATIS)
   ========================================================================== */

const FALLBACK_DOA_HADITS_DB = [
  {
    id: "ramadhan_1",
    category: "ramadhan",
    title: "Niat Puasa Ramadhan",
    arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى",
    latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.",
    translation: "Aku berniat puasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta'ala.",
    source: "Kesepakatan Ulama (Niat Puasa)"
  },
  {
    id: "ramadhan_2",
    category: "ramadhan",
    title: "Doa Berbuka Puasa (Shahih)",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    latin: "Dzahabazh zhama'u wabtallatil 'uruuqu, wa tsabatal ajru in syaa Allah.",
    translation: "Telah hilang rasa haus, urat-urat telah basah, dan pahala telah ditetapkan, insya Allah.",
    source: "HR. Abu Daud No. 2357 (Hasan)"
  },
  {
    id: "ramadhan_3",
    category: "ramadhan",
    title: "Doa Malam Lailatul Qadar",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.",
    translation: "Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai pemaafan, maka maafkanlah aku.",
    source: "HR. Tirmidzi No. 3513 (Shahih)"
  }
];

let dynamicDoaHaditsList = [...FALLBACK_DOA_HADITS_DB];
let activeDoaCategory = "all";
let currentDailyDoaItem = FALLBACK_DOA_HADITS_DB[0];

// Helper: Update badge status koneksi di Tab Doa & Hadits
function setDoaNetworkBadge(status) {
  const badge = document.getElementById("network-status-badge");
  if (!badge) return;

  if (status === "loading") {
    badge.className = "bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-300";
    badge.innerText = "⏳ Menghubungkan Server...";
  } else if (status === "online") {
    badge.className = "bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold border border-green-300";
    badge.innerText = "🟢 Online (Server Live)";
  } else {
    badge.className = "bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300";
    badge.innerText = "🟡 Offline (Mode Cache)";
  }
}

// Helper: Deteksi kategori Ramadhan secara otomatis dari judul doa API
function detectDoaCategory(titleText) {
  const lower = (titleText || "").toLowerCase();
  const ramadhanKeywords = ["puasa", "ramadhan", "sahur", "buka", "berbuka", "lailatul", "tarawih", "witir", "idul fitri"];
  return ramadhanKeywords.some((kw) => lower.includes(kw)) ? "ramadhan" : "harian";
}

// 1. FETCH DINAMIS DARI SERVER API PUBLIK (DOA + HADITS)
async function loadDynamicDoaAndHadits() {
  setDoaNetworkBadge("loading");

  // Muat cache lama terlebih dahulu agar layar langsung terisi tanpa kedip kosong
  const cached = localStorage.getItem("quran_dynamic_doa_hadits_cache");
  if (cached) {
    try {
      const parsedCache = JSON.parse(cached);
      if (Array.isArray(parsedCache) && parsedCache.length > 0) {
        dynamicDoaHaditsList = parsedCache;
        updateDailyHighlightCard();
        renderDoaList();
      }
    } catch (e) {}
  }

  try {
    // Ambil Doa Harian & Hadits secara paralel dengan batas waktu 8 detik
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const [doaRes, haditsRes] = await Promise.allSettled([
      fetch("https://islamic-api-zhirrr.vercel.app/api/doaharian", { signal: controller.signal }),
      fetch("https://api.hadith.gading.dev/books/bukhari?range=1-25", { signal: controller.signal })
    ]);

    clearTimeout(timeoutId);

    const mergedItems = [...FALLBACK_DOA_HADITS_DB];
    let hasLiveSuccess = false;

    // A. Proses Respons API Doa Harian
    if (doaRes.status === "fulfilled" && doaRes.value.ok) {
      const doaJson = await doaRes.value.json();
      const rawDoaArray = doaJson?.data || doaJson || [];
      if (Array.isArray(rawDoaArray) && rawDoaArray.length > 0) {
        hasLiveSuccess = true;
        rawDoaArray.forEach((d, idx) => {
          const title = d.title || d.doa || `Doa Harian #${idx + 1}`;
          mergedItems.push({
            id: `live_doa_${idx}`,
            category: detectDoaCategory(title),
            title: title,
            arabic: d.arabic || d.ayat || "",
            latin: d.latin || "",
            translation: d.translation || d.artinya || "",
            source: "Doa Harian (Server Live)"
          });
        });
      }
    }

    // B. Proses Respons API Hadits (HR. Bukhari)
    if (haditsRes.status === "fulfilled" && haditsRes.value.ok) {
      const haditsJson = await haditsRes.value.json();
      const rawHaditsArray = haditsJson?.data?.hadiths || [];
      if (Array.isArray(rawHaditsArray) && rawHaditsArray.length > 0) {
        hasLiveSuccess = true;
        rawHaditsArray.forEach((h) => {
          const shortPreview = (h.id || "").split(" ").slice(0, 7).join(" ") + "...";
          mergedItems.push({
            id: `live_hadits_bukhari_${h.number}`,
            category: "hadits",
            title: `HR. Bukhari No. ${h.number} — ${shortPreview}`,
            arabic: h.arab || "",
            latin: "",
            translation: h.id || "",
            source: `HR. Bukhari No. ${h.number}`
          });
        });
      }
    }

    if (hasLiveSuccess) {
      dynamicDoaHaditsList = mergedItems;
      localStorage.setItem("quran_dynamic_doa_hadits_cache", JSON.stringify(mergedItems));
      setDoaNetworkBadge("online");
    } else {
      setDoaNetworkBadge("offline");
    }
  } catch (err) {
    setDoaNetworkBadge("offline");
  }

  updateDailyHighlightCard();
  renderDoaList();
}

function updateDailyHighlightCard() {
  if (!dynamicDoaHaditsList.length) return;

  // Sinkronkan ke array lama jika memang masih ada di scope global
  if (typeof doaDatabase !== "undefined" && Array.isArray(doaDatabase)) {
    doaDatabase.length = 0;
    doaDatabase.push(...dynamicDoaHaditsList);
  }
  window.doaDatabase = dynamicDoaHaditsList;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const dailyIndex = dayOfYear % dynamicDoaHaditsList.length;
  currentDailyDoaItem = dynamicDoaHaditsList[dailyIndex];

  // 1. Update Kartu Pilihan Hari Ini di Tab 3 (Doa & Hadits)
  const dateLabel = document.getElementById("daily-date-label");
  const titleEl = document.getElementById("daily-item-title");
  const arabicEl = document.getElementById("daily-item-arabic");
  const latinEl = document.getElementById("daily-item-latin");
  const transEl = document.getElementById("daily-item-translation");
  const sourceEl = document.getElementById("daily-item-source");

  if (dateLabel) {
    dateLabel.innerText = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }
  if (titleEl) titleEl.innerText = currentDailyDoaItem.title;
  if (arabicEl) arabicEl.innerText = currentDailyDoaItem.arabic;
  if (latinEl) {
    latinEl.innerText = currentDailyDoaItem.latin || "";
    latinEl.style.display = currentDailyDoaItem.latin ? "block" : "none";
  }
  if (transEl) transEl.innerText = `"${currentDailyDoaItem.translation}"`;
  if (sourceEl) sourceEl.innerText = `Sumber: ${currentDailyDoaItem.source}`;

  // 2. Update Widget Doa & Hadits Hari Ini di Beranda
  const homeTitleEl = document.getElementById("home-daily-title");
  const homeArabicEl = document.getElementById("home-daily-arabic");
  const homeTransEl = document.getElementById("home-daily-translation");

  if (homeTitleEl) homeTitleEl.innerText = currentDailyDoaItem.title;
  if (homeArabicEl) homeArabicEl.innerText = currentDailyDoaItem.arabic;
  if (homeTransEl) homeTransEl.innerText = `"${currentDailyDoaItem.translation}"`;
}


// 3. FILTER & PENCARIAN
function filterDoaCategory(category) {
  activeDoaCategory = category;

  ["all", "ramadhan", "harian", "hadits"].forEach((cat) => {
    const btn = document.getElementById(`btn-cat-${cat}`);
    if (!btn) return;
    btn.className =
      cat === category
        ? "bg-amber-700 text-white px-3 py-1 rounded-full shrink-0 font-semibold shadow-sm"
        : "bg-stone-200 text-stone-700 hover:bg-amber-100 px-3 py-1 rounded-full shrink-0 font-semibold transition";
  });

  renderDoaList();
}

// 4. SALIN TEKS PILIHAN HARI INI & KARTU SPESIFIK
function copyTextToClipboard(textToCopy, labelTitle) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => showCopySuccessToast(labelTitle)).catch(() => fallbackCopyText(textToCopy, labelTitle));
  } else {
    fallbackCopyText(textToCopy, labelTitle);
  }
}

function fallbackCopyText(text, labelTitle) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showCopySuccessToast(labelTitle);
  } catch (e) {}
  document.body.removeChild(ta);
}

function showCopySuccessToast(labelTitle) {
  if (typeof showCustomAlert === "function") {
    showCustomAlert({
      icon: "📋",
      iconBg: "bg-emerald-100 text-emerald-600",
      title: "Berhasil Disalin",
      message: `"${labelTitle}" telah disalin ke clipboard.`,
      confirmText: "Oke"
    });
  }
}

function copyDailyText() {
  if (!currentDailyDoaItem) return;
  const formatted = `${currentDailyDoaItem.title}\n\n${currentDailyDoaItem.arabic}\n${currentDailyDoaItem.latin ? "\n" + currentDailyDoaItem.latin + "\n" : ""}\nArtinya: "${currentDailyDoaItem.translation}"\n(${currentDailyDoaItem.source})`;
  copyTextToClipboard(formatted, currentDailyDoaItem.title);
}

function copyDoaCardById(id) {
  const item = dynamicDoaHaditsList.find((d) => d.id === id);
  if (!item) return;
  const formatted = `${item.title}\n\n${item.arabic}\n${item.latin ? "\n" + item.latin + "\n" : ""}\nArtinya: "${item.translation}"\n(${item.source})`;
  copyTextToClipboard(formatted, item.title);
}

// Jalankan otomatis saat halaman dimuat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadDynamicDoaAndHadits);
} else {
  loadDynamicDoaAndHadits();
}

window.filterDoaCategory = filterDoaCategory;
window.renderDoaList = renderDoaList;
window.copyDailyText = copyDailyText;
window.copyDoaCardById = copyDoaCardById;
window.loadDynamicDoaAndHadits = loadDynamicDoaAndHadits;

/* ==========================================================================
   SISTEM POPUP ALERT BAWAAN APLIKASI (OVERRIDE NATIVE WINDOW.ALERT)
   ========================================================================== */
(function initAppCustomPopup() {
  function ensurePopupElement() {
    let modal = document.getElementById("app-native-alert-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "app-native-alert-modal";
    modal.className =
      "fixed inset-0 bg-black/70 hidden items-center justify-center p-4 z-[9999] transition-opacity";
    modal.innerHTML = `
      <div class="bg-[#fdfbf7] border border-amber-300 rounded-2xl max-w-xs w-full p-5 shadow-2xl text-stone-800 space-y-3 text-center">
        <div id="app-alert-icon" class="w-11 h-11 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
          🔔
        </div>
        <h3 id="app-alert-title" class="font-bold text-sm text-amber-950">Informasi</h3>
        <p id="app-alert-message" class="text-xs text-stone-600 leading-relaxed whitespace-pre-line"></p>
        <div class="pt-1">
          <button type="button" id="app-alert-close-btn"
            class="w-full bg-amber-700 hover:bg-amber-800 active:scale-[0.98] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition">
            Mengerti
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closePopup = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    };

    modal.querySelector("#app-alert-close-btn").addEventListener("click", closePopup);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePopup();
    });

    return modal;
  }

  // Fungsi global showCustomAlert dengan tampilan aplikasi
  window.showCustomAlert = function (opts) {
    const modal = ensurePopupElement();
    const isObj = typeof opts === "object" && opts !== null;

    const icon = isObj && opts.icon ? opts.icon : "🔔";
    const title = isObj && opts.title ? opts.title : "Informasi Aplikasi";
    const message = isObj ? opts.message || "" : String(opts ?? "");

    modal.querySelector("#app-alert-icon").textContent = icon;
    modal.querySelector("#app-alert-title").textContent = title;
    modal.querySelector("#app-alert-message").textContent = message;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  // Timpa alert() bawaan sistem browser/WebView agar selalu memakai popup aplikasi
  window.alert = function (msg) {
    window.showCustomAlert({
      icon: "🕌",
      title: "Pemberitahuan",
      message: String(msg ?? "")
    });
  };
})();

/* ==========================================================================
   MODUL LENGKAP DOA & HADITS TERPADU (HINT DINAMIS + PENCARIAN EKSTERNAL + 4 API)
   ========================================================================== */
(function initUnifiedDoaHaditsSystem() {
  const CACHE_KEY = "quran_dynamic_doa_hadits_cache_v2";
  let selectedDoaCategory = "all";
  let unifiedList = [];

  const OFFLINE_HADITS_BACKUP = [
    {
      id: "fb_hadits_1",
      category: "hadits",
      title: "Hadits Arba'in No. 1 — Niat dan Ikhlas",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      latin: "Innamal a'maalu bin-niyyaat, wa innaamaa likullimri'in maa nawaa.",
      translation: "Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.",
      source: "HR. Bukhari No. 1 & Muslim No. 1907"
    },
    {
      id: "fb_hadits_2",
      category: "hadits",
      title: "Keutamaan Puasa Ramadhan dengan Iman",
      arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
      latin: "Man shaama Ramadhaana iimaanan wahtisaaban ghufira lahu maa taqaddama min dzanbih.",
      translation: "Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap pahala dari Allah, maka diampuni dosa-dosanya yang telah lalu.",
      source: "HR. Bukhari No. 38 & Muslim No. 760"
    },
    {
      id: "fb_hadits_3",
      category: "hadits",
      title: "Sebaik-baik Manusia adalah yang Paling Bermanfaat",
      arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
      latin: "Khairun naasi anfa'uhum linnaas.",
      translation: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.",
      source: "HR. Ahmad & Thabrani (Hasan)"
    }
  ];

  // Ekstrak kata kunci nyata yang benar-benar ada di dalam daftar doa & hadits aktif
  function generateDynamicHints() {
    const candidateKeywords = [
      "Bukhari",
      "Muslim",
      "Niat",
      "Puasa",
      "Sholat",
      "Iman",
      "Sedekah",
      "Sabar",
      "Surga",
      "Dosa",
      "Ilmu",
      "Makan",
      "Tidur",
      "Orang Tua",
      "Ramadhan"
    ];

    const available = candidateKeywords.filter((kw) => {
      const lower = kw.toLowerCase();
      return unifiedList.some(
        (item) =>
          (item.title || "").toLowerCase().includes(lower) ||
          (item.translation || "").toLowerCase().includes(lower) ||
          (item.source || "").toLowerCase().includes(lower)
      );
    });

    return available.slice(0, 8);
  }

  // Render bar hint di bawah kotak pencarian #doa-search-input
  function renderSearchHints() {
    const searchInput = document.getElementById("doa-search-input");
    if (!searchInput || !searchInput.parentElement) return;

    const parentBox = searchInput.parentElement.parentElement || searchInput.parentElement;
    let hintBar = document.getElementById("doa-search-hints-bar");

    if (!hintBar) {
      hintBar = document.createElement("div");
      hintBar.id = "doa-search-hints-bar";
      hintBar.className = "flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar";
      searchInput.parentElement.insertAdjacentElement("afterend", hintBar);
    }

    const currentVal = searchInput.value.trim();
    const hints = generateDynamicHints();

    const resetBtn = currentVal
      ? `<button type="button" onclick="applyDoaSearchHint('')"
           class="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
           ✕ Reset
         </button>`
      : "";

    const hintChips = hints
      .map((kw) => {
        const isActive = currentVal.toLowerCase() === kw.toLowerCase();
        return `<button type="button" onclick="applyDoaSearchHint('${kw.replace(/'/g, "\\'")}')"
          class="${
            isActive
              ? "bg-amber-700 text-white border-amber-700"
              : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
          } border px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 transition">
          #${kw}
        </button>`;
      })
      .join("");

    hintBar.innerHTML = `<span class="text-[10px] text-stone-400 shrink-0">Saran:</span>${resetBtn}${hintChips}`;
  }

  window.applyDoaSearchHint = function (keyword) {
    const searchInput = document.getElementById("doa-search-input");
    if (searchInput) {
      searchInput.value = keyword;
    }
    window.renderDoaList();
  };

  function collectExistingDoa() {
    const map = new Map();
    const sources = [];
    if (typeof doaDatabase !== "undefined" && Array.isArray(doaDatabase)) sources.push(...doaDatabase);
    if (typeof dynamicDoaHaditsList !== "undefined" && Array.isArray(dynamicDoaHaditsList)) sources.push(...dynamicDoaHaditsList);

    sources.forEach((item) => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }

  function mergeHaditsIntoSystem(haditsItems, saveToCache = false) {
    const baseItems = collectExistingDoa().filter(
      (item) => (item.category || "").toLowerCase() !== "hadits"
    );

    const normalizedHadits = haditsItems.map((h) => ({
      ...h,
      category: "hadits"
    }));

    unifiedList = [...baseItems, ...normalizedHadits];

    if (typeof doaDatabase !== "undefined" && Array.isArray(doaDatabase)) {
      doaDatabase.length = 0;
      doaDatabase.push(...unifiedList);
    }
    if (typeof dynamicDoaHaditsList !== "undefined" && Array.isArray(dynamicDoaHaditsList)) {
      dynamicDoaHaditsList.length = 0;
      dynamicDoaHaditsList.push(...unifiedList);
    }

    if (saveToCache && normalizedHadits.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(normalizedHadits));
      } catch (e) {}
    }

    window.renderDoaList();
    if (typeof updateDailyHighlightCard === "function") {
      try {
        updateDailyHighlightCard();
      } catch (e) {}
    }
  }

  window.filterDoaCategory = function (cat) {
    selectedDoaCategory = (cat || "all").toLowerCase().trim();
    if (typeof currentDoaCategory !== "undefined") currentDoaCategory = selectedDoaCategory;
    if (typeof activeDoaCategory !== "undefined") activeDoaCategory = selectedDoaCategory;

    const categories = ["all", "ramadhan", "harian", "hadits"];
    categories.forEach((c) => {
      const btn = document.getElementById(`btn-cat-${c}`);
      if (btn) {
        btn.className =
          c === selectedDoaCategory
            ? "bg-amber-700 text-white px-3 py-1 rounded-full shrink-0 font-semibold shadow-sm"
            : "bg-stone-200 text-stone-700 hover:bg-amber-100 px-3 py-1 rounded-full shrink-0 font-semibold";
      }
    });

    window.renderDoaList();
  };

  window.renderDoaList = function () {
    renderSearchHints();

    const container = document.getElementById("doa-cards-container");
    if (!container) return;

    const searchInput = document.getElementById("doa-search-input");
    const rawKeyword = searchInput ? searchInput.value.trim() : "";
    const keyword = rawKeyword.toLowerCase();

    const filtered = unifiedList.filter((item) => {
      const itemCat = (item.category || "").toLowerCase().trim();
      const matchCat = selectedDoaCategory === "all" || itemCat === selectedDoaCategory;
      if (!matchCat) return false;
      if (!keyword) return true;

      return (
        (item.title || "").toLowerCase().includes(keyword) ||
        (item.latin || "").toLowerCase().includes(keyword) ||
        (item.translation || "").toLowerCase().includes(keyword) ||
        (item.source || "").toLowerCase().includes(keyword)
      );
    });

    if (filtered.length === 0) {
      const queryText = rawKeyword || "kumpulan doa dan hadits shahih";
      const encodedQuery = encodeURIComponent(queryText);
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText + " arab latin dan artinya")}`;
      const sunnahSearchUrl = `https://sunnah.com/search?q=${encodedQuery}`;
      const nuOnlineSearchUrl = `https://www.google.com/search?q=${encodeURIComponent("site:nu.or.id OR site:rumaysho.com " + queryText)}`;

      container.innerHTML = `
        <div class="bg-white border border-amber-200 rounded-2xl p-5 text-center space-y-3 shadow-sm">
          <div class="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
            🔍
          </div>
          <div class="space-y-1">
            <p class="text-xs font-bold text-stone-800">
              "${rawKeyword ? rawKeyword.replace(/</g, "&lt;") : "Item"}" belum ada di database aplikasi
            </p>
            <p class="text-[11px] text-stone-500">
              Lanjutkan pencarian langsung melalui referensi Islam terpercaya di bawah ini:
            </p>
          </div>

          <div class="space-y-2 pt-1">
            <a href="${googleSearchUrl}" target="_blank" rel="noopener noreferrer"
               class="w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition">
              <span>🌐 Cari "${rawKeyword || "Doa & Hadits"}" di Google</span>
              <span>↗</span>
            </a>

            <div class="grid grid-cols-2 gap-2">
              <a href="${sunnahSearchUrl}" target="_blank" rel="noopener noreferrer"
                 class="inline-flex items-center justify-center gap-1 bg-stone-800 hover:bg-stone-900 text-amber-200 font-semibold text-[11px] py-2 px-2.5 rounded-xl border border-stone-700 transition">
                <span>📜 Sunnah.com</span>
                <span>↗</span>
              </a>
              <a href="${nuOnlineSearchUrl}" target="_blank" rel="noopener noreferrer"
                 class="inline-flex items-center justify-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] py-2 px-2.5 rounded-xl transition">
                <span>📖 NU / Rumaysho</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const badgeLabels = {
      ramadhan: { text: "🌙 Ramadhan", cls: "bg-amber-100 text-amber-800 border-amber-200" },
      harian: { text: "🤲 Sehari-hari", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      hadits: { text: "📜 Hadits", cls: "bg-stone-200 text-stone-700 border-stone-300" }
    };

    container.innerHTML = filtered
      .map((item) => {
        const badge = badgeLabels[item.category] || badgeLabels.hadits;
        const latinHtml = item.latin
          ? `<p class="text-[11px] text-amber-800 italic leading-relaxed">${item.latin}</p>`
          : "";

        return `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-2.5">
          <div class="flex justify-between items-start gap-2 border-b border-stone-100 pb-2">
            <h4 class="font-bold text-xs text-amber-950 leading-snug">${item.title}</h4>
            <span class="text-[9px] px-2 py-0.5 rounded-full border font-semibold shrink-0 ${badge.cls}">${badge.text}</span>
          </div>

          <p class="text-right font-quran text-lg text-stone-900 leading-loose pt-1">${item.arabic}</p>
          ${latinHtml}
          <p class="text-xs text-stone-600 leading-relaxed">"${item.translation}"</p>

          <div class="pt-2 flex justify-between items-center border-t border-stone-100 text-[10px] text-stone-400">
            <span>${item.source}</span>
            <button type="button" onclick="copyDoaCardById('${item.id}')" class="bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 px-2.5 py-1 rounded-lg font-bold border border-stone-200 transition">
              📋 Salin
            </button>
          </div>
        </div>
      `;
      })
      .join("");
  };

  window.copyDoaCardById = function (id) {
    const item = unifiedList.find((x) => String(x.id) === String(id));
    if (!item) return;
    const text = `${item.title}\n\n${item.arabic}\n${item.latin ? item.latin + "\n" : ""}"${item.translation}"\n(${item.source})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (typeof window.showCustomAlert === "function") {
      window.showCustomAlert({
        icon: "📋",
        title: "Teks Tersalin",
        message: `"${item.title}" berhasil disalin ke papan klip.`
      });
    }
  };

  let initialHadits = OFFLINE_HADITS_BACKUP;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (Array.isArray(cached) && cached.length > 0) {
      initialHadits = cached;
    }
  } catch (e) {}
  mergeHaditsIntoSystem(initialHadits, false);

  (async function fetchHaditsMultiServer() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const dailyPage = (dayOfYear % 50) + 1;
    const rangeStart = (dailyPage - 1) * 20 + 1;
    const rangeEnd = rangeStart + 19;

    const formatHadithItem = (prefix, kitabLabel, number, arabText, indoText) => {
      const cleanIndo = (indoText || "").replace(/\s+/g, " ").trim();
      const shortTitle = cleanIndo.split(" ").slice(0, 6).join(" ") + "...";
      return {
        id: `${prefix}_${number}`,
        category: "hadits",
        title: `${kitabLabel} No. ${number} — ${shortTitle}`,
        arabic: arabText || "",
        latin: "",
        translation: cleanIndo,
        source: `${kitabLabel} No. ${number}`
      };
    };

    let liveHadits = [];

    // JALUR 1: Vercel API
    try {
      const [bukhariRes, muslimRes] = await Promise.allSettled([
        fetch(`https://hadis-api-id.vercel.app/hadith/bukhari?page=${dailyPage}&limit=20`),
        fetch(`https://hadis-api-id.vercel.app/hadith/muslim?page=${dailyPage}&limit=20`)
      ]);

      if (bukhariRes.status === "fulfilled" && bukhariRes.value.ok) {
        const json = await bukhariRes.value.json();
        const items = json?.items || json?.data?.hadiths || json?.data || [];
        items.forEach((h) => {
          if (h.id || h.translation) {
            liveHadits.push(formatHadithItem("vercel_bukhari", "HR. Bukhari", h.number, h.arab, h.id || h.translation));
          }
        });
      }

      if (muslimRes.status === "fulfilled" && muslimRes.value.ok) {
        const json = await muslimRes.value.json();
        const items = json?.items || json?.data?.hadiths || json?.data || [];
        items.forEach((h) => {
          if (h.id || h.translation) {
            liveHadits.push(formatHadithItem("vercel_muslim", "HR. Muslim", h.number, h.arab, h.id || h.translation));
          }
        });
      }
    } catch (e1) {}

    // JALUR 2: Gading Hadits API (24 Jam)
    if (liveHadits.length === 0) {
      try {
        const [gBukhari, gMuslim] = await Promise.allSettled([
          fetch(`https://api.hadith.gading.dev/books/bukhari?range=${rangeStart}-${rangeEnd}`),
          fetch(`https://api.hadith.gading.dev/books/muslim?range=${rangeStart}-${rangeEnd}`)
        ]);

        if (gBukhari.status === "fulfilled" && gBukhari.value.ok) {
          const json = await gBukhari.value.json();
          (json?.data?.hadiths || []).forEach((h) => {
            if (h.id) liveHadits.push(formatHadithItem("gading_bukhari", "HR. Bukhari", h.number, h.arab, h.id));
          });
        }

        if (gMuslim.status === "fulfilled" && gMuslim.value.ok) {
          const json = await gMuslim.value.json();
          (json?.data?.hadiths || []).forEach((h) => {
            if (h.id) liveHadits.push(formatHadithItem("gading_muslim", "HR. Muslim", h.number, h.arab, h.id));
          });
        }
      } catch (e2) {}
    }

    // JALUR 3 & 4: jsDelivr Global CDN & GitHub Raw (Arba'in Nawawi 24 Jam)
    if (liveHadits.length === 0) {
      const mirrors = [
        {
          indo: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-nawawi.min.json",
          arab: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi.min.json"
        },
        {
          indo: "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ind-nawawi.min.json",
          arab: "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-nawawi.min.json"
        }
      ];

      for (const m of mirrors) {
        try {
          const [indoRes, arabRes] = await Promise.all([fetch(m.indo), fetch(m.arab)]);
          if (indoRes.ok) {
            const indoJson = await indoRes.json();
            const arabJson = arabRes.ok ? await arabRes.json() : { hadiths: [] };
            const arabMap = new Map((arabJson.hadiths || []).map((a) => [a.hadithnumber, a.text]));

            (indoJson.hadiths || [])
              .filter((h) => h.text && h.text.trim().length > 10)
              .forEach((h) => {
                liveHadits.push(
                  formatHadithItem(
                    "cdn_nawawi",
                    "Hadits Arba'in Nawawi",
                    h.hadithnumber,
                    arabMap.get(h.hadithnumber) || "",
                    h.text
                  )
                );
              });
            if (liveHadits.length > 0) break;
          }
        } catch (e3) {}
      }
    }

    if (liveHadits.length > 0) {
      mergeHaditsIntoSystem(liveHadits, true);
      console.log(`✅ [Unified] Berhasil memuat ${liveHadits.length} hadits online (Multi-Server 24 Jam)`);
    }
  })();
})();


function initNetworkStatusListener() {}

/* ==========================================================================
   AUTO-RECOVERY AL-QUR'AN & PEMBERSIH LOADING MACET
   ========================================================================== */
(function ensureQuranReadyOnStartup() {
  async function recoverQuranIfStuck() {
    const select = document.getElementById("surah-select");
    const ayatsContainer = document.getElementById("ayats-container");

    // 1. Jika dropdown surah masih kosong atau tertahan di "Memuat Surah..."
    const isSelectStuck =
      !select ||
      select.options.length <= 1 ||
      (select.options[0] && select.options[0].text.toLowerCase().includes("memuat"));

    if (isSelectStuck && typeof fetchSurahList === "function") {
      try {
        await fetchSurahList();
      } catch (e) {
        console.warn("Pemulihan fetchSurahList:", e);
      }
    }

    // 2. Jika daftar surah sudah ada tapi isi ayat masih kosong / belum ter-render
    if (
      (!currentSurahData || !Array.isArray(currentSurahData.ayat) || currentSurahData.ayat.length === 0) &&
      typeof fetchSurahDetail === "function"
    ) {
      let targetSurah = 1;
      try {
        const saved = JSON.parse(localStorage.getItem("quran_last_read") || "null");
        if (saved && saved.surahNumber) targetSurah = Number(saved.surahNumber);
      } catch (e) {}
      try {
        await fetchSurahDetail(targetSurah);
      } catch (e) {
        console.warn("Pemulihan fetchSurahDetail:", e);
      }
    }

    // 3. Tutup banner kuning "Menyiapkan data Al-Qur'an di background..." yang macet berputar
    document.querySelectorAll("div, p, span").forEach((el) => {
      if (
        el.children.length <= 3 &&
        el.textContent &&
        el.textContent.includes("Menyiapkan data Al-Qur'an di background")
      ) {
        const bannerBox = el.closest(".bg-amber-100, .bg-yellow-100, .bg-amber-50, [id*='banner'], [id*='sync']") || el;
        bannerBox.style.display = "none";
      }
    });

    // 4. Pastikan tanggal di kartu Beranda tidak "-- --- 2026"
    const hdHome = document.getElementById("current-hijri-date");
    if (hdHome && hdHome.innerText.includes("--")) {
      const now = new Date();
      const masehiStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      try {
        const hijriStr = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }).format(now);
        hdHome.innerText = `${hijriStr} • ${masehiStr}`;
      } catch (e) {
        hdHome.innerText = masehiStr;
      }
    }
  }

  // Jalankan pengecekan otomatis 1.2 detik setelah halaman terbuka
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(recoverQuranIfStuck, 1200));
  } else {
    setTimeout(recoverQuranIfStuck, 1200);
  }
})();

/* ==========================================================================
   HITUNG MUNDUR RAMADHAN DINAMIS (ANTI-KEDALUWARSA & SELALU AKURAT)
   ========================================================================== */
function updateRamadhanCountdownWidget() {
  const el = document.getElementById("ramadhan-countdown-days");
  if (!el) return;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Daftar perkiraan awal 1 Ramadhan (Hijriah ke Masehi)
  const ramadhanStartDates = [
    new Date(2026, 1, 18), // 1 Ramadhan 1447 H (18 Feb 2026)
    new Date(2027, 1, 8),  // 1 Ramadhan 1448 H (8 Feb 2027)
    new Date(2028, 0, 28), // 1 Ramadhan 1449 H (28 Jan 2028)
    new Date(2029, 0, 16)  // 1 Ramadhan 1450 H (16 Jan 2029)
  ];

  // Cek apakah hari ini sedang berada di dalam bulan Ramadhan (30 hari sejak tanggal mulai)
  for (const start of ramadhanStartDates) {
    const end = new Date(start.getTime() + 30 * 86400000);
    if (todayStart >= start && todayStart < end) {
      const dayOfRamadhan = Math.floor((todayStart - start) / 86400000) + 1;
      el.innerText = `Hari ke-${dayOfRamadhan}`;
      return;
    }
  }

  // Cari tanggal 1 Ramadhan terdekat di masa depan
  const nextRamadhan = ramadhanStartDates.find((d) => d > todayStart);
  if (nextRamadhan) {
    const diffDays = Math.ceil((nextRamadhan - todayStart) / 86400000);
    el.innerText = `${diffDays} Hari`;
  } else {
    el.innerText = "-- Hari";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateRamadhanCountdownWidget);
} else {
  updateRamadhanCountdownWidget();
}

/* ==========================================================================
   MODUL KISAH 25 NABI + LINK REFERENSI SEJARAH LENGKAP (WIKIPEDIA & SEJARAH ISLAM)
   ========================================================================== */
(function initKisahNabiModule() {
  // Peta Referensi Sejarah Lengkap untuk masing-masing dari 25 Nabi
  const NABI_REFERENCES = {
    1:  { url: "https://id.wikipedia.org/wiki/Adam_dalam_Islam", source: "Wikipedia Indonesia • Sejarah Islam" },
    2:  { url: "https://id.wikipedia.org/wiki/Idris", source: "Wikipedia Indonesia • Sejarah Islam" },
    3:  { url: "https://id.wikipedia.org/wiki/Nuh", source: "Wikipedia Indonesia • Sejarah Islam" },
    4:  { url: "https://id.wikipedia.org/wiki/Hud", source: "Wikipedia Indonesia • Sejarah Islam" },
    5:  { url: "https://id.wikipedia.org/wiki/Saleh", source: "Wikipedia Indonesia • Sejarah Islam" },
    6:  { url: "https://id.wikipedia.org/wiki/Ibrahim", source: "Wikipedia Indonesia • Sejarah Islam" },
    7:  { url: "https://id.wikipedia.org/wiki/Lut", source: "Wikipedia Indonesia • Sejarah Islam" },
    8:  { url: "https://id.wikipedia.org/wiki/Ismail", source: "Wikipedia Indonesia • Sejarah Islam" },
    9:  { url: "https://id.wikipedia.org/wiki/Ishak", source: "Wikipedia Indonesia • Sejarah Islam" },
    10: { url: "https://id.wikipedia.org/wiki/Yakub", source: "Wikipedia Indonesia • Sejarah Islam" },
    11: { url: "https://id.wikipedia.org/wiki/Yusuf", source: "Wikipedia Indonesia • Sejarah Islam" },
    12: { url: "https://id.wikipedia.org/wiki/Ayub", source: "Wikipedia Indonesia • Sejarah Islam" },
    13: { url: "https://id.wikipedia.org/wiki/Syuaib", source: "Wikipedia Indonesia • Sejarah Islam" },
    14: { url: "https://id.wikipedia.org/wiki/Musa", source: "Wikipedia Indonesia • Sejarah Islam" },
    15: { url: "https://id.wikipedia.org/wiki/Harun", source: "Wikipedia Indonesia • Sejarah Islam" },
    16: { url: "https://id.wikipedia.org/wiki/Zulkifli", source: "Wikipedia Indonesia • Sejarah Islam" },
    17: { url: "https://id.wikipedia.org/wiki/Daud", source: "Wikipedia Indonesia • Sejarah Islam" },
    18: { url: "https://id.wikipedia.org/wiki/Sulaiman", source: "Wikipedia Indonesia • Sejarah Islam" },
    19: { url: "https://id.wikipedia.org/wiki/Ilyas", source: "Wikipedia Indonesia • Sejarah Islam" },
    20: { url: "https://id.wikipedia.org/wiki/Ilyasa", source: "Wikipedia Indonesia • Sejarah Islam" },
    21: { url: "https://id.wikipedia.org/wiki/Yunus", source: "Wikipedia Indonesia • Sejarah Islam" },
    22: { url: "https://id.wikipedia.org/wiki/Zakariyya", source: "Wikipedia Indonesia • Sejarah Islam" },
    23: { url: "https://id.wikipedia.org/wiki/Yahya", source: "Wikipedia Indonesia • Sejarah Islam" },
    24: { url: "https://id.wikipedia.org/wiki/Isa", source: "Wikipedia Indonesia • Sejarah Islam" },
    25: { url: "https://id.wikipedia.org/wiki/Muhammad", source: "Wikipedia Indonesia • Sirah Nabawiyah" }
  };

  let activeKisahId = null;

  // Pastikan setiap item di kisahnabiDatabase memiliki properti refUrl & refSource
  function getEnrichedKisahList() {
    if (typeof kisahnabiDatabase === "undefined" || !Array.isArray(kisahnabiDatabase)) {
      return [];
    }
    return kisahnabiDatabase.map((n) => {
      const ref = NABI_REFERENCES[n.id] || {
        url: `https://id.wikipedia.org/wiki/${encodeURIComponent(n.name.replace(/\s+(AS|SAW)$/i, ""))}`,
        source: "Wikipedia Indonesia • Sejarah Islam"
      };
      return {
        ...n,
        refUrl: n.refUrl || ref.url,
        refSource: n.refSource || ref.source
      };
    });
  }

  // 1. Render Grid Kartu 25 Nabi ke #kisah-grid-container
  window.renderKisahList = function () {
    const container = document.getElementById("kisah-grid-container");
    const searchEl = document.getElementById("kisah-search-input");
    if (!container) return;

    const keyword = searchEl ? searchEl.value.toLowerCase().trim() : "";
    const list = getEnrichedKisahList();

    const filtered = list.filter((n) => {
      if (!keyword) return true;
      return (
        (n.name || "").toLowerCase().includes(keyword) ||
        (n.era || "").toLowerCase().includes(keyword) ||
        (n.location || "").toLowerCase().includes(keyword) ||
        (n.miracle || "").toLowerCase().includes(keyword) ||
        (n.summary || "").toLowerCase().includes(keyword)
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-stone-400 text-xs italic">Tidak ditemukan kisah Nabi yang cocok dengan pencarian "${keyword}".</div>`;
      return;
    }

    container.innerHTML = filtered
      .map(
        (n) => `
      <div onclick="openKisahDetail(${n.id})" class="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm hover:border-amber-500 active:scale-[0.99] transition cursor-pointer flex flex-col justify-between space-y-2">
        <div>
          <div class="flex justify-between items-start gap-2 border-b border-stone-100 pb-2">
            <div class="flex items-center space-x-2">
              <span class="w-6 h-6 rounded-full bg-amber-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                ${n.id}
              </span>
              <div>
                <h4 class="font-bold text-amber-950 text-xs leading-tight">Nabi ${n.name}</h4>
                <span class="text-[10px] text-stone-500 block">${n.era} • ${n.location}</span>
              </div>
            </div>
            <span class="font-quran text-lg text-amber-800 font-bold shrink-0">${n.arabic}</span>
          </div>

          <p class="text-[11px] text-stone-700 leading-relaxed mt-2 line-clamp-3">
            ${n.summary}
          </p>
        </div>

        <div class="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
          <span class="text-amber-700 font-semibold">📖 Baca Kisah & Mukjizat</span>
          <a href="${n.refUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 px-2 py-0.5 rounded border border-stone-300 font-semibold">
            🌐 Referensi
          </a>
        </div>
      </div>`
      )
      .join("");
  };

  // 2. Buka Modal Detail Kisah Nabi + Tombol Baca Lengkap di Wikipedia/Sejarah Islam
  window.openKisahDetail = function (id) {
    const list = getEnrichedKisahList();
    const nabi = list.find((item) => item.id === Number(id));
    if (!nabi) return;

    activeKisahId = nabi.id;

    const modal = document.getElementById("kisah-modal");
    const titleEl = document.getElementById("kisah-modal-title");
    const subEl = document.getElementById("kisah-modal-subtitle");
    const contentEl = document.getElementById("kisah-modal-content");
    const sourceEl = document.getElementById("kisah-modal-source");

    if (titleEl) titleEl.innerText = `Nabi ${nabi.name} (${nabi.arabic})`;
    if (subEl) subEl.innerText = `Nabi ke-${nabi.id} • ${nabi.era} • Diutus di ${nabi.location}`;
    if (sourceEl) sourceEl.innerText = `Sumber: ${nabi.refSource}`;

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">✨ Mukjizat & Keutamaan</span>
          <p class="text-xs text-amber-950 font-medium leading-relaxed">${nabi.miracle}</p>
        </div>

        <div class="space-y-1.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">📜 Ringkasan Sejarah</span>
          <p class="text-xs text-stone-700 leading-relaxed">${nabi.summary}</p>
        </div>

        <div class="space-y-1.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">📖 Kisah Perjuangan Dakwah</span>
          <p class="text-xs text-stone-800 leading-relaxed text-justify">${nabi.story}</p>
        </div>

        <div class="pt-2">
          <a href="${nabi.refUrl}" target="_blank" rel="noopener noreferrer"
             class="w-full inline-flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-900 text-amber-200 font-bold text-xs py-2.5 px-3 rounded-xl border border-stone-700 shadow-sm transition">
            <span>🌐 Baca Sejarah Lengkap di Wikipedia</span>
            <span>↗</span>
          </a>
        </div>
      `;
    }

    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  };

  // 3. Tutup / Toggle Modal Kisah Nabi
  window.toggleKisahModal = function () {
    const modal = document.getElementById("kisah-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  // 4. Salin Teks Kisah Nabi + Link Referensi
  window.copyKisahText = function () {
    const list = getEnrichedKisahList();
    const nabi = list.find((item) => item.id === activeKisahId);
    if (!nabi) return;

    const text = `Kisah Nabi ${nabi.name} (${nabi.arabic})\nEra: ${nabi.era} | Lokasi: ${nabi.location}\n\nMukjizat:\n${nabi.miracle}\n\nKisah:\n${nabi.story}\n\nReferensi Sejarah Lengkap:\n${nabi.refUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (typeof showCustomAlert === "function") {
      showCustomAlert({
        icon: "📋",
        title: "Kisah Tersalin",
        message: `Kisah Nabi ${nabi.name} beserta tautan referensi berhasil disalin.`
      });
    }
  };

  // Jalankan render awal & pastikan ter-render ulang saat tombol tab Kisah Nabi diklik
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && btn.textContent && btn.textContent.includes("Kisah Nabi")) {
      setTimeout(() => {
        window.renderKisahList();
      }, 50);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.renderKisahList);
  } else {
    window.renderKisahList();
  }
})();

function calculateRamadhanCountdown() {
  if (typeof updateRamadhanCountdownWidget === "function") updateRamadhanCountdownWidget();
}

/* ==========================================================================
   SISTEM NOTIFIKASI & AUDIO ADZAN OTOMATIS (TERINTEGRASI DI MENU PENGATURAN ⚙️)
   ========================================================================== */
(function initAdzanNotificationSystem() {
  const ADZAN_STORAGE_KEY = "islamic_app_adzan_enabled";
  let isAdzanEnabled = localStorage.getItem(ADZAN_STORAGE_KEY) !== "false"; // Default aktif
  let lastTriggeredKey = "";
  let activeAudio = null;
  let fallbackOscillators = [];

  const ADZAN_AUDIO_SOURCES = [
    "https://www.islamcan.com/audio/adhan/azan1.mp3",
    "https://www.islamcan.com/audio/adhan/azan2.mp3",
    "https://cdn.islamic.network/audio/adhan/128/ar.makkah.mp3"
  ];

  // Hentikan semua suara adzan & tutup modal adzan
  window.stopAdzanAudio = function () {
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {}
      activeAudio = null;
    }
    fallbackOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    fallbackOscillators = [];

    const modal = document.getElementById("app-adzan-alert-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  };

  // Nada melodi adzan lembut offline via Web Audio API jika MP3 online diblokir/offline
  function playOfflineAdzanChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [
        { freq: 349.23, time: 0.0, dur: 0.6 },
        { freq: 392.00, time: 0.65, dur: 0.6 },
        { freq: 440.00, time: 1.3, dur: 0.9 },
        { freq: 466.16, time: 2.3, dur: 0.7 },
        { freq: 440.00, time: 3.1, dur: 1.2 }
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + n.time + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur + 0.05);
        fallbackOscillators.push(osc);
      });
    } catch (e) {}
  }

  function playAdzanSound() {
    window.stopAdzanAudio();

    let sourceIndex = 0;
    const tryNextSource = () => {
      if (sourceIndex >= ADZAN_AUDIO_SOURCES.length) {
        playOfflineAdzanChime();
        return;
      }
      const audio = new Audio(ADZAN_AUDIO_SOURCES[sourceIndex]);
      audio.volume = 1.0;
      activeAudio = audio;

      audio.onerror = () => {
        sourceIndex++;
        tryNextSource();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          playOfflineAdzanChime();
        });
      }
    };

    tryNextSource();
  }

  // Modal Popup Notifikasi Adzan
  window.triggerAdzanNotification = function (sholatName, timeStr, isTest = false) {
    playAdzanSound();

    let modal = document.getElementById("app-adzan-alert-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "app-adzan-alert-modal";
      modal.className =
        "fixed inset-0 bg-black/75 hidden items-center justify-center p-4 z-[9999]";
      modal.innerHTML = `
        <div class="bg-[#fdfbf7] border-2 border-amber-500 rounded-2xl max-w-xs w-full p-5 shadow-2xl text-stone-800 space-y-3 text-center">
          <div class="w-14 h-14 mx-auto rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-2xl animate-bounce">
            🕌
          </div>
          <div class="space-y-1">
            <span id="adzan-modal-badge" class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-800 text-amber-100">
              Panggilan Sholat
            </span>
            <h3 id="adzan-modal-title" class="font-bold text-base text-amber-950 pt-1">Waktu Sholat Tiba</h3>
            <p id="adzan-modal-time" class="text-xs font-semibold text-amber-700"></p>
          </div>
          <p class="text-[11px] text-stone-600 leading-relaxed">
            "Hayya 'alash shalaah, hayya 'alal falaah."<br>Mari tunaikan sholat tepat pada waktunya.
          </p>
          <div class="pt-1">
            <button type="button" onclick="stopAdzanAudio()"
              class="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition">
              🔇 Hentikan Suara Adzan
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#adzan-modal-badge").textContent = isTest
      ? "Uji Coba Audio Adzan"
      : "Waktu Sholat Telah Tiba";
    modal.querySelector("#adzan-modal-title").textContent = `Adzan ${sholatName}`;
    modal.querySelector("#adzan-modal-time").textContent = `Pukul ${timeStr} WIB`;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  // Toggle ON/OFF Adzan Otomatis
  window.toggleAdzanSetting = function () {
    isAdzanEnabled = !isAdzanEnabled;
    localStorage.setItem(ADZAN_STORAGE_KEY, String(isAdzanEnabled));
    injectAdzanIntoSettingsModal();

    if (isAdzanEnabled) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === "suspended") ctx.resume();
        }
      } catch (e) {}
    } else {
      window.stopAdzanAudio();
    }
  };

  // Hapus bar lama di header tab sholat jika sempat terpasang, dan sisipkan ke dalam Modal Pengaturan ⚙️
  function injectAdzanIntoSettingsModal() {
    const oldBar = document.getElementById("adzan-control-bar");
    if (oldBar) oldBar.remove();

    // Cari modal pengaturan tampilan ⚙️ berdasarkan ID umum atau teks judul di dalam modal
    const candidateIds = [
      "settings-modal",
      "display-settings-modal",
      "pengaturan-modal",
      "theme-modal"
    ];
    let settingsModal = candidateIds
      .map((id) => document.getElementById(id))
      .find((el) => el !== null);

    if (!settingsModal) {
      const allFixedModals = Array.from(document.querySelectorAll("div.fixed"));
      settingsModal = allFixedModals.find(
        (el) =>
          el.id !== "kisah-modal" &&
          el.id !== "app-native-alert-modal" &&
          el.id !== "app-adzan-alert-modal" &&
          /pengaturan|tampilan|ukuran font|tema/i.test(el.textContent || "")
      );
    }

    if (!settingsModal) return;

    // Cari kotak konten putih di dalam modal pengaturan
    const modalCard = settingsModal.firstElementChild || settingsModal;
    let section = document.getElementById("settings-adzan-section");

    if (!section) {
      section = document.createElement("div");
      section.id = "settings-adzan-section";
      section.className = "pt-2.5 border-t border-stone-200 space-y-2 text-left";

      // Sisipkan sebelum tombol Tutup/Selesai terakhir di dalam modal pengaturan
      const buttons = modalCard.querySelectorAll("button");
      const lastBtn = buttons.length > 0 ? buttons[buttons.length - 1] : null;
      const lastBtnWrapper = lastBtn ? lastBtn.closest("div") : null;

      if (lastBtnWrapper && lastBtnWrapper !== modalCard && lastBtnWrapper.parentElement === modalCard) {
        modalCard.insertBefore(section, lastBtnWrapper);
      } else {
        modalCard.appendChild(section);
      }
    }

    section.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-amber-950 block">📢 Notifikasi Suara Adzan</span>
          <span class="text-[10px] text-stone-500">${
            isAdzanEnabled ? "Aktif otomatis 5 waktu sholat" : "Nonaktif (mode senyap)"
          }</span>
        </div>
        <button type="button" onclick="toggleAdzanSetting()"
          class="${
            isAdzanEnabled
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-stone-200 text-stone-700 border-stone-300"
          } border px-3 py-1 rounded-lg text-[11px] font-bold transition">
          ${isAdzanEnabled ? "ON" : "OFF"}
        </button>
      </div>
      <button type="button" onclick="triggerAdzanNotification('Maghrib', '17:50', true)"
        class="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition">
        <span>🔊 Uji Coba Suara & Popup Adzan</span>
      </button>
    `;
  }

  function getTodayPrayerTimesFromDOM() {
    const mapIds = [
      { name: "Subuh", ids: ["jadwal-subuh", "time-subuh", "subuh-time"] },
      { name: "Dzuhur", ids: ["jadwal-dzuhur", "time-dzuhur", "dzuhur-time"] },
      { name: "Ashar", ids: ["jadwal-ashar", "time-ashar", "ashar-time"] },
      { name: "Maghrib", ids: ["jadwal-maghrib", "time-maghrib", "maghrib-time"] },
      { name: "Isya", ids: ["jadwal-isya", "time-isya", "isya-time"] }
    ];

    const result = [];
    mapIds.forEach((item) => {
      for (const id of item.ids) {
        const el = document.getElementById(id);
        if (el && /^\d{2}:\d{2}/.test(el.textContent.trim())) {
          result.push({ name: item.name, time: el.textContent.trim().slice(0, 5) });
          break;
        }
      }
    });
    return result;
  }

  // Pastikan opsi adzan selalu tersedia saat tombol ikon ⚙️ diklik
  document.addEventListener("click", (e) => {
    if (e.target.closest("button")) {
      setTimeout(injectAdzanIntoSettingsModal, 30);
    }
  });

  setInterval(() => {
    if (!isAdzanEnabled) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentHM = `${hh}:${mm}`;
    const todayStr = now.toDateString();

    const times = getTodayPrayerTimesFromDOM();
    times.forEach((t) => {
      const uniqueTrigger = `${todayStr}_${t.name}_${t.time}`;
      if (t.time === currentHM && lastTriggeredKey !== uniqueTrigger) {
        lastTriggeredKey = uniqueTrigger;
        window.triggerAdzanNotification(t.name, t.time, false);
      }
    });
  }, 5000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectAdzanIntoSettingsModal);
  } else {
    injectAdzanIntoSettingsModal();
  }
})();

/* ==========================================================================
   MODUL SHOW/HIDE WIDGET SHOLAT & KALKULATOR ZAKAT (FORMAT RIBUAN OTOMATIS)
   ========================================================================== */
(function initSholatWidgetsAndZakatSystem() {
  const WIDGET_STATE_KEY = "islamic_app_sholat_widgets_state";
  let activeZakatTab = "fitrah";
  let lastZakatCopyText = "";

  // Helper: Ubah string berformat titik (misal "3.000.000") menjadi angka murni (3000000)
  function parseRupiahNumber(val) {
    if (typeof val === "number") return val;
    const digitsOnly = String(val || "").replace(/[^\d]/g, "");
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  }

  // Helper: Format angka murni menjadi string ribuan Indonesia (misal "3.000.000")
  function formatThousandsID(num) {
    return Math.max(0, Math.round(num || 0)).toLocaleString("id-ID");
  }

  function formatRupiah(num) {
    return "Rp " + formatThousandsID(num);
  }

  // Auto-format input saat pengguna mengetik angka
  window.formatRupiahInput = function (inputEl) {
    if (!inputEl) return;
    const numericVal = parseRupiahNumber(inputEl.value);
    inputEl.value = formatThousandsID(numericVal);
    window.calculateZakat();
  };

  // 1. Fungsi Show / Hide Seragam untuk Amalan Harian, Qadha Puasa & Kalkulator Zakat
  window.toggleSholatWidget = function (wrapperId, btnId) {
    const wrapper = document.getElementById(wrapperId);
    const btn = document.getElementById(btnId);
    if (!wrapper) return;

    const isCurrentlyHidden = wrapper.classList.contains("hidden");
    if (isCurrentlyHidden) {
      wrapper.classList.remove("hidden");
      if (btn) btn.textContent = "👁️ Sembunyikan";
    } else {
      wrapper.classList.add("hidden");
      if (btn) btn.textContent = "👁️ Tampilkan";
    }

    try {
      const saved = JSON.parse(localStorage.getItem(WIDGET_STATE_KEY) || "{}");
      saved[wrapperId] = isCurrentlyHidden ? "open" : "closed";
      localStorage.setItem(WIDGET_STATE_KEY, JSON.stringify(saved));
    } catch (e) {}
  };

  function restoreWidgetStates() {
    try {
      const saved = JSON.parse(localStorage.getItem(WIDGET_STATE_KEY) || "{}");
      const configs = [
        { wrapper: "amalan-body-wrapper", btn: "btn-toggle-amalan" },
        { wrapper: "qadha-body-wrapper", btn: "btn-toggle-qadha" },
        { wrapper: "zakat-body-wrapper", btn: "btn-toggle-zakat" }
      ];

      configs.forEach((cfg) => {
        if (!saved[cfg.wrapper]) return;
        const wrapper = document.getElementById(cfg.wrapper);
        const btn = document.getElementById(cfg.btn);
        if (!wrapper) return;

        if (saved[cfg.wrapper] === "open") {
          wrapper.classList.remove("hidden");
          if (btn) btn.textContent = "👁️ Sembunyikan";
        } else {
          wrapper.classList.add("hidden");
          if (btn) btn.textContent = "👁️ Tampilkan";
        }
      });
    } catch (e) {}
  }

  // 2. Sinkronisasi & Format Input Harga Emas antara Panel Profesi dan Panel Maal
  window.syncGoldPriceInput = function (sourceEl) {
    const numericVal = parseRupiahNumber(sourceEl ? sourceEl.value : 1450000);
    const formatted = formatThousandsID(numericVal);

    const elProfesi = document.getElementById("zakat-gold-price-profesi");
    const elMaal = document.getElementById("zakat-gold-price-maal");
    if (elProfesi) elProfesi.value = formatted;
    if (elMaal) elMaal.value = formatted;

    window.calculateZakat();
  };

  // 3. Pindah Sub-Tab Jenis Zakat (Fitrah / Penghasilan / Maal)
  window.switchZakatType = function (type) {
    activeZakatTab = type;
    const tabs = ["fitrah", "profesi", "maal"];

    tabs.forEach((t) => {
      const btn = document.getElementById(`btn-zakat-tab-${t}`);
      const panel = document.getElementById(`zakat-panel-${t}`);
      if (btn) {
        btn.className =
          t === type
            ? "bg-emerald-700 text-white py-1.5 rounded-lg shadow-sm transition"
            : "text-stone-600 hover:text-emerald-900 py-1.5 rounded-lg transition";
      }
      if (panel) {
        if (t === type) panel.classList.remove("hidden");
        else panel.classList.add("hidden");
      }
    });

    window.calculateZakat();
  };

  // 4. Perhitungan Real-time Zakat Fitrah, Penghasilan & Maal
  window.calculateZakat = function () {
    const labelEl = document.getElementById("zakat-result-label");
    const badgeEl = document.getElementById("zakat-status-badge");
    const subDetailEl = document.getElementById("zakat-sub-detail");
    const nominalEl = document.getElementById("zakat-nominal-output");
    const nishabEl = document.getElementById("zakat-nishab-info");
    if (!nominalEl) return;

    if (activeZakatTab === "fitrah") {
      const jiwa = Math.max(1, Number(document.getElementById("zakat-fitrah-jiwa")?.value || 1));
      const hargaBeras = parseRupiahNumber(document.getElementById("zakat-fitrah-beras")?.value || "15.000");
      const totalKg = jiwa * 2.5;
      const totalRupiah = totalKg * hargaBeras;

      if (labelEl) labelEl.textContent = `Total Zakat Fitrah (${jiwa} Jiwa)`;
      if (badgeEl) {
        badgeEl.textContent = "Wajib Zakat";
        badgeEl.className = "px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-bold";
      }
      if (subDetailEl) subDetailEl.textContent = `Setara ${totalKg.toLocaleString("id-ID")} Kg Beras`;
      nominalEl.textContent = formatRupiah(totalRupiah);
      if (nishabEl) {
        nishabEl.textContent =
          "Niat Zakat Fitrah: Nawaitu an ukhrija zakaatal fithri 'an nafsii wa 'an jamii'i maa yalzamunii nafaqaatuhum syar'an fardhan lillaahi ta'aalaa.";
      }

      lastZakatCopyText = `Rincian Zakat Fitrah:\n- Jumlah Jiwa: ${jiwa} orang\n- Takaran Beras: ${totalKg} Kg (@ ${formatRupiah(hargaBeras)}/Kg)\n- Total Zakat Fitrah: ${formatRupiah(totalRupiah)}\n\nLafaz Niat:\n"Nawaitu an ukhrija zakaatal fithri 'an nafsii (wa 'an jamii'i maa yalzamunii nafaqaatuhum) fardhan lillaahi ta'aalaa."`;
    } else if (activeZakatTab === "profesi") {
      const gaji = parseRupiahNumber(document.getElementById("zakat-profesi-gaji")?.value);
      const bonus = parseRupiahNumber(document.getElementById("zakat-profesi-bonus")?.value);
      const goldPrice = Math.max(100000, parseRupiahNumber(document.getElementById("zakat-gold-price-profesi")?.value || "1.450.000"));

      const totalIncome = gaji + bonus;
      const nishabTahunan = 85 * goldPrice;
      const nishabBulanan = nishabTahunan / 12;
      const isWajib = totalIncome >= nishabBulanan && totalIncome > 0;
      const zakatVal = isWajib ? totalIncome * 0.025 : 0;

      if (labelEl) labelEl.textContent = "Zakat Penghasilan (2,5% / Bulan)";
      if (badgeEl) {
        badgeEl.textContent = isWajib ? "Wajib Zakat" : "Belum Mencapai Nishab";
        badgeEl.className = isWajib
          ? "px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold"
          : "px-2 py-0.5 rounded-full bg-stone-700 text-stone-200 font-bold";
      }
      if (subDetailEl) subDetailEl.textContent = `Nishab/bln: ${formatRupiah(nishabBulanan)}`;
      nominalEl.textContent = formatRupiah(zakatVal);
      if (nishabEl) {
        nishabEl.textContent = isWajib
          ? `Alhamdulillah, penghasilan (${formatRupiah(totalIncome)}) telah mencapai nishab bulanan (setara 85 gr emas / 12).`
          : `Penghasilan belum mencapai nishab bulanan (${formatRupiah(nishabBulanan)}). Dianjurkan bersedekah semampunya.`;
      }

      lastZakatCopyText = `Rincian Zakat Penghasilan:\n- Total Pendapatan: ${formatRupiah(totalIncome)}\n- Nishab Bulanan (85 gr emas / 12): ${formatRupiah(nishabBulanan)}\n- Status: ${isWajib ? "Wajib Zakat (2,5%)" : "Belum Nishab"}\n- Zakat Dibayarkan: ${formatRupiah(zakatVal)}`;
    } else if (activeZakatTab === "maal") {
      const tabungan = parseRupiahNumber(document.getElementById("zakat-maal-tabungan")?.value);
      const emas = parseRupiahNumber(document.getElementById("zakat-maal-emas")?.value);
      const utang = parseRupiahNumber(document.getElementById("zakat-maal-utang")?.value);
      const goldPrice = Math.max(100000, parseRupiahNumber(document.getElementById("zakat-gold-price-maal")?.value || "1.450.000"));

      const hartaBersih = Math.max(0, tabungan + emas - utang);
      const nishabMaal = 85 * goldPrice;
      const isWajib = hartaBersih >= nishabMaal && hartaBersih > 0;
      const zakatVal = isWajib ? hartaBersih * 0.025 : 0;

      if (labelEl) labelEl.textContent = "Zakat Maal / Simpanan (2,5% / Tahun)";
      if (badgeEl) {
        badgeEl.textContent = isWajib ? "Wajib Zakat (Haul 1 Thn)" : "Belum Mencapai Nishab";
        badgeEl.className = isWajib
          ? "px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold"
          : "px-2 py-0.5 rounded-full bg-stone-700 text-stone-200 font-bold";
      }
      if (subDetailEl) subDetailEl.textContent = `Harta Bersih: ${formatRupiah(hartaBersih)}`;
      nominalEl.textContent = formatRupiah(zakatVal);
      if (nishabEl) {
        nishabEl.textContent = isWajib
          ? `Harta bersih mencapai nishab 85 gr emas (${formatRupiah(nishabMaal)}). Wajib dizakati 2,5% jika sudah tersimpan 1 tahun (haul).`
          : `Nishab Zakat Maal saat ini adalah ${formatRupiah(nishabMaal)} (setara 85 gram emas).`;
      }

      lastZakatCopyText = `Rincian Zakat Maal:\n- Harta Bersih (Tabungan + Emas - Utang): ${formatRupiah(hartaBersih)}\n- Nishab 85 gr Emas: ${formatRupiah(nishabMaal)}\n- Status: ${isWajib ? "Wajib Zakat (2,5%)" : "Belum Nishab"}\n- Zakat Maal (2,5%): ${formatRupiah(zakatVal)}`;
    }
  };

  window.copyZakatSummary = function () {
    window.calculateZakat();
    if (navigator.clipboard && lastZakatCopyText) {
      navigator.clipboard.writeText(lastZakatCopyText).catch(() => {});
    }
    if (typeof window.showCustomAlert === "function") {
      window.showCustomAlert({
        icon: "⚖️",
        title: "Rincian Zakat Tersalin",
        message: "Hasil perhitungan zakat beserta niatnya berhasil disalin ke papan klip."
      });
    }
  };

  function initAll() {
    restoreWidgetStates();
    window.calculateZakat();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();

/* ==========================================================================
   MODUL RSS FEED MOTIVASI & RENUNGAN ISLAMI DINAMIS (AUTO-INJECT DI BERANDA)
   ========================================================================== */
(function initIslamicMotivationRssModule() {
  const RSS_CACHE_KEY = "islamic_app_motivation_rss_cache_v1";
  let motivationItems = [];
  let currentIndex = 0;
  let activeFeedIndex = 0;

  const RSS_FEEDS = [
    { name: "Rumaysho.com", url: "https://rumaysho.com/feed" },
    { name: "Muslim.or.id", url: "https://muslim.or.id/feed" },
    { name: "NU Online Hikmah", url: "https://islam.nu.or.id/rss" }
  ];

  const OFFLINE_MOTIVATION_BACKUP = [
    {
      title: "Jangan Pernah Meremehkan Kebaikan Kecil",
      excerpt:
        "Boleh jadi satu senyuman tulus, satu kalimat penyemangat, atau sedekah sederhana yang kita anggap kecil justru menjadi sebab turunnya rahmat dan ampunan Allah.",
      source: "Hikmah Salaf",
      date: "Offline Ready",
      link: "https://rumaysho.com"
    },
    {
      title: "Tenanglah, Takdir Allah Selalu Lebih Baik dari Dugaanmu",
      excerpt:
        "Ketika doa belum dijawab sesuai keinginan kita, sesungguhnya Allah sedang menyiapkan jawaban yang paling tepat pada waktu yang paling indah.",
      source: "Renungan Harian",
      date: "Offline Ready",
      link: "https://muslim.or.id"
    },
    {
      title: "Istiqomah Lebih Utama dari Seribu Karomah",
      excerpt:
        "Amalan yang paling dicintai oleh Allah adalah amalan yang dilakukan secara terus-menerus (rutin) meskipun jumlahnya sedikit.",
      source: "HR. Bukhari & Muslim",
      date: "Offline Ready",
      link: "https://islam.nu.or.id"
    }
  ];

  // Bersihkan tag HTML dari deskripsi RSS
  function stripHtmlTags(htmlStr) {
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlStr || "";
    const cleanText = (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
    return cleanText.length > 175 ? cleanText.slice(0, 172) + "..." : cleanText;
  }

  function formatShortDate(dateStr) {
    if (!dateStr || dateStr === "Offline Ready") return "Hari Ini";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Terbaru";
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  // Temukan kontainer Tab Beranda secara otomatis tanpa perlu edit index.html
  function findHomeContainer() {
    const candidateIds = [
      "tab-beranda-view",
      "tab-home-view",
      "beranda-view",
      "home-view"
    ];
    for (const id of candidateIds) {
      const el = document.getElementById(id);
      if (el) return el;
    }
    // Fallback: cari elemen anak pertama di dalam <main> atau pembungkus tab
    const firstTab = document.querySelector("[id^='tab-'][id$='-view']");
    return firstTab ? firstTab.parentElement : null;
  }

  function renderMotivationCard() {
    const homeContainer = findHomeContainer();
    if (!homeContainer) return;

    let card = document.getElementById("islamic-motivation-rss-card");
    if (!card) {
      card = document.createElement("div");
      card.id = "islamic-motivation-rss-card";
      card.className =
        "bg-white p-4 rounded-2xl shadow-sm border border-amber-200 space-y-2.5 transition-all";
      homeContainer.appendChild(card);
    }

    const list = motivationItems.length > 0 ? motivationItems : OFFLINE_MOTIVATION_BACKUP;
    const item = list[currentIndex % list.length];
    const currentFeedName = RSS_FEEDS[activeFeedIndex]?.name || "Rumaysho.com";

    card.innerHTML = `
      <div class="flex justify-between items-center border-b border-stone-100 pb-2 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-sm">✨</span>
          <div>
            <h3 class="font-bold text-xs text-amber-950 leading-tight">Renungan & Motivasi Islami</h3>
            <span class="text-[9px] text-stone-400 block">Sumber: ${item.source} • ${item.date}</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button type="button" onclick="switchMotivationFeedSource()" title="Ganti Portal RSS"
            class="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-1 rounded-lg text-[10px] font-bold transition">
            📡 ${currentFeedName.split(".")[0]}
          </button>
          <button type="button" onclick="nextMotivationItem()" title="Renungan Berikutnya"
            class="bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 px-2 py-1 rounded-lg text-[10px] font-bold transition">
            🔄 (${(currentIndex % list.length) + 1}/${list.length})
          </button>
        </div>
      </div>

      <div class="space-y-1.5 pt-0.5">
        <h4 class="font-bold text-xs text-stone-800 leading-snug">${item.title}</h4>
        <p class="text-[11px] text-stone-600 leading-relaxed">"${item.excerpt}"</p>
      </div>

      <div class="pt-1.5 border-t border-stone-100 flex justify-between items-center">
        <button type="button" onclick="copyCurrentMotivation()"
          class="text-[10px] font-bold text-stone-600 hover:text-amber-800 bg-stone-100 hover:bg-amber-50 px-2.5 py-1 rounded-lg border border-stone-200 transition">
          📋 Salin Kutipan
        </button>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer"
          class="text-[10px] font-bold text-white bg-amber-700 hover:bg-amber-800 px-3 py-1 rounded-lg shadow-sm transition inline-flex items-center gap-1">
          <span>Baca Selengkapnya</span>
          <span>↗</span>
        </a>
      </div>
    `;
  }

  window.nextMotivationItem = function () {
    const list = motivationItems.length > 0 ? motivationItems : OFFLINE_MOTIVATION_BACKUP;
    currentIndex = (currentIndex + 1) % list.length;
    renderMotivationCard();
  };

  window.switchMotivationFeedSource = function () {
    activeFeedIndex = (activeFeedIndex + 1) % RSS_FEEDS.length;
    currentIndex = 0;
    fetchMotivationRss(RSS_FEEDS[activeFeedIndex]);
  };

  window.copyCurrentMotivation = function () {
    const list = motivationItems.length > 0 ? motivationItems : OFFLINE_MOTIVATION_BACKUP;
    const item = list[currentIndex % list.length];
    const text = `✨ ${item.title}\n\n"${item.excerpt}"\n\nSumber: ${item.source}\nBaca selengkapnya: ${item.link}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    if (typeof window.showCustomAlert === "function") {
      window.showCustomAlert({
        icon: "✨",
        title: "Kutipan Tersalin",
        message: `"${item.title}" berhasil disalin untuk dibagikan.`
      });
    }
  };

  async function fetchMotivationRss(feedObj) {
    const encodedFeed = encodeURIComponent(feedObj.url);
    const endpoints = [
      `https://api.rss2json.com/v1/api.json?rss_url=${encodedFeed}`,
      `https://api.allorigins.win/get?url=${encodedFeed}`
    ];

    // Jalur 1: rss2json (JSON langsung)
    try {
      const res = await fetch(endpoints[0]);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
          motivationItems = data.items.slice(0, 10).map((entry) => ({
            title: (entry.title || "Renungan Islami").trim(),
            excerpt: stripHtmlTags(entry.description || entry.content),
            source: feedObj.name,
            date: formatShortDate(entry.pubDate),
            link: entry.link || feedObj.url
          }));
          currentIndex = 0;
          try {
            localStorage.setItem(RSS_CACHE_KEY, JSON.stringify(motivationItems));
          } catch (e) {}
          renderMotivationCard();
          console.log(`✅ [RSS Motivasi] Memuat ${motivationItems.length} artikel dari ${feedObj.name}`);
          return;
        }
      }
    } catch (e1) {}

    // Jalur 2: AllOrigins XML Parser Cadangan
    try {
      const res2 = await fetch(endpoints[1]);
      if (res2.ok) {
        const wrapper = await res2.json();
        if (wrapper && wrapper.contents) {
          const parser = new DOMParser();
          const xml = parser.parseFromString(wrapper.contents, "text/xml");
          const xmlItems = Array.from(xml.querySelectorAll("item")).slice(0, 10);
          if (xmlItems.length > 0) {
            motivationItems = xmlItems.map((node) => ({
              title: (node.querySelector("title")?.textContent || "Renungan Islami").trim(),
              excerpt: stripHtmlTags(node.querySelector("description")?.textContent || ""),
              source: feedObj.name,
              date: formatShortDate(node.querySelector("pubDate")?.textContent || ""),
              link: (node.querySelector("link")?.textContent || feedObj.url).trim()
            }));
            currentIndex = 0;
            try {
              localStorage.setItem(RSS_CACHE_KEY, JSON.stringify(motivationItems));
            } catch (e) {}
            renderMotivationCard();
            console.log(`✅ [RSS Motivasi Backup] Memuat ${motivationItems.length} artikel dari ${feedObj.name}`);
          }
        }
      }
    } catch (e2) {}
  }

  function bootstrapMotivationModule() {
    // 1. Muat cache lokal dulu (instan 0 ms)
    try {
      const cached = JSON.parse(localStorage.getItem(RSS_CACHE_KEY) || "null");
      if (Array.isArray(cached) && cached.length > 0) {
        motivationItems = cached;
      } else {
        motivationItems = OFFLINE_MOTIVATION_BACKUP;
      }
    } catch (e) {
      motivationItems = OFFLINE_MOTIVATION_BACKUP;
    }

    renderMotivationCard();

    // 2. Pilih portal RSS secara dinamis berdasarkan hari & tarik artikel terbaru
    const dayIdx = new Date().getDate() % RSS_FEEDS.length;
    activeFeedIndex = dayIdx;
    fetchMotivationRss(RSS_FEEDS[activeFeedIndex]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrapMotivationModule);
  } else {
    bootstrapMotivationModule();
  }
})();
