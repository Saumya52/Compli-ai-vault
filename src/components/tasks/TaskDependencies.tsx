import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Link, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TaskDependency {
  id: string;
  taskId: string;
  taskTitle: string;
  type: "blocks" | "blocked_by" | "related";
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignee: string;
  dueDate: Date;
  priority: "low" | "medium" | "high" | "critical";
}

interface TaskDependenciesProps {
  taskId: string;
  dependencies: string[];
}

export const TaskDependencies = ({ taskId, dependencies }: TaskDependenciesProps) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [dependencyType, setDependencyType] = useState("blocks");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock dependency data
  const [taskDependencies] = useState<TaskDependency[]>([
    {
      id: "1",
      taskId: "task-001",
      taskTitle: "Collect Financial Documents from Client",
      type: "blocked_by",
      status: "in_progress",
      assignee: "Jane Smith",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: "high"
    },
    {
      id: "2", 
      taskId: "task-002",
      taskTitle: "Review Previous Year Tax Returns",
      type: "blocked_by",
      status: "completed",
      assignee: "Mike Johnson",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      priority: "medium"
    },
    {
      id: "3",
      taskId: "task-003", 
      taskTitle: "Generate Tax Liability Report",
      type: "blocks",
      status: "pending",
      assignee: "Sarah Wilson",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      priority: "low"
    }
  ]);

  // Mock available tasks for dependency selection
  const availableTasks = [
    { id: "task-004", title: "Update Client Information", assignee: "John Doe" },
    { id: "task-005", title: "Prepare Audit Documentation", assignee: "Alice Brown" },
    { id: "task-006", title: "File Quarterly Returns", assignee: "Bob Wilson" },
    { id: "task-007", title: "Schedule Client Meeting", assignee: "Carol Davis" },
    { id: "task-008", title: "Validate Supporting Documents", assignee: "Dave Miller" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blocks": return <ArrowRight className="w-4 h-4 text-orange-600" />;
      case "blocked_by": return <Clock className="w-4 h-4 text-red-600" />;
      default: return <Link className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "blocks": return "Blocks";
      case "blocked_by": return "Blocked by";
      default: return "Related to";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const handleAddDependency = () => {
    if (!selectedTaskId) {
      toast({
        title: "Error",
        description: "Please select a task to create dependency",
        variant: "destructive"
      });
      return;
    }

    const selectedTask = availableTasks.find(task => task.id === selectedTaskId);
    if (!selectedTask) return;

    toast({
      title: "Dependency Added",
      description: `Dependency created with "${selectedTask.title}"`,
    });

    setShowAddDialog(false);
    setSelectedTaskId("");
    setDependencyType("blocks");
  };

  const handleRemoveDependency = (dependencyId: string) => {
    toast({
      title: "Dependency Removed",
      description: "Task dependency has been removed",
    });
  };

  const filteredTasks = availableTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blockedByTasks = taskDependencies.filter(dep => dep.type === "blocked_by");
  const blockingTasks = taskDependencies.filter(dep => dep.type === "blocks");
  const relatedTasks = taskDependencies.filter(dep => dep.type === "related");

  const hasBlockingIssues = blockedByTasks.some(dep => 
    dep.status === "overdue" || 
    (dep.status === "pending" && dep.dueDate < new Date())
  );

  return (
    <div className="space-y-4">
      {/* Dependency Status Summary */}
      {hasBlockingIssues && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                This task is blocked by overdue dependencies
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocked By Section */}
      {blockedByTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <h4 className="font-medium text-sm">Blocked By ({blockedByTasks.length})</h4>
          </div>
          
          <div className="space-y-2">
            {blockedByTasks.map((dependency) => (
              <Card key={dependency.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dependency.status)}
                      <span className="font-medium text-sm">{dependency.taskTitle}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(dependency.status)} variant="secondary">
                        {dependency.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(dependency.priority)} variant="outline">
                        {dependency.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Assigned to {dependency.assignee}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {dependency.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDependency(dependency.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Blocks Section */}
      {blockingTasks.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-orange-600" />
            <h4 className="font-medium text-sm">Blocks ({blockingTasks.length})</h4>
          </div>
          
          <div className="space-y-2">
            {blockingTasks.map((dependency) => (
              <Card key={dependency.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dependency.status)}
                      <span className="font-medium text-sm">{dependency.taskTitle}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(dependency.status)} variant="secondary">
                        {dependency.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(dependency.priority)} variant="outline">
                        {dependency.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Assigned to {dependency.assignee}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {dependency.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDependency(dependency.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Related Tasks Section */}
      {relatedTasks.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-sm">Related Tasks ({relatedTasks.length})</h4>
          </div>
          
          <div className="space-y-2">
            {relatedTasks.map((dependency) => (
              <Card key={dependency.id} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dependency.status)}
                      <span className="font-medium text-sm">{dependency.taskTitle}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(dependency.status)} variant="secondary">
                        {dependency.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(dependency.priority)} variant="outline">
                        {dependency.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Assigned to {dependency.assignee}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDependency(dependency.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Dependency Button */}
      <Separator />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAddDialog(true)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task Dependency
      </Button>

      {/* Add Dependency Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Task Dependency</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dependency Type</Label>
              <Select value={dependencyType} onValueChange={setDependencyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocked_by">This task is blocked by</SelectItem>
                  <SelectItem value="blocks">This task blocks</SelectItem>
                  <SelectItem value="related">This task is related to</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Task</Label>
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedTaskId === task.id 
                        ? "bg-primary/10 border border-primary" 
                        : "bg-muted hover:bg-accent"
                    }`}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Assigned to {task.assignee}
                        </div>
                      </div>
                      {selectedTaskId === task.id && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <span className="text-sm">No tasks found</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDependency} disabled={!selectedTaskId}>
                Add Dependency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};