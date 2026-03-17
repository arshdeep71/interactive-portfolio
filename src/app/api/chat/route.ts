import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "./prompt";
import { getAchievements } from "./tools/getAchievements";
import { getContact } from "./tools/getContact";
import { getCrazy } from "./tools/getCrazy";
import { getInternship } from "./tools/getIntership";
import { getPresentation } from "./tools/getPresentation";
import { getProjects } from "./tools/getProjects";
import { getResume } from "./tools/getResume";
import { getSkills } from "./tools/getSkills";
import { getSports } from "./tools/getSport";

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// Simple heuristic to check if a query matches a known quick button format
function getFallbackToolInvocation(query: string) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('show my skills') || lowerQuery.includes('what are your skills')) {
    return { name: 'getSkills', result: 'Here are my skills:' };
  }
  if (lowerQuery.includes('show my projects') || lowerQuery.includes('what projects are you most proud of')) {
    return { name: 'getProjects', result: 'Here are my projects:' };
  }
  if (lowerQuery.includes('contact me') || lowerQuery.includes('reach you')) {
    return { name: 'getContact', result: 'Here is my contact info:' };
  }
  if (lowerQuery.includes('who are you') || lowerQuery.includes('tell me about yourself')) {
    return { name: 'getPresentation', result: 'Here is a little about me:' };
  }
  if (lowerQuery.includes('resume') || lowerQuery.includes('cv')) {
    return { name: 'getResume', result: 'Here is my resume:' };
  }
  if (lowerQuery.includes('achievements')) {
    return { name: 'getAchievements', result: 'Here are some of my achievements:' };
  }
  
  return null;
}

export async function POST(req: Request) {
  let userMessage = "";
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    userMessage = messages[messages.length - 1]?.content || "";

    messages.unshift(SYSTEM_PROMPT);

    const tools = {
      getAchievements,
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getInternship,
    };

    try {
      const result = streamText({
        model: google('gemini-2.5-flash'),
        messages,
        toolCallStreaming: true,
        tools,
        maxSteps: 2,
      });

      return result.toDataStreamResponse({
        getErrorMessage: errorHandler,
      });
    } catch (apiError) {
      console.warn('[CHAT-API] AI API failed, attempting local fallback...', apiError);
      
      const fallbackTool = getFallbackToolInvocation(userMessage);
      
      // We manually construct a simulated streamed response for the UI if fallback matches
      if (fallbackTool) {
        let fallbackMessage = `[FALLBACK_TOOL:${fallbackTool.name}] The AI API is currently experiencing issues. Here is the requested local info instead.`;
        return new Response(fallbackMessage + "\n\nPlease check the UI sections directly if the components don't load.", { status: 200 });
      }

      throw apiError; // re-throw if no fallback applies
    }

  } catch (err) {
    console.error('Global error:', err);
    
    // We try to rescue it with a known fallback if we can parse the last user message
    const fallbackTool = getFallbackToolInvocation(userMessage);
    if (fallbackTool) {
      return new Response(`[FALLBACK_TOOL:${fallbackTool.name}] The AI API is currently experiencing issues. Here is the requested local info instead.`, { status: 200 });
    }

    const errorMessage = "I'm sorry, the AI API is currently not fetching due to some error. But you can check my basic info (Skills, Projects, Contact) by clicking the buttons, or checking the sections below!";
    return new Response(errorMessage, { status: 200 });
  }
}
