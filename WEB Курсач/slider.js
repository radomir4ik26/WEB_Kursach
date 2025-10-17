// ===============================================
// HERO SLIDER
// ===============================================

$(document).ready(function() {
    let currentSlide = 0;
    const slides = $('.slide');
    const dots = $('.dot');
    const slideCount = slides.length;
    let slideInterval;

    // Show specific slide
    function showSlide(index) {
        slides.removeClass('active');
        dots.removeClass('active');
        
        $(slides[index]).addClass('active');
        $(dots[index]).addClass('active');
        
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        let next = (currentSlide + 1) % slideCount;
        showSlide(next);
    }

    // Previous slide
    function prevSlide() {
        let prev = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prev);
    }

    // Auto play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Initialize
    startAutoPlay();

    // Dots click
    dots.on('click', function() {
        stopAutoPlay();
        const slideIndex = parseInt($(this).data('slide'));
        showSlide(slideIndex);
        startAutoPlay();
    });

    // Arrow navigation
    $('.slider-prev').on('click', function() {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    $('.slider-next').on('click', function() {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if ($('.hero-slider').length) {
            if (e.keyCode === 37) { // Left arrow
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            } else if (e.keyCode === 39) { // Right arrow
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            }
        }
    });

    // Pause on hover
    $('.hero-slider').hover(
        function() {
            stopAutoPlay();
        },
        function() {
            startAutoPlay();
        }
    );

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    $('.hero-slider').on('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    $('.hero-slider').on('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
});