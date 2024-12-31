// First install the package:
// npm install @sanskrit-coders/sanscript

const Sanscript = require('@sanskrit-coders/sanscript');

// Test input
const inputText = "meeru ela unnaro telusukovacha";

// Transliterate the input text to Telugu script
const transliteratedText = Sanscript.t(
    inputText,
    'itrans',  // input scheme (ITRANS is a standard for typing Indian languages in English)
    'telugu'   // output script
);

console.log("Original Text (Latin Script):", inputText);
console.log("Transliterated Text (Telugu Script):", transliteratedText);