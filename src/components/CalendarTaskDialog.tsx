import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  User, 
  Building, 
  Clock, 
  FileText, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Tag
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
}

interface CalendarTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

export const CalendarTaskDialog: React.FC<CalendarTaskDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  onViewTask
}) => {
  if (!selectedDate) return null;

  // Filter tasks for the selected date
  const tasksForDate = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Tasks for {format(selectedDate, "EEEE, MMMM dd, yyyy")}
          </DialogTitle>
        </DialogHeader>

        {/* Task Count Summary */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {tasksForDate.length} {tasksForDate.length === 1 ? 'task' : 'tasks'} scheduled
            </span>
          </div>
          {tasksForDate.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {tasksForDate.filter(t => t.status.toLowerCase() === 'completed').length} completed
              </Badge>
              <Badge variant="outline" className="text-xs">
                {tasksForDate.filter(t => t.status.toLowerCase() === 'pending' || t.status.toLowerCase() === 'open').length} pending
              </Badge>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <ScrollArea className="h-96">
          {tasksForDate.length > 0 ? (
            <div className="space-y-3">
              {tasksForDate.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Task Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sm">{task.title}</h4>
                            {getStatusIcon(task.status)}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewTask(task)}
                          className="ml-2"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>

                      {/* Task Badges */}
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

                      {/* Task Details */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{task.assignedToName || task.assignee || task.assignedTo || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{task.entity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(task.dueDate, "HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* No Tasks Message */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No tasks scheduled
              </h3>
              <p className="text-sm text-muted-foreground">
                There are no tasks scheduled for {format(selectedDate, "MMMM dd, yyyy")}
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {tasksForDate.length > 0 && (
              <span>
                {tasksForDate.filter(t => t.status.toLowerCase() === 'completed').length} of {tasksForDate.length} completed
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {tasksForDate.length > 0 && (
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Day Summary
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};