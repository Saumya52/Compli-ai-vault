import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, Mail, Calendar, Users, Settings, 
  Play, Pause, Edit, Trash2, Plus 
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  time: string;
  recipients: string[];
  format: string;
  isActive: boolean;
  nextRun: Date;
  lastRun?: Date;
  description: string;
}

interface ReportSchedulerProps {
  onScheduleReport: (schedule: Omit<ScheduledReport, 'id' | 'nextRun' | 'lastRun'>) => void;
}

const mockSchedules: ScheduledReport[] = [
  {
    id: "1",
    name: "Weekly Compliance Summary",
    reportType: "compliance-summary",
    frequency: "weekly",
    time: "09:00",
    recipients: ["cfo@company.com", "manager@company.com"],
    format: "pdf",
    isActive: true,
    nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: "Weekly summary of all compliance activities for executive review"
  },
  {
    id: "2",
    name: "Monthly Overdue Report",
    reportType: "overdue-tasks",
    frequency: "monthly",
    time: "08:30",
    recipients: ["compliance@company.com", "admin@company.com"],
    format: "excel",
    isActive: true,
    nextRun: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    description: "Monthly report of overdue tasks for compliance team"
  },
  {
    id: "3",
    name: "Quarterly Board Pack",
    reportType: "entity-compliance",
    frequency: "quarterly",
    time: "10:00",
    recipients: ["board@company.com", "secretary@company.com"],
    format: "zip",
    isActive: false,
    nextRun: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    description: "Comprehensive quarterly compliance report for board meetings"
  }
];

const reportTypes = [
  { value: "compliance-summary", label: "Compliance Summary" },
  { value: "overdue-tasks", label: "Overdue Tasks" },
  { value: "filing-status-bucket", label: "Filing Status by Bucket" },
  { value: "user-activity", label: "User Activity Log" },
  { value: "auto-closed-tickets", label: "Auto-Closed Tickets" },
  { value: "document-validation", label: "Document Validation Status" },
  { value: "entity-compliance", label: "Entity-wise Compliance" }
];

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly (Monday)" },
  { value: "monthly", label: "Monthly (1st)" },
  { value: "quarterly", label: "Quarterly" }
];

const formats = [
  { value: "pdf", label: "PDF Report" },
  { value: "excel", label: "Excel Spreadsheet" },
  { value: "csv", label: "CSV Data" },
  { value: "zip", label: "ZIP with Documents" }
];

export const ReportScheduler: React.FC<ReportSchedulerProps> = ({ onScheduleReport }) => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduledReport[]>(mockSchedules);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    reportType: "",
    frequency: "weekly" as const,
    time: "09:00",
    recipients: "",
    format: "pdf",
    description: ""
  });

  const handleCreateSchedule = () => {
    if (!newSchedule.name || !newSchedule.reportType || !newSchedule.recipients) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const recipientList = newSchedule.recipients
      .split(',')
      .map(email => email.trim())
      .filter(email => email.includes('@'));

    if (recipientList.length === 0) {
      toast({
        title: "Invalid Recipients",
        description: "Please enter valid email addresses",
        variant: "destructive"
      });
      return;
    }

    const schedule: ScheduledReport = {
      id: Date.now().toString(),
      name: newSchedule.name,
      reportType: newSchedule.reportType,
      frequency: newSchedule.frequency,
      time: newSchedule.time,
      recipients: recipientList,
      format: newSchedule.format,
      isActive: true,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      description: newSchedule.description
    };

    setSchedules(prev => [schedule, ...prev]);
    onScheduleReport({
      name: schedule.name,
      reportType: schedule.reportType,
      frequency: schedule.frequency,
      time: schedule.time,
      recipients: schedule.recipients,
      format: schedule.format,
      isActive: schedule.isActive,
      description: schedule.description
    });

    setNewSchedule({
      name: "",
      reportType: "",
      frequency: "weekly",
      time: "09:00",
      recipients: "",
      format: "pdf",
      description: ""
    });
    setIsCreating(false);

    toast({
      title: "Schedule Created",
      description: `Report "${schedule.name}" has been scheduled`,
    });
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, isActive: !schedule.isActive }
          : schedule
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "Scheduled report has been removed",
    });
  };

  const handleRunNow = (schedule: ScheduledReport) => {
    setSchedules(prev => 
      prev.map(s => 
        s.id === schedule.id 
          ? { ...s, lastRun: new Date() }
          : s
      )
    );
    
    toast({
      title: "Report Triggered",
      description: `"${schedule.name}" is being generated and sent`,
    });
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: "bg-blue-100 text-blue-800",
      weekly: "bg-green-100 text-green-800",
      monthly: "bg-orange-100 text-orange-800",
      quarterly: "bg-purple-100 text-purple-800"
    };
    return colors[frequency as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Report Scheduler
          </h3>
          <p className="text-sm text-muted-foreground">
            Automate recurring MIS reports with email delivery
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Report
        </Button>
      </div>

      {/* Create New Schedule */}
      {isCreating && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Create New Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduleName">Schedule Name *</Label>
                <Input
                  id="scheduleName"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekly Compliance Summary"
                />
              </div>
              
              <div>
                <Label htmlFor="reportType">Report Type *</Label>
                <Select 
                  value={newSchedule.reportType} 
                  onValueChange={(value) => setNewSchedule(prev => ({ ...prev, reportType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newSchedule.frequency} 
                  onValueChange={(value: any) => setNewSchedule(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="format">Output Format</Label>
                <Select 
                  value={newSchedule.format} 
                  onValueChange={(value) => setNewSchedule(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="recipients">Email Recipients *</Label>
              <Textarea
                id="recipients"
                value={newSchedule.recipients}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, recipients: e.target.value }))}
                placeholder="Enter email addresses separated by commas"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this scheduled report"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateSchedule}>
                <Calendar className="w-4 h-4 mr-2" />
                Create Schedule
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Schedules */}
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className={!schedule.isActive ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{schedule.name}</h4>
                    <Badge className={getFrequencyBadge(schedule.frequency)}>
                      {schedule.frequency}
                    </Badge>
                    <Badge variant="outline">
                      {formats.find(f => f.value === schedule.format)?.label}
                    </Badge>
                    {!schedule.isActive && (
                      <Badge variant="secondary">Paused</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{schedule.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Runs at {schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Next: {format(schedule.nextRun, 'MMM dd, yyyy')}</span>
                      </div>
                      {schedule.lastRun && (
                        <div className="flex items-center gap-1">
                          <span>Last: {format(schedule.lastRun, 'MMM dd')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{schedule.recipients.length} recipients</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule.isActive}
                      onCheckedChange={() => handleToggleSchedule(schedule.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {schedule.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRunNow(schedule)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run Now
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingId(schedule.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schedules.length === 0 && !isCreating && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No scheduled reports</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first automated report schedule
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Your First Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
