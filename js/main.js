// === UZAY YILDIZ ANİMASYONU ===
(function () {
    var canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var NUM  = 200;
    var W, H, cx, cy;
    var stars = [];
    var warp  = 0;
    var lastY = window.scrollY || 0;
    var frameId = 0;
    var motionQuery = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    var reducedMotion = motionQuery && motionQuery.matches;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        if (canvas.width !== W) canvas.width = W;
        if (canvas.height !== H) canvas.height = H;
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

            if (t > 0.5) {
                ctx.beginPath();
                ctx.arc(sx, sy, size * 2.8, 0, 6.2832);
                ctx.fillStyle='rgba('+r+','+g+','+b+','+(alpha*0.13)+')';
                ctx.fill();
            }
        }

        warp *= 0.88;
        if (Math.abs(warp) < 0.05) warp = 0;
        if (!document.hidden && !reducedMotion) {
            frameId = requestAnimationFrame(draw);
        }
    }

    var tick = false;
    window.addEventListener('scroll', function () {
        if (reducedMotion || document.hidden) return;
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

    window.addEventListener('resize', function () {
        resize();
        init();
        if (!document.hidden) {
            if (frameId) cancelAnimationFrame(frameId);
            draw();
        }
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = 0;
        } else {
            draw();
        }
    });
    if (motionQuery) {
        var onMotionChange = function (event) {
            reducedMotion = event.matches;
            if (reducedMotion && frameId) {
                cancelAnimationFrame(frameId);
                frameId = 0;
            }
            if (!document.hidden) draw();
        };
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', onMotionChange);
        } else if (motionQuery.addListener) {
            motionQuery.addListener(onMotionChange);
        }
    }
    resize(); init(); draw();
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
    // Menü açıkken WhatsApp butonunu gizle, kapanınca geri getir
    if (waWidget) { waWidget.style.display = isOpen ? 'none' : ''; }
}

// Menü dışına tıklanınca kapat
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

// Menü linkine tıklanınca kapat
(function () {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    navMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') { _menuClose(); }
    });
})();

// ESC tuşuyla kapat
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

(function () {
    var canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var maxParticles = 180;
    var frameId = 0;
    var reducedMotionQuery = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    var colors = [
        'rgba(255, 0, 128, ',
        'rgba(0, 229, 255, ',
        'rgba(157, 0, 255, ',
        'rgba(255, 255, 255, '
    ];

    function resizeCanvas() {
        if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
        if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
    }

    function createParticle(x, y) {
        return {
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5,
            colorBase: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01
        };
    }

    function animate() {
        frameId = 0;
        if (document.hidden || (reducedMotionQuery && reducedMotionQuery.matches)) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 8;
        var alive = 0;
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= particle.decay;
            if (particle.size > 0.1) particle.size -= 0.02;

            if (particle.alpha <= 0) continue;

            particles[alive++] = particle;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.colorBase + particle.alpha + ')';
            ctx.shadowColor = particle.colorBase + '1)';
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        if (particles.length) frameId = requestAnimationFrame(animate);
    }

    function requestAnimation() {
        if (!frameId && !document.hidden &&
            !(reducedMotionQuery && reducedMotionQuery.matches)) {
            frameId = requestAnimationFrame(animate);
        }
    }

    function addParticles(x, y, count) {
        if (document.hidden || (reducedMotionQuery && reducedMotionQuery.matches)) return;
        for (var i = 0; i < count && particles.length < maxParticles; i++) {
            particles.push(createParticle(x, y));
        }
        requestAnimation();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', function (event) {
        addParticles(event.clientX, event.clientY, 2);
    }, { passive: true });
    window.addEventListener('touchmove', function (event) {
        if (event.touches.length) {
            addParticles(event.touches[0].clientX, event.touches[0].clientY, 1);
        }
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = 0;
        } else {
            requestAnimation();
        }
    });
    if (reducedMotionQuery) {
        var onCursorMotionChange = function (event) {
            if (event.matches) {
                if (frameId) cancelAnimationFrame(frameId);
                frameId = 0;
                particles.length = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        if (reducedMotionQuery.addEventListener) {
            reducedMotionQuery.addEventListener('change', onCursorMotionChange);
        } else if (reducedMotionQuery.addListener) {
            reducedMotionQuery.addListener(onCursorMotionChange);
        }
    }
})();
// Portfolyo banner slider
(function () {
    const banner = document.getElementById('vProBanner');
    if (!banner) return;

    const imgs = banner.querySelectorAll('.v-pro-banner-img');
    const dots = banner.querySelectorAll('.v-pro-banner-progress span');
    let i = 0;
    const DURATION = 5000;

    function goTo(index) {
        imgs.forEach((img, idx) => img.classList.toggle('active', idx === index));
        dots.forEach((dot, idx) => {
            dot.classList.remove('filling');
            dot.classList.toggle('filled', idx < index);
            void dot.offsetWidth;
            if (idx === index) dot.classList.add('filling');
        });
    }

    goTo(0);
    setInterval(() => {
        i = (i + 1) % imgs.length;
        goTo(i);
    }, DURATION);
})();

(function(){
  // DPI ve baskı türü değerlerini kendi değerlerine göre düzenle
  var M={folyo:{dpi:100,tip:"Eko-Solvent Dijital Baskı"},
         branda:{dpi:72,tip:"Solvent Büyük Format Baskı"},
         oneway:{dpi:100,tip:"Eko-Solvent Dijital Baskı"}};
  var w=document.getElementById("vxW"),h=document.getElementById("vxH"),m=document.getElementById("vxM");
  var dpi=document.getElementById("vxDpi"),px=document.getElementById("vxPx");
  var area=document.getElementById("vxAr"),type=document.getElementById("vxTp");
  if(!w||!h||!m||!dpi||!px||!area||!type){return}
  var nf=new Intl.NumberFormat("tr-TR",{maximumFractionDigits:2});
  function run(){
    var width=parseFloat(w.value),height=parseFloat(h.value),material=M[m.value];
    if(!(width>0&&height>0)||!material){return}
    dpi.textContent=material.dpi+" DPI";
    px.textContent=nf.format(Math.round(width/2.54*material.dpi))+" x "+nf.format(Math.round(height/2.54*material.dpi))+" px";
    area.textContent=nf.format(width*height/10000)+" m²";
    type.textContent=material.tip;
  }
  [w,h,m].forEach(function(e){e.addEventListener("input",run)});run();
})();
(function () {
  var root = document.getElementById("sss");
  if (!root) { return; }
  var items = root.querySelectorAll("details.vq__item");

  // Aynı anda tek soru açık kalsın
  items.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) { return; }
      items.forEach(function (o) { if (o !== d) { o.open = false; } });
    });
  });

  // Adres #sss-fiyat gibi bitiyorsa o soruyu aç
  function openFromHash() {
    var id = location.hash.slice(1);
    var el = id ? document.getElementById(id) : null;
    if (el && el.classList.contains("vq__item")) { el.open = true; }
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  // Sayfadaki soru ve cevaplardan FAQPage verisini üret
  var list = [];
  items.forEach(function (d) {
    var q = d.querySelector("summary");
    var a = d.querySelector(".vq__a");
    if (!q || !a) { return; }
    list.push({
      "@type": "Question",
      "name": q.textContent.trim(),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a.textContent.replace(/\s+/g, " ").trim()
      }
    });
  });

  if (list.length) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": list
    });
    document.head.appendChild(s);
  }
  
  
})();

/* ==========================================================
   Valexira - 3D Küp Görsel (vc-cube.js)
   - Global değişken oluşturmaz (IIFE), diğer scriptlerle çakışmaz.
   - [data-vc] olan her blok ayrı çalışır.
   - Otomatik döner; sürükleme, ok, nokta, klavye ve tıklama ile de çevrilir.
   - Üzerine gelince, ekran dışında, sekme arkadayken veya sürüklerken durur.
   - Görsel yolu hatalıysa yüzün üzerinde tam yolu yazar.
   ========================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    /* ---------- Hatalı görsel yolunu yakala ---------- */
    function watchImage(face, img) {
        function markBroken() {
            face.classList.add('is-broken');
            face.setAttribute('data-path', img.getAttribute('src') || '');
        }
        function check() {
            if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) { markBroken(); }
        }
        img.addEventListener('error', markBroken);
        check();                                   /* hata olayı script'ten önce olmuş olabilir */
    }

    function setup(root) {
        var scene = root.querySelector('.vc-scene');
        var tilt  = root.querySelector('.vc-tilt');
        var cube  = root.querySelector('.vc-cube');
        var faces = Array.prototype.slice.call(root.querySelectorAll('.vc-face'));
        var dots  = Array.prototype.slice.call(root.querySelectorAll('.vc-dot'));
        var prevBtn = root.querySelector('.vc-prev');
        var nextBtn = root.querySelector('.vc-next');

        if (!scene || !tilt || !cube || faces.length < 4) { return; }

        var n        = dots.length || 2;               /* benzersiz görsel sayısı (2 veya 4) */
        var interval = parseInt(root.getAttribute('data-interval'), 10) || 4500;
        var step     = 0;                              /* toplam çeyrek dönüş sayısı */
        var timer    = 0;
        var reasons  = { hover: false, drag: false, focus: false, offscreen: false, hidden: false };

        /* ---------- Görseller ---------- */
        faces.forEach(function (face) {
            var img = face.querySelector('img');
            if (!img) { return; }
            img.draggable = false;
            watchImage(face, img);
        });

        /* ---------- Otomatik dönme ---------- */
        function isPaused() {
            return reasons.hover || reasons.drag || reasons.focus || reasons.offscreen || reasons.hidden;
        }

        function schedule() {
            clearTimeout(timer);
            if (reduceMotion || isPaused()) { return; }
            timer = setTimeout(function () { go(step + 1); }, interval);
        }

        function setPause(reason, value) {
            reasons[reason] = value;
            schedule();
        }

        /* ---------- Döndürme ---------- */
        function render() {
            var active = ((step % n) + n) % n;
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
                if (i === active) { dot.setAttribute('aria-current', 'true'); }
                else { dot.removeAttribute('aria-current'); }
            });
        }

        function go(newStep) {
            step = newStep;
            cube.style.setProperty('--vc-ang', (-step * 90) + 'deg');
            render();
            schedule();
        }

        if (prevBtn) { prevBtn.addEventListener('click', function () { go(step - 1); }); }
        if (nextBtn) { nextBtn.addEventListener('click', function () { go(step + 1); }); }

        dots.forEach(function (dot, k) {
            dot.addEventListener('click', function () {
                var current = ((step % n) + n) % n;
                var delta = ((k - current) % n + n) % n;
                if (delta > n / 2) { delta -= n; }
                if (delta !== 0) { go(step + delta); }
            });
        });

        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft')  { go(step - 1); }
            if (e.key === 'ArrowRight') { go(step + 1); }
        });

        /* Klavye ile odaklanınca dur (fare tıklaması süresiz durdurmasın diye :focus-visible) */
        root.addEventListener('focusin', function (e) {
            var keyboardFocus = false;
            try { keyboardFocus = e.target.matches(':focus-visible'); } catch (err) { /* eski tarayıcı */ }
            if (keyboardFocus) { setPause('focus', true); }
        });
        root.addEventListener('focusout', function () { setPause('focus', false); });

        /* ---------- Sürükleyerek çevirme + fareyle eğilme ---------- */
        var drag = null, dragged = false;
        var rect = null, rafId = 0, px = 0.5, py = 0.5;

        function applyTilt() {
            rafId = 0;
            tilt.style.setProperty('--vc-ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
            tilt.style.setProperty('--vc-rx', (-(py - 0.5) * 14).toFixed(2) + 'deg');
            tilt.style.setProperty('--vc-mx', (px * 100).toFixed(1) + '%');
            tilt.style.setProperty('--vc-my', (py * 100).toFixed(1) + '%');
        }

        function resetTilt() {
            if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
            px = py = 0.5;
            tilt.style.setProperty('--vc-ry', '0deg');
            tilt.style.setProperty('--vc-rx', '0deg');
        }

        scene.addEventListener('pointerenter', function (e) {
            if (e.pointerType !== 'mouse') { return; }
            rect = scene.getBoundingClientRect();
            setPause('hover', true);
        });

        scene.addEventListener('pointerleave', function (e) {
            if (e.pointerType !== 'mouse') { return; }
            rect = null;
            resetTilt();
            setPause('hover', false);
        });

        scene.addEventListener('pointerdown', function (e) {
            if (e.button !== undefined && e.button !== 0) { return; }
            dragged = false;
            drag = { id: e.pointerId, x: e.clientX, y: e.clientY, active: false, dx: 0 };
        });

        scene.addEventListener('pointermove', function (e) {
            if (drag && e.pointerId === drag.id) {
                var dx = e.clientX - drag.x;
                var dy = e.clientY - drag.y;

                if (!drag.active && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
                    drag.active = true;
                    try { scene.setPointerCapture(e.pointerId); } catch (err) { /* sorun değil */ }
                    scene.classList.add('is-drag');
                    resetTilt();
                    setPause('drag', true);
                }

                if (drag.active) {
                    drag.dx = dx;
                    var size  = scene.getBoundingClientRect().width || 1;
                    var extra = Math.max(-90, Math.min(90, dx / size * 90));
                    cube.style.setProperty('--vc-ang', (-step * 90 + extra) + 'deg');
                    return;
                }
            }

            /* Fareyle eğilme */
            if (e.pointerType === 'mouse' && rect) {
                px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
                if (!rafId) { rafId = requestAnimationFrame(applyTilt); }
            }
        });

        function endDrag(e, cancelled) {
            if (!drag || e.pointerId !== drag.id) { return; }
            var d = drag;
            drag = null;
            if (!d.active) { return; }

            dragged = true;
            scene.classList.remove('is-drag');
            void scene.offsetWidth;                      /* geçiş animasyonu geri gelsin diye */

            var size = scene.getBoundingClientRect().width || 1;
            var target = step;
            if (!cancelled && Math.abs(d.dx) > size * 0.18) { target = step + (d.dx < 0 ? 1 : -1); }

            reasons.drag = false;
            go(target);
        }

        scene.addEventListener('pointerup',     function (e) { endDrag(e, false); });
        scene.addEventListener('pointercancel', function (e) { endDrag(e, true); });

        /* Kısa dokunma / tıklama: sıradaki yüz (sürükleme sonrası tıklama sayılmaz) */
        scene.addEventListener('click', function () {
            if (dragged) { dragged = false; return; }
            go(step + 1);
        });

        /* ---------- Ekrana girince uçarak gelsin, ekran dışında dursun ---------- */
        if ('IntersectionObserver' in window && !reduceMotion) {
            var entered = false;
            root.classList.add('vc-ready');
            new IntersectionObserver(function (entries) {
                var visible = entries[0].isIntersecting;
                if (visible && !entered) {
                    entered = true;
                    root.classList.add('is-in');
                }
                root.classList.toggle('is-off', !visible);
                setPause('offscreen', !visible);
            }, { threshold: 0.2 }).observe(root);
        }

        document.addEventListener('visibilitychange', function () {
            root.classList.toggle('is-hidden', document.hidden);
            setPause('hidden', document.hidden);
        });

        go(0);
    }

    function init() {
        var blocks = document.querySelectorAll('[data-vc]');
        for (var i = 0; i < blocks.length; i++) {
            if (!blocks[i].__vcReady) {                /* iki kez başlatılmasın */
                blocks[i].__vcReady = true;
                setup(blocks[i]);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
