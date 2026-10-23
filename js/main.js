// === UZAY YILDIZ ANİMASYONU ===
(function () {
    var canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var NUM  = 200;
    var W, H, cx, cy;
    var stars = [];
    var warp  = 0;
    var lastY = window.scrollY || 0;

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
        requestAnimationFrame(draw);
    }

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

const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

// Ekran boyutlandırma fonksiyonu
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];

/* Sitenin kozmik ve siber renk paleti:
  Neon Macenta, Camgöbeği, Kozmik Mor ve Parlak Yıldız Beyazı
*/
const colors = [
    'rgba(255, 0, 128, ',   
    'rgba(0, 229, 255, ',   
    'rgba(157, 0, 255, ',   
    'rgba(255, 255, 255, '  
];

// Fare konum takibi için obje
const mouse = {
    x: undefined,
    y: undefined
};

// Fare hareket ettikçe parçacık tetikleyici
window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    // Her harekette arkada kalacak 2 adet kozmik parçacık üretir
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
});

// Mobil cihazlar ve dokunmatik ekranlar için iz takibi
window.addEventListener('touchmove', function(event) {
    if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
        particles.push(new Particle(mouse.x, mouse.y));
    }
});

// Parçacık (Yıldız) Sınıfı Yapısı
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Parçacık boyutu (Rastgele küçük kozmik noktalar)
        this.size = Math.random() * 3 + 1; 
        // Hafifçe saçılma yönü ve hızı
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        // Havuzdan rastgele renk seçimi
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        // Başlangıç opaklığı
        this.alpha = 1;
        // Sönerek kaybolma hızı
        this.decay = Math.random() * 0.015 + 0.01;
    }

    // Pozisyon ve görünürlük güncelleme
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay; // Zamanla şeffaflaşma
        if (this.size > 0.1) this.size -= 0.02; // Zamanla küçülme
    }

    // Ekrana çizme ve parlama (Glow) verme alanı
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.alpha + ')';
        
        // Siber parlama efekti (Glow)
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.colorBase + '1)';
        
        ctx.fill();
        ctx.restore();
    }
}

// Akıcı animasyon döngüsü (60 FPS Çalışır)
function animate() {
    // Katmanı her karede temizler
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Tamamen sönen (görünmez olan) parçacıkları silerek hafızayı temiz tutar
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

// Döngüyü başlat
animate();
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

/* =====================================================================
   VALEXIRA INFOGRAFİK  |  js/infografik.js
   - Adım seçimi (tıklama, klavye, otomatik oynatma)
   - Çözünürlük hesaplayıcı
   - Görünüm animasyonları
   ===================================================================== */
(function () {
    'use strict';

    /* ---------- Adım verileri ---------- */
    var STEPS = [
        {
            num: '01',
            title: 'Grafik Tasarım & Vektör Hazırlık',
            cat: 'Baskı Öncesi (Pre-Press) Standartları',
            desc: 'Baskı kalitesinin temeli doğru hazırlanan grafik dosyasıdır. Tasarımlar Illustrator veya CorelDRAW ortamında vektörel çizilir. Renk modunun CMYK olması ve taşma paylarının (bleed) 3 mm olarak ayarlanması önemlidir.',
            l1: 'RENK MODU', v1: 'CMYK (FOGRA39)',
            l2: 'ÖNERİLEN ÇÖZÜNÜRLÜK', v2: '300 DPI / PPI',
            tags: ['#PDF/X-1a', '#Vector Layout', '#3mm Bleed', '#Font Outlining', '#Pantone Matching']
        },
        {
            num: '02',
            title: 'Malzeme Seçimi & Ortam Analizi',
            cat: 'Uygulama Alanına Göre Seçim',
            desc: 'Malzeme, uygulanacak yere göre belirlenir. Cam ve araç yüzeyleri için döküm folyo, geniş dış mekân alanları için branda, içeriden dışarının görülmesi gereken camlar için delikli folyo (One Way Vision) tercih edilir. Kullanım süresi ve yüzey yapısı seçimi belirler.',
            l1: 'KULLANIM ALANI', v1: 'İç ve dış mekân',
            l2: 'YÜZEY', v2: 'Cam, araç, duvar, tabela',
            tags: ['#Döküm Folyo', '#Branda', '#One Way Vision', '#Dekota', '#Kendinden Yapışkanlı']
        },
        {
            num: '03',
            title: 'Yüksek Çözünürlük Baskı',
            cat: 'Üretim Aşaması',
            desc: 'Dosya onaylandıktan sonra malzemeye uygun makinede baskı alınır. Solvent mürekkepler dış mekânda dayanıklı sonuç verir, UV baskı ise sert yüzeylere doğrudan baskı yapılmasını sağlar. Baskı sonrası mürekkebin kuruması için kısa bir bekleme gerekir.',
            l1: 'ÇÖZÜNÜRLÜK', v1: "1440 DPI'a kadar",
            l2: 'MÜREKKEP', v2: 'UV / Eko-Solvent',
            tags: ['#1440 DPI', '#UV Baskı', '#Eko-Solvent', '#Renk Profili']
        },
        {
            num: '04',
            title: 'Kesim & Son İşlem',
            cat: 'Baskı Sonrası (Finishing)',
            desc: 'Baskı tamamlanınca iş istenen şekle getirilir. Plotter kontur kesimi yapar, laminasyon ise yüzeyi çizilmeye ve güneş ışığına karşı korur. Gerektiğinde uygulamayı kolaylaştırmak için transfer bandı eklenir.',
            l1: 'KESİM', v1: 'Kontur / düz kesim',
            l2: 'KORUMA', v2: 'Mat veya parlak laminasyon',
            tags: ['#Plotter Kesim', '#Kontur Kesim', '#Laminasyon', '#Transfer Bandı']
        },
        {
            num: '05',
            title: 'Montaj & Teslimat',
            cat: 'Uygulama Aşaması',
            desc: 'Ürün atölyede teslim edilir ya da yerinde uygulanır. Yüzeyin temiz ve kuru olması, uygulama sıcaklığı ve hava kabarcıklarının doğru alınması sonucu belirler. Büyük işlerde uygulama sırası önceden planlanır.',
            l1: 'UYGULAMA', v1: 'Kuru veya ıslak yöntem',
            l2: 'TESLİMAT', v2: 'Atölye teslim / montaj',
            tags: ['#Saha Uygulama', '#Yüzey Hazırlığı', '#Rakle', '#Kabarcıksız Montaj']
        }
    ];

    /* ---------- Hesaplayıcı kuralları ---------- */
    // rules: [en uzun kenar (cm) üst sınırı, önerilen DPI]
    var MATERIALS = {
        folyo:  { type: 'Eko-Solvent Dijital Baskı',          rules: [[100, 150], [300, 100], [Infinity, 72]] },
        branda: { type: 'Solvent Dijital Baskı',              rules: [[200, 100], [500, 72],  [Infinity, 50]] },
        oneway: { type: 'Eko-Solvent Baskı + UV Laminasyon',  rules: [[300, 100], [Infinity, 72]] }
    };
    var MAX_CM = 5000;
    var INCH = 2.54;

    function compute(w, h, material) {
        w = Number(w);
        h = Number(h);
        if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0 || w > MAX_CM || h > MAX_CM) {
            return { valid: false };
        }
        var m = MATERIALS[material] || MATERIALS.folyo;
        var side = Math.max(w, h);
        var dpi = m.rules[m.rules.length - 1][1];
        for (var i = 0; i < m.rules.length; i++) {
            if (side <= m.rules[i][0]) { dpi = m.rules[i][1]; break; }
        }
        return {
            valid: true,
            dpi: dpi,
            pxW: Math.round((w / INCH) * dpi),
            pxH: Math.round((h / INCH) * dpi),
            area: (w * h) / 10000,
            type: m.type,
            // Rulo genişliğini aşan işler parçalı basılır
            split: Math.min(w, h) > 320
        };
    }

    // Node testleri için
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { compute: compute, STEPS: STEPS };
    }
    if (typeof document === 'undefined') { return; }

    var root = document.getElementById('valexira-infographic-root');
    if (!root) { return; }
    root.classList.add('v-js');

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (sel) { return root.querySelector(sel); };
    var vx = function (name) { return root.querySelector('[data-vx="' + name + '"]'); };

    /* ---------- Adım seçimi ---------- */
    var nodes = [].slice.call(root.querySelectorAll('.v-node'));
    var card = $('.v-info-card');
    var current = 0;

    function renderTags(list) {
        var wrap = vx('tags');
        wrap.textContent = '';
        list.forEach(function (t, i) {
            var s = document.createElement('span');
            s.className = 'v-tag';
            s.style.setProperty('--t', i);
            s.textContent = t;
            wrap.appendChild(s);
        });
    }

    function setStep(index, fromUser) {
        index = (index + STEPS.length) % STEPS.length;
        var d = STEPS[index];

        nodes.forEach(function (n, i) {
            var active = i === index;
            n.classList.toggle('is-active', active);
            n.classList.toggle('is-done', i < index);
            n.setAttribute('aria-selected', active ? 'true' : 'false');
            n.tabIndex = active ? 0 : -1;
        });

        vx('num').textContent = d.num;
        vx('title').textContent = d.title;
        vx('cat').textContent = d.cat;
        vx('desc').textContent = d.desc;
        vx('l1').textContent = d.l1;
        vx('v1').textContent = d.v1;
        vx('l2').textContent = d.l2;
        vx('v2').textContent = d.v2;
        renderTags(d.tags);
        card.setAttribute('aria-labelledby', 'vx-tab-' + index);

        if (!reduced && index !== current) {
            card.classList.remove('is-swapping');
            void card.offsetWidth; // animasyonu yeniden başlat
            card.classList.add('is-swapping');
        }
        current = index;

        if (fromUser) { stopAutoplay(true); }
    }

    nodes.forEach(function (n, i) {
        n.style.setProperty('--i', i);
        n.addEventListener('click', function () { setStep(i, true); });
    });

    // Klavye: ok tuşları, Home, End
    $('.v-timeline').addEventListener('keydown', function (e) {
        var k = e.key, target = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') { target = current + 1; }
        else if (k === 'ArrowLeft' || k === 'ArrowUp') { target = current - 1; }
        else if (k === 'Home') { target = 0; }
        else if (k === 'End') { target = STEPS.length - 1; }
        if (target === null) { return; }
        e.preventDefault();
        setStep(target, true);
        nodes[current].focus();
    });

    /* ---------- Otomatik oynatma ---------- */
    var timer = null, inView = false, hovering = false, userStopped = false;
    var INTERVAL = 6000;

    function syncAutoplay() {
        var should = !reduced && inView && !hovering && !userStopped && !document.hidden;
        if (should && !timer) {
            timer = setInterval(function () { setStep(current + 1, false); }, INTERVAL);
        } else if (!should && timer) {
            clearInterval(timer);
            timer = null;
        }
    }
    function stopAutoplay(permanent) {
        if (permanent) { userStopped = true; }
        syncAutoplay();
    }

    root.addEventListener('pointerenter', function () { hovering = true; syncAutoplay(); });
    root.addEventListener('pointerleave', function () { hovering = false; syncAutoplay(); });
    root.addEventListener('focusin',      function () { hovering = true; syncAutoplay(); });
    root.addEventListener('focusout',     function () { hovering = false; syncAutoplay(); });
    document.addEventListener('visibilitychange', syncAutoplay);

    /* ---------- Hesaplayıcı ---------- */
    var inW = $('#vWidth'), inH = $('#vHeight'), inM = $('#vMaterial');
    var results = $('.v-calc-results');
    var nf = new Intl.NumberFormat('tr-TR');
    var af = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
    var flashTimer = null;

    function parse(el) { return parseFloat(String(el.value).replace(',', '.')); }

    function calculate() {
        var r = compute(parse(inW), parse(inH), inM.value);
        var note = vx('note');

        inW.classList.toggle('is-invalid', !(parse(inW) > 0 && parse(inW) <= MAX_CM));
        inH.classList.toggle('is-invalid', !(parse(inH) > 0 && parse(inH) <= MAX_CM));

        if (!r.valid) {
            vx('r-dpi').textContent = '—';
            vx('r-pixel').textContent = '—';
            vx('r-area').textContent = '—';
            vx('r-type').textContent = '—';
            note.textContent = 'Genişlik ve yüksekliği 1 ile 5000 cm arasında girin.';
            note.hidden = false;
            return;
        }

        vx('r-dpi').textContent = r.dpi + ' DPI';
        vx('r-pixel').textContent = nf.format(r.pxW) + ' x ' + nf.format(r.pxH) + ' px';
        vx('r-area').textContent = af.format(r.area) + ' m²';
        vx('r-type').textContent = r.type;

        if (r.split) {
            note.textContent = 'Bu ölçüde iş genellikle parçalara bölünerek basılır ve birleştirilir.';
            note.hidden = false;
        } else {
            note.hidden = true;
        }

        if (!reduced) {
            results.classList.remove('is-updated');
            void results.offsetWidth;
            results.classList.add('is-updated');
            clearTimeout(flashTimer);
            flashTimer = setTimeout(function () { results.classList.remove('is-updated'); }, 450);
        }
    }

    inW.addEventListener('input', calculate);
    inH.addEventListener('input', calculate);
    inM.addEventListener('change', calculate);

    /* ---------- Görünüm animasyonları ---------- */
    var reveals = [].slice.call(root.querySelectorAll('.v-reveal'));
    reveals.forEach(function (el) {
        if (!el.classList.contains('v-node')) { el.style.setProperty('--i', 0); }
    });

    if ('IntersectionObserver' in window) {
        var revealIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('is-visible');
                    revealIO.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { revealIO.observe(el); });

        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            syncAutoplay();
        }, { threshold: 0.35 }).observe(root);
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
        inView = true;
        syncAutoplay();
    }

    /* ---------- Başlangıç ---------- */
    setStep(0, false);
    calculate();

    // Eski satır içi çağrılarla uyumluluk
    window.switchInfoStep = function (i) { setStep(i, true); };
    window.calculatePrint = calculate;
})();
