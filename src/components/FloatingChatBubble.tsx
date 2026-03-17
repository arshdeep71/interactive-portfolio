"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-landing";
import { ScrollArea } from "@/components/ui/scroll-area";
// Local responder text data for full-stack static fallback
const localTextAnswers: Record<string, string> = {
  'What are your passions?': "I am deeply passionate about full-stack web development, building scalable applications, and solving complex problems through code. I enjoy learning new frameworks and improving user experiences.",
  'How did you get started in tech?': "My journey in tech began with a curiosity for how websites work, which led me to dive deep into HTML, CSS, and eventually complex backend systems like Node.js, Express, and MongoDB.",
  'Where do you see yourself in 5 years?': "In 5 years, I envision myself as a Senior Developer or Tech Lead, driving innovative software architectures and continuing to build impactful, user-centric products.",
  'What makes you a valuable team member?': "I bring a strong combination of technical skills (MERN stack, Python, C++) and soft skills like adaptability, problem-solving, and project management. I thrive in collaborative environments.",
  'Why should I hire you?': "You should hire me because of my proven track record in building dynamic, full-stack applications like the Indian Startups Dashboard and Public Grievance Sorting System. I am dedicated, quick to adapt, and focused on delivering high-quality solutions.",
  "What's your educational background?": "I am currently focused on computer science and programming, continually expanding my knowledge through academics and actively building real-world software projects.",
  "What kind of project would make you say 'yes' immediately?": "I would immediately say 'yes' to any project that involves modern full-stack development (like React and Next.js), has a clear positive impact on users, and challenges me to solve complex problems.",
  'Where are you located?': "I am based in Hoshiarpur, Punjab, India.",
};

const matchLocalText = (query: string): string => {
  const q = query.trim();
  const exact = localTextAnswers[q];
  if (exact) return exact;

  const lower = q.toLowerCase();
  if (/(who are you|about|yourself|background|profile|bio|tell me|person|intro)/i.test(lower)) {
    return "I am Arshdeep Singh, a Computer Science student at Lovely Professional University. I'm a passionate developer specializing in React, Node.js, and scaling applications.";
  }
  if (/(project|work|built|made|create|dashboard|system)/i.test(lower)) {
    return "I have built projects like INNOSCOPE (Indian Startups Dashboard), SyllabiSync, and a Public Grievance Sorting system utilizing full-stack tools.";
  }
  if (/(skill|tech|stack|language)/i.test(lower)) {
    return "My core stack includes PHP, C++, Python, JavaScript along with React, Node.js, Express, and Tailwind CSS.";
  }
  if (/(contact|email|reach|hire|phone)/i.test(lower)) {
    return "You can reach me at arshdeepsingh07711@gmail.com or +91-7526954160. There's also a contact card layout with links available on the landing page!";
  }
  if (/(training|internship|course|lpu|summer)/i.test(lower)) {
    return "I've completed static Summer Training courses involving Mastering C++ (OOP to Dynamic Programming) directly tied to CPE enhancements.";
  }
  if (/(certification|certificate|nptel|infosys|freecodecamp)/i.test(lower)) {
    return "I hold whitelisted certifications in Cloud Computing (Nptel), Build Generative AI Apps (Infosys), and Responsive Web Design (freeCodeCamp).";
  }
  if (/(resume|cv)/i.test(lower)) {
    return "You can download my CV inside the Contact Card panel layout attached directly on the landing page dashboard!";
  }

  return "I'm Arshdeep. Ask me about my skills, projects, background, or training and I'll fill you in!";
};

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
      const response = matchLocalText(userMessage.content);
      
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