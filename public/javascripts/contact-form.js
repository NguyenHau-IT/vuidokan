// Enhanced Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }

    init() {
        if (!this.form) return;

        // Add real-time validation
        this.addValidation();
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Auto-hide success message after 5 seconds
        this.setupAutoHideSuccess();
    }

    addValidation() {
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        
        fields.forEach(field => {
            // Real-time validation on blur
            field.addEventListener('blur', () => this.validateField(field));
            
            // Clear errors on focus
            field.addEventListener('focus', () => this.clearFieldError(field));
            
            // Validate on input for immediate feedback
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });

        // Phone number formatting
        const phoneField = this.form.querySelector('#phone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }

    validateField(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Remove previous error state
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        }
        
        // Email validation
        else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
        }
        
        // Phone validation (Vietnamese format)
        else if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            const cleanPhone = field.value.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09)';
            }
        }
        
        // Name validation
        else if (field.name === 'name' && field.value.trim()) {
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Họ tên phải có ít nhất 2 ký tự';
            } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(field.value)) {
                isValid = false;
                errorMessage = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
            }
        }
        
        // Message length validation
        else if (field.name === 'message' && field.value.trim()) {
            if (field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự';
            } else if (field.value.trim().length > 1000) {
                isValid = false;
                errorMessage = 'Tin nhắn không được vượt quá 1000 ký tự';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.error-message');
        
        fieldGroup.classList.add('error');
        field.classList.add('error');
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.querySelector('.error-message');
        
        fieldGroup.classList.remove('error');
        field.classList.remove('error');
        errorElement.textContent = '';
    }

    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, ''); // Remove non-digits
        
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // Format as: 0xxx xxx xxx
        if (value.length > 6) {
            value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{4})(\d{0,3})/, '$1 $2');
        }
        
        field.value = value;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Vui lòng kiểm tra và sửa các lỗi trong form', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Prepare form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Send request
            const response = await fetch('/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccess(result.message);
                this.form.reset();
                
                // Clear any remaining error states
                fields.forEach(field => this.clearFieldError(field));
                
                // Scroll to success message
                this.successMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra khi gửi form');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification(
                'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.', 
                'error'
            );
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        if (!this.submitBtn) return;

        const btnText = this.submitBtn.querySelector('.btn-text');
        
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Đang gửi...';
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Gửi Thông Tin';
        }
    }

    showSuccess(message) {
        if (this.successMessage) {
            const messageText = this.successMessage.querySelector('span');
            if (messageText) {
                messageText.textContent = message;
            }
            this.successMessage.style.display = 'flex';
        }
    }

    setupAutoHideSuccess() {
        if (this.successMessage) {
            // Hide after 8 seconds
            let hideTimeout;
            
            const showSuccess = () => {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    this.successMessage.style.display = 'none';
                }, 8000);
            };

            // Watch for when success message is shown
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style') {
                        if (this.successMessage.style.display === 'flex') {
                            showSuccess();
                        }
                    }
                });
            });

            observer.observe(this.successMessage, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} show`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 5 seconds
        const autoHideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHideTimeout);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// Additional utility functions for contact page
const ContactPageUtils = {
    // Copy text to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (fallbackErr) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Add click to copy functionality for contact info
    addCopyToContact: () => {
        const contactItems = document.querySelectorAll('.contact-info-content .highlight');
        
        contactItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.title = 'Click để sao chép';
            
            item.addEventListener('click', async () => {
                const text = item.textContent.trim();
                const success = await ContactPageUtils.copyToClipboard(text);
                
                if (success) {
                    // Show temporary feedback
                    const originalText = item.textContent;
                    item.textContent = 'Đã sao chép!';
                    item.style.color = 'var(--bs-primary)';
                    
                    setTimeout(() => {
                        item.textContent = originalText;
                        item.style.color = '';
                    }, 1500);
                }
            });
        });
    },

    // Animate elements when they come into view
    addScrollAnimations: () => {
        const animateElements = document.querySelectorAll(
            '.contact-form-container, .contact-info-item, .faq-item'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    ContactPageUtils.addCopyToContact();
    ContactPageUtils.addScrollAnimations();
});