import React from "react";

const TypingAnimation = ({text}) => {
  const fullText = text

  return (
    <h1 className="space-grotesk-logoo">
      {fullText.split("").map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {char}
        </span>
      ))}
    </h1>
  );
};

export default TypingAnimation;
