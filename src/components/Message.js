import React, {useState} from 'react';
import moment from 'moment';
import './gradient.css'
import { IoLanguageSharp } from "react-icons/io5";
import { VscDebugStepBack } from "react-icons/vsc";
import './Message.css'


export default function Message({ msg, userId, onTranslate }) {
  const [showTranslate, setShowTranslate] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    if (!translatedText) {
      const translation = await onTranslate(msg.text);
      setTranslatedText(translation);
    }
    setShowOriginal(false); // Switch to translated text when "See Translation" is clicked
  };

  const handleShowOriginal = () => {
    setShowOriginal(true);
  };

  return (
    <div className="outermsg" style={{display:'flex'}}
    onMouseEnter={() => setShowTranslate(true)}
    onMouseLeave={() => setShowTranslate(false)}
    >
    <div
    className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
      msg?.importance === 2
        ? userId === msg?.msgByUserId
          ? "ml-auto redd"
          : "redd"
        : msg?.importance === 1
        ? userId === msg?.msgByUserId
          ? "ml-auto yelloww"
          : "yelloww"
        : userId === msg?.msgByUserId
        ? "ml-auto normall"
        : "bg-white"
    }`}
    // onMouseEnter={() => setShowTranslate(true)}
    // onMouseLeave={() => setShowTranslate(false)}
  >
      <div className="w-full relative">
        {msg?.imageUrl && (
          <img 
            src={msg?.imageUrl} 
            className="w-full h-full object-scale-down" 
            alt="Message media"
          />
        )}
        {msg?.videoUrl && (
          <video
            src={msg.videoUrl}
            className="w-full h-full object-scale-down"
            controls
          />
        )}
      </div>
      <p className="px-2">{showOriginal || !translatedText ? msg.text : translatedText}</p>
      {/* {showTranslate && (
        <div className="px-2">
          {!translatedText ? (
            <button
              className="text-blue-500 text-xs underline"
              onClick={handleTranslate}
            >
              <IoLanguageSharp />
            </button>
          ) : (
            <button
              className="text-blue-500 text-xs underline"
              onClick={showOriginal ? handleTranslate : handleShowOriginal}
            >
              {showOriginal ? "See Translation" : "See Original"}
            </button>
          )}
        </div>
      )} */}
      <p className="text-xs ml-auto w-fit">
        {moment(msg.createdAt).format("hh:mm")}
      </p>
    </div>
    <div className="butttons">
 {(showTranslate && userId !== msg?.msgByUserId) && (
        <div className="px-2">
          {!translatedText ? (
            <button
              className="text-white text-xs iconbg"
              onClick={handleTranslate}
            >
              <IoLanguageSharp />
            </button>
          ) : (
            <button
              className="text-white text-xs iconbg"
              onClick={showOriginal ? handleTranslate : handleShowOriginal}
            >
              {showOriginal ? <IoLanguageSharp /> : <VscDebugStepBack />}
            </button>
          )}
        </div>
      )}


    </div>
            
    </div>
  );
}