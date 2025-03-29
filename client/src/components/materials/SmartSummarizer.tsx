
import { useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';

interface SmartSummarizerProps {
  materialId: string;
  materialTitle: string;
}

export function SmartSummarizer({ materialId, materialTitle }: SmartSummarizerProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  const generateSummary = () => {
    setLoading(true);
    
    // Simulate API call to summarization service
    setTimeout(() => {
      // Mock summary data
      const mockSummary = `
        • The presentation covers key concepts in web development fundamentals
        • HTML is used for structuring content on the web
        • CSS is responsible for styling and layout
        • JavaScript adds interactivity to web pages
        • Responsive design ensures websites work on all devices
        • Performance optimization is crucial for user experience
      `;
      
      setSummary(mockSummary.trim());
      setLoading(false);
      setExpanded(true);
      toast.success('Summary generated successfully');
    }, 2000);
  };
  
  return (
    <div className="mt-2">
      {!summary ? (
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={generateSummary}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-t-transparent border-current rounded-full animate-spin mr-1" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              Generate Smart Summary
            </>
          )}
        </Button>
      ) : (
        <div className="mt-1">
          <button 
            className="flex items-center text-xs font-medium text-primary mb-1 hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Smart Summary
            {expanded ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            )}
          </button>
          
          {expanded && (
            <GlassCard className="p-2 text-xs">
              <div className="whitespace-pre-line">{summary}</div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
