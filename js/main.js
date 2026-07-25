// === UZAY YILDIZ ANİMASYONU ===
(function () {
    var canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    // Azaltıldı: 450 → 200 yıldız (CPU %55 daha az)
    var NUM  = 200;
    var W, H, cx, cy;
    var stars = [];
    var warp  = 0;
    var lastY = window.scrollY || 0;
    var rafId = null;
    var paused = false;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cx = W / 2; cy = H / 2;
    }

    function mkStar(fresh) {
        var maxZ = 1800;
        return {
            x    : (Math.random() - 0.5) * W  * 5,
            y    : (Math.random() - 0.5) * H  * 5,
            z    : fresh ? Math.random() * maxZ : maxZ,
            spd  : 0.4 + Math.random() * 1.8,
            szmul: 0.5 + Math.random() * 1.5,
            twinkPhase : Math.random() * Math.PI * 2,
            twinkSpeed : 0.015 + Math.random() * 0.04,
            col  : Math.random() < 0.80 ? 0 : (Math.random() < 0.60 ? 1 : 2),
            maxZ : maxZ,
            px:0, py:0
        };
    }

    function init() {
        stars = [];
        for (var i = 0; i < NUM; i++) stars.push(mkStar(true));
    }

    function draw() {
        if (paused) { rafId = null; return; }
        ctx.clearRect(0, 0, W, H);

        var warping   = warp >  2.5;
        var reversing = warp < -1;

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var prevPX = s.px, prevPY = s.py;

            s.z -= s.spd + warp * (0.5 + s.spd * 0.3);
            s.twinkPhase += s.twinkSpeed;

            if (s.z <= 1 || s.z > s.maxZ) {
                stars[i] = mkStar(false);
                continue;
            }

            var f  = 500;
            var sx = (s.x / s.z) * f + cx;
            var sy = (s.y / s.z) * f + cy;
            s.px = sx; s.py = sy;

            if (sx < -100 || sx > W+100 || sy < -100 || sy > H+100) continue;

            var t      = 1 - s.z / s.maxZ;
            var twink  = 0.7 + 0.3 * Math.sin(s.twinkPhase);
            var size   = Math.max(0.3, t * 3.2 * s.szmul);
            var alpha  = Math.min(1, (0.1 + t * 1.4) * twink);

            var r, g, b;
            if      (s.col === 1) { r=80;  g=220; b=255; }
            else if (s.col === 2) { r=255; g=80;  b=190; }
            else {
                r = Math.floor(170 + t*85);
                g = Math.floor(175 + t*80);
                b = Math.floor(215 + t*40);
            }

            // Warp izleri
            if ((warping || reversing) && prevPX !== 0) {
                var dx=sx-prevPX, dy=sy-prevPY;
                if (dx*dx+dy*dy > 1) {
                    ctx.beginPath();
                    ctx.moveTo(prevPX, prevPY);
                    ctx.lineTo(sx, sy);
                    ctx.strokeStyle='rgba('+r+','+g+','+b+','+(alpha*0.5)+')';
                    ctx.lineWidth = size * 0.55;
                    ctx.stroke();
                }
            }

            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, 6.2832);
            ctx.fillStyle='rgba('+r+','+g+','+b+','+alpha+')';
            ctx.fill();

            // Parlama — sadece öne yakın, BÜYÜK yıldızlar (t > 0.65) — overdraw azaltır
            if (t > 0.65 && size > 1.2) {
                ctx.beginPath();
                ctx.arc(sx, sy, size * 2.5, 0, 6.2832);
                ctx.fillStyle='rgba('+r+','+g+','+b+','+(alpha*0.10)+')';
                ctx.fill();
            }
        }

        warp *= 0.88;
        if (Math.abs(warp) < 0.05) warp = 0;
        rafId = requestAnimationFrame(draw);
    }

    // Sayfa gizlenince animasyonu durdur, görününce devam et
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            paused = true;
        } else {
            paused = false;
            if (!rafId) { rafId = requestAnimationFrame(draw); }
        }
    });

    var tick = false;
    window.addEventListener('scroll', function () {
        if (!tick) {
            requestAnimationFrame(function () {
                var y = window.scrollY || document.documentElement.scrollTop || 0;
                var d = y - lastY;
                lastY = y;
                warp += d * 0.5;
                if (warp >  32) warp =  32;
                if (warp < -18) warp = -18;
                tick = false;
            });
            tick = true;
        }
    }, {passive:true});

    window.addEventListener('resize', function () { resize(); init(); });
    resize(); init();
    rafId = requestAnimationFrame(draw);
})();

// === MOBİL MENÜ ===
function _menuClose() {
    var navMenu  = document.getElementById('navMenu');
    var menuBtn  = document.getElementById('mobileMenuBtn');
    var waWidget = document.getElementById('ai-wa-wrapper');
    if (navMenu)  { navMenu.classList.remove('active'); }
    if (menuBtn)  { menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    if (waWidget) { waWidget.style.display = ''; }
    document.body.style.overflow = '';
}

function toggleMenu() {
    var navMenu  = document.getElementById('navMenu');
    var menuBtn  = document.getElementById('mobileMenuBtn');
    var waWidget = document.getElementById('ai-wa-wrapper');
    if (!navMenu || !menuBtn) return;
    var isOpen = navMenu.classList.toggle('active');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (waWidget) { waWidget.style.display = isOpen ? 'none' : ''; }
}

document.addEventListener('click', function (e) {
    var navMenu = document.getElementById('navMenu');
    var menuBtn = document.getElementById('mobileMenuBtn');
    if (!navMenu || !menuBtn) return;
    if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) { _menuClose(); }
});

(function () {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    navMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') { _menuClose(); }
    });
})();

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        var navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) { _menuClose(); }
    }
});

// === M² HESAPLAMA ===
function calculateM2() {
    var en   = parseFloat(document.getElementById('m2_en').value)  || 0;
    var boy  = parseFloat(document.getElementById('m2_boy').value) || 0;
    var alan = (en / 100) * (boy / 100);
    document.getElementById('m2_sonuc').textContent = alan.toFixed(2) + ' m\u00b2';
}

// === MATERYAL SEÇİM ASİSTANI ===
function pickProduct(val) {
    var res  = document.getElementById('asistan-sonuc');
    if (!res) return;
    var data = {
        cam:    '<b>\u00d6neri: One Way Vision / Folyo</b><br><small>Camlarda d\u0131\u015ftan reklam, i\u00e7ten net g\u00f6r\u00fc\u015f sa\u011flar.</small>',
        dekor:  '<b>\u00d6neri: Kumlu / Kesim Folyo</b><br><small>Ofis ve vitrinlerde \u015fik dekoratif \u00e7\u00f6z\u00fcmler.</small>',
        levha:  '<b>\u00d6neri: Foreks \u00dczeri Folyo</b><br><small>Y\u00f6nlendirme ve \u0130SG i\u00e7in en dayan\u0131kl\u0131 sert zemin.</small>',
        rehber: '<b>Hangi \u00dcr\u00fcn Daha Yararl\u0131?</b><br><small><b>Kartvizit:</b> Prestij ve tan\u0131\u015fma.<br><b>Magnet:</b> Buzdolab\u0131nda kal\u0131c\u0131 reklam.</small>'
    };
    res.innerHTML = '<span style="color:#00e5ff;display:block;width:100%;">' + (data[val] || '') + '</span>';
}

// === AI ROBOT TYPEWRITER ===
(function () {
    var msg    = ' \u0130leti\u015fim \u00dcs\u00fc Ba\u011flant\u0131s\u0131 Haz\u0131r. Tasar\u0131m yolculu\u011funu ba\u015flat\u0131n.';
    var el     = document.getElementById('ai-wa-typed');
    var cursor = document.getElementById('ai-wa-cursor');
    if (!el) return;
    var idx = 0;
    function typeChar() {
        if (idx < msg.length) {
            el.textContent += msg[idx++];
            setTimeout(typeChar, 55 + Math.random() * 30);
        } else {
            if (cursor) cursor.style.display = 'none';
        }
    }
    setTimeout(typeChar, 1000);
})();

// === TEKLİF FORMU & WHATSAPP ===
(function () {
    var fileInput  = document.getElementById('v_file');
    var trigger    = document.getElementById('v_trigger');
    var statusText = document.getElementById('v_status');
    var submitBtn  = document.getElementById('v_submit');

    if (trigger && fileInput) {
        trigger.addEventListener('click', function () { fileInput.click(); });
    }

    if (fileInput && statusText) {
        fileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                statusText.innerText = '\u2705 ' + this.files[0].name;
                statusText.style.color = '#00f2fe';
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            var details = document.getElementById('v_details') ? document.getElementById('v_details').value : '';
            var phone   = document.getElementById('v_phone')   ? document.getElementById('v_phone').value   : '';
            var m2      = document.getElementById('m2_sonuc')  ? document.getElementById('m2_sonuc').innerText : '0.00 m\u00b2';
            var myNum   = '905427412994';

            if (!details || !phone) {
                alert('L\u00fctfen t\u00fcm alanlar\u0131 doldurunuz.');
                return;
            }

            var fileName = (fileInput && fileInput.files.length > 0) ? fileInput.files[0].name : 'Se\u00e7ilmedi';
            var msg = 'Merhaba Valexira,\n\n*Teklif Talebi*\n\uD83D\uDCCF \u00d6l\u00e7\u00fc: ' + m2 + '\n\uD83D\uDCDD Detay: ' + details + '\n\uD83D\uDCDE \u0130leti\u015fim: ' + phone + '\n\uD83D\uDCC1 Dosya: ' + fileName;

            window.open('https://wa.me/' + myNum + '?text=' + encodeURIComponent(msg), '_blank');
        });
    }
})();

// === LIGHTBOX ===
function openLightbox(src) {
    var lb  = document.getElementById('v-portfolio-lightbox');
    var img = document.getElementById('lightbox-img');
    if (lb && img) {
        img.src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    var lb = document.getElementById('v-portfolio-lightbox');
    if (lb) {
        lb.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// === İMZEÇ KURSÖRİ (CURSOR TRAIL) ===
// Cursor canvas ve space canvas aynı RAF döngüsüne alındı — ikinci bir RAF döngüsü kaldırıldı
(function () {
    var cursorCanvas = document.getElementById('cursor-canvas');
    if (!cursorCanvas) return;
    var cctx = cursorCanvas.getContext('2d');

    function resizeCursor() {
        cursorCanvas.width  = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    resizeCursor();
    window.addEventListener('resize', resizeCursor, { passive: true });

    var particles = [];
    var MAX_PARTICLES = 120; // Sınır eklendi — bellek koruması

    var colors = [
        'rgba(255, 0, 128, ',
        'rgba(0, 229, 255, ',
        'rgba(157, 0, 255, ',
        'rgba(255, 255, 255, '
    ];

    var mx, my;

    window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        // MAX_PARTICLES aşıldıysa yeni parçacık ekleme
        if (particles.length < MAX_PARTICLES) {
            particles.push(new Particle(mx, my));
            particles.push(new Particle(mx, my));
        }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
        if (e.touches.length > 0 && particles.length < MAX_PARTICLES) {
            mx = e.touches[0].clientX; my = e.touches[0].clientY;
            particles.push(new Particle(mx, my));
        }
    }, { passive: true });

    function Particle(x, y) {
        this.x = x; this.y = y;
        this.size      = Math.random() * 3 + 1;
        this.speedX    = (Math.random() - 0.5) * 1.5;
        this.speedY    = (Math.random() - 0.5) * 1.5;
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        this.alpha     = 1;
        this.decay     = Math.random() * 0.015 + 0.01;
    }

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        if (this.size > 0.1) this.size -= 0.02;
    };

    Particle.prototype.draw = function () {
        cctx.save();
        cctx.beginPath();
        cctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        cctx.fillStyle = this.colorBase + this.alpha + ')';
        cctx.shadowBlur  = 8;  // 10 → 8 (hafif azaltma)
        cctx.shadowColor = this.colorBase + '1)';
        cctx.fill();
        cctx.restore();
    };

    var rafPaused = false;
    document.addEventListener('visibilitychange', function () {
        rafPaused = document.hidden;
        if (!rafPaused) requestAnimationFrame(animate);
    });

    function animate() {
        if (rafPaused) return;
        cctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();
