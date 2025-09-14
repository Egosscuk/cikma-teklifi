document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const successMessage = document.getElementById('successMessage');
    const gifContainer = document.getElementById('gifContainer');
    const content = document.querySelector('.content');
    
    let clickCount = 0;
    let yesScale = 1;
    let noScale = 1;
    
    // Hayır butonuna tıklandığında
    noBtn.addEventListener('click', function() {
        clickCount++;
        
        // EVET butonunu büyüt
        yesScale += 0.1;
        yesBtn.style.transform = `scale(${yesScale})`;
        yesBtn.classList.add('grow');
        
        // HAYIR butonunu küçült
        noScale -= 0.1;
        if (noScale < 0.3) {
            noScale = 0.3; // Çok küçülmesini engelle
        }
        noBtn.style.transform = `scale(${noScale})`;
        noBtn.classList.add('shrink');
        
        // Buton metnini değiştir (eğlenceli mesajlar)
        const messages = [
            'Emin misin? 😢',
            'Lütfen düşün... 💔',
            'Belki bir şans? 🥺',
            'Çok üzgünüm... 😭',
            'Son bir şans! 🙏',
            'Lütfen... 😔',
            'Çok acı verici... 💔',
            'Son kez soruyorum! 🥺'
        ];
        
        if (clickCount <= messages.length) {
            noBtn.textContent = messages[clickCount - 1];
        } else {
            noBtn.textContent = 'HAYIR 😢';
        }
        
        // Buton pozisyonunu rastgele değiştir (kaçmaya çalışsın)
        if (clickCount > 3) {
            const container = document.querySelector('.buttons');
            const containerRect = container.getBoundingClientRect();
            const btnRect = noBtn.getBoundingClientRect();
            
            const maxX = containerRect.width - btnRect.width;
            const maxY = containerRect.height - btnRect.height;
            
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            
            noBtn.style.position = 'absolute';
            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
        }
        
        // Kalp animasyonlarını hızlandır
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach(heart => {
            heart.style.animationDuration = Math.max(2, 6 - clickCount * 0.5) + 's';
        });
        
        // Animasyon sınıflarını temizle
        setTimeout(() => {
            yesBtn.classList.remove('grow');
            noBtn.classList.remove('shrink');
        }, 300);
        
        // Her HAYIR tıklamasını veritabanına kaydet
        saveResponse('NO', clickCount);
        
        // Çok fazla tıklanırsa mesaj değiştir
        if (clickCount >= 10) {
            content.innerHTML = `
                <h1 class="title">💔 Üzgünüm... 💔</h1>
                <p class="question">Görünüşe göre gerçekten istemiyorsun.</p>
                <p style="margin-top: 1rem; color: #666;">Belki başka zaman... 😔</p>
                <button class="btn btn-yes" onclick="location.reload()" style="margin-top: 2rem;">
                    Tekrar Dene 💕
                </button>
            `;
        }
    });
    
    // Evet butonuna tıklandığında
    yesBtn.addEventListener('click', function() {
        // Yanıtı veritabanına kaydet
        saveResponse('YES', 0);
        
        // GIF container'ı göster
        gifContainer.classList.add('show');
        
        // Sayfayı gizle
        content.style.display = 'none';
        
        // Konfeti efekti ekle
        createConfetti();
        
        // Müzik çal (eğer tarayıcı destekliyorsa)
        playSuccessSound();
    });
    
    // Konfeti efekti
    function createConfetti() {
        const colors = ['#ff6b9d', '#ff8fab', '#ffb3c1', '#ffc2d1', '#ffd6e8'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.zIndex = '1001';
                confetti.style.borderRadius = '50%';
                confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                // Konfeti'yi temizle
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 10);
        }
    }
    
    // Konfeti düşme animasyonu
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Başarı sesi (Web Audio API ile)
    function playSuccessSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.6);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.6);
        } catch (error) {
            console.log('Ses çalma hatası:', error);
        }
    }
    
    // Mouse takip efekti
    document.addEventListener('mousemove', function(e) {
        if (Math.random() < 0.1) { // %10 ihtimalle
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            sparkle.style.zIndex = '1000';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkle 1s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }
    });
    
    // Sparkle animasyonu
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 1;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(sparkleStyle);
    
    // Sayfa yüklendiğinde hoş geldin animasyonu
    setTimeout(() => {
        content.style.animation = 'slideIn 1s ease-out';
    }, 100);
    
    // Veritabanına yanıt kaydetme fonksiyonu
    function saveResponse(response, clickCount) {
        fetch('/api/save-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                response: response,
                clickCount: clickCount
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Yanıt kaydedildi:', data);
        })
        .catch(error => {
            console.error('Kaydetme hatası:', error);
        });
    }
});
