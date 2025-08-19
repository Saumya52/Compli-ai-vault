import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { TaskFilters } from "./tasks/TaskFilters";
import { TaskCard, type EnhancedTask } from "./tasks/TaskCard";
import { BulkActions } from "./tasks/BulkActions";
import CreateTaskDialog from "./CreateTaskDialog";

interface TaskListViewProps {
  tasks: any[];
  onTaskCreate: (task: any) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskCreate }) => {
  const { toast } = useToast();
  
  // Enhanced state management
  const [filters, setFilters] = useState({
    bucket: "All Buckets",
    frequency: "All Frequencies",
    entity: "All Entities",
    status: "All Status",
    assignee: "All Assignees",
    tags: [] as string[],
    dueDateFrom: null as Date | null,
    dueDateTo: null as Date | null,
    search: ""
  });
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock enhanced tasks data
  const enhancedTasks: EnhancedTask[] = [
    {
      id: "1",
      title: "File Annual Return - Company ABC",
      description: "Submit annual return for Company ABC to MCA portal with all required documents and compliance certificates",
      status: "open",
      priority: "high",
      assignee: "john.doe",
      assigneeName: "John Doe",
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      bucket: "ROC",
      frequency: "Yearly",
      entity: "ABC Pvt Ltd",
      tags: ["Urgent", "High Priority"],
      dependencies: ["task-001", "task-002"],
      hasDocumentsPending: true,
      hasValidationIssues: false,
      estimatedHours: 8,
      completedHours: 3,
      lastUpdated: new Date(),
      aiSuggestions: ["Similar tasks completed in Q3 had 2-day average turnaround", "Consider uploading board resolution first"]
    },
    {
      id: "2",
      title: "GST Return Filing - Q4",
      description: "File quarterly GST return for Q4 2024 including input tax credit reconciliation",
      status: "in_progress",
      priority: "medium",
      assignee: "jane.smith",
      assigneeName: "Jane Smith", 
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      bucket: "GST",
      frequency: "Quarterly",
      entity: "XYZ Corp",
      tags: ["Repeat Filing"],
      dependencies: [],
      hasDocumentsPending: false,
      hasValidationIssues: true,
      estimatedHours: 4,
      completedHours: 2,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiSuggestions: ["Invoice validation failed - missing digital signatures", "Previous quarter had similar issues with vendor invoices"]
    }
  ];

  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    return enhancedTasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.assigneeName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.bucket !== "All Buckets" && task.bucket !== filters.bucket) return false;
      if (filters.entity !== "All Entities" && task.entity !== filters.entity) return false;
      if (filters.status !== "All Status" && task.status !== filters.status.toLowerCase().replace(' ', '_')) return false;
      if (filters.assignee !== "All Assignees" && task.assigneeName !== filters.assignee) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags.includes(tag))) return false;
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  // Bulk action handlers
  const handleSelectAll = (selected: boolean) => {
    setSelectedTasks(selected ? filteredTasks.map(task => task.id) : []);
  };

  const handleSelectionChange = (taskId: string, selected: boolean) => {
    setSelectedTasks(prev => 
      selected ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const handleBulkReassign = (taskIds: string[], assignee: string) => {
    toast({ title: "Success", description: `${taskIds.length} tasks reassigned to ${assignee}` });
  };

  const handleBulkMarkComplete = (taskIds: string[]) => {
    toast({ title: "Success", description: `${taskIds.length} tasks marked as completed` });
  };

  const handleBulkSetAlerts = (taskIds: string[], alertType: string) => {
    toast({ title: "Success", description: `Alerts set for ${taskIds.length} tasks` });
  };

  const handleBulkDownloadSummary = (taskIds: string[]) => {
    toast({ title: "Success", description: `Downloading summary for ${taskIds.length} tasks` });
  };

  // Task action handlers
  const handleStatusUpdate = (taskId: string, status: string) => {
    toast({ title: "Status Updated", description: `Task status updated to ${status}` });
  };

  const handleReassign = (taskId: string, assignee: string) => {
    toast({ title: "Task Reassigned", description: `Task assigned to ${assignee}` });
  };

  const handlePriorityChange = (taskId: string, priority: string) => {
    toast({ title: "Priority Updated", description: `Task priority set to ${priority}` });
  };

  const handleCreateTicket = (taskId: string) => {
    toast({ title: "Ticket Created", description: "Compliance ticket generated successfully" });
  };

  const handleAddComment = (taskId: string, comment: string) => {
    toast({ title: "Comment Added", description: "Your comment has been posted" });
  };

  const handleTagUpdate = (taskId: string, tags: string[]) => {
    toast({ title: "Tags Updated", description: "Task tags have been updated" });
  };

  // CSV functionality
  const handleDownloadTemplate = () => {
    const csvHeaders = [
      "Title",
      "Description", 
      "Priority",
      "Assignee",
      "Due Date",
      "Bucket",
      "Frequency",
      "Entity",
      "Tags",
      "Estimated Hours"
    ];
    
    const csvContent = csvHeaders.join(",") + "\n" +
      "Sample Task,Sample task description,high,john.doe,2024-12-31,ROC,Monthly,ABC Pvt Ltd,Urgent;High Priority,8";
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "task_upload_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Template Downloaded", description: "CSV template downloaded successfully" });
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          const values = line.split(",").map(v => v.trim());
          const task = {
            title: values[0],
            description: values[1],
            priority: values[2],
            assignee: values[3],
            dueDate: values[4],
            bucket: values[5],
            frequency: values[6],
            entity: values[7],
            tags: values[8]?.split(";") || [],
            estimatedHours: parseInt(values[9]) || 0
          };
          
          if (task.title && task.description) {
            onTaskCreate(task);
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }
      
      toast({ 
        title: "CSV Upload Complete", 
        description: `${successCount} tasks created, ${errorCount} errors` 
      });
    };
    
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Tasks</h2>
          <p className="text-muted-foreground">Manage compliance tasks with advanced features</p>
        </div>
        
        <div className="flex gap-2">
          <CreateTaskDialog onTaskCreate={onTaskCreate}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CreateTaskDialog>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
          
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleDownloadTemplate}
          >
            <FileText className="w-4 h-4 mr-2" />
            CSV Template
          </Button>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({
          bucket: "All Buckets",
          frequency: "All Frequencies", 
          entity: "All Entities",
          status: "All Status",
          assignee: "All Assignees",
          tags: [],
          dueDateFrom: null,
          dueDateTo: null,
          search: ""
        })}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedTasks={selectedTasks}
        totalTasks={filteredTasks.length}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedTasks([])}
        onBulkReassign={handleBulkReassign}
        onBulkMarkComplete={handleBulkMarkComplete}
        onBulkSetAlerts={handleBulkSetAlerts}
        onBulkDownloadSummary={handleBulkDownloadSummary}
      />

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusUpdate={handleStatusUpdate}
            onReassign={handleReassign}
            onPriorityChange={handlePriorityChange}
            onCreateTicket={handleCreateTicket}
            onAddComment={handleAddComment}
            onTagUpdate={handleTagUpdate}
            isSelected={selectedTasks.includes(task.id)}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No tasks found matching your filters</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
};