// ==========================================================================
// CYBER BRAWL STARS PORTAL - CORE JAVASCRIPT SYSTEM
// ==========================================================================

// EmailJS Aktivləşdirmə Paneli
(function() {
    // BURANI DƏYİŞMƏ: Sənin şəxsi Public Key-ini bura yazmalısan
    emailjs.init("YOUR_PUBLIC_KEY"); 
})();

let trophies = parseInt(localStorage.getItem('cyber_trophies')) || 0;
let xp = parseInt(localStorage.getItem('cyber_xp')) || 0;
let level = parseInt(localStorage.getItem('cyber_lvl')) || 1;
let generatedOtp = null;

window.onload = function() {
    initMatrixBg();
    updateUI();
    setupChat();
    startMonitorSim();
};

// --- 1. MÜKƏMMƏL MATRİX ARKA PLAN ANIMASIYASI ---
function initMatrixBg() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = "01BRAWLSTARS0101💥⭐🏆💎";
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f3ff'; // Neon Mavi
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }
    setInterval(draw, 33);
}

// --- 2. SƏNİN SERVICE ID-N İLƏ REAL GMAIL GÖNDƏRMƏ ---
function sendRealOtp() {
    const email = document.getElementById('email-input').value;
    if (!email || !email.includes('@') || email.length < 6) {
        alert("Zəhmət olmasa düzgün bir Gmail ünvanı daxil edin!");
        return;
    }

    // 6 rəqəmli kod yaradılır
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[Təhlükəsizlik Sistemi] Yaradılan Kod: ${generatedOtp}`);

    const templateParams = {
        to_email: email,
        otp_code: generatedOtp
    };

    // Sənin service_attk09n Xidmətin İnteqrasiyası
    emailjs.send('service_attk09n', 'YOUR_TEMPLATE_ID', templateParams)
    .then(function(response) {
        alert("🔒 Təhlükəsizlik kodu real olaraq Gmailinizə göndərildi! Gələn qutusu və ya Spam bölməsini yoxlayın.");
        document.getElementById('login-part').classList.add('hidden');
        document.getElementById('otp-part').classList.remove('hidden');
    }, function(error) {
        console.log("EmailJS Xətası:", error);
        alert("EmailJS ayarları (Public Key və ya Template ID) hələ tam yazılmayıb! Konsol (F12) bölməsindən kodu götürərək test edə bilərsiniz.");
        // Testin yarımçıq qalmaması üçün keçid təmin edilir
        document.getElementById('login-part').classList.add('hidden');
        document.getElementById('otp-part').classList.remove('hidden');
    });
}

function checkOtp() {
    const input = document.getElementById('otp-input').value;
    if (input === generatedOtp) {
        alert("Giriş təsdiqləndi! Dashboard panelinə yönləndirilirsiniz.");
        document.getElementById('otp-part').classList.add('hidden');
        document.getElementById('portal-part').classList.remove('hidden');
    } else {
        alert("Daxil etdiyiniz kod yanlışdır!");
    }
}

// --- 3. UI VƏ İNTERFEYS LOGİKASI ---
function updateUI() {
    document.getElementById('trophy-count').innerText = trophies;
    document.getElementById('xp-progress').style.width = xp + "%";
    
    let rank = "Bürünc Oyunçu 🥉";
    if(trophies >= 100) rank = "Epik Döyüşçü 🌟";
    if(trophies >= 300) rank = "Kiber Elmas Master 💎🔥";
    document.getElementById('user-title').innerText = "Rank: " + rank;
}

function addTrophies() {
    trophies += 5;
    xp += 20;
    if (xp >= 100) { xp = 0; level++; }
    saveData();
    updateUI();
}

function openStarrDrop() {
    const res = document.getElementById('drop-res');
    res.innerText = "Açılır... 🎲";
    setTimeout(() => {
        const rewards = ["⚡ 200 Token Doubler", "🪙 500 Qızıl", "💎 10 Pulsuz Elmas Xalı"];
        res.innerText = "Çıxdı: " + rewards[Math.floor(Math.random() * rewards.length)];
        document.getElementById('drop-btn').disabled = true;
    }, 1200);
}

// --- 4. QLOBAL SÖHBƏT OTAĞI ---
function setupChat() {
    const screen = document.getElementById('chat-screen');
    screen.innerHTML = "<p style='color:#555;'>[Sistem]: Təhlükəsiz kiber kanal açıldı.</p><p><b>Pro_Brawler:</b> Kim kupa qasır? Otaq kodu yazın.</p>";
}

function sendMsg() {
    const nick = document.getElementById('chat-nick').value || "Oyunçu";
    const color = document.getElementById('nick-color').value;
    const text = document.getElementById('chat-text').value;
    if(!text.trim()) return;

    const screen = document.getElementById('chat-screen');
    screen.innerHTML += `<p><b style="color:${color}">${nick}:</b> ${text}</p>`;
    document.getElementById('chat-text').value = "";
    screen.scrollTop = screen.scrollHeight;
}

function processOrder() {
    const pack = document.getElementById('gem-pack').value;
    alert(` Sifariş Uğurla Qeydə Alındı!\nSeçilən Paket: ${pack} Elmas\n\nBalans yaxın zamanda rəhbərlik tərəfindən təsdiqlənib yüklənəcək.`);
}

function changeAvatar(emoji) {
    document.getElementById('avatar-display').innerText = emoji;
}

function startMonitorSim() {
    setInterval(() => {
        const ping = Math.floor(20 + Math.random() * 20);
        document.getElementById('fps-ping').innerText = ping;
        
        const online = Math.floor(500 + Math.random() * 80);
        document.getElementById('online-count').innerText = online;
    }, 4000);
}

function saveData() {
    localStorage.setItem('cyber_trophies', trophies);
    localStorage.setItem('cyber_xp', xp);
    localStorage.setItem('cyber_lvl', level);
}
