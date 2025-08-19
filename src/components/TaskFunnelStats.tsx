import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Zap, User, AlertTriangle } from "lucide-react";

interface TaskFunnelStatsProps {
  className?: string;
}

interface TaskStats {
  totalTasks: number;
  completedOnTime: number;
  autoClosedViaZoho: number;
  manualCompletions: number;
  escalations: number;
}

const mockTaskStats: TaskStats = {
  totalTasks: 247,
  completedOnTime: 89,
  autoClosedViaZoho: 34,
  manualCompletions: 67,
  escalations: 12
};

export const TaskFunnelStats = ({ className }: TaskFunnelStatsProps) => {
  const completionRate = Math.round((mockTaskStats.completedOnTime / mockTaskStats.totalTasks) * 100);
  const autoCloseRate = Math.round((mockTaskStats.autoClosedViaZoho / mockTaskStats.totalTasks) * 100);
  const escalationRate = Math.round((mockTaskStats.escalations / mockTaskStats.totalTasks) * 100);

  const statItems = [
    {
      label: "Completed On Time",
      value: mockTaskStats.completedOnTime,
      percentage: completionRate,
      icon: CheckCircle,
      color: "text-status-success",
      bgColor: "bg-status-success/10"
    },
    {
      label: "Auto-closed via Zoho",
      value: mockTaskStats.autoClosedViaZoho,
      percentage: autoCloseRate,
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Manual Completions",
      value: mockTaskStats.manualCompletions,
      percentage: Math.round((mockTaskStats.manualCompletions / mockTaskStats.totalTasks) * 100),
      icon: User,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: "Escalations Triggered",
      value: mockTaskStats.escalations,
      percentage: escalationRate,
      icon: AlertTriangle,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10"
    }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Task Funnel Stats</CardTitle>
          <Badge variant="outline" className="text-xs">
            This Month
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Total Tasks: {mockTaskStats.totalTasks}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${item.bgColor}`}>
                    <Icon className={`h-3 w-3 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{item.value}</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion Rate</span>
            <span className={`font-bold ${completionRate >= 85 ? 'text-status-success' : completionRate >= 70 ? 'text-status-warning' : 'text-status-error'}`}>
              {completionRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};