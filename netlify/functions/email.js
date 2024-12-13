exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;
  
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Enable CORS
        },
      };
    }

    const data = JSON.parse(event.body);

    // Validate required fields
    const { name, phone, email, subject, message } = data;
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required.' }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Enable CORS
        },
      };
    }

    // Set up email API request
    const emailResponse = await fetch('/.netlify/functions/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SEND_GRID_API, // Use environment variable
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              { email: 'devarsh4455@gmail.com' },
            ],
            subject: `[Contact Form] ${subject}`,
          },
        ],
        from: { email: 'devarsh4455@gmail.com', name: 'Contact Form' },
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
        headers: {
          'Access-Control-Allow-Origin': '*', // Enable CORS
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Enable CORS
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*', // Enable CORS
      },
    };
  }
};
