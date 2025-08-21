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
import { uploadTasksCSV, transformUploadedTask, transformUploadedTaskForAPI, createTask, reassignTask, type TaskUploadData } from "@/utils/api";
import { TaskUploadProgress } from "./TaskUploadProgress";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [showUploadResult, setShowUploadResult] = useState(false);

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

  const handleBulkReassign = async (taskIds: string[], assignee: string) => {
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const taskId of taskIds) {
        const result = await reassignTask(taskId, { assignedTo: assignee });
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast({ 
          title: "Bulk Reassignment Complete", 
          description: `${successCount} tasks reassigned to ${assignee}${errorCount > 0 ? `, ${errorCount} failed` : ''}` 
        });
      } else {
        toast({ 
          title: "Reassignment Failed", 
          description: "Failed to reassign tasks",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Bulk Reassignment Error", 
        description: "An error occurred during bulk reassignment",
        variant: "destructive"
      });
    }
  };

  const handleBulkMarkComplete = (taskIds: string[]) => {
    // TODO: Call API to bulk update task status to completed
    toast({ title: "Success", description: `${taskIds.length} tasks marked as completed` });
  };

  const handleBulkSetAlerts = (taskIds: string[], alertType: string) => {
    // TODO: Call API to set alerts for multiple tasks
    toast({ title: "Success", description: `Alerts set for ${taskIds.length} tasks` });
  };

  const handleBulkDownloadSummary = (taskIds: string[]) => {
    // TODO: Generate and download summary report for selected tasks
    toast({ title: "Success", description: `Downloading summary for ${taskIds.length} tasks` });
  };

  // Task action handlers
  const handleStatusUpdate = (taskId: string, status: string) => {
    // TODO: Call API to update task status
    toast({ title: "Status Updated", description: `Task status updated to ${status}` });
  };

  const handleReassign = async (taskId: string, assignee: string) => {
    try {
      const result = await reassignTask(taskId, { assignedTo: assignee });
      if (result.success) {
        toast({ title: "Task Reassigned", description: `Task assigned to ${assignee}` });
      } else {
        toast({ 
          title: "Reassignment Failed", 
          description: result.error || "Failed to reassign task",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ 
        title: "Reassignment Error", 
        description: "An error occurred while reassigning the task",
        variant: "destructive"
      });
    }
  };

  const handlePriorityChange = (taskId: string, priority: string) => {
    // TODO: Call API to update task priority
    toast({ title: "Priority Updated", description: `Task priority set to ${priority}` });
  };

  const handleCreateTicket = (taskId: string) => {
    // TODO: Call API to create compliance ticket
    toast({ title: "Ticket Created", description: "Compliance ticket generated successfully" });
  };

  const handleAddComment = (taskId: string, comment: string) => {
    // TODO: Call API to add comment to task
    toast({ title: "Comment Added", description: "Your comment has been posted" });
  };

  const handleTagUpdate = (taskId: string, tags: string[]) => {
    // TODO: Call API to update task tags
    toast({ title: "Tags Updated", description: "Task tags have been updated" });
  };

  // CSV functionality
  const handleDownloadTemplate = () => {
    const csvHeaders = [
      "status",
      "name",
      "description", 
      "priority",
      "assignedTo",
      "entity",
      "bucket",
      "dueDate",
      "recurringFrequency",
      "tags",
      "estimatedHours",
      "closureRightsEmail"
    ];
    
    const csvContent = csvHeaders.join(",") + "\n" +
      "open,File Annual Return - Company ABC,Submit annual return for Company ABC to MCA portal with all required documents,high,John Doe,ABC Pvt Ltd,ROC,01-08-2025,yearly,urgent,high,8,abc@example.com";
    
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
    if (!file) {
      return;
    }

    handleCSVUploadToAPI(file);
  };

  const handleCSVUploadToAPI = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await uploadTasksCSV(file);
      
      if (result.success && result.data) {
        // Transform tasks for API creation
        const apiTasks = result.data.map(transformUploadedTaskForAPI);
        // Transform tasks for UI display
        const uiTasks = result.data.map(transformUploadedTask);
        
        let successCount = 0;
        let duplicateCount = 0;
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Create tasks in database via API and add to UI
        for (const [index, apiTask] of apiTasks.entries()) {
          try {
            const createResult = await createTask(apiTask);
            if (createResult.success) {
              // Add the UI version to local state
              onTaskCreate(uiTasks[index]);
              successCount++;
            } else {
              errors.push(`Failed to create task: ${apiTask.title} - ${createResult.error}`);
            }
          } catch (error) {
            errors.push(`Failed to create task: ${apiTask.title} - ${error}`);
          }
        }
        
        // Parse any duplicate information from the API response
        if (result.message && result.message.includes('Duplicate')) {
          const duplicateMatches = result.message.match(/Duplicate found:/g);
          duplicateCount = duplicateMatches ? duplicateMatches.length : 0;
          warnings.push(`${duplicateCount} duplicate tasks were detected`);
        }
        
        const uploadResult = {
          fileName: file.name,
          totalTasks: result.data.length,
          successfulTasks: successCount,
          failedTasks: result.data.length - successCount,
          duplicates: duplicateCount,
          errors,
          warnings
        };
        
        setUploadResult(uploadResult);
        setShowUploadResult(true);
        
        toast({
          title: "Upload Successful",
          description: `${successCount} tasks uploaded successfully`,
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload tasks",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Legacy CSV parsing function (keeping as fallback)
  const handleCSVUploadLegacy = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            accept=".csv,.xlsx,.xls"
            onChange={handleCSVUpload}
            className="hidden"
          />
          
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </>
            )}
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

      {/* Upload Progress/Result */}
      <TaskUploadProgress
        isVisible={showUploadResult}
        result={uploadResult}
        onClose={() => setShowUploadResult(false)}
      />

    </div>
  );
};