import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle, XCircle, AlertTriangle, FileText, Eye } from "lucide-react";

interface RecentAIFeedbackLogsProps {
  className?: string;
}

interface AIFeedback {
  id: string;
  type: "suggestion" | "validation_failed" | "validation_passed" | "recommendation";
  title: string;
  description: string;
  client: string;
  document?: string;
  timestamp: Date;
  status: "new" | "reviewed" | "implemented";
  severity: "low" | "medium" | "high";
}

const mockAIFeedback: AIFeedback[] = [
  {
    id: "1",
    type: "validation_failed",
    title: "Document Format Validation Failed",
    description: "GST Return file missing required fields: GSTIN verification",
    client: "TechCorp Industries",
    document: "GST_Return_Dec2023.pdf",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "new",
    severity: "high"
  },
  {
    id: "2",
    type: "suggestion",
    title: "Optimize Filing Schedule",
    description: "Consider consolidating 3 pending filings for better efficiency",
    client: "GreenEnergy Solutions",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: "reviewed",
    severity: "medium"
  },
  {
    id: "3",
    type: "validation_passed",
    title: "Compliance Check Successful",
    description: "All mandatory documents verified for audit preparation",
    client: "RetailMax Pvt Ltd",
    document: "Audit_Checklist_Q4.xlsx",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "implemented",
    severity: "low"
  },
  {
    id: "4",
    type: "recommendation",
    title: "Process Automation Opportunity",
    description: "TDS calculations can be automated for recurring transactions",
    client: "FinanceFirst Corp",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: "new",
    severity: "medium"
  },
  {
    id: "5",
    type: "validation_failed",
    title: "Data Inconsistency Detected",
    description: "Balance sheet figures don't match with trial balance",
    client: "TechCorp Industries",
    document: "Balance_Sheet_Q4.pdf",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: "reviewed",
    severity: "high"
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "suggestion":
      return <Bot className="h-3 w-3" />;
    case "validation_failed":
      return <XCircle className="h-3 w-3" />;
    case "validation_passed":
      return <CheckCircle className="h-3 w-3" />;
    case "recommendation":
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <Bot className="h-3 w-3" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "suggestion":
      return "bg-primary/10 text-primary border-primary/20";
    case "validation_failed":
      return "bg-status-error/10 text-status-error border-status-error/20";
    case "validation_passed":
      return "bg-status-success/10 text-status-success border-status-success/20";
    case "recommendation":
      return "bg-status-warning/10 text-status-warning border-status-warning/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "text-status-error";
    case "medium":
      return "text-status-warning";
    case "low":
      return "text-status-success";
    default:
      return "text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-primary/10 text-primary border-primary/20";
    case "reviewed":
      return "bg-status-warning/10 text-status-warning border-status-warning/20";
    case "implemented":
      return "bg-status-success/10 text-status-success border-status-success/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "Just now";
  }
};

export const RecentAIFeedbackLogs = ({ className }: RecentAIFeedbackLogsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Recent AI Feedback
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Last 5 Events
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          AI suggestions and document validation results
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAIFeedback.map((feedback) => (
          <div 
            key={feedback.id} 
            className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className={`${getTypeColor(feedback.type)} border text-xs`}>
                  {getTypeIcon(feedback.type)}
                  <span className="ml-1 capitalize">{feedback.type.replace('_', ' ')}</span>
                </Badge>
                <Badge className={`${getStatusColor(feedback.status)} border text-xs`}>
                  {feedback.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${getSeverityColor(feedback.severity)}`}>
                  {feedback.severity.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getTimeAgo(feedback.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{feedback.title}</h4>
              <p className="text-xs text-muted-foreground">{feedback.description}</p>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-primary">{feedback.client}</span>
                {feedback.document && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{feedback.document}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t text-center">
          <button className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors w-full">
            <Eye className="h-3 w-3" />
            View All AI Feedback Logs
          </button>
        </div>
      </CardContent>
    </Card>
  );
};