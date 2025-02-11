"use client";

import { useState, useRef, useEffect } from "react";
import { SunIcon, MoonIcon, ArrowUpIcon, BoltIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (input.trim() && !loading) {
      setMessages((prev) => [...prev, { user: "You", text: input }]);
      setInput("");
      setLoading(true);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { user: "AI", text: "This is a sample response." },
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-[#212121] text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">CSRSEF Chatbot</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition ${
            darkMode ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 mx-64"
        style={{ paddingBottom: "80px" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 px-4 rounded-3xl break-words w-fit max-w-3xl ${
              message.user === "You"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-300 text-black self-start dark:bg-gray-700 dark:text-white"
            }`}
          >
            {message.text}
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className=" p-2 px-4 rounded-3xl break-words w-fit max-w-3xl bg-gray-300 text-black self-start">
            ...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Bar */}
      <div
        className={`p-4 border-t fixed bottom-0 w-full flex items-center gap-2 ${
          darkMode
            ? "bg-[#303030] text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`flex-1 p-3 border rounded-2xl resize-none overflow-y-auto max-h-[150px] 
            ${
              darkMode
                ? "bg-[#303030] text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            } 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={
            loading ? "Waiting for response..." : "Type a message..."
          }
          rows={1}
          disabled={loading}
        />
        <button
          onClick={() => (loading ? setLoading(false) : handleSend())}
          className={`p-3 rounded-full transition 
            ${
              loading
                ? "cursor-not-allowed"
                : darkMode
                ? "bg-white hover:bg-gray-300 text-black"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
              disabled={loading}
            >
              {loading ? (
                <BoltIcon className="h-6 w-6" />
              ) : (
                <ArrowUpIcon className="h-6 w-6" />
              )}
        </button>
      </div>
    </div>
  );
}
