
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface CourseAIChatbotProps {
  courseId: string;
  courseTitle: string;
}

export function CourseAIChatbot({ courseId, courseTitle }: CourseAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI assistant for the "${courseTitle}" course. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "I understand your question. Based on the course materials, you should focus on understanding the fundamental concepts first.",
        "That's a great question! The course covers this topic in Week 3. I recommend reviewing the materials there.",
        "According to the course content, the answer involves applying the principles we learned in the recent module.",
        "This is an advanced topic. Let me explain it step by step based on what's covered in the course.",
        "The instructor addresses this specifically in lecture 4. The key points to remember are...",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <GlassCard className="flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-blue-100">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">Course Assistant</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMessages([
              {
                id: '1',
                content: `Hello! I'm your AI assistant for the "${courseTitle}" course. How can I help you today?`,
                sender: 'ai',
                timestamp: new Date(),
              },
            ]);
            toast.success("Conversation reset");
          }}
        >
          Reset Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-blue-100'
                } h-8 w-8 flex items-center justify-center flex-shrink-0`}
              >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div
                className={`py-2 px-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/70'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2 rounded-full bg-blue-100 h-8 w-8 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="py-3 px-4 rounded-lg bg-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this course..."
          className="min-h-10 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="h-10 w-10 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </GlassCard>
  );
}
