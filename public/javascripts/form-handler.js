// Form handling and validation - Enhanced version
document.addEventListener('DOMContentLoaded', function() {
    // Handle both contact forms (if any other forms exist)
    const contactForms = document.querySelectorAll('#contactForm, .contact-form form');
    
    contactForms.forEach(form => {
        if (form) {
            setupFormValidation(form);
        }
    });
    
    function setupFormValidation(form) {
        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if this is the main contact form
            if (form.id === 'contactForm') {
                // Let the ContactFormHandler take care of this
                return;
            }
            
            // Handle other forms with legacy method
            handleLegacyFormSubmission(form);
        });
        
        // Real-time validation for all forms
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
    
    function handleLegacyFormSubmission(form) {
        // Get form data
        const formData = new FormData(form);
        const name = form.querySelector('input[name="name"]')?.value.trim() || '';
        const email = form.querySelector('input[name="email"]')?.value.trim() || '';
        const phone = form.querySelector('input[name="phone"]')?.value.trim() || '';
        const message = form.querySelector('textarea[name="message"]')?.value.trim() || '';
        
        // Basic validation
        if (!name || !email || !phone || !message) {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Email không hợp lệ!', 'error');
            return;
        }
        
        // Phone validation (Vietnamese phone number format)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        const cleanPhone = phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showNotification('Số điện thoại không hợp lệ!', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Đang gửi...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
                form.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        }
    }
    
    // Field validation function
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        
        // Remove existing error styling
        field.classList.remove('error');
        const fieldGroup = field.closest('.form-group');
        if (fieldGroup) {
            fieldGroup.classList.remove('error');
            const existingError = fieldGroup.querySelector('.error-message');
            if (existingError) {
                existingError.textContent = '';
            }
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is required
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        } else if (value) {
            // Specific validations based on field type/name
            switch (type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Email không hợp lệ';
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
                    const cleanPhone = value.replace(/\s/g, '');
                    if (!phoneRegex.test(cleanPhone)) {
                        isValid = false;
                        errorMessage = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09)';
                    }
                    break;
            }
            
            // Additional validations based on field name
            if (name === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Họ tên phải có ít nhất 2 ký tự';
            } else if (name === 'message' && value.length < 10) {
                isValid = false;
                errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự';
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            if (fieldGroup) {
                fieldGroup.classList.add('error');
                const errorElement = fieldGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                }
            }
        }
        
        return isValid;
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    // Phone number formatting utility
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, ''); // Remove non-digits
        
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // Format as: 0xxx xxx xxx
        if (value.length > 6) {
            value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{4})(\d{0,3})/, '$1 $2');
        }
        
        input.value = value;
    }
    
    // Add phone formatting to all phone inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});