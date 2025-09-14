const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Veritabanı bağlantısı
const db = new sqlite3.Database('proposals.db', (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('📊 SQLite veritabanına bağlandı.');
        
        // Tablo oluştur
        db.run(`CREATE TABLE IF NOT EXISTS proposals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            response TEXT NOT NULL,
            click_count INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT
        )`);
    }
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Yanıt kaydetme endpoint'i
app.post('/api/save-response', (req, res) => {
    const { response, clickCount } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    if (!response) {
        return res.status(400).json({ error: 'Response gerekli' });
    }
    
    const sql = `INSERT INTO proposals (response, click_count, ip_address, user_agent) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [response, clickCount || 0, ipAddress, userAgent], function(err) {
        if (err) {
            console.error('Veritabanı kayıt hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        
        const proposalId = this.lastID;
        const timestamp = new Date().toLocaleString('tr-TR');
        
        // Konsola log yazdır
        console.log(`📊 Yeni kayıt - ID: ${proposalId}, Yanıt: ${response}, Tarih: ${timestamp}`);
        
        res.json({ 
            success: true, 
            id: proposalId,
            message: 'Yanıt başarıyla kaydedildi',
            timestamp: timestamp
        });
    });
});

// İstatistikler endpoint'i
app.get('/api/stats', (req, res) => {
    const queries = [
        'SELECT COUNT(*) as total FROM proposals',
        'SELECT COUNT(*) as yes_count FROM proposals WHERE response = "YES"',
        'SELECT COUNT(*) as no_count FROM proposals WHERE response = "NO"',
        'SELECT AVG(click_count) as avg_clicks FROM proposals WHERE response = "NO"',
        'SELECT MAX(click_count) as max_clicks FROM proposals WHERE response = "NO"'
    ];
    
    let results = {};
    let completed = 0;
    
    queries.forEach((query, index) => {
        db.get(query, (err, row) => {
            if (err) {
                console.error('İstatistik hatası:', err.message);
                return;
            }
            
            const keys = ['total', 'yes_count', 'no_count', 'avg_clicks', 'max_clicks'];
            results[keys[index]] = Object.values(row)[0];
            
            completed++;
            if (completed === queries.length) {
                res.json(results);
            }
        });
    });
});

// Son kayıtları getir
app.get('/api/recent', (req, res) => {
    const limit = req.query.limit || 10;
    
    db.all(`SELECT * FROM proposals 
            ORDER BY timestamp DESC 
            LIMIT ?`, [limit], (err, rows) => {
        if (err) {
            console.error('Kayıt getirme hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        
        res.json(rows);
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    console.log(`📊 İstatistikler: http://localhost:${PORT}/api/stats`);
    console.log(`📋 Son kayıtlar: http://localhost:${PORT}/api/recent`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    db.close((err) => {
        if (err) {
            console.error('Veritabanı kapatma hatası:', err.message);
        } else {
            console.log('Veritabanı bağlantısı kapatıldı.');
        }
        process.exit(0);
    });
});