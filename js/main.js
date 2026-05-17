document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('v_file');
    const trigger = document.getElementById('v_trigger');
    const statusText = document.getElementById('v_status');
    const submitBtn = document.getElementById('v_submit');

    // 1. Metrekare Hesaplama Fonksiyonu
    window.calculateM2 = function() {
        const en = document.getElementById('m2_en').value;
        const boy = document.getElementById('m2_boy').value;
        const sonucAlan = document.getElementById('m2_sonuc');

        if (en > 0 && boy > 0) {
            const m2 = (en * boy) / 10000;
            sonucAlan.innerText = m2.toFixed(2) + " m²";
        } else {
            sonucAlan.innerText = "0.00 m²";
        }
    };

    // 2. Dosya Seçme
    if(trigger) trigger.addEventListener('click', () => fileInput.click());

    if(fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                statusText.innerText = "✅ " + this.files[0].name;
                statusText.style.color = "#00f2fe";
            }
        });
    }

    // 3. WhatsApp Gönderimi
    if(submitBtn) {
        submitBtn.addEventListener('click', function() {
            const details = document.getElementById('v_details').value;
            const phone = document.getElementById('v_phone').value;
            const m2 = document.getElementById('m2_sonuc').innerText;
            const myNum = "905427412994";

            if (!details || !phone) {
                alert("Lütfen tüm alanları doldurunuz.");
                return;
            }

            let fileName = (fileInput.files.length > 0) ? fileInput.files[0].name : "Seçilmedi";
            const msg = `Merhaba Valexira,\n\n*Teklif Talebi*\n📏 Ölçü: ${m2}\n📝 Detay: ${details}\n📞 İletişim: ${phone}\n📁 Dosya: ${fileName}`;
            
            window.open(`https://wa.me/${myNum}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }
});
