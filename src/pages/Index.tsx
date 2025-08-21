import { useState } from "react";
import { FileText, Users } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { ClientOnboardingWizard } from "@/components/ClientOnboardingWizard";
import { ClientSummaryDashboard } from "@/components/ClientSummaryDashboard";
import ComplianceOverview from "@/components/ComplianceOverview";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import CalendarView from "@/components/CalendarView";
import VaultView from "@/components/VaultView";
import { TaskListView } from "@/components/TaskListView";
import MISReports from "@/components/MISReports";
import Settings from "@/components/Settings";
import FormPvtLtd from "@/components/FormPvtLtd";
import { AINudgesPanel } from "@/components/AINudgesPanel";
import { ComplianceHealthTrend } from "@/components/ComplianceHealthTrend";
import { QuickFilterPanel } from "@/components/QuickFilterPanel";
import { AlertCenter } from "@/components/AlertCenter";
import { SmartShortcuts } from "@/components/SmartShortcuts";
import { DashboardViewToggle, type DashboardViewMode } from "@/components/DashboardViewToggle";
import { MultiCompanyDashboard } from "@/components/MultiCompanyDashboard";
import { ClientSummaryCards } from "@/components/ClientSummaryCards";
import { TaskFunnelStats } from "@/components/TaskFunnelStats";
import { BillingStatusSnapshot } from "@/components/BillingStatusSnapshot";
import { AutoComplianceClock } from "@/components/AutoComplianceClock";
import { RecentAIFeedbackLogs } from "@/components/RecentAIFeedbackLogs";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showClientOnboarding, setShowClientOnboarding] = useState(false);
  
  // Enhanced dashboard state
  const userRole = user?.role || "team_member";
  const [dashboardViewMode, setDashboardViewMode] = useState<DashboardViewMode>("my_tasks");
  const [filters, setFilters] = useState({
    entity: "All Entities",
    state: "All States", 
    complianceType: "All Types",
    assignedUser: "All Users"
  });

  const handleTaskCreate = (newTask: any) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      entity: "All Entities",
      state: "All States",
      complianceType: "All Types", 
      assignedUser: "All Users"
    });
  };

  // Role-sensitive content configuration
  const getRoleBasedComponents = () => {
    const baseComponents = {
      showAINudges: true,
      showSmartShortcuts: true,
      showAlertCenter: true,
      showComplianceHealthTrend: true
    };

    switch (userRole) {
      case "admin":
        return { ...baseComponents, showFullAnalytics: true, showUserManagement: true };
      case "cfo":
        return { ...baseComponents, showFinancialInsights: true, showExecutiveDashboard: true };
      case "team_member":
        return { ...baseComponents, showFullAnalytics: false, showUserManagement: false };
      default:
        return baseComponents;
    }
  };

  const roleConfig = getRoleBasedComponents();

  const renderCurrentView = () => {
    switch (currentView) {
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "tasks":
        return <TaskListView tasks={tasks} onTaskCreate={handleTaskCreate} />;
      case "vault":
        return <VaultView tasks={tasks} />;
      case "reports":
        return <MISReports />;
      case "settings":
        return <Settings />;
      case "form-pvt-ltd":
        return <FormPvtLtd />;
      default:
        return (
          <>
            {/* Quick Filter Panel */}
            <QuickFilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              className="mb-6"
            />

            {/* Dashboard View Toggle */}
            <DashboardViewToggle
              currentView={dashboardViewMode}
              onViewChange={setDashboardViewMode}
              userRole={userRole}
              className="mb-6"
            />

            {/* Conditional Dashboard Content based on View Mode */}
            {dashboardViewMode === "entity_overview" ? (
              <MultiCompanyDashboard />
            ) : (
              <>
                {/* Enhanced Compliance Overview with Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <ComplianceOverview />
                  </div>
                  <div>
                    {roleConfig.showComplianceHealthTrend && (
                      <ComplianceHealthTrend />
                    )}
                  </div>
                </div>

                {/* Alert Center - Critical Alerts */}
                {roleConfig.showAlertCenter && (
                  <AlertCenter userRole={userRole} className="mb-6" />
                )}

                {/* Client Summary Cards */}
                <ClientSummaryCards className="mb-6" />

                {/* Strategic Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                  {/* Task Funnel Stats */}
                  <div className="lg:col-span-1">
                    <TaskFunnelStats />
                  </div>
                  
                  {/* Auto Compliance Clock */}
                  <div className="lg:col-span-1">
                    <AutoComplianceClock />
                  </div>
                  
                  {/* Billing Status (CFO only) */}
                  {(userRole === "admin" || userRole === "cfo") && (
                    <div className="lg:col-span-1">
                      <BillingStatusSnapshot />
                    </div>
                  )}
                  
                  {/* Recent AI Feedback */}
                  <div className="lg:col-span-1">
                    <RecentAIFeedbackLogs />
                  </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Quick Actions & AI Nudges */}
                  <div className="lg:col-span-2 space-y-6">
                    <QuickActions 
                      onTaskCreate={handleTaskCreate} 
                      onCalendarView={() => setCurrentView("calendar")} 
                    />
                    
                    {roleConfig.showAINudges && (
                      <AINudgesPanel userRole={userRole} userId="current-user" />
                    )}
                  </div>

                  {/* Right Column - Smart Shortcuts & Recent Activity */}
                  <div className="space-y-6">
                    {roleConfig.showSmartShortcuts && (
                      <SmartShortcuts 
                        userId="current-user" 
                        userRole={userRole} 
                      />
                    )}
                    <RecentActivity />
                  </div>
                </div>
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardHeader 
        currentView={currentView} 
        onNavigate={handleNavigation}
        onAddClient={() => setShowClientOnboarding(true)}
      />
      
      <ClientOnboardingWizard
        open={showClientOnboarding}
        onClose={() => setShowClientOnboarding(false)}
      />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {currentView === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                CFO Dashboard
              </h1>
              <p className="text-muted-foreground">
                {dashboardViewMode === "my_tasks" && "Here's your personal task overview. You have "}
                {dashboardViewMode === "all_tasks" && "Organization-wide task overview. There are "}
                {dashboardViewMode === "entity_overview" && "Multi-entity compliance overview. Monitoring "}
                <span className="font-medium text-status-warning">3 upcoming deadlines</span> 
                {dashboardViewMode === "entity_overview" ? " across all entities." : " this week."}
              </p>
            </div>
            
            {/* Client Summary Dashboard */}
            <ClientSummaryDashboard />
          </div>
        )}

        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
