(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    items.forEach((item, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        item.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
// Sayfa açılır açılmaz butonu düzeltir (Tıklama beklemez)
$(document).ready(function() {
    var fixLink = function() {
        var $lbClose = $('.lb-close');
        if ($lbClose.length > 0) {
            $lbClose.attr('href', '#').attr('aria-label', 'Kapat');
        }
    };
    
    // Hem sayfa açıldığında hem de resme tıklandığında çalıştır
    fixLink(); 
    $(document).on('click', '[data-lightbox]', function() {
        setTimeout(fixLink, 500);
    });
});

    
})(jQuery);

