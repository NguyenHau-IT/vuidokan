// News Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Category filtering functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const newsCards = document.querySelectorAll('[data-category]');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Filter news cards
            newsCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'block';
                    // Add animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate API call
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Đang xử lý...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    submitButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Thành công!';
                    submitButton.classList.remove('btn-light');
                    submitButton.classList.add('btn-success');
                    
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.classList.remove('btn-success');
                        submitButton.classList.add('btn-light');
                        submitButton.disabled = false;
                        emailInput.value = '';
                    }, 2000);
                }, 1500);
                
                // Show success message
                showNotification('Đăng ký thành công! Cảm ơn bạn đã quan tâm đến VUIDOKAN.', 'success');
            } else {
                showNotification('Vui lòng nhập địa chỉ email hợp lệ.', 'error');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading for news images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Add reading time calculation
    document.querySelectorAll('.news-card p, .featured-news-card p').forEach(content => {
        const text = content.textContent || content.innerText;
        const wordsPerMinute = 200; // Average reading speed
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        // Add reading time badge
        const newsCard = content.closest('.news-card, .featured-news-card');
        const newsMeta = newsCard.querySelector('.news-meta');
        if (newsMeta && readingTime > 0) {
            const readingTimeBadge = document.createElement('span');
            readingTimeBadge.className = 'reading-time';
            readingTimeBadge.innerHTML = `<i class="bi bi-clock me-1"></i>${readingTime} phút đọc`;
            readingTimeBadge.style.color = '#6c757d';
            readingTimeBadge.style.fontSize = '0.8rem';
            newsMeta.appendChild(readingTimeBadge);
        }
    });
    
    // Social sharing functionality
    function addSocialSharing() {
        const newsCards = document.querySelectorAll('.news-card, .featured-news-card');
        
        newsCards.forEach(card => {
            const title = card.querySelector('h3, h4')?.textContent || 'Tin tức từ VUIDOKAN';
            const url = window.location.href;
            
            // Create social sharing buttons
            const socialShare = document.createElement('div');
            socialShare.className = 'social-share mt-2';
            socialShare.innerHTML = `
                <small class="text-muted me-2">Chia sẻ:</small>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" 
                   target="_blank" class="me-2" title="Chia sẻ Facebook">
                    <i class="bi bi-facebook text-primary"></i>
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}" 
                   target="_blank" class="me-2" title="Chia sẻ Twitter">
                    <i class="bi bi-twitter text-info"></i>
                </a>
                <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" 
                   class="me-2" title="Chia sẻ qua Email">
                    <i class="bi bi-envelope text-secondary"></i>
                </a>
            `;
            
            const newsFooter = card.querySelector('.news-footer');
            if (newsFooter) {
                newsFooter.appendChild(socialShare);
            }
        });
    }
    
    // Initialize social sharing
    addSocialSharing();
    
    // View counter simulation
    function updateViewCount() {
        document.querySelectorAll('.news-views').forEach(viewElement => {
            const currentViews = parseInt(viewElement.textContent.replace(/[^\d]/g, '')) || 0;
            // Simulate view increment (in real app, this would be server-side)
            if (Math.random() > 0.8) {
                const newViews = currentViews + Math.floor(Math.random() * 5) + 1;
                viewElement.innerHTML = `<i class="bi bi-eye me-1"></i>${formatNumber(newViews)}`;
            }
        });
    }
    
    // Update view counts periodically
    setInterval(updateViewCount, 30000); // Every 30 seconds
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 150);
        }
    }, 5000);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Search functionality (if search input exists)
function initNewsSearch() {
    const searchInput = document.querySelector('#newsSearch');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                const newsCards = document.querySelectorAll('.news-card, .featured-news-card');
                
                newsCards.forEach(card => {
                    const title = card.querySelector('h3, h4')?.textContent.toLowerCase() || '';
                    const content = card.querySelector('p')?.textContent.toLowerCase() || '';
                    
                    if (query === '' || title.includes(query) || content.includes(query)) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
                
                // Show no results message if needed
                const visibleCards = document.querySelectorAll('.news-card:not([style*="none"]), .featured-news-card:not([style*="none"])');
                if (visibleCards.length === 0 && query !== '') {
                    showNotification('Không tìm thấy tin tức phù hợp với từ khóa "' + query + '"', 'info');
                }
            }, 300);
        });
    }
}

// Initialize search if available
initNewsSearch();