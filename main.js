// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const submitButton = contactForm.querySelector('.btn-primary');
    const inputs = contactForm.querySelectorAll('input, textarea');

    // Basic client-side validation
    if (!name || !email || !message) {
      showError('Please fill in all required fields.');
      return;
    }

    // Clear any previous error messages
    const existingError = contactForm.querySelector('.alert-error');
    if (existingError) existingError.remove();

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    submitButton.querySelector('span:not(.spinner)').textContent = 'Sending...';
    submitButton.setAttribute('aria-busy', 'true');
    inputs.forEach(input => (input.disabled = true));

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        const formContainer = contactForm.parentElement;
        const successMessage = document.createElement('div');
        successMessage.className = 'alert-success';
        successMessage.innerHTML = `
          <h3>Thank you for your message!</h3>
          <p>We have received your inquiry and will get back to you shortly.</p>
        `;

        formContainer.innerHTML = '';
        formContainer.appendChild(successMessage);
      } else {
        showError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('An error occurred. Please try again later.');
    } finally {
      // Remove loading state
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
      submitButton.querySelector('span:not(.spinner)').textContent = 'Send Message';
      submitButton.setAttribute('aria-busy', 'false');
      inputs.forEach(input => (input.disabled = false));
    }
  });
}

// Helper function to show error messages
function showError(message) {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const errorMessage = document.createElement('div');
  errorMessage.className = 'alert-error';
  errorMessage.innerHTML = `<p>${message}</p>`;
  contactForm.prepend(errorMessage);

  // Auto-remove error after 5 seconds
  setTimeout(() => errorMessage.remove(), 5000);
}