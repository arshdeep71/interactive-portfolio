"use client";
import ChatBottombar from "@/components/chat/chat-bottombar";
import ChatLanding from "@/components/chat/chat-landing";
import ChatMessageContent from "@/components/chat/chat-message-content";
import HelperBoost from "./HelperBoost";
import React, { useEffect, useMemo, useRef, useState } from "react";
import WelcomeModal from "@/components/welcome-modal";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SimplifiedChatView } from "@/components/chat/simple-chat-view";

// Component imports
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isTalking: boolean;
}

// Static import of Avatar component
const Avatar = ({ hasActiveTool }: AvatarProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full transition-all duration-300 overflow-hidden shadow-lg border-2 border-white dark:border-neutral-800 ${
        hasActiveTool ? 'h-24 w-24' : 'h-32 w-32'
      }`}
    >
      <div
        className="relative h-full w-full cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        <img
          src="/avatar_arsh.jpg"
          alt="Avatar"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};


const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
        setIsTalking(true);
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('Failed to play video:', error);
          });
        }
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      console.error('Chat error:', error.message, error.cause);
      
      // The user wants ONLY the 'Out of credits' message for all API limits
      toast.error("Sorry, we are out of credits. We'll be back soon! Sorry for the inconvenience.");
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  const localQueries: Record<string, string> = {
    'Who are you?': 'getPresentation',
    'Tell me about your projects': 'getProjects',
    'Show my projects': 'getProjects',
    'What projects are you most proud of?': 'getProjects',
    'Show my skills': 'getSkills',
    'What are your skills?': 'getSkills',
    'Show my achievements': 'getAchievements',
    'Show my training': 'getTraining',
    'Show my certifications': 'getCertifications',
    'How can someone contact me?': 'getContact',
    'How can I reach you?': 'getContact',
    'Can I see your resume?': 'getResume',
  };

  const matchLocalTool = (query: string): string | null => {
    // 1) First check exact map (for the quick buttons)
    if (localQueries[query]) return localQueries[query];

    // 2) Then check 100+ patterns dynamically
    const q = query.toLowerCase();

    // Presentation / Me / About matches
    if (/(who are you|about|yourself|background|presentation|me\b|profile|bio|tell me|person|intro)/i.test(q)) return 'getPresentation';
    
    // Projects matches
    if (/(project|work|portfolio|built|made|create|did you do|experience|app|dashboard|system)/i.test(q)) return 'getProjects';
    
    // Skills matches
    if (/(skill|tech|stack|language|framework|know|tool|mongodb|react|node|c\+\+|php|python|java|html|css|expert|good at)/i.test(q)) return 'getSkills';
    
    // Achievements matches
    if (/(achievement|patent|award|accomplish|proud|win|won|success|trophy)/i.test(q)) return 'getAchievements';
    
    // Training matches
    if (/(training|internship|intern|course|lpu|summer|mastering c\+\+|cpe|enhancement)/i.test(q)) return 'getTraining';
    
    // Certifications matches
    if (/(certification|certificate|nptel|infosys|freecodecamp|cloud computing|generative ai)/i.test(q)) return 'getCertifications';

    // Contact / Reach matches
    if (/(contact|email|reach|hire|phone|mobile|linkedin|github|touch|social|message|call|connect)/i.test(q)) return 'getContact';
    
    // Resume matches
    if (/(resume|cv|document|file)/i.test(q)) return 'getResume';

    return null;
  };

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

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;

    const localToolName = matchLocalTool(query);

    setInput(query); // Automatically fill the search box for visual feedback
    const userMessage = { id: Date.now().toString(), role: 'user', content: query };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);
    
    setLoadingSubmit(true);
    setIsTalking(true);

    const exactTextAnswer = localTextAnswers[query];

    if (exactTextAnswer) {
      setTimeout(() => {
        setLoadingSubmit(false);
        setInput(''); // clear input box
        const textMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: exactTextAnswer,
        };
        //@ts-ignore
        setMessages((prev) => [...prev, textMsg]);
        setIsTalking(false);
      }, 800);
    } else if (localToolName) {
      setTimeout(() => {
        setLoadingSubmit(false);
        setInput(''); // clear input box

        const mockToolId = `call_${Date.now()}`;
        const mockAssistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `[FALLBACK_TOOL:${localToolName}]`,
          parts: [
            {
              type: 'text',
              text: `[FALLBACK_TOOL:${localToolName}]`
            },
            {
              type: 'tool-invocation',
              toolInvocation: {
                state: 'result',
                toolCallId: mockToolId,
                toolName: localToolName,
                args: {},
                result: `Successfully loaded local data for ${localToolName}`
              }
            }
          ]
        };
        //@ts-ignore
        setMessages((prev) => [...prev, mockAssistantMsg]);
        setIsTalking(false);
      }, 800);
    } else {
      setTimeout(() => {
        setLoadingSubmit(false);
        setInput(''); // clear input box
        const errMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "We are srry for the inconvenince, this feature is still under update. For now, please click the quick question cards to check my Profile, Projects, Skills, Achievements, and Contact info!",
        };
        //@ts-ignore
        setMessages((prev) => [...prev, errMessage]);
        setIsTalking(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.pause();
    }

    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch((error) => {
          console.error('Failed to play video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
    setIsTalking(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
                videoRef={videoRef}
                isTalking={isTalking}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={submitQuery} setInput={setInput} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
