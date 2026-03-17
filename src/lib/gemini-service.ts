import { GoogleGenerativeAI } from "@google/generative-ai";

// Type definitions for better TypeScript support
interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CacheEntry {
  response: string;
  timestamp: number;
}

// Demo-friendly fallback responses
const FALLBACK_RESPONSES = {
  'tell me about yourself': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. I'm a passionate developer with expertise in modern web technologies, specializing in creating interactive and user-friendly applications using React, Next.js, and TypeScript.`,
  
  'show my projects': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. Here are some highlights:

1. **Portfolio Website** - A modern, interactive portfolio with AI chat integration
2. **Data Visualization Dashboard** - Real-time analytics with interactive charts
3. **E-commerce Platform** - Full-stack solution with user authentication
4. **Task Management App** - Collaborative team application`,
  
  'show my skills': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. Here's a quick overview:

**Technical Skills:** Frontend (React, Next.js, TypeScript), Backend (Node.js, Python), Databases (MongoDB, PostgreSQL), Tools (Git, Docker, AWS)

**Soft Skills:** Problem-solving, team collaboration, agile methodologies`,
  
  'show my achievements': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. Key achievements include:

- Deployed multiple full-stack applications with 99% uptime
- Implemented performance optimizations improving load times by 60%
- Led development teams in agile environments
- Contributed to open-source projects with 100+ stars`,
  
  'how can someone contact me': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. You can reach me at:

📧 **Email:** your.email@example.com
🔗 **LinkedIn:** linkedin.com/in/yourprofile
🐙 **GitHub:** github.com/yourusername

I'm always open to discussing new opportunities!`,
  
  'default': `That's an interesting question! While I'm processing that, feel free to check out [Your Name]'s projects below. I'm a skilled developer with experience in modern web technologies including React, Next.js, and TypeScript. I enjoy creating interactive applications and solving complex problems.`
};

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly BASE_DELAY = 5000; // 5 seconds
  private readonly isServer = typeof window === 'undefined';

  // Public method to check if service is available
  get isAvailable(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  constructor() {
    if (this.isServer) {
      // Skip initialization on server side
      return;
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set. Using mock responses only.');
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
        }
      });
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
    }
  }

  private generateCacheKey(messages: GeminiMessage[]): string {
    return JSON.stringify(messages).toLowerCase();
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check for exact matches first
    if (FALLBACK_RESPONSES[lowerMessage as keyof typeof FALLBACK_RESPONSES]) {
      return FALLBACK_RESPONSES[lowerMessage as keyof typeof FALLBACK_RESPONSES];
    }
    
    // Check for partial matches
    for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
      if (lowerMessage.includes(key.replace(/['"]/g, ''))) {
        return response;
      }
    }
    
    return FALLBACK_RESPONSES.default;
  }

  private async exponentialBackoff<T>(
    operation: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retryCount >= this.MAX_RETRIES) {
        throw error;
      }

      // Check if it's a 429 (Quota Exceeded) error
      if (error.status === 429 || error.message?.includes('429')) {
        const delay = this.BASE_DELAY * Math.pow(2, retryCount);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.exponentialBackoff(operation, retryCount + 1);
      }
      
      throw error;
    }
  }

  async generateResponse(messages: GeminiMessage[]): Promise<string> {
    const cacheKey = this.generateCacheKey(messages);
    
    // Check cache first (session storage for demo persistence)
    const cachedResponse = this.getSessionCache(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Check in-memory cache as fallback
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (this.isCacheValid(cached.timestamp)) {
        console.log('Returning cached response');
        return cached.response;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      // Extract user message for caching and fallback responses
      const userMessage = messages[messages.length - 1]?.content || '';
      
      // Only make API call if we have a valid model
      if (this.model) {
        const result = await this.exponentialBackoff(async () => {
          const chat = this.model.startChat({
            history: messages.slice(0, -1),
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 1000,
            }
          });
          
          const response = await chat.sendMessage(userMessage);
          return response;
        });

        const responseText = result.response.text();
        
        // Cache the response in both memory and session storage
        this.cache.set(cacheKey, {
          response: responseText,
          timestamp: Date.now()
        });
        this.setSessionCache(cacheKey, responseText);

        return responseText;
      } else {
        // No API key available, use fallback
        throw new Error('No API key configured');
      }
      
    } catch (error: any) {
      // Safety check: never log API keys or sensitive information
      console.error('Gemini API error (safe logging):', {
        message: error.message,
        status: error.status,
        type: error.constructor.name
      });
      
      // Return demo-friendly fallback response
      const userMessage = messages[messages.length - 1]?.content || '';
      const fallbackResponse = this.getFallbackResponse(userMessage);
      
      // Cache the fallback response to avoid repeated API calls
      this.cache.set(cacheKey, {
        response: fallbackResponse,
        timestamp: Date.now()
      });
      this.setSessionCache(cacheKey, fallbackResponse);
      
      return fallbackResponse;
    }
  }

  // Session storage methods for demo persistence
  private getSessionCache(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setSessionCache(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore session storage errors (incognito mode, etc.)
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const geminiService = new GeminiService();