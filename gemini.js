const axios = require('axios');

// Function to translate a message
const translateMessage = async (message, targetLanguage) => {
    try {
        const response = await axios.post('https://api.gemini-ai.com/translate', {
            text: message,
            target_language: targetLanguage
        }, {
            headers: {
                'Authorization': 'AIzaSyDIjnVESrjYFlE-3PmMR5mlNg1XAzy2zck', // Replace with your API key
                'Content-Type': 'application/json'
            }
        });

        return response.data.translated_text;
    } catch (error) {
        console.error('Error translating message:', error.response?.data || error.message);
        return null;
    }
};

// Example usage
(async () => {
    const originalMessage = 'Hello, how are you?';
    const targetLanguage = 'es'; // Spanish
    const translatedMessage = await translateMessage(originalMessage, targetLanguage);
    console.log('Translated Message:', translatedMessage); // Output: "Hola, ¿cómo estás?"
})();
