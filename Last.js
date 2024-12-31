// Install required packages first
// npm install @indic-transliteration/sanscript transliteration axios

const Sanscript = require('@indic-transliteration/sanscript');
const axios = require("axios");
const { transliterate } = require("transliteration");

// Function to detect language
async function detectLanguage(inputText) {
  const apiKey = ""; // Replace with your actual Google API key
  const url = `https://translation.googleapis.com/language/translate/v2/detect`;

  try {
    const response = await axios.post(url, { q: inputText }, { params: { key: apiKey } });
    const detectedLanguage = response.data.data.detections[0][0].language;
    console.log("Detected Language:", detectedLanguage);
    return detectedLanguage;
  } catch (error) {
    console.error("Error in language detection:", error.message);
    return null;
  }
}

// Function to handle transliteration and translation
async function handleTranslation(inputText, targetLanguage) {
  // Step 1: Detect the language
  const detectedLanguage = await detectLanguage(inputText);

  if (!detectedLanguage) {
    console.error("Could not detect the language.");
    return;
  }

  let nativeScriptText = inputText; // Default to the original inputText

  // Step 2: Transliterate based on the detected language
  if (detectedLanguage === "te-Latn") { // Telugu in Latin script
    nativeScriptText = Sanscript.t(inputText, 'hk', 'telugu'); // Transliterate to Telugu script
    console.log("Transliterated to Telugu Script:", nativeScriptText);
  } else if (detectedLanguage === "te") { // Telugu native script
    console.log("Input is already in Telugu script:", nativeScriptText);
  } else {
    // Transliterate other supported languages as needed
    nativeScriptText = transliterate(inputText, "te"); // General transliteration fallback
    console.log("General Transliteration:", nativeScriptText);
  }

  // Step 3: Translate the text
  const url = `https://translation.googleapis.com/language/translate/v2`;

  try {
    const response = await axios.post(
      url,
      {
        q: nativeScriptText,
        target: targetLanguage,
        source: detectedLanguage.includes("te") ? "te" : "auto", // Telugu or auto-detect
        format: "text",
      },
      { params: { key: "AIzaSyCf_Knl1wpapXGgdO733G3j8Kj-FiLL54s" } } // Replace with your API key
    );

    console.log("Translated Text:", response.data.data.translations[0].translatedText);
  } catch (error) {
    console.error("Error while translating:", error.message);
  }
}

// Example Usage
handleTranslation("meeru ela unnaro telusukovacha", "hi"); // Translate to Hindi
