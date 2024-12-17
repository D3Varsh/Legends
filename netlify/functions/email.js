const sgMail = require('@sendgrid/mail');
require('dotenv').config();



exports.handler = async (event) => {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  const SENDGRID_API_KEY = process.env.SEND_GRID_API;

  // Configure SendGrid
  if (!SENDGRID_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SendGrid API key is missing.' }),
    };
  }
  sgMail.setApiKey(SENDGRID_API_KEY);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    const { name, phone, email, subject, message } = data;
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Create email message
    const msg = {
      to: ['devarsh4455@gmail.com'], // Replace with your emails
      from: {
        email: 'devarsh4455@gmail.com', // Replace with your verified sender email
        name: 'Contact Form',
      },
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
    

    // Send the email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
