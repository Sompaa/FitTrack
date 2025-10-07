# FitTrack-Projektterv-2025

# `FitTrack - Fitness Nyomon Követő Rendszer` Projektterv `2025`

## 1. Összefoglaló

A modern élet stresszes tempója és a széles körben elterjedt ülő életmód miatt egyre nagyobb figyelmet kap az egészséges életmód és a rendszeres testmozgás fontossága. Azonban sok ember számára nehézséget jelent a megfelelő edzésprogram kiválasztása, az étkezés megtervezése és a haladás nyomon követése. Ennek a projektnek a célja, hogy egy olyan webalkalmazást fejlesszünk, amely átfogó támogatást nyújt a felhasználóknak az egészségesebb életmód kialakításában. A rendszer lehetővé teszi a felhasználók számára a BMI és testsúly nyomon követését, személyre szabott edzéstervek és receptek ajánlását, valamint a közelben található sportolási lehetőségek megtalálását. Az alkalmazás intelligensen alkalmazkodik a felhasználó jelenlegi fizikai állapotához és a környezeti tényezőkhöz (például időjárás), hogy biztonságos és hatékony javaslatokat tegyen. A cél egy könnyen használható, motiváló platform létrehozása, amely segít az embereknek elérni fitness céljaikat.

## 2. A projekt bemutatása

Ez a projektterv a FitTrack - Fitness Nyomon Követő Rendszer projektet mutatja be, amely 2025.09.08-tól 2025.11.30-ig tart, azaz összesen 114 napon keresztül fog futni. A projekten 3 fejlesztő fog dolgozni, az elvégzett feladatokat pedig négy alkalommal fogjuk prezentálni a megrendelőnek, annak érdekében, hogy biztosítsuk a projekt folyamatos előrehaladását.

### 2.1. Rendszerspecifikáció

A rendszernek képesnek kell lennie arra, hogy regisztrált felhasználók számára személyre szabott fitness élményt nyújtson. A felhasználók bejelentkezés után rögzíthetik testsúlyukat, magasságukat és más releváns adataikat, amelyek alapján a rendszer automatikusan kiszámítja BMI értéküket és nyomon követi annak változását időben. A rendszer intelligens ajánlórendszerrel rendelkezik, amely a felhasználó aktuális fizikai állapota (testsúly, BMI kategória) alapján megfelelő edzésterveket javasol - például túlsúlyos felhasználóknak ízületkímélő gyakorlatokat ajánl futás helyett. A Google Maps API integrációval a rendszer képes megjeleníteni a felhasználó közelében található edzőtermeket, parkokat, futópályákat és egyéb sportolási lehetőségeket, azok áraival és értékeléseivel együtt. Az étkezés támogatásához a rendszer receptadatbázist tartalmaz, amely szűrhető kalóriatartalom, allergének és speciális étrendek (vegán, vegetáriánus, ketogén, paleo) szerint. Az időjárás API integráció révén a rendszer az aktuális és előrejelzett időjárás alapján beltéri vagy kültéri edzéseket javasol. A felhasználók számára vizuális kimutatások készülnek a BMI és testsúly változásáról, amely motiválja őket a céljaik elérésében.

### 2.2. Funkcionális követelmények

**Felhasználókezelés és Autentikáció:**
- Felhasználók regisztrációja és bejelentkezése (CRUD)
- Jelszó visszaállítás email-en keresztül
- Felhasználói profil kezelése (személyes adatok, célok, preferenciák)
- Profilkép feltöltés

**Egészségügyi Mérések és Nyomon Követés:**
- BMI kalkulátor (automatikus számítás magasság és testsúly alapján)
- Testsúly naplózás és történeti adatok tárolása
- BMI és testsúly változás vizuális megjelenítése grafikonokon
- Célsúly meghatározás és haladás követése

**Térkép és Helyszín Funkciók:**
- Google Maps integráció
- Felhasználó helyzetének meghatározása (geolokáció)
- Közeli edzőtermek, parkok, futópályák megjelenítése térképen
- Helyszín beállítása (felh)
- Edzőtermi árak megjelenítése és összehasonlítása
- Helyszínek értékelése és véleményezése

**Edzéstervek és Ajánlások:**
- Előre definiált edzéstervek adatbázisa
- Személyre szabott edzésterv ajánlás BMI és testsúly alapján
- Különböző intenzitású edzések (kezdő, haladó, profi)
- Ízületkímélő gyakorlatok ajánlása túlsúlyos felhasználóknak
- Edzéstervek mentése és követése
- Edzés napló vezetése

**Időjárás Alapú Ajánlások:**
- Időjárás API integráció
- Felhasználó helye szerinti időjárás-előrejelzés lekérése
- Beltéri edzések ajánlása rossz időjárás esetén
- Kültéri edzések ajánlása megfelelő időjárás esetén

**Receptek és Táplálkozás:**
- Receptek adatbázisa kalóriaértékekkel
- Receptek szűrése kalória szerint
- Allergén szűrés (glutén, tejtermék, dió, tojás, szója, stb.)
- Speciális étrendek szerinti szűrés (vegán, vegetáriánus, ketogén, paleo)
- Napi kalóriabevitel számítása és követése
- Kedvenc receptek mentése

**Statisztikák és Jelentések:**
- Heti/havi testsúly és BMI összefoglalók
- Edzésnapló statisztikák
- Haladás vizualizáció (grafikonok, diagramok)
- Célok elérésének követése

**Általános Funkciók:**
- Responsive design (mobil, tablet, desktop támogatás)
- Email értesítések (edzés emlékeztetők, mérföldkövek)
- Adatvédelem és GDPR megfelelőség
- Adatok exportálása (CSV, PDF)

### 2.3. Nem funkcionális követelmények

- A kliens oldal modern böngészőkben működjön (Chrome, Firefox, Safari, Edge)
- Reszponzív megjelenés minden eszközön (mobil first megközelítés)
- A felhasználói jelszavakat titkosítva (hash) tároljuk
- Az oldal betöltési ideje 3 másodperc alatt legyen
- A Google Maps és időjárás API hívások ne lassítsák az oldal működését
- A rendszer legyen könnyen bővíthető új funkciókkal
- Felhasználóbarát, intuitív interfész
- Akadálymentesség (WCAG 2.1 AA szint)
- A rendszer 99% rendelkezésre állást biztosítson
- Adatok automatikus mentése az adatvesztés elkerülésére

## 3. Költség- és erőforrás-szükségletek

Az erőforrásigényünk összesen 114 személynap, átlagosan 114/3=38 személynap/fő.

A rendelkezésünkre áll összesen 3 * 70 = 210 pont.

## 4. Szervezeti felépítés és felelősségmegosztás

A projekt megrendelője {MEGRENDELŐ_NEVE}. A FitTrack projektet a projektcsapat fogja végrehajtani, amely jelenleg 3 fejlesztőből áll. A csapat tagjai rendelkeznek webes fejlesztési tapasztalattal, és motiváltak az egészséges életmód népszerűsítésében.

{CSAPATTAGOK_TAPASZTALATAINAK_LEÍRÁSA - pl.:
- Sándor Erzsébet (15 év tapasztalat frontend fejlesztésben)
- Páli Leonóra (40 év tapasztalat backend fejlesztésben)
- Somogyi Áron (Értékelhetetlen tapasztalat)

### 4.1 Projektcsapat

A projekt a következő emberekből áll:

| Név | Pozíció | E-mail cím (stud-os) |
| --- | --- | --- |
| Vidács László | Projektmenedzser | {EMAIL_1} |
| Sándor Erzsébet | Projekt tag | {EMAIL_2} |
| Páli Leonóra | Projekt tag | {EMAIL_3} |
| Somogyi Áron | Projekt tag | {EMAIL_4} |

## 5. A munka feltételei

### 5.1. Munkakörnyezet

A projekt a következő munkaállomásokat fogja használni a munka során:

{MUNKAÁLLOMÁSOK_LEÍRÁSA - pl.:
- Munkaállomások: X db, Windows/macOS/Linux operációs rendszerrel
- Laptop1 specifikációi
- Laptop2 specifikációi
- stb.}

| **Terméksorozat** | Thinkpad L15 |
| --- | --- |
| **Processzor** |  |
| Processzor gyártó | Intel |
| Processzor típus | Core i7 |
| Processzor modell | 1165G7 |
| **Kijelző** |  |
| Képátló | 15,6" |
| Felbontás | 1920 x 1080 |
| Kijelző Típusa | Matt, FullHD, IPS, 250nits |
| Kamera felbontás | HD 720p |
| Érintőképernyő (Igen/Nem) | Nem |
| **Háttértár** |  |
| Háttértár típus | SSD (NVMe) |
| HDD méret | 0 GB |
| SSD méret | 512 GB |
| **Memória** |  |
| Memória. | 16 GB |
| Memória típus | DDR4 3200Mhz (1X16GB) |
| **Operációs rendszer** |  |
| Operációs rendszer verzió | Windows 10 Pro |
| **Videokártya** |  |
| Videokártya | Integrált |
| Videokártya fajta | Intel |
| Memória | - |
| Videokártya típus | Iris Xe Graphics |

A projekt a következő technológiákat/szoftvereket fogja használni a munka során:

**Frontend (Kezdőknek is megfelelő):**
- **HTML, CSS, JavaScript** - Alapvető webes technológiák
- **Bootstrap 5** vagy **Tailwind CSS** - CSS framework a gyors és reszponzív design-hoz (dokumentáció: https://getbootstrap.com vagy https://tailwindcss.com)
- **React.js** (opcionális) vagy **sima JavaScript** - Interaktív felhasználói felület
- **Chart.js** - Grafikonok készítéséhez (testsúly/BMI változás megjelenítése)
- **Leaflet.js** vagy **Google Maps JavaScript API** - Térképes funkciókhoz

**Backend:**
- **Node.js + Express.js** - Egyszerű backend keretrendszer kezdőknek is
- **MongoDB** (NoSQL) vagy **MySQL/PostgreSQL** (SQL) - Adatbázis
- **Mongoose** (MongoDB esetén) vagy **Sequelize** (SQL esetén) - ORM/ODM

**Autentikáció és Biztonság:**
- **Passport.js** - Egyszerű autentikációs middleware
- **bcrypt.js** - Jelszó titkosítás
- **JSON Web Tokens (JWT)** - Token-alapú autentikáció

**API Integrációk:**
- **Google Maps JavaScript API** - Térképes funkciók (ingyenes kvóta: 28,000 térképbetöltés/hó)
- **OpenWeatherMap API** - Időjárás előrejelzés (ingyenes: 1000 hívás/nap)
- **Geolocation API** - Böngésző beépített helymeghatározása (ingyenes)

**Receptek Adatbázis:**
- **Edamam Recipe API** (ingyenes tier) - Receptek és táplálkozási információk
- **Spoonacular API** (ingyenes tier) - Receptek allergén és diéta szűréssel
- Vagy saját JSON alapú recept adatbázis

**Projektmenedzsment és Együttműködés:**
- **Trello** (https://trello.com) - Ingyenes, vizuális feladatkezelő (Kanban tábla)
- **Redmine** (https://www.redmine.org) - Ingyenes, nyílt forráskódú projektmenedzsment
- **GitHub Projects** - Ingyenes, ha GitHub-ot használunk verziókezelésre
- **Notion** (https://www.notion.so) - Dokumentáció és feladatkezelés

**Verziókezelés:**
- **Git** - Verziókezelő rendszer
- **GitHub** vagy **GitLab** - Repository hosting

**Dizájn és Prototípus:**
- **Figma** (https://www.figma.com) - Ingyenes UI/UX tervezés (3 projekt ingyenes)
- **Canva** - Grafikai elemek készítése

**Fejlesztőkörnyezet:**
- **Visual Studio Code** - Ingyenes, népszerű kódszerkesztő
- **XAMPP** vagy **WAMP** - Helyi fejlesztői környezet (Apache, MySQL, PHP)
- **Node.js** - JavaScript futtatókörnyezet

**Tesztelés:**
- **Postman** - API tesztelés
- **Jest** - JavaScript unit tesztek
- **Chrome DevTools** - Böngésző fejlesztői eszközök

**Hosting (Ingyenes/Kezdő szint):**
- **Vercel** vagy **Netlify** - Frontend hosting (ingyenes)
- **Heroku** (korlátozott ingyenes) vagy **Railway** - Backend hosting
- **MongoDB Atlas** - Ingyenes MongoDB hosting (512 MB)
- **PlanetScale** vagy **Supabase** - Ingyenes SQL adatbázis

**Dokumentáció:**
- **Markdown** - Dokumentáció írása
- **JSDoc** - Kód dokumentáció

### 5.2. Rizikómenedzsment

| Kockázat | Leírás | Valószínűség | Hatás |
| --- | --- | --- | --- |
| Betegség | Súlyosságtól függően hátráltatja vagy bizonyos esetekben teljes mértékben korlátozza a munkavégzőt, így az egész projektre kihatással van. Megoldás: a feladatok átcsoportosítása, páros programozás alkalmazása | közepes | erős |
| API kvóták túllépése | Az ingyenes API szolgáltatások (Google Maps, időjárás) kvótáinak túllépése. Megoldás: API hívások cache-elése, rate limiting implementálása | kis | közepes |
| Kezdő programozók lassabb haladása | A csapatban kevésbé tapasztalt tagok lassabban haladnak. Megoldás: mentorálás, code review, páros programozás, egyszerűbb feladatok kiosztása | nagy | közepes |
| Külső API szolgáltatások elérhetetlensége | A Google Maps vagy időjárás API ideiglenesen nem elérhető. Megoldás: fallback mechanizmusok, hibaüzenetek, offline mód | kis | közepes |
| Adatvédelmi problémák | Személyes egészségügyi adatok nem megfelelő kezelése. Megoldás: GDPR irányelvek betartása, adattitkosítás, hozzájárulás kezelése | közepes | erős |
| Böngésző kompatibilitási problémák | Különböző böngészőkben eltérően jelenik meg az oldal. Megoldás: kereszt-böngésző tesztelés, modern CSS frameworkök használata | közepes | gyenge |
| Teljesítményproblémák nagy adatmennyiségnél | Sok felhasználó vagy adat esetén lassul a rendszer. Megoldás: adatbázis indexelés, lazy loading, képek optimalizálása | közepes | közepes |
| Kommunikációs fennakadás a csapattagokkal | A csapattagok között nem elégséges az információ áramlás. Megoldás: heti sprint meetingek, napi stand-up online, Trello/Redmine használata | kis | erős |
| Receptek szerzői jogi problémái | Receptek másolása szerzői jogi problémákat okozhat. Megoldás: API-k használata, CC licencű receptek, saját receptek írása | kis | közepes |
| Időjárás API pontatlan előrejelzése | Az időjárás előrejelzés nem pontos. Megoldás: több API kombináció, disclaimer hozzáadása | nagy | gyenge |

## 6. Jelentések

### 6.1. Munka menedzsment

A munkát {PROJEKTMENEDZSER_NEVE} koordinálja. Fő feladata, hogy folyamatosan egyeztessen a csapattagokkal az előrehaladásról és a fellépő problémákról, esetlegesen a megoldásban is segítséget nyújthat a projekt csúszásának elkerülése végett. További feladata a heti szinten tartandó csoportgyűlések időpontjának és helyszínének leszervezése, valamint a feladatok kiosztása és nyomon követése Trello/Redmine segítségével. A projektmenedzser felelős a sprint tervezésért és a burndown chart vezetéséért is.

### 6.2. Csoportgyűlések

A projekt hetente ülésezik, hogy megvitassák az azt megelőző hét problémáit, illetve hogy megbeszéljék a következő hét feladatait. A megbeszélésről minden esetben memó készül. Emellett rövid napi/kétnapos online check-in meetingek is történnek a projekt státuszának frissítésére.

{MEGBESZÉLÉSEK_LISTÁJA - pl.:
1. megbeszélés:
- Időpont: 2025-10-06
- Hely: Móra Ferenc Szakkollégium
- Résztvevők: Nevek felsorolása
- Érintett témák: Téma leírása

1. megbeszélés:
- …
stb.}

### 6.3. Minőségbiztosítás

Az elkészült terveket a terveken nem dolgozó csapattársak közül átnézik, hogy megfelel-e a specifikációnak és az egyes diagramtípusok összhangban vannak-e egymással. A meglévő rendszerünk helyes működését a prototípusok bemutatása előtt a tesztelési dokumentumban leírtak végrehajtása alapján ellenőrizzük és összevetjük a specifikációval, hogy az elvárt eredményt kapjuk-e.

További tesztelési lehetőségek:
- **Manuális tesztelés:** Különböző böngészőkben és eszközökön történő tesztelés
- **Unit tesztek:** Kritikus funkciók (BMI számítás, kalória számítás) unit tesztelése Jest-tel
- **API tesztelés:** Postman segítségével az API végpontok tesztelése
- **Code review:** Pull request-ek során kötelező code review másik csapattag által
- **Felhasználói tesztelés:** Beta tesztelők bevonása visszajelzések gyűjtéséhez
- **Teljesítmény tesztelés:** Chrome DevTools Lighthouse használata
- **Responsive tesztelés:** Különböző eszközméreteken való megjelenés ellenőrzése

Az alábbi lehetőségek vannak a szoftver megfelelő minőségének biztosítására:
- Specifikáció és tervek átnézése (kötelező)
- Teszttervek végrehajtása (kötelező)
- Böngésző kompatibilitási tesztek (kötelező)
- Unit tesztek kritikus funkciókhoz (kötelező)
- Kód átnézése (választható, de ajánlott)
- ESLint használata kódminőség ellenőrzésére (ajánlott)

### 6.4. Átadás, eredmények elfogadása

A projekt eredményeit a megrendelő, Vidács László fogja elfogadni. A projektterven változásokat csak a megrendelő írásos engedélyével lehet tenni. A projekt eredményesnek bizonyul, ha a specifikáció helyes és határidőn belül készül el. Az esetleges késések pontlevonást eredményeznek.
Az elfogadás feltételeire és beadás formájára vonatkozó részletes leírás a következő honlapon olvasható: https://okt.inf.szte.hu/rf1/

### 6.5. Státuszjelentés

Minden mérföldkő leadásnál a projekten dolgozók jelentést tesznek a mérföldkőben végzett munkájukról a megadott sablon alapján. A gyakorlatvezetővel folytatott csapatmegbeszéléseken a csapat áttekintik és felmérik az eredményeket és teendőket. Továbbá gazdálkodnak az erőforrásokkal és szükség esetén a megrendelővel egyeztetnek a projektterv módosításáról.

## 7. A munka tartalma

### 7.1. Tervezett szoftverfolyamat modell és architektúra

A szoftver fejlesztése során az agilis fejlesztési modellt (Scrum) alkalmazzuk, mivel a fejlesztés során nagy hangsúlyt fektetünk a folyamatos kommunikációra és az iteratív fejlesztésre. A projekt 2 hetes sprintekben épül fel, minden sprint végén bemutatható, működő funkcionalitást szállítunk. A fejlesztés során a szoftver specifikációi rugalmasan változhatnak a felhasználói visszajelzések alapján, és ezzel a módszertannal tudunk a leggyorsabban alkalmazkodni az új elvárásokhoz.

A webalkalmazás hagyományos **háromrétegű architektúrát** követ, amely kezdő fejlesztők számára is érthető és karbantartható:

**1. Prezentációs réteg (Frontend):**
- HTML5 és CSS3 (Bootstrap vagy Tailwind keretrendszer)
- JavaScript (ES6+) vagy opcionálisan React.js
- Chart.js könyvtár a grafikonok megjelenítéséhez
- Google Maps JavaScript API a térképes funkciókhoz
- Responsive design minden eszközön

**2. Üzleti logikai réteg (Backend/API):**
- Node.js + Express.js REST API
- Autentikáció: Passport.js + JWT tokenek
- Üzleti logika: BMI számítás, ajánló algoritmusok, adatvalidáció
- Külső API-k integrálása (időjárás, receptek)

**3. Adatkezelési réteg (Database):**
- MongoDB (NoSQL) vagy MySQL/PostgreSQL (SQL)
- Mongoose vagy Sequelize ORM
- Adatmodellek: User, WeightLog, Exercise, Recipe, Workout

**Komponensek közötti kommunikáció:**
- A frontend AJAX (fetch API) hívásokkal kommunikál a backend REST API-val
- JSON formátumú adatcsere
- Aszinkron működés (async/await)

**Külső rendszerek:**
- Google Maps API (térképek, helyek keresése)
- OpenWeatherMap API (időjárás)
- Edamam/Spoonacular API (receptek)

Ez az architektúra egyszerű, jól strukturált, és lehetővé teszi a független fejlesztést és tesztelést minden rétegben.

### 7.2. Átadandók és határidők

A főbb átadandók és határidők a projekt időtartama alatt a következők:

| Szállítandó | Neve | Határideje |
| --- | --- | --- |
| D1 | Projektterv és Gantt chart, prezentáció, egyéni jelentés | {M1_HATÁRIDŐ} |
| P1+D2 | UML, adatbázis- és képernyőtervek, prezentáció, egyéni jelentés | {M2_HATÁRIDŐ} |
| P1+D3 | Prototípus I. és tesztelési dokumentáció, egyéni jelentés | {M3_HATÁRIDŐ} |
| P2+D4 | Prototípus II. és frissített tesztelési dokumentáció, egyéni jelentés | {M4_HATÁRIDŐ} |

## 8. Feladatlista

A következőkben a tervezett feladatok részletes összefoglalása található.

### 8.1. Projektterv (1. mérföldkő)

Ennek a feladatnak az a célja, hogy a megvalósításhoz szükséges lépéseket, az erőforrásigényeket, az ütemezést, a felelősöket és a feladatok sorrendjét meghatározzuk, majd vizualizáljuk Gantt diagram segítségével.

Részfeladatai a következők:

### 8.1.1. Projektterv kitöltése

Felelős: Mindenki

Tartam: 5 nap

Erőforrásigény: 1 személynap/fő

### 8.1.2. Gantt diagram elkészítése

Felelős: {PROJEKTMENEDZSER_NEVE}

Tartam: 2 nap

Erőforrásigény: 0.5 személynap

### 8.1.3. Technológiai stack véglegesítése

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 0.5 személynap

### 8.1.4. API kulcsok beszerzése (Google Maps, OpenWeatherMap)

Felelős: {FELELŐS_NEVE}

Tartam: 1 nap

Erőforrásigény: 0.25 személynap

### 8.1.5. Fejlesztői környezet beállítása (Git, VS Code, Node.js)

Felelős: Mindenki

Tartam: 2 nap

Erőforrásigény: 0.5 személynap/fő

### 8.1.6. Trello/Redmine projekt létrehozása és feladatok felvitele

Felelős: {PROJEKTMENEDZSER_NEVE}

Tartam: 1 nap

Erőforrásigény: 0.5 személynap

### 8.1.7. Bemutató prezentáció elkészítése

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 0.5 személynap

### 8.2. UML és adatbázis- és képernyőtervek (2. mérföldkő)

Ennek a feladatnak az a célja, hogy a rendszerarchitektúrát, az adatbázist és webalkalmazás kinézetét megtervezzük.

Részfeladatai a következők:

### 8.2.1. Use Case diagram (összes funkció)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.2.2. Class diagram (entitások és kapcsolatok)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.2.3. Sequence diagram (bejelentkezés, BMI számítás, edzésterv ajánlás)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.2.4. Egyed-kapcsolat diagram (ER diagram) adatbázishoz

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.2.5. Adatbázis séma tervezése (táblák, mezők, kapcsolatok)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.2.6. Package diagram (rendszer felépítés)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.2.7. Képernyőtervek (mockup) Figma-ban

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

Elvárt képernyők:
- Főoldal (landing page)
- Regisztráció / Bejelentkezés
- User Dashboard (testsúly, BMI grafikonok)
- BMI kalkulátor oldal
- Térkép oldal (edzőtermek, parkok)
- Receptek böngésző oldal (szűrőkkel)
- Edzésterv ajánló oldal
- Profil szerkesztő oldal

### 8.2.8. Színpaletta és design rendszer kialakítása

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.2.9. REST API végpontok specifikálása (dokumentáció)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.2.10. Bemutató prezentáció elkészítése

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 0.5 személynap

### 8.3. Prototípus I. (3. mérföldkő)

Ennek a feladatnak az a célja, hogy egy működő prototípust hozzunk létre, ahol a vállalt funkcionális követelmények nagy része már prezentálható állapotban van.

Részfeladatai a következők:

### 8.3.1. Adatbázis létrehozása és kapcsolódás beállítása

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.2. User model és séma implementálása

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.3.3. Regisztrációs funkció (backend + frontend)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.4. Bejelentkezési funkció (Passport.js + JWT)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.5. Jelszó titkosítás (bcrypt) implementálása

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.3.6. Felhasználói munkamenet kezelése (session/token)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.7. Felhasználói profil oldal (frontend)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.8. Profil szerkesztés (magasság, testsúly, célok)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.9. BMI kalkulátor logika (backend)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.3.10. BMI kalkulátor UI (frontend)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.11. Testsúly naplózás funkció (CRUD)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.12. Testsúly és BMI történeti adatok tárolása (adatbázis)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.13. Grafikon megjelenítés Chart.js-sel (testsúly/BMI időbeli változás)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.3.14. Google Maps API integráció (alap térkép megjelenítés)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.15. Felhasználó helymeghatározása (Geolocation API)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.16. Közeli helyek keresése (Google Places API - edzőtermek, parkok)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.3.17. Helyek megjelenítése térképen markerekkel

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.18. Receptek adatbázis létrehozása (kezdeti adatokkal)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.19. Receptek listázása (frontend)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.20. Receptek szűrése kalória szerint

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.21. Edzéstervek adatbázis létrehozása

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.22. Edzésterv ajánló algoritmus (BMI kategória alapján)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.3.23. Edzéstervek megjelenítése felhasználónak

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.24. Időjárás API integráció (OpenWeatherMap)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.3.25. Responsive design implementálása (mobil nézet)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.3.26. Navigációs menü és layout (Bootstrap/Tailwind)

Felelős: {FELELŐS_TEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.27. Tesztelési dokumentum elkészítése (Test Plan, Test Cases)

Felelős: Mindenki

Tartam: 4 nap

Erőforrásigény: 1 személynap/fő

### 8.3.28. Unit tesztek írása (BMI számítás, kalória számítás)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.3.29. A prototípus kitelepítése (Vercel/Heroku)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4. Prototípus II. (4. mérföldkő)

Ennek a feladatnak az a célja, hogy az előző mérföldkő hiányzó funkcióit pótoljuk, illetve a hibásan működő funkciókat és az esetlegesen felmerülő új funkciókat megvalósítsuk. Továbbá az alkalmazás alapos tesztelése is a mérföldkőben történik az előző mérföldkőben összeállított tesztesetek alapján.

Részfeladatai a következők:

### 8.4.1. Edzőtermi árak megjelenítése és összehasonlítása

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.2. Helyek értékelése és véleményezése (review funkció)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.4.3. Receptek allergén szűrése (glutén, tejtermék, dió, stb.)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.4. Speciális étrend szűrés (vegán, vegetáriánus, keto, paleo)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.5. Receptek API integráció (Edamam/Spoonacular)

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.4.6. Kedvenc receptek mentése funkció

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.7. Napi kalóriabevitel követése

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.8. Időjárás alapú edzés ajánlás (beltéri/kültéri)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.9. Edzés napló funkció

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.4.10. Különböző intenzitású edzések (kezdő, haladó, profi)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.11. Ízületkímélő gyakorlatok ajánlása túlsúlyos felhasználóknak

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.12. Heti/havi statisztikák és összefoglalók

Felelős: {FELELŐS_NEVE}

Tartam: 5 nap

Erőforrásigény: 2.5 személynap

### 8.4.13. Célsúly meghatározás és haladás követése

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.14. Email értesítések (edzés emlékeztetők)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.15. Jelszó visszaállítás funkció

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.16. Profilkép feltöltés

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.17. Adatok exportálása (CSV/PDF)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.18. GDPR megfelelőség (adatvédelmi nyilatkozat, cookie-k)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.19. Teljesítmény optimalizálás (képek, API cache)

Felelős: {FELELŐS_NEVE}

Tartam: 4 nap

Erőforrásigény: 2 személynap

### 8.4.20. Böngésző kompatibilitási tesztek

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.21. Felhasználói autentikáció tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.22. BMI kalkulátor tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 1 nap

Erőforrásigény: 0.5 személynap

### 8.4.23. Térkép funkciók tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.24. Receptek szűrés tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.25. Edzésterv ajánlás tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.26. Időjárás integráció tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 1 nap

Erőforrásigény: 0.5 személynap

### 8.4.27. Responsive design tesztelése (TR)

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.28. API tesztelés Postman-nel

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.29. Biztonsági audit (SQL injection, XSS védelem)

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.30. Felhasználói dokumentáció elkészítése

Felelős: {FELELŐS_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

### 8.4.31. Fejlesztői dokumentáció frissítése

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.32. A végleges prototípus kitelepítése és tesztelése éles környezetben

Felelős: {FELELŐS_NEVE}

Tartam: 2 nap

Erőforrásigény: 1 személynap

### 8.4.33. Bemutató prezentáció és demo videó elkészítése

Felelős: {PROJEKTMENEDZSER_NEVE}

Tartam: 3 nap

Erőforrásigény: 1.5 személynap

## 9. Részletes időbeosztás

![Gantt diagram](https://www.notion.so./fittrack-gantt-diagram.png)

Gantt diagram

{IDE KELL BEILLESZTENI A GANTT DIAGRAMOT, amely a 8. fejezetben található részfeladatokat tartalmazza felelős/tartam bontásban. A diagram készíthető: GanttProject, Microsoft Project, Excel, vagy online eszközökkel (TeamGantt, Instagantt)}

## 10. Projekt költségvetés

{A TÁBLÁZATOKAT A KONKRÉT CSAPATTAGOK ÉS FELADATKIOSZTÁSOK ALAPJÁN KELL KITÖLTENI}

### 10.1. Részletes erőforrásigény (személynap)

| Név | M1 | M2 | M3 | M4 | Összesen |
| --- | --- | --- | --- | --- | --- |
| {NÉV_1} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_2} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_3} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_4} | {X} | {X} | {X} | {X} | {X} |

### 10.2. Részletes feladatszámok

| Név | M1 | M2 | M3 | M4 | Összesen |
| --- | --- | --- | --- | --- | --- |
| {NÉV_1} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_2} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_3} | {X} | {X} | {X} | {X} | {X} |
| {NÉV_4} | {X} | {X} | {X} | {X} | {X} |

### 10.3. Részletes költségvetés

| Név | M1 | M2 | M3 | M4 | Összesen |
| --- | --- | --- | --- | --- | --- |
| Maximálisan megszerezhető pontszám | (7) | (20) | (35) | (28) | 100% (70) |
| {NÉV_1} | {X} | {X} | {X} | {X} | 70 |
| {NÉV_2} | {X} | {X} | {X} | {X} | 70 |
| {NÉV_3} | {X} | {X} | {X} | {X} | 70 |
| {NÉV_4} | {X} | {X} | {X} | {X} | 70 |

Szeged, {DÁTUM}.

---

## Függelék: Hasznos linkek és források

**API Dokumentációk:**
- Google Maps JavaScript API: https://developers.google.com/maps/documentation/javascript
- OpenWeatherMap API: https://openweathermap.org/api
- Edamam Recipe API: https://developer.edamam.com/
- Spoonacular API: https://spoonacular.com/food-api

**Technológiai dokumentációk:**
- Node.js: https://nodejs.org/docs/
- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/
- Mongoose: https://mongoosejs.com/docs/
- Bootstrap 5: https://getbootstrap.com/docs/
- Chart.js: https://www.chartjs.org/docs/

**Tutoriálok kezdőknek:**
- JavaScript MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Node.js + Express tutorial: https://www.youtube.com/watch?v=Oe421EPjeBE
- Google Maps tutorial: https://www.youtube.com/watch?v=Zxf1mnP5zcw
- Chart.js tutorial: https://www.youtube.com/watch?v=sE08f4iuOhA

**Projektmenedzsment:**
- Trello: https://trello.com
- Redmine: https://www.redmine.org
- GitHub Projects: https://github.com/features/issues

**Design eszközök:**
- Figma: https://www.figma.com
- Canva: https://www.canva.com
- Color Hunt (színpaletta): https://colorhunt.co