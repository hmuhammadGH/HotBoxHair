/* Main JavaScript - HotBoxHair Website */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initNavigation();
  initSmoothScrolling();
  initYearDisplay();
  initFormValidation();
  initLazyLoading();
});

// Navigation functionality
function initNavigation() {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  
  if (!nav || !menu) return;
  
  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.className = 'mobile-menu-toggle';
  mobileMenuToggle.innerHTML = '☰';
  mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
  
  // Add mobile menu functionality
  mobileMenuToggle.addEventListener('click', function() {
    menu.classList.toggle('mobile-open');
    this.setAttribute('aria-expanded', 
      this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
  });
  
  // Add toggle button to nav if on mobile
  if (window.innerWidth <= 768) {
    nav.appendChild(mobileMenuToggle);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      menu.classList.remove('mobile-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, href);
    });
  });
}

// Year display functionality
function initYearDisplay() {
  const yearElements = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    element.textContent = currentYear;
  });
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
        return false;
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  });
}

// Validate individual form field
function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const required = field.hasAttribute('required');
  
  let isValid = true;
  let message = '';
  
  // Required field validation
  if (required && !value) {
    isValid = false;
    message = 'This field is required';
  }
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (type === 'tel' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  
  // Show/hide error message
  showFieldError(field, isValid, message);
  return isValid;
}

// Validate entire form
function validateForm(form) {
  const fields = form.querySelectorAll('input, textarea, select');
  let isFormValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });
  
  return isFormValid;
}

// Show field error
function showFieldError(field, isValid, message) {
  const existingError = field.parentNode.querySelector('.field-error');
  
  if (existingError) {
    existingError.remove();
  }
  
  if (!isValid) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc2626';
  } else {
    field.style.borderColor = '';
  }
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }
}

// Utility functions
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

// Export functions for use in other scripts
window.HotBoxHair = {
  debounce,
  throttle,
  validateField,
  validateForm
};
