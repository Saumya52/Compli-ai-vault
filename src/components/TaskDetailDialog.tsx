import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  User, 
  Building, 
  Calendar, 
  Clock, 
  Tag, 
  MessageSquare,
  Upload,
  History,
  Edit,
  CheckCircle,
  AlertTriangle,
  Link
} from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  complianceBucket?: string;
  bucket?: string;
  entity: string;
  assignedTo?: string;
  assignedToName?: string;
  assignee?: string;
  status: string;
  priority: string;
  tags?: string[];
  frequency?: string;
  estimatedHours?: number;
  completedHours?: number;
  createdDate?: Date;
  lastUpdated?: Date;
}

interface TaskDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  isOpen,
  onClose,
  task
}) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!task) return null;

  const getBucketColor = (bucket: string) => {
    const colors = {
      "GST": "bg-blue-500 text-white",
      "Income Tax": "bg-green-500 text-white",
      "TDS": "bg-purple-500 text-white",
      "PF": "bg-orange-500 text-white",
      "ESI": "bg-pink-500 text-white",
      "ROC": "bg-indigo-500 text-white",
      "Labor Law": "bg-red-500 text-white",
      "Labour": "bg-red-500 text-white"
    };
    return colors[bucket as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Header */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  {getStatusIcon(task.status)}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getBucketColor(task.complianceBucket || task.bucket || 'General')} text-xs`}>
                    {task.complianceBucket || task.bucket || 'General'}
                  </Badge>
                  <Badge className={`${getStatusColor(task.status)} text-xs`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                    {task.priority}
                  </Badge>
                  {task.tags && task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="font-medium">
                      {task.assignedToName || task.assignee || task.assignedTo || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Entity:</span>
                    <span className="font-medium">{task.entity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{format(task.dueDate, "MMM dd, yyyy")}</span>
                  </div>
                  {task.frequency && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{task.frequency}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Task ID</label>
                      <p className="text-sm font-mono">{task.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                      <p className="text-sm">{task.priority}</p>
                    </div>
                    {task.createdDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                        <p className="text-sm">{format(task.createdDate, "MMM dd, yyyy HH:mm")}</p>
                      </div>
                    )}
                    {task.lastUpdated && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                        <p className="text-sm">{format(task.lastUpdated, "MMM dd, yyyy HH:mm")}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Description</label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{task.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {task.estimatedHours && task.completedHours !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Progress</label>
                        <span className="text-sm text-muted-foreground">
                          {task.completedHours}h / {task.estimatedHours}h
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (task.completedHours / task.estimatedHours) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {task.estimatedHours || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Estimated Hours</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {task.completedHours || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed Hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Task Created</p>
                        <p className="text-xs text-muted-foreground">
                          {task.createdDate ? format(task.createdDate, "MMM dd, yyyy HH:mm") : "Unknown"}
                        </p>
                      </div>
                    </div>
                    {task.lastUpdated && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-xs text-muted-foreground">
                            {format(task.lastUpdated, "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};