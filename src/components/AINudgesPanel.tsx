import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  User,
  FileText,
  Calendar,
  Zap
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AINudge {
  id: string;
  type: "overdue" | "escalation" | "reassignment" | "filing_reminder" | "optimization";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionLabel: string;
  targetEntity?: string;
  dueDate?: Date;
  relatedTask?: string;
}

interface AINudgesPanelProps {
  userRole: "admin" | "cfo" | "team_member";
  userId: string;
}

export const AINudgesPanel = ({ userRole, userId }: AINudgesPanelProps) => {
  const { toast } = useToast();

  // Mock AI-generated nudges based on user role and history
  const getNudgesForRole = (): AINudge[] => {
    const baseNudges: AINudge[] = [
      {
        id: "1",
        type: "overdue",
        title: "GSTR-3B Filing Overdue",
        description: "ABC Pvt Ltd GSTR-3B for March 2024 is 3 days overdue. Consider immediate filing to avoid penalties.",
        priority: "high",
        actionLabel: "File Now",
        targetEntity: "ABC Pvt Ltd",
        dueDate: new Date(Date.now() - 259200000), // 3 days ago
        relatedTask: "GSTR-3B March 2024"
      },
      {
        id: "2", 
        type: "escalation",
        title: "Multiple Pending Approvals",
        description: "5 compliance tasks require your approval. Team productivity may be impacted.",
        priority: "medium",
        actionLabel: "Review Queue",
        targetEntity: "Multiple Entities"
      }
    ];

    if (userRole === "admin") {
      return [
        ...baseNudges,
        {
          id: "3",
          type: "reassignment",
          title: "Workload Redistribution Needed",
          description: "John Doe has 12 pending tasks while others have <3. Consider reassigning for better efficiency.",
          priority: "medium",
          actionLabel: "Reassign Tasks",
          targetEntity: "Team Management"
        },
        {
          id: "4",
          type: "optimization",
          title: "Automation Opportunity",
          description: "GST return filings can be automated for 3 entities based on recurring patterns.",
          priority: "low",
          actionLabel: "Setup Automation",
          targetEntity: "Process Optimization"
        }
      ];
    } else if (userRole === "cfo") {
      return [
        ...baseNudges,
        {
          id: "5",
          type: "filing_reminder",
          title: "Quarterly Review Due",
          description: "Q4 compliance review meeting is scheduled for tomorrow. 3 pending items need attention.",
          priority: "high",
          actionLabel: "Prepare Review",
          targetEntity: "Quarterly Planning"
        }
      ];
    }

    return baseNudges.filter(nudge => nudge.type !== "reassignment");
  };

  const nudges = getNudgesForRole();

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
      case "overdue": return <Clock className="w-4 h-4" />;
      case "escalation": return <TrendingUp className="w-4 h-4" />;
      case "reassignment": return <User className="w-4 h-4" />;
      case "filing_reminder": return <Calendar className="w-4 h-4" />;
      case "optimization": return <Zap className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleNudgeAction = (nudge: AINudge) => {
    toast({
      title: "Action Initiated",
      description: `${nudge.actionLabel} for ${nudge.relatedTask || nudge.targetEntity}`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {nudges.map((nudge) => (
              <div key={nudge.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(nudge.type)}
                    <span className="font-medium text-sm">{nudge.title}</span>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(nudge.priority)}`}>
                    {nudge.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {nudge.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {nudge.targetEntity}
                    {nudge.dueDate && (
                      <span className="ml-2">
                        Due: {nudge.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7"
                    onClick={() => handleNudgeAction(nudge)}
                  >
                    {nudge.actionLabel}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            
            {nudges.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">All caught up!</p>
                <p className="text-xs">No urgent actions needed right now.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};