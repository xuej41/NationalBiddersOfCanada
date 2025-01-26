'use client';
import { useState } from "react";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
      >
        Chat
      </button>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="font-bold text-lg mb-2">Virtual Assistant</div>
          <div className="text-gray-700">Hello, how can I help you today?</div>
        </div>
      )}
    </>
  );
}