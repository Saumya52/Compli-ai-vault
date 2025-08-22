import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AISuggestion {
  id: string;
  type: "document_analysis" | "task_optimization" | "compliance_insight";
  title: string;
  description: string;
  taskId?: string;
  documentName?: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  actionLabel: string;
}

interface AISuggestionsPanelProps {
  className?: string;
}

export const AISuggestionsPanel = ({ className }: AISuggestionsPanelProps) => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  // Listen for AI suggestions from document uploads
  useEffect(() => {
    const handleAISuggestion = (event: CustomEvent) => {
      const { suggestion, taskId, documentName } = event.detail;
      
      if (suggestion && suggestion.trim() && !suggestion.includes("no content provided")) {
        const newSuggestion: AISuggestion = {
          id: Date.now().toString(),
          type: "document_analysis",
          title: "Document Analysis Complete",
          description: suggestion,
          taskId,
          documentName,
          timestamp: new Date(),
          priority: "medium",
          actionLabel: "Review Analysis"
        };
        
        setSuggestions(prev => [newSuggestion, ...prev.slice(0, 9)]); // Keep last 10 suggestions
      }
    };

    window.addEventListener('ai-suggestion', handleAISuggestion as EventListener);
    
    return () => {
      window.removeEventListener('ai-suggestion', handleAISuggestion as EventListener);
    };
  }, []);

  const handleSuggestionAction = (suggestion: AISuggestion) => {
    toast({
      title: "Action Initiated",
      description: `${suggestion.actionLabel} for ${suggestion.documentName || 'task'}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document_analysis": return <FileText className="w-4 h-4" />;
      case "task_optimization": return <Lightbulb className="w-4 h-4" />;
      case "compliance_insight": return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(suggestion.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {suggestion.documentName && (
                      <span>Document: {suggestion.documentName}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7"
                    onClick={() => handleSuggestionAction(suggestion)}
                  >
                    {suggestion.actionLabel}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            
            {suggestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No AI suggestions yet</p>
                <p className="text-xs">Upload documents to get AI analysis and suggestions.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};