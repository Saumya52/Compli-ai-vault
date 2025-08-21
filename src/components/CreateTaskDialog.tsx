import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createTask } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface CreateTaskDialogProps {
  children: React.ReactNode;
  onTaskCreate: (task: any) => void;
}

const CreateTaskDialog = ({ children, onTaskCreate }: CreateTaskDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [bucket, setBucket] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [frequency, setFrequency] = useState("");
  const [assignee, setAssignee] = useState("");
  const [alertsList, setAlertsList] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName || !bucket || !dueDate || !frequency || !assignee) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Prepare task data for API
    const apiTaskData = {
      title: taskName,
      description: `Task created manually via dashboard`,
      bucket,
      dueDate,
      frequency,
      assignedTo: assignee,
      status: 'open',
      priority: 'medium',
      entity: 'Default Entity', // You might want to add entity selection to the form
      estimatedHours: 0,
      closureRightsEmail: assignee,
      tags: []
    };

    try {
      const result = await createTask(apiTaskData);
      
      if (result.success) {
        // Create UI version for local state
        const uiTask = {
          id: result.data?.id || Date.now().toString(),
          name: taskName,
          title: taskName,
          bucket,
          dueDate,
          frequency,
          assignee,
          assigneeName: assignee,
          alerts: alertsList.split(',').map(email => email.trim()).filter(Boolean),
          status: 'open',
          priority: 'medium',
          createdAt: new Date(),
          entity: 'Default Entity',
          tags: [],
          dependencies: [],
          hasDocumentsPending: false,
          hasValidationIssues: false,
          estimatedHours: 0,
          completedHours: 0,
          lastUpdated: new Date(),
          aiSuggestions: [],
          closureRightsEmail: assignee
        };

        onTaskCreate(uiTask);
        
        // Reset form
        setTaskName("");
        setBucket("");
        setDueDate(undefined);
        setFrequency("");
        setAssignee("");
        setAlertsList("");
        setOpen(false);
        
        toast({
          title: "Task Created Successfully",
          description: `Task "${taskName}" has been created and saved to database`,
        });
      } else {
        toast({
          title: "Task Creation Failed",
          description: result.error || "Failed to create task",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Task creation error:', error);
      toast({
        title: "Task Creation Error",
        description: "An unexpected error occurred while creating the task",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket">Bucket</Label>
            <Select value={bucket} onValueChange={setBucket} required>
              <SelectTrigger>
                <SelectValue placeholder="Select bucket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst">GST Compliance</SelectItem>
                <SelectItem value="income-tax">Income Tax</SelectItem>
                <SelectItem value="tds">TDS Returns</SelectItem>
                <SelectItem value="pf">PF Compliance</SelectItem>
                <SelectItem value="esi">ESI Compliance</SelectItem>
                <SelectItem value="roc">ROC Filings</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Recurring Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency} required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One Time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="half-yearly">Half Yearly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign Ticket Closure Rights To</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee name/email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alerts">Send Alerts To</Label>
            <Textarea
              id="alerts"
              value={alertsList}
              onChange={(e) => setAlertsList(e.target.value)}
              placeholder="Enter email addresses separated by commas"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;