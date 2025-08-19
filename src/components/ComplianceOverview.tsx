import { AlertTriangle, CheckCircle, Clock, FileCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ComplianceOverview = () => {
  const stats = [
    {
      title: "Total Compliances",
      value: "47",
      change: "+3 this month",
      icon: FileCheck,
      color: "text-primary"
    },
    {
      title: "Due This Week",
      value: "8",
      change: "2 urgent",
      icon: Clock,
      color: "text-status-warning"
    },
    {
      title: "Completed",
      value: "39",
      change: "83% completion rate",
      icon: CheckCircle,
      color: "text-status-completed"
    },
    {
      title: "Overdue",
      value: "2",
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-status-overdue"
    }
  ];

  const upcomingTasks = [
    {
      title: "GST Return Filing",
      dueDate: "Jul 20, 2024",
      status: "due-soon",
      assignee: "Tax Team",
      priority: "high"
    },
    {
      title: "TDS Return Quarterly",
      dueDate: "Jul 31, 2024",
      status: "in-progress",
      assignee: "Finance Team",
      priority: "medium"
    },
    {
      title: "PF Monthly Return",
      dueDate: "Aug 15, 2024",
      status: "pending",
      assignee: "HR Team",
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'due-soon': return 'bg-status-warning';
      case 'in-progress': return 'bg-status-progress';
      case 'pending': return 'bg-status-pending';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-status-overdue';
      case 'medium': return 'border-l-status-warning';
      case 'low': return 'border-l-status-completed';
      default: return 'border-l-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Health Score */}
        <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Compliance Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="font-medium text-foreground">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tax Compliances</span>
                <Badge variant="secondary" className="bg-status-completed/10 text-status-completed">92%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Labor Laws</span>
                <Badge variant="secondary" className="bg-status-warning/10 text-status-warning">78%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Corporate</span>
                <Badge variant="secondary" className="bg-status-progress/10 text-status-progress">85%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-2 bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Upcoming Deadlines</span>
              </span>
              <Badge variant="outline" className="text-muted-foreground">
                Next 30 days
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div 
                key={index} 
                className={`p-4 border-l-4 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors cursor-pointer ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(task.status)} text-white text-xs`}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceOverview;