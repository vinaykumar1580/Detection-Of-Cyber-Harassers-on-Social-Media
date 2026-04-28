import React, { useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { BsSend } from "react-icons/bs";

const Message = () => {
  const [messages, setMessages] = useState([
    { sender: "user", text: "Hey! How's it going?" },
    { sender: "friend", text: "Hey! I'm good, you?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100 mt-4">
     
      {/* Chat Window */}
      <div className="flex-1 flex flex-col mt-5">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-300 flex items-center mt-30 pt-120">
          <img
            src="https://via.placeholder.com/50"
            alt="Friend"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">john_doe</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } rounded-lg px-4 py-2 max-w-xs`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-300 bg-white flex items-center">
          <FaRegSmile className="text-gray-500 text-2xl mr-3 cursor-pointer" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="ml-3">
            <BsSend className="text-blue-500 text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
