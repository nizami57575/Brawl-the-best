// ==========================================================================
// BRAWL STARS PRO PORTAL - PREMIUM JAVASCRIPT LOGIC
// ==========================================================================

// --- Qlobal Dəyişənlər və Yaddaş Sistemi ---
let trophies = parseInt(localStorage.getItem('portal_trophies')) || 0;
let userXP = parseInt(localStorage.getItem('portal_xp')) || 0;
let userLevel = parseInt(localStorage.getItem('portal_level')) || 1;
let generatedOtp = null;

// Sayt açılanda məlumatları ekrana yüklə
window.onload = function() {
    updateUI();
    setupChat();
    startViewersCounter();
    startSeasonTimer();
};

// --- 1. İnterfeys Yeniləmə Funksiyası ---
function updateUI() {
    document.getElementById('trophy-count').innerText = trophies;
    
    // Rütbə təyin edilməsi
    let title = "Bürünc Oyunçu 🥉";
    if (trophies >= 100 && trophies < 300) title = "Qızıl Üzv ✨ 🥇";
    if (trophies >= 300) title = "Elmas Master 🔥 💎";
    
    document.getElementById('user-title').innerText = "Rank: " + title;
}

// --- 2. Təhlükəsizlik və Anti-Bot Giriş Sistemi ---
function sendOtp() {
    const email = document.getElementById('email-input').value;
    if (!email || !email.includes('@') || email.length < 6) {
        showNotification("❌ Zəhmət olmasa düzgün bir email daxil edin!", "red");
        return;
    }
    
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`%c[Sistem Kodu]: ${generatedOtp}`, "color: #00ffcc; font-weight: bold; font-size: 16px;");
    
    alert("Bot yoxlama kodu yaradıldı!\n\nKodu görmək üçün klaviaturada F12 düyməsini sıxın və 'Console' bölməsinə baxın.");
    
    document.getElementById('login-part').classList.add('hidden');
    document.getElementById('otp-part').classList.remove('hidden');
}

function checkOtp() {
    const input = document.getElementById('otp-input').value;
    if (input === generatedOtp) {
        showNotification("✅ Giriş uğurludur!", "green");
        document.getElementById('otp-part').classList.add('hidden');
        document.getElementById('portal-part').classList.remove('hidden');
    } else {
        showNotification("❌ Kod yanlışdır!", "red");
    }
}

// --- 3. Kupa Klikləmə və XP Sistemi ---
function addTrophies() {
    trophies += 5;
    localStorage.setItem('portal_trophies', trophies);
    gainXP(10);
    updateUI();
}

function gainXP(amount) {
    userXP += amount;
    if (userXP >= 100) {
        userLevel += 1;
        userXP = userXP - 100;
        showNotification(`🎉 Səviyyə Artırıldı: LVL ${userLevel}!`, "gold");
    }
    localStorage.setItem('portal_xp', userXP);
    localStorage.setItem('portal_level', userLevel);
}

// --- 4. Profil Avatar Mexanikası ---
function changeAvatar(emoji) {
    document.getElementById('avatar-display').innerText = emoji;
    showNotification("👤 Profil şəkli yeniləndi", "cyan");
}

// --- 5. Gündəlik Mükafat Sistemi ---
function claimDaily() {
    const dailyBtn = document.getElementById('daily-btn');
    if (dailyBtn) {
        trophies += 50;
        localStorage.setItem('portal_trophies', trophies);
        updateUI();
        dailyBtn.disabled = true;
        dailyBtn.innerText = "Alındı";
        dailyBtn.style.background = "#444";
        showNotification("🎁 +50 Kupa Bonus qazandınız!", "gold");
    }
}

// --- 6. Qlobal Söhbət Otağı ---
function setupChat() {
    const screen = document.getElementById('chat-screen');
    if (screen) {
        screen.innerHTML = `
            <p style="margin:4px 0; color:#aaa;"><b>[Sistem]:</b> Portala xoş gəldiniz!</p>
            <p style="margin:4px 0;"><b>Leon_Pro:</b> Kim kupa qasır? Otaq kodu paylaşın.</p>
            <p style="margin:4px 0;"><b>Spike_Fan:</b> Bu yeni dizayn çox sürətli işləyir.</p>
        `;
        screen.scrollTop = screen.scrollHeight;
    }
}

function sendMsg() {
    const nick = document.getElementById('chat-nick').value || "Oyunçu";
    const text = document.getElementById('chat-text').value;
    if (!text.trim()) return;
    
    const screen = document.getElementById('chat-screen');
    screen.innerHTML += `<p><b>${nick}:</b> ${text}</p>`;
    document.getElementById('chat-text').value = "";
    screen.scrollTop = screen.scrollHeight;
    gainXP(5);
}

// --- 7. Klan Paylaşım Sistemi ---
function addClub() {
    const tag = document.getElementById('club-tag').value;
    if (!tag.trim()) return;
    
    const clubList = document.getElementById('club-list');
    clubList.innerHTML += `<div style="margin:3px 0; color:#00ffcc;">🛡️ Siyahıda: ${tag.toUpperCase()}</div>`;
    document.getElementById('club-tag').value = "";
    showNotification("🛡️ Klan uğurla əlavə edildi!", "cyan");
}

// --- 8. Otaq Kodu Paylaşımı ---
function shareRoom() {
    const code = document.getElementById('room-code').value;
    if (!code.trim()) return;
    alert(`Otaq kodu [${code.toUpperCase()}] kopyalandı və paylaşıldı!`);
    document.getElementById('room-code').value = "";
}

// --- 9. Brawler Axtarış Süzgəci ---
function filterBrawlers() {
    const query = document.getElementById('search-brawler').value.toLowerCase();
    const res = document.getElementById('brawler-res');
    const list = ["colt", "shelly", "edgar", "mortis", "crow", "leon", "spike"];
    
    if (!query) {
        res.innerText = "Bütün xarakterlər aktivdir";
        return;
    }
    
    const found = list.filter(item => item.includes(query));
    if (found.length > 0) {
        res.innerText = "Tapıldı: " + found.join(", ");
    } else {
        res.innerText = "Xarakter tapılmadı...";
    }
}

// --- 10. İnternet Ping Testi Simulyatoru ---
function runPingTest() {
    const res = document.getElementById('ping-res');
    if (res) {
        res.innerText = "Yoxlanır...";
        setTimeout(() => {
            const randomPing = Math.floor(20 + Math.random() * 60);
            res.innerText = `${randomPing} ms (Stabil)`;
        }, 8000);
    }
}

// --- 11. Səs Effekti Pəncərəsi ---
function playBrawlSound() {
    showNotification("🔊 Səs effekti aktiv edildi!", "cyan");
}

// --- 12. Səsvermə Sistemi ---
function vote(type) {
    if (type === 'Leon') {
        let c = parseInt(document.getElementById('v-leon').innerText);
        document.getElementById('v-leon').innerText = c + 1;
    } else {
        let c = parseInt(document.getElementById('v-crow').innerText);
        document.getElementById('v-crow').innerText = c + 1;
    }
    showNotification("📊 Səsiniz qeydə alındı", "green");
}

// --- 13. Gizli Promo Kod Sahəsi ---
function activateSecret() {
    const code = document.getElementById('secret-code').value;
    if (code.toUpperCase() === "BS2026") {
        trophies += 100;
        localStorage.setItem('portal_trophies', trophies);
        updateUI();
        showNotification("🌟 Gizli Kod: +100 Kupa!", "gold");
    } else {
        showNotification("❌ Keçərsiz Kod", "red");
    }
    document.getElementById('secret-code').value = "";
}

// --- 14. Elmas Sifariş Kalkulyatoru ---
function buyGems() {
    const pack = document.getElementById('gem-pack').value;
    showNotification(`🛒 ${pack} Elmas sifarişi siyahıya əlavə edildi!`, "gold");
}

// --- 15. Bildiriş Pəncərəsi (Toast Notification Layout) ---
function showNotification(text, color) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 25px";
    toast.style.borderRadius = "8px";
    toast.style.background = "#141722";
    toast.style.borderLeft = `5px solid ${color}`;
    toast.style.color = "#fff";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.4)";
    toast.style.zIndex = "9999";
    toast.innerText = text;
    
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// --- Simulyasiya Taymerləri ---
function startViewersCounter() {
    setInterval(() => {
        const viewersSpan = document.getElementById('viewers');
        if (viewersSpan) {
            viewersSpan.innerText = Math.floor(400 + Math.random() * 45);
        }
    }, 5000);
}

function startSeasonTimer() {
    const timerSpan = document.getElementById('season-timer');
    if (timerSpan) {
        let d = 14, h = 5, m = 22;
        setInterval(() => {
            m--;
            if (m < 0) { m = 55; h--; }
            timerSpan.innerText = `${d}g ${h}s ${m}d`;
        }, 60000);
    }
}

// Məlumatları Sıfırlama Düyməsi (İstəyə bağlı konsoldan işlədilə bilər)
function resetPortalData() {
    localStorage.clear();
    trophies = 0;
    userXP = 0;
    userLevel = 1;
    updateUI();
    alert("Bütün yerli sayt datası sıfırlandı!");
}
