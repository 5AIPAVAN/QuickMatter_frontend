import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Avatar from './Avatar';
import Loading from './Loading';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from 'react-icons/io5';
import wallapaper from '../assets/wallapaper.jpeg';
import newbg from '../assets/newbg.jpg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import './gradient.css'
import Colordropdown from './Colordropdown';
import Message from './Message';
import ScheduleMessage from './ScheduleMessage';
import { LuCalendarClock } from "react-icons/lu";







export default function MessagePage() {

  const [openScheduler, setOpenScheduler] = useState(false);

  const [isVoiceActive, setIsVoiceActive] = useState(false);


  const toggleVoiceTyping = () => {
    if (isVoiceActive) {
      // Stop voice recognition
      if (recognition) recognition.stop();
    } else {
      // Start voice recognition
      if (recognition) recognition.start();
    }
    setIsVoiceActive(!isVoiceActive); // Toggle the state
  };

  const toggleopenScheduler = () => {
    if (openScheduler) {
      console.log('closed');
      setOpenScheduler(false);
    } else {
      console.log('opened');
      setOpenScheduler(true);
    }
  }

  const [selectedLanguage, setSelectedLanguage] = useState('te'); // Default to Telugu
  const params = useParams();

  // Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = selectedLanguage; // Default language

      newRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setMessage((prev) => ({ ...prev, text: transcript }));
      };

      newRecognition.onerror = (event) => console.error("Speech recognition error:", event.error);

      setRecognition(newRecognition);
    } else {
      alert("Your browser does not support Speech Recognition.");
    }
  }, [SpeechRecognition, selectedLanguage]);

  const handleStartVoice = () => {
    if (recognition) recognition.start();
  };

  const handleStopVoice = () => {
    if (recognition) recognition.stop();
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({ ...prev, text: value }));
  };



  // *****************************************************************************

  // translation language

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    console.log('Selected Language Code:', event.target.value); // Log the selected language code
  };


  // you details(logged in user details)
  const user = useSelector(state => state?.user);

  // obtain T/F whether socket is connected or not from redux
  const socketConnection = useSelector(state => state?.user?.socketConnection);

  console.log("Params :", params.userId); // params is an object containing userId 

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    priority: 0
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: uploadPhoto?.url
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage(prev => {
      return {
        ...prev,
        videoUrl: uploadVideo?.url
      };
    });
  };

  const handleClearUploadImage = () => {
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: ""
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage(prev => {
      return {
        ...prev,
        videoUrl: ""
      };
    });
  };

  // const handleOnChange = (e) => {
  //   const { name, value } = e.target;

  //   setMessage(prev => {
  //     return {
  //       ...prev,
  //       text: value
  //     };
  //   });
  // };

  // Handler to update priority based on selected color
  const handleColorSelect = (color) => {
    let newPriority = 0;
    if (color === 'red') {
      console.log('changed to red');
      newPriority = 2; // Set priority to 2 for red
    } else if (color === 'yellow') {
      console.log('changed to yellow');
      newPriority = 1; // Set priority to 1 for yellow
    }

    // Update the state with the new priority
    setMessage((prevMessage) => ({
      ...prevMessage,
      priority: newPriority,
    }));
  };

  // Set button color based on priority
  const getButtonColor = () => {
    if (message.priority === 2) {
      return 'bg-red-600 hover:bg-red-700 text-white'; // Red button color
    } else if (message.priority === 1) {
      return 'bg-yellow-300 hover:bg-yellow-400 text-black'; // Yellow button color
    } else {
      return 'bg-gray-400 hover:bg-gray-500 text-white'; // Default color (if no priority selected)
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    console.log('checkkk', message);

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          importance: message.priority,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          priority: 0
        });
      }
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);

      socketConnection.on('message-user', (data_of_that_person) => {
        setDataUser(data_of_that_person);
      });

      socketConnection.on('message', (data) => {
        console.log('data checkkk', data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.userId, user]);

  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);



  //filtering888***********************************************************
  const [prior, setPrior] = useState("0");
  const [filteredMessages, setFilteredMessages] = useState(allMessage);
  const [priorisOpen, setPriorIsOpen] = useState(false);

  const handlePriorChange = (value) => {
    const selectedPrior = value;
    setPrior(selectedPrior);

    if (selectedPrior === "0") {
      setFilteredMessages(allMessage); // Show all messages
    } else {
      const filtered = allMessage.filter(
        (msg) => msg.importance === parseInt(selectedPrior)
      );
      console.log('filtered',filtered);
      setFilteredMessages(filtered);
    }
    setPriorIsOpen(false);
  };

  //*************************************************************************** */


  // const translateMessage = async (text) => {
  //   // Placeholder for translation logic
  //   return `Translated: ${text}`;
  // };


  const translateMessage = async (text) => {
    try {
      // Define your target language code (e.g., 'en', 'te', 'es')
      const targetLanguage = selectedLanguage; // Example: Translate to English

      // Use the translateText function to get the translated text
      const translatedText = await translateText(text, targetLanguage);

      // Return the translated text
      return translatedText;
    } catch (error) {
      console.error('Error in translating message:', error.message);

      // Return a fallback message if translation fails
      return 'Translation not available.';
    }
  };



  // Import the Axios library for making HTTP requests
  // const axios = require('axios');

  // Replace this with your Google Cloud API key
  const API_KEY = process.env.GOOGLEAPI;

  /**
   * Translates the given text using the Google Translate API.
   *
   * @param {string} text - The text to translate.
   * @param {string} targetLanguage - The target language code (e.g., 'en', 'es', 'te').
   * @returns {Promise<string>} - A promise that resolves to the translated text.
   */
  async function translateText(text, targetLanguage) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    try {
      const response = await axios.post(url, {
        q: text, // Text to be translated
        target: targetLanguage, // Target language code
        format: 'text', // Optional: Specify format (e.g., "text" or "html")
        // source: 'en', // Detect source language
        // model: 'nmt', // Neural Machine Translation for better accuracy
      });

      // Extract the translated text from the API response
      const translatedText = response.data.data.translations[0].translatedText;
      return translatedText;
    } catch (error) {
      console.error('Error while translating text:', error.response?.data || error.message);
      throw new Error('Translation failed. Please try again later.');
    }
  }


  const [isOpen, setIsOpen] = useState(false);


  function handleLanguageChange1(value) {
    setSelectedLanguage(value);
    setIsOpen(false); // Close dropdown after selection
  };

  const options = [
    { value: "en", label: "aA" },
    { value: "hi", label: "ह" },
    { value: "ta", label: "தெ" },
    { value: "te", label: "తె" },
  ];
  const prior_options = [
    { value: "2", label: "Red" },
    { value: "1", label: "Yello" },
    { value: "0", label: "Na" },
  ];


  return (
    <div style={{ 'backgroundImage': `url(${wallapaper})` }} className='bg-no-repeat bg-cover bg-opacity-50'>

      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              ProfilePicUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>
        </div>

        <div className='flex gap-2'>

          {/* msg prior dropdown */}

        <div className="relative inline-block">
  {/* Dropdown button */}
  <div
    className="ml-2 p-2 border rounded cursor-pointer bg-[#f3f4f6] no-select"
    onClick={() => setPriorIsOpen(!priorisOpen)}
  >
    {prior_options.find((opt) => opt.value === prior)?.label}
  </div>

  {/* Dropdown options */}
  <div
    className={`absolute top-[-10px] right-full flex-row-reverse bg-white border rounded shadow-lg z-100 space-x-2 px-2 py-2 ${
      priorisOpen ? "dropdown-open" : "hidden"
    }`}
    style={{
      whiteSpace: "nowrap",
    }}
  >
{prior_options.map((opt, index) => (
  <div
    key={opt.value}
    onClick={() => handlePriorChange(opt.value)}
    className="px-4 py-2 mx-2 cursor-pointer text-white rounded hover:bg-green-600 option-animate no-select "
    style={{
      animationDelay: `${index * 200}ms`,
      border: '1px solid grey', // Staggered animation
      backgroundColor:
        opt.value === '2' ? 'red' :
        opt.value === '1' ? 'yellow' :
        opt.value === '0' ? 'whitesmoke' : 'transparent', // Dynamic background color based on value
    }}
  >
    
  </div>
))}

  </div>
</div>

          {/* <select
            value={prior}
            onChange={handlePriorChange}
            className="ml-2 p-2 border rounded cursor-pointer"
          >
            <option value="2">red</option>
            <option value="1">yellow</option>
            <option value="0">All</option>
          </select> */}

          <div className="relative inline-block">
  {/* Dropdown button */}
  <div
    className="ml-2 p-2 border rounded cursor-pointer bg-[#f3f4f6] no-select"
    onClick={() => setIsOpen(!isOpen)}
  >
    {options.find((opt) => opt.value === selectedLanguage)?.label}
  </div>

  {/* Dropdown options */}
  <div
    className={`absolute top-[-10px] right-full flex-row-reverse bg-white border rounded shadow-lg z-100 space-x-2 px-2 py-2 ${
      isOpen ? "dropdown-open" : "hidden"
    }`}
    style={{
      whiteSpace: "nowrap",
    }}
  >
    {options.map((opt, index) => (
      <div
        key={opt.value}
        onClick={() => handleLanguageChange1(opt.value)}
        className="px-4 py-2 mx-2 cursor-pointer bg-green-500 text-white rounded hover:bg-green-600 option-animate no-select"
        style={{
          animationDelay: `${index * 200}ms`, // Staggered animation
        }}
      >
        {opt.label}
      </div>
    ))}
  </div>
</div>




          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>

        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
        {filteredMessages.length > 0 ? (
  filteredMessages.map((msg, index) => (
    <Message
      key={index}
      msg={msg}
      userId={user._id}
      onTranslate={translateMessage}
    />
  ))
) : (
  allMessage.map((msg, index) => (
    <Message
      key={index}
      msg={msg}
      userId={user._id}
      onTranslate={translateMessage}
    />
  ))
)}
        </div>

        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img
                src={message.imageUrl}
                alt='uploadImage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video
                src={message.videoUrl}
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading />
          </div>
        )}
      </section>

      {openScheduler && <div className="scheduler absolute bottom-20">
        <ScheduleMessage sender={user._id} receiver={params.userId} importance={message.priority} />
      </div>
      }

      <section className='h-16 bg-white flex items-center px-4'>
        <div className='realtive '>
          <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center rounded-full w-11 h-11 hover:bg-primary hover:text-white mx-2'>
            <FaPlus size={20} />
          </button>

          {openImageVideoUpload && (<div className='bg-white shadow rounded absolute bottom-20 w-36 p-2'>
            <form>
              <label htmlFor='uploadImage' className='flex items-center p-2 px-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className='text-primary'>
                  <FaImage size={18} />
                </div>
                <p> Image </p>
              </label>

              <label htmlFor='uploadVideo' className='flex items-center p-2 px-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                <div className='text-purple-500'>
                  <FaVideo size={18} />
                </div>
                <p> Video </p>
              </label>

              <input type='file'
                id='uploadImage'
                onChange={handleUploadImage}
                className='hidden' />

              <input type='file'
                id='uploadVideo'
                onChange={handleUploadVideo}
                className='hidden' />

            </form>
          </div>
          )}

        </div>
        {/* <div>
          <button onClick={handleStartVoice}>Start Voice Typing</button>
          <button onClick={handleStopVoice}>Stop</button>
        </div> */}
        <div>

          <div className="buttonsss" style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={toggleVoiceTyping}
              className={`flex items-center gap-2 p-2 rounded ${isVoiceActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
              {isVoiceActive ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
              {/* {isVoiceActive ? "Stop" : "Start"} */}
            </button>

            <button
              onClick={toggleopenScheduler}
              className={`flex items-center text-2xl gap-2 p-2 rounded ${openScheduler ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
              {openScheduler ? <LuCalendarClock /> : <LuCalendarClock />}
              {/* {isVoiceActive ? "Stop" : "Start"} */}
            </button>


          </div>

        </div>
        <form className='h-full w-full flex gap-2 p-2.5' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full bg-gray-100 rounded-[9px]'
            value={message.text}
            onChange={handleOnChange}
          />
          <div className="flex gap-3 items-center mx-2">
            <div
              className="h-5 w-5 bg-red-600 rounded-full cursor-pointer"
              onClick={() => handleColorSelect('red')}
            ></div>
            <div
              className="h-5 w-5 bg-yellow-300 rounded-full cursor-pointer"
              onClick={() => handleColorSelect('yellow')}
            ></div>
          </div>
          <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
          {/* <button className={`text-primary hover:${getButtonColor()}`}>
        <IoMdSend size={28} />
      </button> */}
        </form>

      </section>

    </div>
  );
}
