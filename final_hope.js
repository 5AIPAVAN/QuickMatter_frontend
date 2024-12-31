// First install the package:
// npm install @indic-transliteration/sanscript

const Sanscript = require('@indic-transliteration/sanscript');

// Test input
const inputText = "meeru ela unnaro telusukovacha";

// Transliterate the input text to Kannada script
const transliteratedText = Sanscript.t(
    inputText,
    'hk',     // input scheme (Harvard-Kyoto scheme)
    'telugu' // output script
);

console.log("Original Text (Latin Script):", inputText);
console.log("Transliterated Text (Kannada Script):", transliteratedText);