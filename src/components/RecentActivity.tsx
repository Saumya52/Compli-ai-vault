import { Clock, CheckCircle, AlertTriangle, Upload, FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "document_uploaded",
      title: "GST Return documents uploaded",
      description: "Tax team uploaded supporting documents for July GST filing",
      timestamp: "2 hours ago",
      user: "Priya Sharma",
      userInitials: "PS",
      icon: Upload,
      status: "success"
    },
    {
      id: 2,
      type: "task_completed",
      title: "PF Return submitted successfully",
      description: "All validations passed, compliance marked as complete",
      timestamp: "4 hours ago",
      user: "Raj Kumar",
      userInitials: "RK",
      icon: CheckCircle,
      status: "success"
    },
    {
      id: 3,
      type: "reminder_sent",
      title: "TDS Return reminder sent",
      description: "7-day reminder sent to finance team for quarterly filing",
      timestamp: "1 day ago",
      user: "System",
      userInitials: "SY",
      icon: Clock,
      status: "info"
    },
    {
      id: 4,
      type: "validation_failed",
      title: "Document validation failed",
      description: "Income Tax return rejected - missing supporting schedules",
      timestamp: "2 days ago",
      user: "Anita Desai",
      userInitials: "AD",
      icon: AlertTriangle,
      status: "error"
    },
    {
      id: 5,
      type: "calendar_updated",
      title: "Compliance calendar updated",
      description: "Q3 compliance schedule uploaded with 23 new deadlines",
      timestamp: "3 days ago",
      user: "Admin",
      userInitials: "AD",
      icon: FileText,
      status: "info"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-status-completed';
      case 'error': return 'text-status-overdue';
      case 'info': return 'text-status-progress';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-status-completed/10';
      case 'error': return 'bg-status-overdue/10';
      case 'info': return 'bg-status-progress/10';
      default: return 'bg-muted/10';
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className={`p-2 rounded-lg ${getStatusBg(activity.status)}`}>
              <activity.icon className={`w-4 h-4 ${getStatusColor(activity.status)}`} />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {activity.userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{activity.user}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;