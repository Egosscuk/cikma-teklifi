# 💕 Çıkma Teklifi Takip Sistemi

Bu proje, çıkma tekliflerinin yanıtlarını takip etmek için tasarlanmış basit bir web uygulamasıdır.

## 🚀 Özellikler

- ✅ **Basit ve şık arayüz** - Kullanıcı dostu tasarım
- 📊 **SQLite veritabanı** - Tüm yanıtları saklar
- 📈 **İstatistikler** - EVET/HAYIR sayıları ve analizler
- 📱 **Responsive tasarım** - Mobil uyumlu
- 🔒 **Güvenli** - IP adresi ve cihaz bilgisi takibi

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

## 🛠️ Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/Egosscuk/cikma-teklifi.git
cd cikma-teklifi
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Sunucuyu başlatın:**
```bash
npm start
```

4. **Tarayıcıda açın:**
```
http://localhost:80
```

## 📁 Proje Yapısı

```
├── server.js          # Ana sunucu dosyası
├── index.html         # Ana sayfa
├── style.css          # CSS stilleri
├── script.js          # Frontend JavaScript
├── package.json       # Proje bağımlılıkları
├── proposals.db       # SQLite veritabanı (otomatik oluşur)
└── README.md          # Bu dosya
```

## 🔧 API Endpoints

- `GET /` - Ana sayfa
- `POST /api/save-response` - Yanıt kaydetme
- `GET /api/stats` - İstatistikler
- `GET /api/recent` - Son kayıtlar

## 💾 Veritabanı

SQLite veritabanı otomatik olarak oluşturulur ve şu tabloyu içerir:

```sql
CREATE TABLE proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    response TEXT NOT NULL,
    click_count INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT
);
```

## 🎨 Özelleştirme

- `style.css` dosyasından renkleri ve stilleri değiştirebilirsiniz
- `index.html` dosyasından metinleri düzenleyebilirsiniz
- `server.js` dosyasından API davranışlarını özelleştirebilirsiniz

## 📊 İstatistikler

Sistem şu istatistikleri sağlar:
- Toplam yanıt sayısı
- EVET yanıtı sayısı
- HAYIR yanıtı sayısı
- Ortalama HAYIR tıklama sayısı
- En yüksek HAYIR tıklama sayısı

## 🚀 Deployment

### Heroku
```bash
# Procfile oluşturun
echo "web: node server.js" > Procfile

# Heroku'ya deploy edin
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Vercel
```bash
# vercel.json oluşturun
```

`vercel.json` dosyası içeriği:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.


## 📞 İletişim

Sorularınız için issue açabilir veya https://egosscuk.com üzerinden iletişime geçebilirsiniz.

---

Çıkma teklifi geri gelsin diyenlere...
<img width="2547" height="1271" alt="image" src="https://github.com/user-attachments/assets/c646685f-359b-4261-81a0-619a1840bf5b" />

