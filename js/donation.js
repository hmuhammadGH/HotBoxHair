/* Donation Page JavaScript - HotBoxHair Website */

// Donation page specific functionality
document.addEventListener('DOMContentLoaded', function() {
  initDonationAmounts();
  initDonationForm();
  initPaymentMethods();
  initDonationTracking();
});

// Initialize donation amount selection
function initDonationAmounts() {
  const amountPills = document.querySelectorAll('.pill[href*="amount="]');
  const customAmountInput = document.getElementById('custom-amount');
  
  amountPills.forEach(pill => {
    pill.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all pills
      amountPills.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked pill
      this.classList.add('active');
      
      // Get amount from href
      const url = new URL(this.href);
      const amount = url.searchParams.get('amount');
      
      // Update form with selected amount
      updateDonationAmount(amount);
      
      // Clear custom amount if it was set
      if (customAmountInput) {
        customAmountInput.value = '';
      }
    });
  });
  
  // Handle custom amount input
  if (customAmountInput) {
    customAmountInput.addEventListener('input', function() {
      const amount = this.value;
      
      // Remove active class from all pills
      amountPills.forEach(p => p.classList.remove('active'));
      
      // Update form with custom amount
      updateDonationAmount(amount);
    });
  }
}

// Update donation amount in form
function updateDonationAmount(amount) {
  const amountInput = document.getElementById('donation-amount');
  if (amountInput) {
    amountInput.value = amount;
  }
  
  // Update display
  const amountDisplay = document.getElementById('selected-amount');
  if (amountDisplay) {
    amountDisplay.textContent = `$${amount}`;
  }
  
  // Track amount selection
  trackDonationEvent('amount_selected', { amount: amount });
}

// Initialize donation form
function initDonationForm() {
  const donationForm = document.getElementById('donation-form');
  if (!donationForm) return;
  
  donationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateDonationForm(this)) {
      return false;
    }
    
    // Show loading state
    showDonationLoading();
    
    // Process donation
    processDonation(this);
  });
  
  // Handle donation type toggle
  const donationTypeRadios = document.querySelectorAll('input[name="donation-type"]');
  donationTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      updateDonationType(this.value);
    });
  });
}

// Validate donation form
function validateDonationForm(form) {
  const amount = form.querySelector('input[name="amount"]')?.value;
  const email = form.querySelector('input[name="email"]')?.value;
  const name = form.querySelector('input[name="name"]')?.value;
  
  let isValid = true;
  let errors = [];
  
  // Validate amount
  if (!amount || amount <= 0) {
    isValid = false;
    errors.push('Please select a donation amount');
  }
  
  // Validate email
  if (!email || !isValidEmail(email)) {
    isValid = false;
    errors.push('Please enter a valid email address');
  }
  
  // Validate name
  if (!name || name.trim().length < 2) {
    isValid = false;
    errors.push('Please enter your full name');
  }
  
  // Show errors
  if (!isValid) {
    showDonationErrors(errors);
  }
  
  return isValid;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show donation errors
function showDonationErrors(errors) {
  const errorContainer = document.getElementById('donation-errors');
  if (!errorContainer) return;
  
  errorContainer.innerHTML = errors.map(error => 
    `<div class="error-message">${error}</div>`
  ).join('');
  
  errorContainer.style.display = 'block';
  
  // Scroll to errors
  errorContainer.scrollIntoView({ behavior: 'smooth' });
}

// Show loading state
function showDonationLoading() {
  const submitButton = document.querySelector('#donation-form button[type="submit"]');
  const originalText = submitButton.textContent;
  
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  submitButton.classList.add('loading');
  
  // Store original text for restoration
  submitButton.dataset.originalText = originalText;
}

// Hide loading state
function hideDonationLoading() {
  const submitButton = document.querySelector('#donation-form button[type="submit"]');
  
  submitButton.disabled = false;
  submitButton.textContent = submitButton.dataset.originalText || 'Donate Now';
  submitButton.classList.remove('loading');
}

// Process donation
function processDonation(form) {
  const formData = new FormData(form);
  const donationData = Object.fromEntries(formData.entries());
  
  // Track donation attempt
  trackDonationEvent('donation_attempt', {
    amount: donationData.amount,
    type: donationData['donation-type'],
    recurring: donationData.recurring === 'on'
  });
  
  // Simulate API call (replace with actual payment processing)
  setTimeout(() => {
    // For demo purposes, always succeed
    // In real implementation, handle actual payment processing
    handleDonationSuccess(donationData);
  }, 2000);
}

// Handle successful donation
function handleDonationSuccess(donationData) {
  hideDonationLoading();
  
  // Show success message
  showDonationSuccess(donationData);
  
  // Track successful donation
  trackDonationEvent('donation_success', {
    amount: donationData.amount,
    type: donationData['donation-type']
  });
  
  // Redirect to thank you page or show confirmation
  setTimeout(() => {
    window.location.href = '/thank-you.html';
  }, 3000);
}

// Show donation success message
function showDonationSuccess(donationData) {
  const successContainer = document.getElementById('donation-success');
  if (!successContainer) return;
  
  successContainer.innerHTML = `
    <div class="success-message">
      <h3>Thank you for your donation!</h3>
      <p>Your donation of $${donationData.amount} has been processed successfully.</p>
      <p>You will receive a confirmation email shortly.</p>
    </div>
  `;
  
  successContainer.style.display = 'block';
  successContainer.scrollIntoView({ behavior: 'smooth' });
}

// Initialize payment methods
function initPaymentMethods() {
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
      updatePaymentMethod(this.value);
    });
  });
}

// Update payment method display
function updatePaymentMethod(method) {
  const methodInfo = document.getElementById('payment-method-info');
  if (!methodInfo) return;
  
  const methodDescriptions = {
    'credit-card': 'Enter your credit card information below.',
    'paypal': 'You will be redirected to PayPal to complete your donation.',
    'bank-transfer': 'Bank transfer information will be provided after form submission.'
  };
  
  methodInfo.textContent = methodDescriptions[method] || '';
  
  // Track payment method selection
  trackDonationEvent('payment_method_selected', { method: method });
}

// Initialize donation tracking
function initDonationTracking() {
  // Track page view
  trackDonationEvent('page_view', {
    page: 'donation',
    timestamp: new Date().toISOString()
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      // Track milestone scroll depths
      if (maxScroll >= 25 && maxScroll < 50) {
        trackDonationEvent('scroll_25', { depth: maxScroll });
      } else if (maxScroll >= 50 && maxScroll < 75) {
        trackDonationEvent('scroll_50', { depth: maxScroll });
      } else if (maxScroll >= 75) {
        trackDonationEvent('scroll_75', { depth: maxScroll });
      }
    }
  });
}

// Track donation events
function trackDonationEvent(eventName, data = {}) {
  // Google Analytics tracking (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'donation',
      event_label: data.amount || data.method || 'unknown',
      value: data.amount || 0,
      custom_parameters: data
    });
  }
  
  // Console logging for development
  console.log('Donation Event:', eventName, data);
  
  // Custom tracking endpoint (disabled for local development)
  // In production, this would connect to your analytics service
  /*
  if (typeof fetch !== 'undefined') {
    fetch('/api/track-donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data: data,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
    }).catch(error => {
      console.log('Tracking error:', error);
    });
  }
  */
}

// Update donation type
function updateDonationType(type) {
  const recurringFields = document.getElementById('recurring-fields');
  const oneTimeFields = document.getElementById('one-time-fields');
  
  if (type === 'recurring') {
    if (recurringFields) recurringFields.style.display = 'block';
    if (oneTimeFields) oneTimeFields.style.display = 'none';
  } else {
    if (recurringFields) recurringFields.style.display = 'none';
    if (oneTimeFields) oneTimeFields.style.display = 'block';
  }
  
  // Track donation type change
  trackDonationEvent('donation_type_changed', { type: type });
}
