'use client';
import { useState } from "react";
import Image from "next/image";
import "./chat-window.css";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    // Handle sending the message
    console.log("Message sent:", message);
    setMessage(""); // Clear the input box after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
      >
        <Image src="/chatbot.png" alt="Chat" width={64} height={64} />
      </button>
      <div className={`chat-window ${isOpen ? "open" : "closed"}`}>
        <div className="font-bold text-lg mb-2">Virtual Assistant</div>
        <div className="text-gray-700 mb-4">Hello, how can I help you today?</div>
        <div className="chatbox-container">
          <input
            type="text"
            className="chatbox-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button onClick={handleSend} className="chatbox-send-button">
            Send
          </button>
        </div>
      </div>
    </>
  );
}