import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageCircleQuestionMark, SendHorizontal, X } from "lucide-react";

const seedMessages = [
  {
    id: "support-1",
    author: "support",
    text: "Hi! How can we help you with GoRides today?",
    time: "Just now",
  },
];

const quickTopics = [
  "Payment issue",
  "Ride not found",
  "Captain delayed",
  "OTP problem",
];

export default function HelpChatPanel({ open, onClose }) {
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMessages(seedMessages);
      setInput("");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const sendMessage = async (value) => {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    setError("");
    const userMessage = {
      id: `user-${Date.now()}`,
      author: "user",
      text: trimmed,
      time: "Now",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const history = [...messages, userMessage].map((msg) => ({
        type: msg.author === "user" ? "user" : "model",
        text: msg.text,
      }));
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/support/chat`,
        { message: trimmed, history },
        { withCredentials: true },
      );
      const replyText =
        response?.data?.reply || "Sorry, I could not answer that.";
      setMessages((prev) => [
        ...prev,
        {
          id: `support-${Date.now() + 1}`,
          author: "support",
          text: replyText,
          time: "Now",
        },
      ]);
    } catch (err) {
      console.error("Help chat error:", err);
      setError("Unable to reach support right now.");
      setMessages((prev) => [
        ...prev,
        {
          id: `support-${Date.now() + 1}`,
          author: "support",
          text: "We hit a problem sending your message. Please try again.",
          time: "Now",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickSend = (topic) => {
    sendMessage(topic);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <MessageCircleQuestionMark
                size={20}
                className="text-emerald-600"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Help Chat</h2>
              <p className="text-xs text-gray-500">
                We usually respond quickly
              </p>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-gradient-to-b from-emerald-50/40 via-white to-white">
          {messages.map((message) => {
            const isUser = message.author === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isUser
                      ? "bg-emerald-500 text-white rounded-br-md"
                      : "bg-white border border-emerald-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p>{message.text}</p>
                  <div
                    className={`mt-2 text-[11px] ${
                      isUser ? "text-emerald-100" : "text-gray-400"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="p-5 flex flex-wrap gap-2">
          {quickTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleQuickSend(topic)}
              className="px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {topic}
            </button>
          ))}
        </div>
        {error && <p className="px-5 text-xs text-red-500">{error}</p>}
        <div className="px-5 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(input);
                }
              }}
              className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSending}
              aria-label="Send message"
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
