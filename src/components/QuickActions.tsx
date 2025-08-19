import { Plus, Upload, Calendar, FileText, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateTaskDialog from "./CreateTaskDialog";

interface QuickActionsProps {
  onTaskCreate: (task: any) => void;
  onCalendarView: () => void;
}

const QuickActions = ({ onTaskCreate, onCalendarView }: QuickActionsProps) => {
  const actions = [
    {
      title: "Upload Calendar",
      description: "Add new compliance calendar",
      icon: Calendar,
      variant: "default" as const,
      action: "upload-calendar"
    },
    {
      title: "Create Task",
      description: "Manually create a compliance task",
      icon: Plus,
      variant: "outline" as const,
      action: "create-task"
    },
    {
      title: "Upload Document",
      description: "Add to document vault",
      icon: Upload,
      variant: "outline" as const,
      action: "upload-doc"
    },
    {
      title: "Search Vault",
      description: "Find documents contextually",
      icon: Search,
      variant: "outline" as const,
      action: "search-vault"
    },
    {
      title: "Generate MIS",
      description: "Create compliance report",
      icon: FileText,
      variant: "outline" as const,
      action: "generate-mis"
    },
    {
      title: "Set Reminders",
      description: "Configure alert preferences",
      icon: Bell,
      variant: "outline" as const,
      action: "set-reminders"
    }
  ];

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            if (action.action === "create-task") {
              return (
                <CreateTaskDialog key={index} onTaskCreate={onTaskCreate}>
                  <Button
                    variant={action.variant}
                    className="h-auto p-4 flex flex-col items-start space-y-2 hover:scale-105 transition-transform duration-200 w-full"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </CreateTaskDialog>
              );
            }

            return (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  if (action.action === "upload-calendar") {
                    onCalendarView();
                  }
                  // Add other action handlers as needed
                }}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;