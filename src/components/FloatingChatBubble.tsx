"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-landing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { geminiService } from "@/lib/gemini-service";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Typing animation component
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="ml-2 text-sm">AI is thinking deeply...</span>
    </div>
  </div>
);

export default function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Initialize with session storage or welcome message
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.warn('Failed to parse saved messages:', error);
        setDefaultMessages();
      }
    } else {
      setDefaultMessages();
    }
  }, []);

  const setDefaultMessages = () => {
    const welcomeMessage = {
      id: "welcome",
      content: "Hello! I'm your AI assistant. How can I help you learn about my portfolio?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    sessionStorage.setItem('chat_messages', JSON.stringify([welcomeMessage]));
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Convert messages to the format expected by Gemini
      const geminiMessages = messages.map((msg) => ({
        role: msg.isUser ? "user" as const : "assistant" as const,
        content: msg.content,
      }));

      // Add the new user message
      geminiMessages.push({
        role: "user" as const,
        content: userMessage.content,
      });

      const response = await geminiService.generateResponse(geminiMessages);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save messages to session storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('chat_messages', JSON.stringify(messages));
      } catch (error) {
        console.warn('Failed to save messages to session storage:', error);
      }
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg hover:from-blue-600 hover:to-purple-700"
          size="lg"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="glassmorphism rounded-t-xl border border-white/20 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-300">
                      {isLoading ? "Thinking..." : "Ready to help"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMinimized}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    {isMinimized ? "Expand" : "Minimize"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <ScrollArea className="glassmorphism rounded-t-none rounded-b-none border-x border-white/20 backdrop-blur-md">
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          message.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs rounded-2xl px-4 py-2 ${
                            message.isUser
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "bg-white/10 text-white backdrop-blur-sm"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="mt-1 text-xs text-gray-300 text-right">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && <TypingIndicator />}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="glassmorphism rounded-b-xl border border-white/20 p-4 backdrop-blur-md">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  <p className="mt-2 text-xs text-gray-400 text-center">
                    Powered by Gemini 2.5 Flash
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}