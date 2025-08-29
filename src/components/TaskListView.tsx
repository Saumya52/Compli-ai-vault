import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { TaskFilters } from "./tasks/TaskFilters";
import { TaskCard, type EnhancedTask } from "./tasks/TaskCard";
import { BulkActions } from "./tasks/BulkActions";
import CreateTaskDialog from "./CreateTaskDialog";
import { uploadTasksCSV, transformUploadedTask, transformUploadedTaskForAPI, createTask, reassignTask, getAllTasks, type TaskUploadData } from "@/utils/api";
import { TaskUploadProgress } from "./TaskUploadProgress";
import { parseExcelDate } from "@/utils/dateUtils";
import { uploadTaskDocument, getTasksPaginated } from "@/utils/api";

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

  // API tasks state
  const [apiTasks, setApiTasks] = useState<EnhancedTask[]>([]);
  const [isLoadingApiTasks, setIsLoadingApiTasks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pageSize] = useState(10);

  // Transform API task to EnhancedTask format
  const transformApiTaskToEnhanced = (apiTask: any): EnhancedTask => {
    // Handle the backend date format - it seems to be a timestamp in seconds since epoch
    let dueDate = new Date();
    if (apiTask.dueDate) {
      const dateValue = new Date(apiTask.dueDate);
      // Check if it's a valid date, if not try parsing as timestamp
      if (isNaN(dateValue.getTime())) {
        // Try parsing as timestamp in seconds
        const timestamp = parseFloat(apiTask.dueDate);
        if (!isNaN(timestamp)) {
          dueDate = new Date(timestamp * 1000);
        }
      } else {
        dueDate = dateValue;
      }
    }
    
    return {
      id: apiTask._id || apiTask.id || Math.random().toString(),
      title: apiTask.title || apiTask.name || "Untitled Task",
      description: apiTask.description || "",
      status: (apiTask.status || "open") as EnhancedTask['status'],
      priority: (apiTask.priority || "medium") as EnhancedTask['priority'],
      assignee: apiTask.assignedTo || apiTask.assigned_to || "unassigned",
      assigneeName: apiTask.assignedToName || apiTask.assigned_to_name || apiTask.assignedTo || "Unassigned",
      dueDate,
      createdDate: apiTask.createdAt ? new Date(apiTask.createdAt) : new Date(),
      bucket: apiTask.bucket || apiTask.complianceType || "General",
      frequency: apiTask.recurringFrequency || apiTask.frequency || "one-time",
      entity: apiTask.entity || "Unknown Entity",
      tags: apiTask.tags ? (typeof apiTask.tags === 'string' ? apiTask.tags.split(',').map(t => t.trim()) : apiTask.tags) : [],
      dependencies: apiTask.dependencies || [],
      hasDocumentsPending: apiTask.hasDocumentsPending || false,
      hasValidationIssues: apiTask.hasValidationIssues || false,
      estimatedHours: apiTask.estimatedHours || 0,
      completedHours: apiTask.completedHours || 0,
      lastUpdated: apiTask.updatedAt ? new Date(apiTask.updatedAt) : new Date(),
      aiSuggestions: apiTask.ai_doc_suggestions?.summary ? [apiTask.ai_doc_suggestions.summary] : (apiTask.aiSuggestions || []),
      closureRightsEmail: apiTask.closureRightsEmail || ""
    };
  };

  // Load API tasks with pagination
  useEffect(() => {
    const fetchPaginatedTasks = async () => {
      setIsLoadingApiTasks(true);
      try {
        const result = await getTasksPaginated(currentPage, pageSize);
        if (result.success && result.data) {
          const transformedTasks = result.data.tasks.map(transformApiTaskToEnhanced);
          setApiTasks(transformedTasks);
          setTotalPages(result.data.totalPages);
          setTotalTasks(result.data.totalTasks);
        } else {
          toast({
            title: "Failed to Load Tasks",
            description: result.error || "Could not fetch tasks from server",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error Loading Tasks",
          description: "An unexpected error occurred while loading tasks",
          variant: "destructive"
        });
      } finally {
        setIsLoadingApiTasks(false);
      }
    };

    fetchPaginatedTasks();
  }, [currentPage, pageSize, toast]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
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

  // Combine API tasks with mock tasks and filter
  const getFilteredTasks = () => {
    const allTasks = [...apiTasks];
    return allTasks.filter(task => {
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
    // This is now handled directly in TaskCard component
    toast({ title: "Comment Added", description: "Your comment has been posted" });
  };

  const handleTagUpdate = (taskId: string, tags: string[]) => {
    // TODO: Call API to update task tags
    toast({ title: "Tags Updated", description: "Task tags have been updated" });
  };

  const handleDocumentUpload = async (taskId: string, file: File) => {
    try {
      const result = await uploadTaskDocument(taskId, file);
      if (result.success) {
        // Extract AI suggestions from the response
        const aiSuggestion = result.data?.ai_doc_suggestions?.summary;
        
        // Dispatch custom event for AI suggestions panel
        if (aiSuggestion && aiSuggestion.trim() && !aiSuggestion.includes("no content provided")) {
          const event = new CustomEvent('ai-suggestion', {
            detail: {
              suggestion: aiSuggestion,
              taskId: taskId,
              documentName: file.name
            }
          });
          window.dispatchEvent(event);
        }
        
        toast({
          title: "Document Uploaded",
          description: aiSuggestion 
            ? `${file.name} uploaded. AI Analysis: ${aiSuggestion.substring(0, 100)}${aiSuggestion.length > 100 ? '...' : ''}`
            : `${file.name} has been uploaded to task successfully`,
        });
        
        // Show AI suggestions in a separate notification if available
        if (aiSuggestion && aiSuggestion.trim() && !aiSuggestion.includes("no content provided")) {
          setTimeout(() => {
            toast({
              title: "AI Document Analysis",
              description: aiSuggestion,
            });
          }, 1500);
        }
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload document",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An error occurred while uploading the document",
        variant: "destructive"
      });
    }
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
          <p className="text-muted-foreground">
            Manage compliance tasks with advanced features 
            {isLoadingApiTasks && " (Loading API tasks...)"}
          </p>
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
      {isLoadingApiTasks && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks from server...</p>
          </CardContent>
        </Card>
      )}
      
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
            onDocumentUpload={handleDocumentUpload}
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

      {/* Show total count */}
      <div className="text-sm text-muted-foreground text-center py-4">
        Showing {filteredTasks.length} of {totalTasks} tasks (Page {currentPage} of {totalPages})
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoadingApiTasks}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoadingApiTasks}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoadingApiTasks}
          >
            Next
          </Button>
        </div>
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