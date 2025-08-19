import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  User, 
  Calendar, 
  AlertCircle, 
  FileText, 
  MessageSquare, 
  Upload, 
  History,
  Edit,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  Link,
  Brain,
  Tag,
  Building
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { TaskComments } from "./TaskComments";
import { TaskDocuments } from "./TaskDocuments";
import { TaskDependencies } from "./TaskDependencies";

export interface EnhancedTask {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "escalated" | "completed" | "overdue" | "on_hold";
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  assigneeName: string;
  dueDate: Date;
  createdDate: Date;
  bucket: string;
  frequency: string;
  entity: string;
  tags: string[];
  dependencies: string[];
  hasDocumentsPending: boolean;
  hasValidationIssues: boolean;
  estimatedHours?: number;
  completedHours?: number;
  lastUpdated: Date;
  aiSuggestions: string[];
}

interface TaskCardProps {
  task: EnhancedTask;
  onStatusUpdate: (taskId: string, status: string) => void;
  onReassign: (taskId: string, assignee: string) => void;
  onPriorityChange: (taskId: string, priority: string) => void;
  onCreateTicket: (taskId: string) => void;
  onAddComment: (taskId: string, comment: string) => void;
  onTagUpdate: (taskId: string, tags: string[]) => void;
  isSelected?: boolean;
  onSelectionChange?: (taskId: string, selected: boolean) => void;
}

export const TaskCard = ({ 
  task, 
  onStatusUpdate,
  onReassign,
  onPriorityChange,
  onCreateTicket,
  onAddComment,
  onTagUpdate,
  isSelected,
  onSelectionChange
}: TaskCardProps) => {
  const { toast } = useToast();
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "escalated": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "on_hold": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getBucketColor = (bucket: string) => {
    const colors = {
      "GST": "bg-blue-500",
      "Income Tax": "bg-green-500",
      "TDS": "bg-purple-500",
      "PF": "bg-orange-500",
      "ESI": "bg-pink-500",
      "ROC": "bg-indigo-500",
      "Labor Law": "bg-red-500"
    };
    return colors[bucket as keyof typeof colors] || "bg-gray-500";
  };

  const isTicketEligible = () => {
    const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  };

  const handleQuickStatusUpdate = (newStatus: string) => {
    onStatusUpdate(task.id, newStatus);
    toast({
      title: "Status Updated",
      description: `Task status updated to ${newStatus.replace('_', ' ')}`,
    });
  };

  const handleQuickReassign = (newAssignee: string) => {
    onReassign(task.id, newAssignee);
    setIsReassignDialogOpen(false);
    toast({
      title: "Task Reassigned",
      description: `Task assigned to ${newAssignee}`,
    });
  };

  const handleQuickPriorityChange = (newPriority: string) => {
    onPriorityChange(task.id, newPriority);
    toast({
      title: "Priority Updated",
      description: `Task priority set to ${newPriority}`,
    });
  };

  const handleCreateTicket = () => {
    onCreateTicket(task.id);
    toast({
      title: "Ticket Created",
      description: "Compliance ticket has been generated",
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(task.id, newComment);
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });
    }
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className={`
      transition-all duration-200 hover:shadow-md 
      ${isSelected ? "ring-2 ring-primary bg-accent/5" : ""}
      ${task.hasValidationIssues ? "border-l-4 border-l-red-500" : ""}
      ${task.hasDocumentsPending ? "border-l-4 border-l-orange-500" : ""}
    `}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Selection Checkbox */}
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={isSelected || false}
                  onChange={(e) => onSelectionChange(task.id, e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
              )}
              
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    {task.hasValidationIssues && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {task.hasDocumentsPending && (
                      <Upload className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                
                <p className="text-muted-foreground text-sm mb-3">
                  {showFullDescription ? task.description : truncateDescription(task.description)}
                  {task.description.length > 100 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-primary ml-1 hover:underline"
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>
                
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={`${getBucketColor(task.bucket)} text-white text-xs`}>
                    {task.bucket}
                  </Badge>
                  <Badge className={`${getStatusColor(task.status)} text-xs`}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                    {task.priority}
                  </Badge>
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Task Details Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{task.assigneeName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{task.entity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(task.dueDate, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.frequency}</span>
                  </div>
                  {task.dependencies.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Link className="w-4 h-4" />
                      <span>{task.dependencies.length} dependencies</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Status Update */}
              <Select onValueChange={handleQuickStatusUpdate} value={task.status}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Quick Priority Change */}
              <Select onValueChange={handleQuickPriorityChange} value={task.priority}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Reassign Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReassignDialogOpen(true)}
                className="h-8 text-xs"
              >
                <User className="w-3 h-3 mr-1" />
                Reassign
              </Button>
              
              {/* Create Ticket Button */}
              {isTicketEligible() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateTicket}
                  className="h-8 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ticket
                </Button>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {task.aiSuggestions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Suggestions</span>
              </div>
              <div className="space-y-1">
                {task.aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Sections */}
          <Accordion type="multiple" className="w-full">
            {/* Comments Section */}
            <AccordionItem value="comments">
              <AccordionTrigger className="text-sm py-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments & Collaboration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TaskComments taskId={task.id} onAddComment={onAddComment} />
              </AccordionContent>
            </AccordionItem>
            
            {/* Documents Section */}
            <AccordionItem value="documents">
              <AccordionTrigger className="text-sm py-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents & History
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TaskDocuments taskId={task.id} />
              </AccordionContent>
            </AccordionItem>
            
            {/* Dependencies Section */}
            {task.dependencies.length > 0 && (
              <AccordionItem value="dependencies">
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Dependencies
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <TaskDependencies taskId={task.id} dependencies={task.dependencies} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </CardContent>

      {/* Reassign Dialog */}
      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Assignee: {task.assigneeName}</label>
            </div>
            <Select onValueChange={handleQuickReassign}>
              <SelectTrigger>
                <SelectValue placeholder="Select new assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                <SelectItem value="Alex Brown">Alex Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};