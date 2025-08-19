import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Users, 
  Building, 
  Eye, 
  UserCheck, 
  Globe
} from "lucide-react";

export type DashboardViewMode = "my_tasks" | "all_tasks" | "entity_overview";

interface DashboardViewToggleProps {
  currentView: DashboardViewMode;
  onViewChange: (view: DashboardViewMode) => void;
  userRole: "admin" | "cfo" | "team_member";
  className?: string;
}

export const DashboardViewToggle = ({ 
  currentView, 
  onViewChange, 
  userRole,
  className 
}: DashboardViewToggleProps) => {
  
  const viewOptions = [
    {
      id: "my_tasks" as const,
      label: "My Tasks",
      description: "Tasks assigned to you",
      icon: <User className="w-4 h-4" />,
      allowedRoles: ["admin", "cfo", "team_member"]
    },
    {
      id: "all_tasks" as const,
      label: "All Tasks", 
      description: "Organization-wide tasks",
      icon: <Users className="w-4 h-4" />,
      allowedRoles: ["admin", "cfo"]
    },
    {
      id: "entity_overview" as const,
      label: "Entity Overview",
      description: "Cross-entity insights",
      icon: <Building className="w-4 h-4" />,
      allowedRoles: ["admin", "cfo"]
    }
  ];

  const availableViews = viewOptions.filter(view => 
    view.allowedRoles.includes(userRole)
  );

  const getTaskCounts = (viewId: DashboardViewMode) => {
    // Mock task counts based on view
    switch (viewId) {
      case "my_tasks":
        return { active: 5, pending: 2, completed: 12 };
      case "all_tasks":
        return { active: 23, pending: 8, completed: 156 };
      case "entity_overview":
        return { active: 45, pending: 12, completed: 234 };
      default:
        return { active: 0, pending: 0, completed: 0 };
    }
  };

  const getViewScope = (viewId: DashboardViewMode) => {
    switch (viewId) {
      case "my_tasks":
        return "Personal workspace";
      case "all_tasks":
        return "Team & organization";
      case "entity_overview":
        return "Multi-entity insights";
      default:
        return "";
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Current View Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-medium">Dashboard View</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {getViewScope(currentView)}
            </Badge>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex flex-wrap gap-2">
            {availableViews.map((view) => {
              const isActive = currentView === view.id;
              const counts = getTaskCounts(view.id);
              
              return (
                <Button
                  key={view.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="flex-1 min-w-fit h-auto p-3 flex flex-col items-start gap-1"
                  onClick={() => onViewChange(view.id)}
                >
                  <div className="flex items-center gap-2 w-full justify-center">
                    {view.icon}
                    <span className="font-medium text-sm">{view.label}</span>
                  </div>
                  
                  <div className="text-xs opacity-80 text-center w-full">
                    {view.description}
                  </div>
                  
                  {/* Task counts for active view */}
                  {isActive && (
                    <div className="flex items-center gap-3 mt-1 text-xs opacity-80">
                      <span>{counts.active} active</span>
                      <span>•</span>
                      <span>{counts.pending} pending</span>
                      <span>•</span>
                      <span>{counts.completed} done</span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Role-based restrictions notice */}
          {userRole === "team_member" && (
            <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
              <div className="flex items-start gap-2">
                <UserCheck className="w-3 h-3 mt-0.5" />
                <div>
                  <p className="font-medium">Team Member View</p>
                  <p>You have access to your personal tasks. Contact admin for broader access.</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Quick Stats for Current View */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {(() => {
              const counts = getTaskCounts(currentView);
              return [
                { label: "Active", value: counts.active, color: "text-blue-600" },
                { label: "Pending", value: counts.pending, color: "text-yellow-600" },
                { label: "Completed", value: counts.completed, color: "text-green-600" }
              ];
            })().map((stat) => (
              <div key={stat.label}>
                <div className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};