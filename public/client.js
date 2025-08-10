// Client-side JavaScript for enhanced user experience

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if needed
    initializeTooltips();
    
    // Auto-hide success messages
    setTimeout(() => {
        const successMessages = document.querySelectorAll('.success-message');
        successMessages.forEach(msg => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 300);
        });
    }, 3000);
    
    // Form validation enhancements
    enhanceFormValidation();
});

function initializeTooltips() {
    // Add tooltips to status badges
    const statusBadges = document.querySelectorAll('.status');
    statusBadges.forEach(badge => {
        const status = badge.textContent.toLowerCase().trim();
        let tooltip = '';
        
        switch(status) {
            case 'pending':
                tooltip = 'Waiting for teacher response';
                break;
            case 'accepted':
                tooltip = 'Appointment confirmed';
                break;
            case 'declined':
                tooltip = 'Appointment declined by teacher';
                break;
        }
        
        if (tooltip) {
            badge.title = tooltip;
        }
    });
}

function enhanceFormValidation() {
    // Add real-time validation for appointment booking
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const dateInput = bookingForm.querySelector('#date');
        const timeSelect = bookingForm.querySelector('#time');
        const noteTextarea = bookingForm.querySelector('#note');
        
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    this.setCustomValidity('Please select a future date');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        if (noteTextarea) {
            const maxLength = noteTextarea.getAttribute('maxlength') || 500;
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = 'text-align: right; font-size: 0.875rem; color: #666; margin-top: 0.5rem;';
            noteTextarea.parentNode.appendChild(counter);
            
            function updateCounter() {
                const remaining = maxLength - noteTextarea.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? '#ef4444' : '#666';
            }
            
            noteTextarea.addEventListener('input', updateCounter);
            updateCounter();
        }
    }
}

// Utility functions for better UX
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

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

// Smooth scroll for better navigation
function smoothScrollTo(element) {
    element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Auto-refresh functionality for teacher dashboard
if (window.location.pathname.includes('teacher/dashboard')) {
    // Refresh appointment count periodically
    setInterval(() => {
        const pendingAppointments = document.querySelectorAll('.status-pending');
        if (pendingAppointments.length > 0) {
            document.title = `(${pendingAppointments.length}) Teacher Dashboard`;
        } else {
            document.title = 'Teacher Dashboard - Booking System';
        }
    }, 10000);
}

// Enhanced error handling for AJAX requests
window.handleAjaxError = function(error, fallbackMessage = 'An error occurred. Please try again.') {
    console.error('AJAX Error:', error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = error.message || fallbackMessage;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 350px;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
};