// ===============================================
// NEWS FUNCTIONS
// ===============================================

$(document).ready(function() {
    
    // Render news cards
    function renderNews(container, data, limit = null) {
        const newsToShow = limit ? data.slice(0, limit) : data;
        let html = '';

        newsToShow.forEach((news, index) => {
            html += `
                <div class="news-card variant-${news.variant}" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="news-image">
                        <div class="news-icon">${news.icon}</div>
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span class="news-date">📅 ${news.date}</span>
                            <span class="news-category">${news.category}</span>
                        </div>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.excerpt}</p>
                        <div class="news-footer">
                            <span class="news-author">✍️ ${news.author}</span>
                            <a href="#" class="news-read-more">
                                Читати далі →
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        $(container).html(html);
    }

    // Render news on home page (10 items)
    if ($('#newsGrid').length) {
        renderNews('#newsGrid', newsData, 10);
    }

    // Render all news on news page
    if ($('#allNewsGrid').length) {
        renderNews('#allNewsGrid', newsData);
    }

    // News card click handler
    $(document).on('click', '.news-card', function(e) {
        if (!$(e.target).hasClass('news-read-more')) {
            const newsId = $(this).index() + 1;
            showNewsDetail(newsId);
        }
    });

    // Show news detail (можна розширити для модального вікна)
    function showNewsDetail(id) {
        const news = newsData.find(n => n.id === id);
        if (news) {
            console.log('Showing news:', news);
            // Тут можна додати логіку для відображення повної новини
            // Наприклад, відкрити модальне вікно або перейти на окрему сторінку
        }
    }

    // Search news
    function searchNews(query) {
        query = query.toLowerCase();
        return newsData.filter(news => 
            news.title.toLowerCase().includes(query) ||
            news.excerpt.toLowerCase().includes(query) ||
            news.category.toLowerCase().includes(query)
        );
    }

    // Filter news by category
    function filterByCategory(category) {
        if (category === 'all') {
            return newsData;
        }
        return newsData.filter(news => news.category === category);
    }

    // Sort news
    function sortNews(data, sortBy) {
        const sorted = [...data];
        
        switch(sortBy) {
            case 'date-desc':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        
        return sorted;
    }

    // News filters (if on news page)
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const category = $(this).data('category');
        const filtered = filterByCategory(category);
        renderNews('#allNewsGrid', filtered);
    });

    // Search functionality
    $('#newsSearch').on('input', function() {
        const query = $(this).val();
        const results = searchNews(query);
        renderNews('#allNewsGrid', results);
    });

    // Load more news
    let loadedCount = 10;
    $('#loadMoreNews').on('click', function() {
        loadedCount += 6;
        renderNews('#allNewsGrid', newsData, loadedCount);
        
        if (loadedCount >= newsData.length) {
            $(this).hide();
        }
    });

    // Animation on scroll
    function animateNewsCards() {
        $('.news-card').each(function(index) {
            const $card = $(this);
            const cardTop = $card.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (cardTop < windowBottom - 100) {
                setTimeout(function() {
                    $card.addClass('animate-fade-in-up');
                }, index * 100);
            }
        });
    }

    // Call animation on scroll
    $(window).on('scroll', animateNewsCards);
    animateNewsCards(); // Initial call
});