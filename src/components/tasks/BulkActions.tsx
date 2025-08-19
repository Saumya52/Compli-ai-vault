import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  CheckCircle, 
  Bell, 
  Download, 
  User,
  FileText,
  Calendar,
  Mail,
  AlertTriangle,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BulkActionsProps {
  selectedTasks: string[];
  totalTasks: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  onBulkReassign: (taskIds: string[], assignee: string) => void;
  onBulkMarkComplete: (taskIds: string[]) => void;
  onBulkSetAlerts: (taskIds: string[], alertType: string) => void;
  onBulkDownloadSummary: (taskIds: string[]) => void;
  className?: string;
}

export const BulkActions = ({
  selectedTasks,
  totalTasks,
  onSelectAll,
  onClearSelection,
  onBulkReassign,
  onBulkMarkComplete,
  onBulkSetAlerts,
  onBulkDownloadSummary,
  className
}: BulkActionsProps) => {
  const { toast } = useToast();
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");
  const [alertType, setAlertType] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  const assignees = [
    "John Doe",
    "Jane Smith", 
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Brown"
  ];

  const alertTypes = [
    { value: "due_soon", label: "Due Soon (24 hrs before)" },
    { value: "overdue", label: "Overdue Alert" },
    { value: "escalation", label: "Escalation Alert" },
    { value: "status_change", label: "Status Change Alert" },
    { value: "assignment", label: "Assignment Alert" }
  ];

  const handleBulkReassign = () => {
    if (!newAssignee) {
      toast({
        title: "Error",
        description: "Please select an assignee",
        variant: "destructive"
      });
      return;
    }

    onBulkReassign(selectedTasks, newAssignee);
    setShowReassignDialog(false);
    setNewAssignee("");
    
    toast({
      title: "Tasks Reassigned",
      description: `${selectedTasks.length} tasks assigned to ${newAssignee}`,
    });
  };

  const handleBulkMarkComplete = () => {
    onBulkMarkComplete(selectedTasks);
    
    toast({
      title: "Tasks Completed",
      description: `${selectedTasks.length} tasks marked as completed`,
    });
  };

  const handleBulkSetAlerts = () => {
    if (!alertType) {
      toast({
        title: "Error",
        description: "Please select an alert type",
        variant: "destructive"
      });
      return;
    }

    onBulkSetAlerts(selectedTasks, alertType);
    setShowAlertsDialog(false);
    setAlertType("");
    
    toast({
      title: "Alerts Set",
      description: `Alerts configured for ${selectedTasks.length} tasks`,
    });
  };

  const handleBulkDownloadSummary = () => {
    onBulkDownloadSummary(selectedTasks);
    setShowDownloadDialog(false);
    
    toast({
      title: "Download Started",
      description: `Downloading summary for ${selectedTasks.length} tasks`,
    });
  };

  const isAllSelected = selectedTasks.length === totalTasks && totalTasks > 0;
  const isPartiallySelected = selectedTasks.length > 0 && selectedTasks.length < totalTasks;

  if (selectedTasks.length === 0) {
    return null;
  }

  return (
    <>
      <Card className={`border-primary bg-primary/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Selection Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">
                  {selectedTasks.length} of {totalTasks} tasks selected
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-7 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear Selection
              </Button>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReassignDialog(true)}
                className="h-8 text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Reassign
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkComplete}
                className="h-8 text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark Complete
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlertsDialog(true)}
                className="h-8 text-xs"
              >
                <Bell className="w-3 h-3 mr-1" />
                Set Alerts
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDownloadDialog(true)}
                className="h-8 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Reassign Tasks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                You are about to reassign <strong>{selectedTasks.length} tasks</strong> to a new assignee.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select New Assignee</label>
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map(assignee => (
                    <SelectItem key={assignee} value={assignee}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {assignee}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox id="notify" />
              <label htmlFor="notify" className="text-sm">
                Send notification email to new assignee
              </label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkReassign}>
                Reassign Tasks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Set Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Bulk Alerts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                Configure alerts for <strong>{selectedTasks.length} tasks</strong>.
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Alert Type</label>
              {alertTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={alertType === type.value}
                    onCheckedChange={(checked) => {
                      if (checked) setAlertType(type.value);
                    }}
                  />
                  <label htmlFor={type.value} className="text-sm">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Method</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email_alert" defaultChecked />
                  <label htmlFor="email_alert" className="text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email Alert
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dashboard_alert" defaultChecked />
                  <label htmlFor="dashboard_alert" className="text-sm flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    Dashboard Notification
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAlertsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkSetAlerts}>
                Set Alerts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Task Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                Download summary report for <strong>{selectedTasks.length} tasks</strong>.
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Download Format</label>
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PDF Report
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Excel Spreadsheet
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      CSV File
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Include in Report</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include_comments" defaultChecked />
                  <label htmlFor="include_comments" className="text-sm">Task Comments</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include_documents" defaultChecked />
                  <label htmlFor="include_documents" className="text-sm">Document History</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include_timeline" defaultChecked />
                  <label htmlFor="include_timeline" className="text-sm">Status Timeline</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkDownloadSummary}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};