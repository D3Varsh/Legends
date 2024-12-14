document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const spinner = document.getElementById('spinner');
    const responseMessage = document.getElementById('response-message');

    form.style.display = 'none';
    spinner.style.display = 'block';

    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await fetch('/.netlify/functions/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        spinner.style.display = 'none';
        responseMessage.style.display = 'block';
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (error) {
      spinner.style.display = 'none';
      form.style.display = 'block';
      alert('There was an error sending your message. Please try again.');
    }
  });