import { Bell, Search, Calendar, FileText, Users, Settings, Home, User, Camera, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { UserManagementDialog } from "@/components/UserManagementDialog";
import { ClientSwitcher } from "@/components/ClientSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useClient } from "@/contexts/ClientContext";

interface DashboardHeaderProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  onAddClient?: () => void;
}

const DashboardHeader = ({ currentView = "dashboard", onNavigate, onAddClient }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const { refreshClients } = useClient();

  const handleAddClient = async () => {
    if (onAddClient) {
      onAddClient();
      // Refresh clients after potential addition
      setTimeout(() => {
        refreshClients();
      }, 1000);
    }
  };
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/4aa64269-25f9-4ebb-a095-16149aa9907f.png" 
                alt="ComplAI Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold text-foreground">ComplAI</h1>
            </div>
            
            {/* Client Switcher */}
            <ClientSwitcher onAddClient={handleAddClient} />
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant={currentView === "dashboard" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                variant={currentView === "calendar" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button 
                variant={currentView === "tasks" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("tasks")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Tasks
              </Button>
              <Button 
                variant={currentView === "vault" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("vault")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Vault
              </Button>
              <Button 
                variant={currentView === "reports" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("reports")}
              >
                <Users className="w-4 h-4 mr-2" />
                Reports
              </Button>
              <Button 
                variant={currentView === "form-pvt-ltd" ? "default" : "ghost"} 
                className="text-foreground hover:text-primary"
                onClick={() => onNavigate?.("form-pvt-ltd")}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Form a Pvt Ltd
              </Button>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search documents, tasks..." 
                className="pl-10 w-64 bg-muted/50 border-border"
              />
            </div>
            
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-status-overdue text-xs">
                3
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <UserManagementDialog />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.("settings")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  All Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0 rounded-full">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-xs font-medium text-primary-foreground">JD</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      {user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;