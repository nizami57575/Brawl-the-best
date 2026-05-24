// ==========================================================================
// NEXUS BRAWL PORTAL - CORE ENGINE v5.0 (25+ NEW FEATURES INTEGRATED)
// ==========================================================================

let trophies = parseInt(localStorage.getItem('nexus_trophies')) || 0;
let xp = parseInt(localStorage.getItem('nexus_xp')) || 0;
let level = parseInt(localStorage.getItem('nexus_lvl')) || 1;
let energy = 100;
let currentTheme = "blue";

// Sürət Oyunu Dəyişənləri
let speedGameScore = 0;
let isSpeedGameActive = false;

// Viktorina Sualları Bazası
const quizData = [
    { q: "Leon xarakteri super gücü ilə tamamilə gizlənə bilir?", a: true },
    { q: "Brawl Stars-da maksimal klan üzvü limiti 100 nəfərdir?", a: false },
    { q: "Spike xarakteri əfsanəvi (Legendary) brawlerdir?", a: true },
    { q: "Oyunda Brawl Pass hər mövsüm yenilənir?", a: true }
];
let currentQuizIndex = 0;
let quizHp = 3;

window.onload = function() {
    initMatrixBg();
    updateUI();
    setupChat();
    startMonitorSim();
    loadQuizQuestion();
    startSalesSimulation();
    startEnergyRegen();
};

// --- 1. AYARLANABİLƏN MATRİX ARKA PLAN MEXANİKASI ---
let matrixInterval;
function initMatrixBg() {
    if(matrixInterval) clearInterval(matrixInterval);
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = "01BRAWLSTARS🧬💎🏆⚡⭐";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(6, 7, 19, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Mövzu rəng filtrləri
        if(currentTheme === "blue") ctx.fillStyle = '#00f3ff';
        else if(currentTheme === "pink") ctx.fillStyle = '#ff007f';
        else if(currentTheme === "green") ctx.fillStyle = '#39ff14';
        else if(currentTheme === "gold") ctx.fillStyle = '#ffd700';

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
            rainDrops[i]++;
        }
    }
    matrixInterval = setInterval(draw, 33);
}

function changeTheme() {
    currentTheme = document.getElementById('theme-selector').value;
    initMatrixBg();
    showToast("Mövzu rəngləri uğurla yeniləndi!", "cyan");
}

// --- 2. STATİSTİKA, ENERJİ VƏ SƏVİYYƏ METRİKLƏRİ ---
function updateUI() {
    document.getElementById('trophy-count').innerText = trophies;
    document.getElementById('lvl-display').innerText = level;
    document.getElementById('xp-progress').style.width = xp + "%";
    
    let rank = "Bürünc Oyunçu 🥉";
    let badgeText = "(RÜTBƏ: ROOKIE)";
    if(trophies >= 100) { rank = "Epik Döyüşçü 🌟"; badgeText = "(RÜTBƏ: PRO)"; }
    if(trophies >= 300) { rank = "Kiber Elmas Master 💎🔥"; badgeText = "(RÜTBƏ: ELITE)"; }
    
    document.getElementById('user-title').innerText = "Rank: " + rank;
    document.getElementById('rank-badge').innerText = badgeText;
}

function addTrophies() {
    if(energy < 10) {
        showToast("❌ Enerji yetərsizdir! Bərpa olunmasını gözləyin.", "red");
        return;
    }
    energy -= 10;
    trophies += 5;
    xp += 15;
    if (xp >= 100) { xp = 0; level++; showToast(`🎉 SƏVİYYƏ ARTDI: LVL ${level}!`, "gold"); }
    
    document.getElementById('energy-text').innerText = energy;
    document.getElementById('energy-bar').style.width = energy + "%";

    saveData();
    updateUI();
    showToast("+5 Kupa qazanıldı!", "green");
}

function startEnergyRegen() {
    setInterval(() => {
        if(energy < 100) {
            energy += 5;
            if(energy > 100) energy = 100;
            document.getElementById('energy-text').innerText = energy;
            document.getElementById('energy-bar').style.width = energy + "%";
        }
    }, 3000);
}

// --- 3. REAKSİYA SÜRƏT TESTİ MİNİ OYUNU ---
function startSpeedGame() {
    if(isSpeedGameActive) return;
    isSpeedGameActive = true;
    speedGameScore = 0;
    const btn = document.getElementById('speed-game-btn');
    btn.innerText = "KLİKLƏ!!! 🔥";
    
    setTimeout(() => {
        isSpeedGameActive = false;
        btn.innerText = "OYUNU BAŞLAT 🎮";
        document.getElementById('speed-game-res').innerText = `Nəticə: 10 saniyədə ${speedGameScore} klik!`;
        if(speedGameScore > 30) {
            trophies += 15; updateUI(); saveData();
            showToast("Bonus: Sürətli olduğunuz üçün +15 Kupa!", "gold");
        }
    }, 10000);
}

// Klik sayğacı (Yalnız oyun aktiv olanda işləyir)
document.getElementById('speed-game-btn').addEventListener('click', () => {
    if(isSpeedGameActive) {
        speedGameScore++;
        document.getElementById('speed-game-res').innerText = `Klik: ${speedGameScore}`;
    }
});

// --- 4. KİBER ŞANS ÇARXI ---
function spinWheel() {
    const res = document.getElementById('wheel-res');
    res.innerText = "⚡ Çarx sürətlə fırlanır...";
    setTimeout(() => {
        const prizes = ["15 Kupa 🏆", "100 Qızıl 🪙", "Kiber Çərçivə 🖼️", "Brawl Pass Xalı 🌟"];
        const win = prizes[Math.floor(Math.random() * prizes.length)];
        res.innerText = "Çıxdı: " + win;
        if(win.includes("15 Kupa")) { trophies += 15; updateUI(); saveData(); showToast("+15 Kupa xalı əlavə edildi!", "green"); }
    }, 1200);
}

// --- 5. SUAL-CAVAB VƏ TEST REJİMLƏRİ ---
function loadQuizQuestion() {
    if(currentQuizIndex >= quizData.length) {
        document.getElementById('quiz-question').innerText = "Bütün sualları bitirdiniz! 🧠";
        return;
    }
    document.getElementById('quiz-question').innerText = quizData[currentQuizIndex].q;
}

function answerQuiz(userAns) {
    if(quizHp <= 0) return;
    if(quizData[currentQuizIndex].a === userAns) {
        showToast("Doğrudur! +20 XP", "green");
        xp += 20; if(xp>=100){xp=0; level++;}
        currentQuizIndex++;
    } else {
        quizHp--;
        document.getElementById('quiz-hp').innerText = quizHp;
        showToast("Xəta! Canınız azaldı.", "red");
        if(quizHp <= 0) document.getElementById('quiz-question').innerText = "Can bitdi! Mövsümü uduzdunuz.";
    }
    loadQuizQuestion(); updateUI(); saveData();
}

function runBrawlerTest() {
    const val = document.getElementById('test-style').value;
    const res = document.getElementById('test-res');
    if(val === "aggro") res.innerText = "Sizin xarakteriniz: MORTİS! ⚔️";
    if(val === "camper") res.innerText = "Sizin xarakteriniz: BULL! 🐂";
    if(val === "support") res.innerText = "Sizin xarakteriniz: POCO! 🎸";
}

// --- 6. PIN SƏS SİMULYATORU ---
function triggerPinSound(name, quote) {
    document.getElementById('pin-sound-text').innerText = `${name}: "${quote}"`;
}

// --- 7. SÖHBƏT VƏ MAĞAZA MODULLARI ---
function setupChat() {
    document.getElementById('chat-screen').innerHTML = "<p style='color:#444;'>[Sistem]: Kiber şəbəkə qorunur.</p><p><b>Nexus_User:</b> Kim klan turnirinə gəlir?</p>";
}

function sendMsg() {
    const nick = document.getElementById('chat-nick').value || "Oyunçu";
    const color = document.getElementById('nick-color').value;
    const text = document.getElementById('chat-text').value;
    if(!text.trim()) return;

    document.getElementById('chat-screen').innerHTML += `<p><b style="color:${color}">${nick}:</b> ${text}</p>`;
    document.getElementById('chat-text').value = "";
    document.getElementById('chat-screen').scrollTop = document.getElementById('chat-screen').scrollHeight;
}

function buySkin(name, cost) {
    if(trophies >= cost) {
        trophies -= cost;
        saveData(); updateUI();
        showToast(`Uğurla alındı: ${name}! 🛍️`, "gold");
    } else {
        showToast("❌ Kifayət qədər kupa yoxdur!", "red");
    }
}

// --- 8. KALKULYATORLAR VƏ YADDAŞ PLUGİNLƏRİ ---
function compareBrawlers() {
    const b1 = document.getElementById('comp-1').value;
    const b2 = document.getElementById('comp-2').value;
    document.getElementById('compare-res').innerText = `${b1} hücumda, ${b2} isə müdafiədə üstündür.`;
}

function calcClubTrophies() {
    const m = parseInt(document.getElementById('member-count').value) || 0;
    const t = parseInt(document.getElementById('avg-trophy').value) || 0;
    document.getElementById('club-calc-res').innerText = `Cəmi: ${m * t} 🏆`;
}

function saveClubTag() {
    const tag = document.getElementById('club-tag-input').value;
    if(!tag) return;
    document.getElementById('club-tag-res').innerText = `Yadda saxlanıldı: ${tag.toUpperCase()}`;
    showToast("Klan teqi qeydə alındı!", "cyan");
}

function activatePromo() {
    const code = document.getElementById('promo-input').value;
    if(code === "BS2026") {
        trophies += 100; updateUI(); saveData();
        showToast("🌟 PROMO KOD: +100 Kupa!", "gold");
    } else {
        showToast("❌ Keçərsiz kod!", "red");
    }
}

function checkPing() {
    document.getElementById('ping-test-res').innerText = "Yoxlanılır...";
    setTimeout(() => {
        document.getElementById('ping-test-res').innerText = Math.floor(15 + Math.random() * 20) + " ms (Əla)";
    }, 8000);
}

// --- 9. POP-UP TOAST BİLDİRİŞ SİSTEMİ ---
function showToast(message, colorType) {
    const toast = document.createElement("div");
    toast.style.position = "fixed"; toast.style.bottom = "20px"; toast.style.right = "20px";
    toast.style.padding = "12px 20px"; toast.style.borderRadius = "8px";
    toast.style.background = "#0c0e22"; toast.style.color = "#fff";
    toast.style.fontSize = "13px"; toast.style.zIndex = "99999";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.5)";
    
    let borderColors = { green: "#22c55e", red: "#ef4444", cyan: "#00f3ff", gold: "#ffd700" };
    toast.style.borderLeft = `4px solid ${borderColors[colorType] || "#fff"}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// --- 10. SİFARIŞ VƏ CANLI SİMULYASİYALAR ---
function startMonitorSim() {
    setInterval(() => {
        document.getElementById('fps-ping').innerText = Math.floor(20 + Math.random() * 10);
    }, 4000);
}

function startSalesSimulation() {
    const names = ["Nizami", "Kiber_Pro", "X_Brawler_X", "Samir", "Elnur"];
    setInterval(() => {
        const popup = document.getElementById('sales-popup');
        const text = document.getElementById('sales-text');
        text.innerText = `${names[Math.floor(Math.random() * names.length)]} indi 950 Elmas paketi aldı!`;
        popup.style.display = "block";
        setTimeout(() => { popup.style.display = "none"; }, 3500);
    }, 15000);
}

function processOrder() {
    showToast("Sifariş kiber şəbəkəyə göndərildi! 🛸", "cyan");
}

function resetAllData() {
    if(confirm("Bütün məlumatları sıfırlamaq istədiyinizdən əminsiniz?")) {
        localStorage.clear();
        trophies = 0; xp = 0; level = 1;
        updateUI();
        showToast("Bütün sistem datası sıfırlandı!", "red");
    }
}

function saveData() {
    localStorage.setItem('nexus_trophies', trophies);
    localStorage.setItem('nexus_xp', xp);
    localStorage.setItem('nexus_lvl', level);
}
