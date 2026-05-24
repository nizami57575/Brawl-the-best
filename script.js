// --- YENİ ÖZƏLLİKLƏRİN SKRİPT KODLARI ---

let userXP = 0;
let userLevel = 1;
let totalTrophies = 0;

// Söhbət Otağı Sistemi (Müvəqqəti local saxlama ilə)
function loadChat() {
    const chatBox = document.getElementById('chat-box');
    const savedMessages = JSON.parse(localStorage.getItem('site_chat')) || [
        { name: "Bot_Elvin", msg: "Salam hamıya! Klanımıza adam axtarırıq." },
        { name: "Pro_Gamer", msg: "360 Elmas sifariş verdim, çox rahat işləyir kalkulyator." }
    ];
    
    chatBox.innerHTML = "";
    savedMessages.forEach(item => {
        chatBox.innerHTML += `<p style="margin: 5px 0; font-size: 14px;"><strong>${item.name}:</strong> ${item.msg}</p>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const nameInput = document.getElementById('chat-username').value || "Anonim";
    const msgInput = document.getElementById('chat-message').value;
    
    if(!msgInput) return;
    
    const savedMessages = JSON.parse(localStorage.getItem('site_chat')) || [];
    savedMessages.push({ name: nameInput, msg: msgInput });
    
    // Maksimum 20 mesaj saxlayırıq ki yaddaş dolmasın
    if(savedMessages.length > 20) savedMessages.shift();
    
    localStorage.setItem('site_chat', JSON.stringify(savedMessages));
    document.getElementById('chat-message').value = "";
    
    loadChat();
    gainXP(15); // Hər mesaj üçün 15 XP verilir
}

// XP və Səviyyə Sistemi
function gainXP(amount) {
    userXP += amount;
    if(userXP >= 100) {
        userLevel += 1;
        userXP = userXP - 100;
        alert(`🎉 Təbriklər! Sayt daxili səviyyəniz artdı: Səviyyə ${userLevel}`);
    }
    document.getElementById('user-level').innerText = userLevel;
    document.getElementById('xp-bar').style.width = userXP + "%";
}

// Kupa Klikləyici Oyunu
function clickTrophy() {
    totalTrophies += 2;
    document.getElementById('click-trophies').innerText = totalTrophies + " 🏆";
    gainXP(5); // Hər klik üçün 5 XP
}

// Sayt açılanda söhbət otağını yükləmək üçün funksiyanı işə salırıq
// Əvvəlki window.onload funksiyasının daxilinə loadChat(); əlavə edilə bilər.
setInterval(loadChat, 3000); // Hər 3 saniyədən bir söhbəti yeniləyir

