const fetch = require('node-fetch');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const data = JSON.parse(event.body);

    // Validate required fields
    const { name, phone, email, subject, message } = data;
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required.' }),
      };
    }


    // Set up email API request
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SEND_GRID_API}`, // Use environment variable
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              { email: 'devarsh4455@gmail.com' },
              // { email: 'adam.kunz+inft@durhamcollege.ca' },
            ],
            subject: `[Contact Form] ${subject}`,
          },
        ],
        from: { email: 'devarsh4455@gmail.com', name: 'Contact Form' }, // Sender email and name
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorDetails = await emailResponse.json();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email', details: errorDetails }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
