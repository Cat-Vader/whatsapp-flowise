const wa = require('@open-wa/wa-automate');  // Import the WhatsApp automation library
const axios = require('axios');  // Import the Axios library for HTTP requests

// Initialize a new WhatsApp session
wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0,
}).then(client => start(client));  // Start the client when initialization is complete

function start(client) {
  // Event listener for incoming messages
  client.onMessage(async message => {
    console.log('Received message:', message.body);
    console.log('Sender:', message.from);

    if (message.body === 'Hi') {  // If the message is "Hi"
      await client.sendText(message.from, '👋 Hello!');  // Send a greeting
      console.log('Response sent: 👋 Hello!');
    } else {
      // Send the message content to an API endpoint
      const question = message.body;
      const token = 'your-authorization-token';  // Replace with your authorization token

      try {
        // Make a POST request to the API endpoint
        const response = await axios.post('http://your-api-endpoint.com', {
          question: question
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const answer = response.data;  // Get the response from the API
        await client.sendText(message.from, answer);  // Send the API response as a message
        console.log('Response sent:', answer);
      } catch (error) {
        console.error('API request error:', error);
        // Send an error message if the API request fails
        await client.sendText(message.from, 'Sorry, there was an error processing your question.');
        console.log('Error response sent: Sorry, there was an error processing your question.');
      }
    }
  });
}
