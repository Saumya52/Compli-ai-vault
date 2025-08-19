import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  User, 
  Send, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Sparkles,
  Clock,
  Calendar,
  Filter,
  Folder
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  id: string;
  fileName: string;
  folderPath: string;
  fileType: string;
  relevanceScore: number;
  matchedContent: string;
  uploadedAt: Date;
  size: string;
  tags: string[];
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  searchResults?: SearchResult[];
  suggestions?: string[];
}

interface AISearchAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISearchAssistant = ({ isOpen, onClose }: AISearchAssistantProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hi! I'm your AI search assistant. I can help you find documents using natural language queries. Try asking me something like 'Show me GSTR-3B filings from FY 2024-25' or 'Find all invoices from last month'.",
      timestamp: new Date(),
      suggestions: [
        "Show me GSTR-3B filings from FY 2024-25",
        "Find all incorporation documents",
        "Get bank statements from last quarter",
        "Show pending compliance documents",
        "Find invoices above ₹1 lakh"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: "1",
      fileName: "GSTR-3B_March_2024_ABC_Pvt_Ltd.pdf",
      folderPath: "/Compliance/GST/FY2024-25/Q4",
      fileType: "PDF",
      relevanceScore: 95,
      matchedContent: "GSTR-3B return for the period March 2024, filed on April 18, 2024",
      uploadedAt: new Date('2024-04-18'),
      size: "2.4 MB",
      tags: ["GST", "GSTR-3B", "March 2024", "Filed"]
    },
    {
      id: "2", 
      fileName: "GSTR-3B_February_2024_ABC_Pvt_Ltd.pdf",
      folderPath: "/Compliance/GST/FY2024-25/Q4",
      fileType: "PDF",
      relevanceScore: 92,
      matchedContent: "GSTR-3B return for February 2024, contains input tax credit details",
      uploadedAt: new Date('2024-03-15'),
      size: "2.1 MB", 
      tags: ["GST", "GSTR-3B", "February 2024", "Filed"]
    },
    {
      id: "3",
      fileName: "GSTR-3B_January_2024_ABC_Pvt_Ltd.pdf", 
      folderPath: "/Compliance/GST/FY2024-25/Q4",
      fileType: "PDF",
      relevanceScore: 89,
      matchedContent: "GSTR-3B return for January 2024, quarterly summary included",
      uploadedAt: new Date('2024-02-12'),
      size: "1.9 MB",
      tags: ["GST", "GSTR-3B", "January 2024", "Filed"]
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsSearching(true);

    // Simulate AI processing
    setTimeout(() => {
      let assistantResponse: ChatMessage;
      
      if (inputValue.toLowerCase().includes("gstr-3b") && inputValue.toLowerCase().includes("2024")) {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I found 3 GSTR-3B filings from FY 2024-25. These documents contain quarterly GST return submissions with input tax credit details and liability calculations.",
          timestamp: new Date(),
          searchResults: mockSearchResults,
          suggestions: [
            "Show me filing dates for these returns",
            "Find GSTR-1 returns for the same period", 
            "Get GST payment receipts",
            "Show late filing penalties if any"
          ]
        };
      } else if (inputValue.toLowerCase().includes("invoice")) {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I found several invoices matching your criteria. Would you like me to filter by amount, date range, or client?",
          timestamp: new Date(),
          searchResults: mockSearchResults.slice(0, 2),
          suggestions: [
            "Show invoices above ₹50,000",
            "Filter by client name",
            "Show unpaid invoices",
            "Group by month"
          ]
        };
      } else {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant", 
          content: "I understand you're looking for documents. Could you be more specific about what type of documents or time period you need? I can search by document type, date ranges, entity names, compliance categories, and more.",
          timestamp: new Date(),
          suggestions: [
            "Show all board resolutions",
            "Find documents from last month",
            "Get incorporation documents",
            "Show compliance deadlines"
          ]
        };
      }

      setMessages(prev => [...prev, assistantResponse]);
      setIsSearching(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownload = (result: SearchResult) => {
    toast({
      title: "Download Started",
      description: `Downloading ${result.fileName}`,
    });
  };

  const handleView = (result: SearchResult) => {
    toast({
      title: "Opening Document",
      description: `Opening ${result.fileName}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Search Assistant
          </DialogTitle>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "assistant" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-lg p-3 ${
                      message.type === "user" 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Search Results */}
                {message.searchResults && (
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Search className="w-4 h-4" />
                      Found {message.searchResults.length} documents
                    </div>
                    {message.searchResults.map((result) => (
                      <Card key={result.id} className="p-3">
                        <CardContent className="p-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">{result.fileName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {result.relevanceScore}% match
                                </Badge>
                              </div>
                              
                              <div className="text-xs text-muted-foreground flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Folder className="w-3 h-3" />
                                  {result.folderPath}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {result.uploadedAt.toLocaleDateString()}
                                </span>
                                <span>{result.size}</span>
                              </div>
                              
                              <p className="text-xs text-muted-foreground">
                                {result.matchedContent}
                              </p>
                              
                              <div className="flex gap-1">
                                {result.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 ml-3">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleView(result)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownload(result)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      Suggested follow-ups:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isSearching && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Searching documents...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to find documents... e.g. 'Show me all GST returns from last quarter'"
            className="flex-1"
            disabled={isSearching}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSearching}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};