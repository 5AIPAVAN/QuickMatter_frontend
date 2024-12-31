import React, { useState } from 'react';

const ScheduleMessage = (props) => {
  const {sender,receiver,importance} = props;
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleSchedule = () => {
    console.log("got details in backend",message,scheduleTime);
    if (message && scheduleTime) {
      // Send data to backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/schedule-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, scheduleTime,sender,receiver,importance }),
      }).then((response) => {
        if (response.ok) {
          alert('Message scheduled successfully!');
          setMessage('');
          setScheduleTime('');
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        value={scheduleTime}
        onChange={(e) => setScheduleTime(e.target.value)}
      />
      <button
        className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md"
        onClick={handleSchedule}
      >
        Schedule Message
      </button>
    </div>
  );
};

export default ScheduleMessage;
