const mineflayer = require('mineflayer');
const express = require('express');

// 1. Web Sunucusu (Botun PC kapalıyken 7/24 uyanık kalması için)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Yardımcı Bot 7/24 Görev Başında!');
});

app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda sorunsuz çalışıyor.`);
});

// 2. Minecraft Bot Ayarları ve Fonksiyonları
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

    if (msg === 'sa' || msg === '!sa') {
      bot.chat(`Aleykümselam @${username}, hoş geldin! Ben sunucu asistanıyım.`);
    } else if (msg === '!yardim') {
      bot.chat('Komutlar: !site, !bilgi, !durum');
    } else if (msg === '!bilgi') {
      bot.chat('Kurucu aktif olmadığında sunucuda ben 7/24 nöbet tutuyorum!');
    } else if (msg === '!durum') {
      bot.chat('Sunucu aktif, bot sistemi 7/24 çalışıyor.');
    } 
    // !site yazılınca tıklanabilir ve kopyalanabilir link gönderir
    else if (msg === '!site') {
      const siteJson = JSON.stringify([
        { text: 'Web Sitemiz: ', color: 'gold', bold: true },
        {
          text: 'proeditsmp.onrender.com',
          color: 'aqua',
          underlined: true,
          clickEvent: {
            action: 'open_url',
            value: 'https://proeditsmp.onrender.com'
          },
          hoverEvent: {
            action: 'show_text',
            contents: 'Tıkla ve siteye git / adresi kopyala!'
          }
        }
      ]);

      // JSON formatlı tıklanabilir chat mesajını yollar
      bot.chat(`/tellraw ${username} ${siteJson}`);
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