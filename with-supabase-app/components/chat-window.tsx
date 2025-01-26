'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import "./chat-window.css";
import OpenAI from "openai";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]); // State to store chat history
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    dangerouslyAllowBrowser: true
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (message.trim() !== "") {
      // Add the user's message to the chat history

      // Call OpenAI API to get the response
      const response =  JSON.stringify(openAIResponse);
      console.log("True response", response)
      setChatHistory((prevHistory) => [...prevHistory, { sender: "user", text: message }]);

      setChatHistory((prevHistory) => [...prevHistory, { sender: "bot", text: response }]);

      setMessage(""); // Clear the input box after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
      handleSubmit();
    }
  };

  const getItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auction_items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      // Remove the `image` field from each object
      const updatedData = data.map((item : any) => {
        const { image, ...rest } = item; // Destructure to remove `image`
        return rest; // Return the object without `image`
      });
      
      console.log(updatedData);
      setItems(updatedData); // Set the modified data
    } catch (error) {
      console.error("Error initiating call: ", error);
    }
  };
  

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log(message);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant for recommending the best auction item to the user based on a list of auctioned items and the requirements they asked for." },
          {
            role: "user",
            content: `Recommend the best auction item for me. I want something that is ${message}. These are the items for auction: ${JSON.stringify(items)}, return the best item for me and its id. Do not have any newlines or bold characters in your response, make sure that it is in text message form, not json.`,
          },
        ],
      });
      const openAIData =  response.choices[0].message.content;
      setOpenAIResponse(openAIData);
      console.log("OpenAI Response: ", openAIData);
      console.log("OpenAI Response2: ", openAIResponse);
    } catch (error) {
      console.error("Error calling OpenAI: ", error);
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

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
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbox-container">
          <input
            type="text"
            className="chatbox-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button onClick={() => { handleSend(); handleSubmit();  }} className="chatbox-send-button">
            Send
          </button>
        </div>
      </div>
    </>
  );
}