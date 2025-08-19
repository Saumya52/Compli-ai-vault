import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Calendar, 
  FileX, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CriticalAlert {
  id: string;
  type: "overdue" | "validation_failed" | "upcoming_deadline" | "system_error" | "compliance_breach";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  entityName: string;
  dueDate?: Date;
  daysOverdue?: number;
  actionButtons: {
    label: string;
    action: string;
    variant?: "default" | "destructive" | "outline";
  }[];
}

interface AlertCenterProps {
  userRole: "admin" | "cfo" | "team_member";
  className?: string;
}

export const AlertCenter = ({ userRole, className }: AlertCenterProps) => {
  const { toast } = useToast();

  // Mock critical alerts based on user role
  const getCriticalAlerts = (): CriticalAlert[] => {
    const baseAlerts: CriticalAlert[] = [
      {
        id: "1",
        type: "overdue",
        title: "GSTR-3B Filing Overdue",
        description: "March 2024 GSTR-3B return is 5 days overdue. Penalty of ₹500/day applies.",
        severity: "critical",
        entityName: "ABC Pvt Ltd",
        dueDate: new Date(Date.now() - 432000000), // 5 days ago
        daysOverdue: 5,
        actionButtons: [
          { label: "File Return", action: "file_return", variant: "default" },
          { label: "View Details", action: "view_details", variant: "outline" }
        ]
      },
      {
        id: "2",
        type: "upcoming_deadline",
        title: "TDS Return Due Tomorrow",
        description: "Quarterly TDS return (24Q4) for XYZ Corp is due within 24 hours.",
        severity: "high",
        entityName: "XYZ Corp",
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        actionButtons: [
          { label: "Prepare Return", action: "prepare_return", variant: "default" },
          { label: "Set Reminder", action: "set_reminder", variant: "outline" }
        ]
      },
      {
        id: "3",
        type: "validation_failed",
        title: "Document Validation Failed",
        description: "PF return uploaded for Tech Solutions Inc contains validation errors.",
        severity: "medium",
        entityName: "Tech Solutions Inc",
        actionButtons: [
          { label: "Fix Validation", action: "fix_validation", variant: "default" },
          { label: "Download Report", action: "download_report", variant: "outline" }
        ]
      }
    ];

    if (userRole === "admin") {
      return [
        ...baseAlerts,
        {
          id: "4",
          type: "system_error",
          title: "Integration Sync Failed",
          description: "Google Drive sync failed for 3 entities. Documents may not be up to date.",
          severity: "high",
          entityName: "System",
          actionButtons: [
            { label: "Retry Sync", action: "retry_sync", variant: "default" },
            { label: "View Logs", action: "view_logs", variant: "outline" }
          ]
        },
        {
          id: "5",
          type: "compliance_breach",
          title: "Multiple Compliance Breaches",
          description: "4 entities have missed statutory deadlines this month. Immediate action required.",
          severity: "critical",
          entityName: "Multiple Entities",
          actionButtons: [
            { label: "View Report", action: "view_report", variant: "destructive" },
            { label: "Create Action Plan", action: "create_plan", variant: "default" }
          ]
        }
      ];
    }

    return baseAlerts.slice(0, userRole === "cfo" ? 3 : 2);
  };

  const alerts = getCriticalAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "overdue": return <Clock className="w-4 h-4" />;
      case "validation_failed": return <FileX className="w-4 h-4" />;
      case "upcoming_deadline": return <Calendar className="w-4 h-4" />;
      case "system_error": return <XCircle className="w-4 h-4" />;
      case "compliance_breach": return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAlertAction = (alert: CriticalAlert, action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action.replace('_', ' ').toUpperCase()} for ${alert.entityName}`,
    });

    // Mock action processing
    setTimeout(() => {
      toast({
        title: "Action Completed",
        description: `Successfully processed ${action} for ${alert.title}`,
      });
    }, 2000);
  };

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const highCount = alerts.filter(a => a.severity === "high").length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Alert Center
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {criticalCount} Critical
              </Badge>
            )}
            {highCount > 0 && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {highCount} High
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={`${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start gap-3">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs opacity-80 mt-1">{alert.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs ml-2">
                        {alert.entityName}
                      </Badge>
                    </div>
                    
                    {/* Due Date Info */}
                    {alert.dueDate && (
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {alert.type === "overdue" ? (
                          <span>
                            Due: {alert.dueDate.toLocaleDateString()} 
                            ({alert.daysOverdue} days overdue)
                          </span>
                        ) : (
                          <span>Due: {alert.dueDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {alert.actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={button.variant || "default"}
                          className="text-xs h-7"
                          onClick={() => handleAlertAction(alert, button.action)}
                        >
                          {button.label}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p className="text-sm font-medium">All Clear!</p>
                <p className="text-xs">No critical alerts at this time.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-3 border-t flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {alerts.length} active alerts
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <ExternalLink className="w-3 h-3 mr-1" />
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};