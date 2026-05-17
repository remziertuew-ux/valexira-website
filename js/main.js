// === UZAY YILDIZ ANİMASYONU ===
(function () {
    var canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var NUM  = 450;
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

/* Mobil menü aç/kapat */
function toggleMenu() {
    var navMenu = document.getElementById('navMenu');
    var menuBtn = document.getElementById('mobileMenuBtn');
    var isOpen  = navMenu.classList.toggle('active');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));

    /* Açıkken body scroll'u kilitle */
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* Menü dışına tıklanınca kapat */
document.addEventListener('click', function(e) {
    var navMenu = document.getElementById('navMenu');
    var menuBtn = document.getElementById('mobileMenuBtn');
    if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

/* Menü linkine tıklanınca kapat */
document.getElementById('navMenu').addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        var navMenu = document.getElementById('navMenu');
        var menuBtn = document.getElementById('mobileMenuBtn');
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

/* ESC tuşuyla kapat */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var navMenu = document.getElementById('navMenu');
        var menuBtn = document.getElementById('mobileMenuBtn');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
});

/* M² Hesaplama */
function calculateM2() {
    var en   = parseFloat(document.getElementById('m2_en').value)  || 0;
    var boy  = parseFloat(document.getElementById('m2_boy').value) || 0;
    var alan = (en / 100) * (boy / 100);
    document.getElementById('m2_sonuc').textContent = alan.toFixed(2) + ' m²';
}

/* Materyal Seçim Asistanı */
function pickProduct(val) {
    var res  = document.getElementById('asistan-sonuc');
    var data = {
        cam:    '<b>Öneri: One Way Vision / Folyo</b><br><small>Camlarda dıştan reklam, içten net görüş sağlar.</small>',
        dekor:  '<b>Öneri: Kumlu / Kesim Folyo</b><br><small>Ofis ve vitrinlerde şık dekoratif çözümler.</small>',
        levha:  '<b>Öneri: Foreks Üzeri Folyo</b><br><small>Yönlendirme ve İSG için en dayanıklı sert zemin.</small>',
        rehber: '<b>Hangi Ürün Daha Yararlı?</b><br><small><b>Kartvizit:</b> Prestij ve tanışma.<br><b>Magnet:</b> Buzdolabında kalıcı reklam.</small>'
    };
    res.innerHTML = '<span style="color:#00e5ff; display:block; width:100%;">' + data[val] + '</span>';
}

/* === AI ROBOT TYPEWRITER YAZISI (tek seferlik) === */
(function () {
    var msg       = ' "İletişim Üssü Bağlantısı Hazır. Tasarım yolculuğunu başlatın."';
    var el        = document.getElementById('ai-wa-typed');
    var cursor    = document.getElementById('ai-wa-cursor');
    if (!el) return;

    var idx = 0;

    function typeChar() {
        if (idx < msg.length) {
            el.textContent += msg[idx];
            idx++;
            setTimeout(typeChar, 55 + Math.random() * 30);
        } else {
            /* Yazı tamamlandı — imleci gizle */
            if (cursor) cursor.style.display = 'none';
        }
    }

    /* Sayfa yüklendikten 1 saniye sonra başla */
    setTimeout(typeChar, 1000);
})();

/* Teklif Formu */
document.addEventListener('DOMContentLoaded', function() {
    var fileInput  = document.getElementById('v_file');
    var trigger    = document.getElementById('v_trigger');
    var statusText = document.getElementById('v_status');
    var submitBtn  = document.getElementById('v_submit');

    if (trigger) {
        trigger.addEventListener('click', function () { fileInput.click(); });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                statusText.innerText = "✅ " + this.files[0].name;
                statusText.style.color = "#00f2fe";
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            var details  = document.getElementById('v_details').value;
            var phone    = document.getElementById('v_phone').value;
            var m2       = document.getElementById('m2_sonuc').innerText;
            var myNum    = "905427412994";

            if (!details || !phone) {
                alert("Lütfen tüm alanları doldurunuz.");
                return;
            }

            var fileName = (fileInput && fileInput.files.length > 0) ? fileInput.files[0].name : "Seçilmedi";
            var msg = "Merhaba Valexira,\n\n*Teklif Talebi*\n📏 Ölçü: " + m2 + "\n📝 Detay: " + details + "\n📞 İletişim: " + phone + "\n📁 Dosya: " + fileName;

            window.open("https://wa.me/" + myNum + "?text=" + encodeURIComponent(msg), '_blank');
        });
    }
});
 
