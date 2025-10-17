// ===============================================
// MAIN JAVASCRIPT
// ===============================================

$(document).ready(function() {
    
    // ===============================================
    // PRELOADER
    // ===============================================
    
    $(window).on('load', function() {
        setTimeout(function() {
            $('#preloader').addClass('hidden');
        }, 800);
    });

    // ===============================================
    // AOS ANIMATION INIT
    // ===============================================
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // ===============================================
    // MOBILE MENU
    // ===============================================
    
    $('#mobileToggle').on('click', function() {
        $(this).toggleClass('active');
        $('#navMenu').parent('.nav').toggleClass('active');
        $('body').toggleClass('menu-open');
    });

    // Close mobile menu when clicking on link
    $('.nav-link').on('click', function() {
        $('#mobileToggle').removeClass('active');
        $('#navMenu').parent('.nav').removeClass('active');
        $('body').removeClass('menu-open');
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav, #mobileToggle').length) {
            $('#mobileToggle').removeClass('active');
            $('#navMenu').parent('.nav').removeClass('active');
            $('body').removeClass('menu-open');
        }
    });

    // ===============================================
    // SCROLL TO TOP
    // ===============================================
    
    const $scrollBtn = $('#scrollToTop');
    
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $scrollBtn.addClass('visible');
        } else {
            $scrollBtn.removeClass('visible');
        }
    });
    
    $scrollBtn.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // ===============================================
    // SMOOTH SCROLL
    // ===============================================
    
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });

    // ===============================================
    // ACTIVE MENU HIGHLIGHT
    // ===============================================
    
    function highlightActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        $('.nav-link').each(function() {
            const href = $(this).attr('href');
            if (href === currentPage) {
                $('.nav-link').removeClass('active');
                $(this).addClass('active');
            }
        });
    }
    
    highlightActiveMenu();

    // ===============================================
    // HEADER SCROLL EFFECT
    // ===============================================
    
    let lastScroll = 0;
    const header = $('.header');
    
    $(window).on('scroll', function() {
        const currentScroll = $(this).scrollTop();
        
        if (currentScroll > 100) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.css('transform', 'translateY(-100%)');
        } else {
            header.css('transform', 'translateY(0)');
        }
        
        lastScroll = currentScroll;
    });

    // ===============================================
    // LAZY LOADING IMAGES
    // ===============================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===============================================
    // COUNTER ANIMATION
    // ===============================================
    
    function animateCounter($element, target) {
        $({ countNum: 0 }).animate({
            countNum: target
        }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $element.text(Math.floor(this.countNum));
            },
            complete: function() {
                $element.text(target);
            }
        });
    }

    // Trigger counter animation when in viewport
    let counterAnimated = false;
    
    $(window).on('scroll', function() {
        if (!counterAnimated && $('.stat-number').length) {
            const statsTop = $('.stats-section').offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (statsTop < windowBottom - 100) {
                counterAnimated = true;
                $('.stat-number').each(function() {
                    const text = $(this).text().replace('+', '').replace('%', '');
                    const target = parseInt(text);
                    if (!isNaN(target)) {
                        $(this).text('0');
                        animateCounter($(this), target);
                        
                        // Add back suffix
                        if ($(this).text().includes('+')) {
                            setTimeout(() => {
                                $(this).text($(this).text() + '+');
                            }, 2000);
                        }
                        if ($(this).text().includes('%')) {
                            setTimeout(() => {
                                $(this).text($(this).text() + '%');
                            }, 2000);
                        }
                    }
                });
            }
        }
    });

    // ===============================================
    // FORM VALIDATION
    // ===============================================
    
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const $form = $(this);
        
        $form.find('input[required], textarea[required]').each(function() {
            const $field = $(this);
            const value = $field.val().trim();
            
            if (!value) {
                isValid = false;
                $field.addClass('error');
                $field.next('.error-message').remove();
                $field.after('<span class="error-message">Це поле обов\'язкове</span>');
            } else {
                $field.removeClass('error');
                $field.next('.error-message').remove();
            }
            
            // Email validation
            if ($field.attr('type') === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    $field.addClass('error');
                    $field.next('.error-message').remove();
                    $field.after('<span class="error-message">Невірний формат email</span>');
                }
            }
        });
        
        if (isValid) {
            // Submit form or show success message
            console.log('Form submitted successfully');
            showNotification('Форму успішно відправлено!', 'success');
            $form[0].reset();
        }
    });

    // Remove error on input
    $('input, textarea').on('input', function() {
        $(this).removeClass('error');
        $(this).next('.error-message').remove();
    });

    // ===============================================
    // NOTIFICATION SYSTEM
    // ===============================================
    
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type}">
                <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('show');
        }, 100);
        
        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        notification.find('.notification-close').on('click', function() {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // ===============================================
    // PARALLAX EFFECT
    // ===============================================
    
    $(window).on('scroll', function() {
        const scrolled = $(this).scrollTop();
        $('.parallax').each(function() {
            const speed = $(this).data('speed') || 0.5;
            const offset = scrolled * speed;
            $(this).css('transform', `translateY(${offset}px)`);
        });
    });

    // ===============================================
    // SEARCH FUNCTIONALITY
    // ===============================================
    
    $('#searchBtn').on('click', function() {
        $('.search-overlay').addClass('active');
        $('#searchInput').focus();
    });

    $('.search-close, .search-overlay').on('click', function(e) {
        if ($(e.target).hasClass('search-overlay') || $(e.target).hasClass('search-close')) {
            $('.search-overlay').removeClass('active');
        }
    });

    // Search with Enter key
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            const query = $(this).val();
            performSearch(query);
        }
    });

    function performSearch(query) {
        console.log('Searching for:', query);
        // Тут можна додати логіку пошуку
    }

    // ===============================================
    // TOOLTIPS
    // ===============================================
    
    $('[data-tooltip]').each(function() {
        const $element = $(this);
        const tooltipText = $element.data('tooltip');
        
        $element.hover(
            function() {
                const tooltip = $(`<div class="tooltip">${tooltipText}</div>`);
                $('body').append(tooltip);
                
                const offset = $element.offset();
                const elementWidth = $element.outerWidth();
                const tooltipWidth = tooltip.outerWidth();
                
                tooltip.css({
                    top: offset.top - tooltip.outerHeight() - 10,
                    left: offset.left + (elementWidth / 2) - (tooltipWidth / 2)
                });
                
                setTimeout(() => tooltip.addClass('show'), 10);
            },
            function() {
                $('.tooltip').remove();
            }
        );
    });

    // ===============================================
    // COPY TO CLIPBOARD
    // ===============================================
    
    $('.copy-btn').on('click', function() {
        const text = $(this).data('copy');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Скопійовано в буфер обміну!', 'success');
            });
        } else {
            // Fallback for older browsers
            const $temp = $('<input>');
            $('body').append($temp);
            $temp.val(text).select();
            document.execCommand('copy');
            $temp.remove();
            showNotification('Скопійовано в буфер обміну!', 'success');
        }
    });

    // ===============================================
    // ACCORDION
    // ===============================================
    
    $('.accordion-header').on('click', function() {
        const $item = $(this).parent();
        const $content = $item.find('.accordion-content');
        
        if ($item.hasClass('active')) {
            $item.removeClass('active');
            $content.slideUp(300);
        } else {
            $('.accordion-item').removeClass('active');
            $('.accordion-content').slideUp(300);
            $item.addClass('active');
            $content.slideDown(300);
        }
    });

    // ===============================================
    // TABS
    // ===============================================
    
    $('.tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $(`#${tabId}`).addClass('active');
    });

    // ===============================================
    // MODAL
    // ===============================================
    
    $('[data-modal]').on('click', function() {
        const modalId = $(this).data('modal');
        $(`#${modalId}`).addClass('active');
        $('body').addClass('modal-open');
    });

    $('.modal-close, .modal-overlay').on('click', function(e) {
        if ($(e.target).hasClass('modal-close') || $(e.target).hasClass('modal-overlay')) {
            $('.modal').removeClass('active');
            $('body').removeClass('modal-open');
        }
    });

    // Close modal with Escape key
    $(document).on('keydown', function(e) {
        if (e.keyCode === 27) {
            $('.modal').removeClass('active');
            $('body').removeClass('modal-open');
        }
    });

    // ===============================================
    // PRINT PAGE
    // ===============================================
    
    $('#printBtn').on('click', function() {
        window.print();
    });

    // ===============================================
    // CONSOLE MESSAGE
    // ===============================================
    
    console.log('%c👋 Привіт, бухгалтер!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cЦей сайт розроблений з любов\'ю ❤️', 'color: #764ba2; font-size: 14px;');
    console.log('%cВерсія: 1.0.0', 'color: #6b7280; font-size: 12px;');

    // ===============================================
    // PERFORMANCE OPTIMIZATION
    // ===============================================
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize scroll events
    $(window).on('scroll', throttle(function() {
        // Your scroll logic here
    }, 100));

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    
    // Format number
    window.formatNumber = function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Format date
    window.formatDate = function(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Check if element is in viewport
    window.isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // ===============================================
    // INIT COMPLETE
    // ===============================================
    
    console.log('✅ JavaScript initialized successfully');
});