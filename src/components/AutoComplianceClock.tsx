import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface AutoComplianceClockProps {
  className?: string;
}

interface ComplianceEvent {
  id: string;
  title: string;
  client: string;
  dueDate: Date;
  type: "filing" | "audit" | "tax" | "regulatory";
  priority: "high" | "medium" | "low";
}

const mockComplianceEvents: ComplianceEvent[] = [
  {
    id: "1",
    title: "GST Return Filing",
    client: "TechCorp Industries",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    type: "filing",
    priority: "high"
  },
  {
    id: "2",
    title: "Income Tax Audit",
    client: "GreenEnergy Solutions", 
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    type: "audit",
    priority: "high"
  },
  {
    id: "3",
    title: "TDS Return",
    client: "RetailMax Pvt Ltd",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    type: "tax",
    priority: "medium"
  },
  {
    id: "4",
    title: "Board Meeting",
    client: "FinanceFirst Corp",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    type: "regulatory",
    priority: "medium"
  },
  {
    id: "5",
    title: "Annual Filing",
    client: "TechCorp Industries",
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    type: "filing",
    priority: "low"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "filing":
      return "bg-primary/10 text-primary border-primary/20";
    case "audit":
      return "bg-status-error/10 text-status-error border-status-error/20";
    case "tax":
      return "bg-status-warning/10 text-status-warning border-status-warning/20";
    case "regulatory":
      return "bg-status-success/10 text-status-success border-status-success/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
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

const getTimeRemaining = (dueDate: Date) => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return "Due now";
  }
};

const getProgressPercentage = (dueDate: Date) => {
  const now = new Date();
  const created = new Date(dueDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // Assume 30 days total
  const total = dueDate.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

export const AutoComplianceClock = ({ className }: AutoComplianceClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Sort events by due date and take first 5
  const upcomingEvents = mockComplianceEvents
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Compliance Clock
          </CardTitle>
          <Badge variant="outline" className="text-xs animate-pulse">
            Live
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Next 5 compliance events across all clients
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event, index) => {
          const timeRemaining = getTimeRemaining(event.dueDate);
          const progress = getProgressPercentage(event.dueDate);
          const isUrgent = event.dueDate.getTime() - currentTime.getTime() < 3 * 24 * 60 * 60 * 1000; // Less than 3 days
          
          return (
            <div 
              key={event.id} 
              className={`p-3 rounded-lg border transition-all ${isUrgent ? 'bg-status-error/5 border-status-error/20 animate-pulse' : 'bg-muted/30 border-border/50'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.title}</span>
                    <Badge className={`${getTypeColor(event.type)} text-xs border`}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{event.client}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${getPriorityColor(event.priority)}`}>
                    {timeRemaining}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.dueDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {/* Animated Progress Ring */}
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${isUrgent ? 'bg-status-error' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {isUrgent && (
                  <div className="absolute -top-1 right-0 w-2 h-2 bg-status-error rounded-full animate-ping" />
                )}
              </div>
            </div>
          );
        })}
        
        <div className="pt-3 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};