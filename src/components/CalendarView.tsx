import React, { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Users, Settings } from "lucide-react";
import { EnhancedCalendarView } from "./EnhancedCalendarView";
import { getAllTasks } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface CalendarViewProps {
  tasks: any[];
}

const CalendarView = ({ tasks }: CalendarViewProps) => {
  const { toast } = useToast();
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [apiTasks, setApiTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const result = await getAllTasks();
        if (result.success && result.data) {
          setApiTasks(result.data);
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
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  // Combine local tasks with API tasks
  const allTasks = [...tasks, ...apiTasks];

  if (showEnhanced) {
    return <EnhancedCalendarView tasks={allTasks} isLoading={isLoading} />;
  }

  // Fallback to basic calendar view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Calendar View</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowEnhanced(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Enhanced View
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Compliance Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-8 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square border rounded-lg p-2 hover:bg-accent cursor-pointer">
                <div className="text-sm">{((i % 31) + 1)}</div>
                {allTasks.some(task => {
                  const taskDate = new Date(task.dueDate || task.due_date);
                  const cellDate = new Date();
                  cellDate.setDate(((i % 31) + 1));
                  return taskDate.getDate() === cellDate.getDate();
                }) && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Task
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;