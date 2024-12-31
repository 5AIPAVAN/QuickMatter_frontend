const { transliterate } = require("transliteration");

// Test input
const inputText = "meeru ela unnaro telusukovacha";  // Latin script text (Telugu)

// Transliterate the input text to Telugu script
const transliteratedText = transliterate(inputText);

console.log("Original Text (Latin Script):", inputText);
console.log("Transliterated Text (Telugu Script):", transliteratedText);
