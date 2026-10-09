const mineflayer = require('mineflayer');
const express = require('express');

// 1. Web Sunucusu (UptimeRobot'un botu 7/24 uyanık tutabilmesi için)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Yardımcı Bot 7/24 Görev Başında!');
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda sorunsuz çalışıyor.`);
});

// 2. Minecraft Bot Ayarları
function createBot() {
  const bot = mineflayer.createBot({
    host: 'proboxpvp.funserver.top', // Sunucu IP adresin
    port: 25565,                     // Java Portu
    username: 'Yardimci_Bot',         // Botun oyundaki adı
    version: '1.20.1'                // Sunucu sürümü
  });

  bot.on('spawn', () => {
    console.log('Yardımcı Bot sunucuya bağlandı ve 7/24 nöbet başladı!');

    // AFK kalıp oyundan atılmaması için her 15 saniyede bir zıplar
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 15000);
  });

  // Oyuna yeni biri girdiğinde otomatik karşılama
  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      setTimeout(() => {
        bot.chat(`Hoş geldin @${player.username}! Web sitemiz ve komutlar için '!site' veya '!yardim' yazabilirsin.`);
      }, 2000);
    }
  });

  // Chat komutları ve otomatik cevap sistemi
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const msg = message.toLowerCase();

    // Kurucu (proeditYT) sunucuda mı kontrolü
    const isOwnerOnline = Boolean(bot.players['proeditYT']);

    if (msg === 'sa' || msg === '!sa') {
      bot.chat(`Aleykümselam @${username}, hoş geldin! Ben sunucu asistanıyım.`);
    } else if (msg === '!yardim') {
      bot.chat('Komutlar: !site, !bilgi, !durum');
    } else if (msg === '!bilgi') {
      if (isOwnerOnline) {
        // Kurucu oyundaysa (Kırmızı ve Kalın)
        bot.chat('&c&l[BİLGİ] Kurucu (proeditYT) şu an sunucuda aktif!');
      } else {
        // Kurucu oyunda değilse
        bot.chat('&c&l[BİLGİ] Kurucu aktif olmadığında sunucuda ben 7/24 nöbet tutuyorum!');
      }
    } else if (msg === '!durum') {
      if (isOwnerOnline) {
        // Kurucu oyundaysa (Kırmızı ve Kalın)
        bot.chat('&c&l[DURUM] Kurucu oyunda! Sunucu ve bot sistemi aktif.');
      } else {
        // Kurucu oyunda değilse
        bot.chat('&c&l[DURUM] Sunucu aktif, bot sistemi 7/24 çalışıyor.');
      }
    } 
    // Oyuncuları sunucudan atmaması için düz chat mesajı olarak gönderiyoruz
    else if (msg === '!site') {
      bot.chat(`Web sitemiz: https://proeditsmp.onrender.com`);
    }
  });

  // İnternet kesilirse veya bağlantı koparsa otomatik tekrar bağlanır
  bot.on('end', () => {
    console.log('Bağlantı koptu, 5 saniye sonra tekrar bağlanılıyor...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => console.log('Hata oluştu:', err));
}

createBot();
