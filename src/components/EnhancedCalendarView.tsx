import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Filter,
  Download,
  Upload,
  Users,
  Brain,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  BarChart3,
  User,
  Building,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Settings
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, isToday, differenceInDays } from "date-fns";

type CalendarView = "month" | "week" | "list" | "compliance_type" | "ai_generator";
type ComplianceBucket = "GST" | "TDS" | "ROC" | "PF" | "ESI" | "Income Tax" | "Labor Law";
type TaskStatus = "pending" | "completed" | "overdue" | "in_progress";
type UrgencyLevel = "normal" | "due_soon" | "overdue";

interface ComplianceTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  complianceBucket: ComplianceBucket;
  entity: string;
  assignedTo: string;
  assignedToName: string;
  status: TaskStatus;
  urgencyLevel: UrgencyLevel;
  isRecurring: boolean;
  priority: "low" | "medium" | "high";
}

interface CalendarFilters {
  entity: string;
  complianceType: string;
  assignee: string;
  status: string;
}

interface CalendarViewProps {
  tasks: any[];
}

export const EnhancedCalendarView = ({ tasks }: CalendarViewProps) => {
  const { toast } = useToast();
  
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAISuggestionsOpen, setIsAISuggestionsOpen] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    entity: "All Entities",
    complianceType: "All Types",
    assignee: "All Users",
    status: "All Status"
  });
  const [hoveredTask, setHoveredTask] = useState<ComplianceTask | null>(null);
  const [showExternalSync, setShowExternalSync] = useState(false);
  
  // AI Generator states
  const [aiStep, setAiStep] = useState<"company_details" | "questionnaire" | "results">("company_details");
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    industry: "",
    size: "",
    location: "",
    businessType: ""
  });
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [aiAnswers, setAiAnswers] = useState<Record<number, string>>({});
  const [generatedCompliances, setGeneratedCompliances] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock compliance tasks with enhanced data
  const mockTasks: ComplianceTask[] = [
    {
      id: "1",
      title: "GSTR-3B Filing",
      description: "Monthly GST return filing for ABC Pvt Ltd",
      dueDate: new Date(2024, 11, 20), // Dec 20, 2024
      complianceBucket: "GST",
      entity: "ABC Pvt Ltd",
      assignedTo: "user1",
      assignedToName: "John Doe",
      status: "pending",
      urgencyLevel: "due_soon",
      isRecurring: true,
      priority: "high"
    },
    {
      id: "2",
      title: "TDS Return Q3",
      description: "Quarterly TDS return submission",
      dueDate: new Date(2024, 11, 15), // Dec 15, 2024
      complianceBucket: "TDS",
      entity: "XYZ Corp",
      assignedTo: "user2",
      assignedToName: "Jane Smith",
      status: "overdue",
      urgencyLevel: "overdue",
      isRecurring: false,
      priority: "high"
    },
    {
      id: "3",
      title: "ROC Annual Filing",
      description: "Annual return filing with ROC",
      dueDate: new Date(2024, 11, 25), // Dec 25, 2024
      complianceBucket: "ROC",
      entity: "Tech Solutions Inc",
      assignedTo: "user1",
      assignedToName: "John Doe",
      status: "in_progress",
      urgencyLevel: "normal",
      isRecurring: true,
      priority: "medium"
    },
    {
      id: "4",
      title: "PF Return Monthly",
      description: "Employee Provident Fund return",
      dueDate: new Date(2024, 11, 10), // Dec 10, 2024
      complianceBucket: "PF",
      entity: "ABC Pvt Ltd",
      assignedTo: "user3",
      assignedToName: "Mike Johnson",
      status: "completed",
      urgencyLevel: "normal",
      isRecurring: true,
      priority: "medium"
    }
  ];

  // Calculate urgency level based on due date
  const calculateUrgencyLevel = (dueDate: Date): UrgencyLevel => {
    const today = new Date();
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue <= 3) return "due_soon";
    return "normal";
  };

  // Get color for compliance bucket
  const getBucketColor = (bucket: ComplianceBucket): string => {
    const colors = {
      "GST": "bg-blue-500",
      "TDS": "bg-green-500",
      "ROC": "bg-purple-500",
      "PF": "bg-orange-500",
      "ESI": "bg-pink-500",
      "Income Tax": "bg-red-500",
      "Labor Law": "bg-indigo-500"
    };
    return colors[bucket] || "bg-gray-500";
  };

  // Get urgency color
  const getUrgencyColor = (urgency: UrgencyLevel): string => {
    switch (urgency) {
      case "overdue": return "ring-2 ring-red-500 bg-red-50 border-red-200";
      case "due_soon": return "ring-2 ring-orange-500 bg-orange-50 border-orange-200";
      default: return "border-gray-200";
    }
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): ComplianceTask[] => {
    return mockTasks.filter(task => isSameDay(task.dueDate, date));
  };

  // Get filtered tasks
  const getFilteredTasks = (): ComplianceTask[] => {
    return mockTasks.filter(task => {
      if (filters.entity !== "All Entities" && task.entity !== filters.entity) return false;
      if (filters.complianceType !== "All Types" && task.complianceBucket !== filters.complianceType) return false;
      if (filters.assignee !== "All Users" && task.assignedToName !== filters.assignee) return false;
      if (filters.status !== "All Status" && task.status !== filters.status) return false;
      return true;
    });
  };

  // Handle date cell click
  const handleDateCellClick = (date: Date) => {
    setSelectedDate(date);
    setIsCreateTaskOpen(true);
  };

  // Handle task creation
  const handleCreateTask = (taskData: any) => {
    toast({
      title: "Task Created",
      description: `${taskData.title} has been scheduled for ${format(selectedDate!, 'MMM dd, yyyy')}`,
    });
    setIsCreateTaskOpen(false);
  };

  // Handle task reassignment
  const handleReassignTask = (taskId: string, newAssignee: string) => {
    toast({
      title: "Task Reassigned",
      description: `Task has been reassigned to ${newAssignee}`,
    });
  };

  // Handle external sync
  const handleExternalSync = (provider: "google" | "outlook") => {
    toast({
      title: "Sync Initiated",
      description: `Syncing with ${provider === "google" ? "Google Calendar" : "Microsoft Outlook"}`,
    });
  };

  // Handle export
  const handleExport = (format: "ics" | "csv") => {
    toast({
      title: "Export Started",
      description: `Exporting calendar data as ${format.toUpperCase()} file`,
    });
  };

  // Generate AI suggestions
  const getAISuggestions = () => {
    return [
      {
        id: "1",
        type: "recurring",
        title: "Suggest Recurring Tasks for January",
        description: "Based on December patterns, suggest GST returns and TDS filings for January 2025",
        action: "generate_recurring"
      },
      {
        id: "2",
        type: "missed",
        title: "Identify Missed Tasks from December",
        description: "Found 2 tasks that were marked completed late. Review for process improvement",
        action: "review_missed"
      },
      {
        id: "3",
        type: "optimization",
        title: "Optimize Task Distribution",
        description: "John Doe has 60% more tasks than average. Consider redistributing workload",
        action: "optimize_workload"
      }
    ];
  };

  // Render calendar grid for month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(day => {
          const dayTasks = getTasksForDate(day);
          const taskCount = dayTasks.length;
          
          return (
            <div
              key={day.toString()}
              className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                !isSameMonth(day, currentDate) ? "opacity-50" : ""
              } ${isToday(day) ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleDateCellClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{format(day, "d")}</span>
                {/* Heatmap indicator */}
                {taskCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs h-4 min-w-4 ${
                      taskCount > 3 ? "bg-red-500 text-white" :
                      taskCount > 1 ? "bg-orange-500 text-white" :
                      "bg-blue-500 text-white"
                    }`}
                  >
                    {taskCount}
                  </Badge>
                )}
              </div>
              
              {/* Task indicators */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={`p-1 rounded text-xs truncate ${getBucketColor(task.complianceBucket)} text-white`}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    const filteredTasks = getFilteredTasks();
    
    return (
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className={`p-4 ${getUrgencyColor(task.urgencyLevel)}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getBucketColor(task.complianceBucket)} text-white`}>
                      {task.complianceBucket}
                    </Badge>
                    <h3 className="font-medium">{task.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {format(task.dueDate, "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {task.entity}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.assignedToName}
                    </span>
                  </div>
                </div>
                <Badge variant={task.status === "completed" ? "default" : "outline"}>
                  {task.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  // Handle AI Generator steps
  const handleCompanyDetailsSubmit = () => {
    if (!companyDetails.name || !companyDetails.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in company name and industry"
      });
      return;
    }
    
    // Generate AI questions based on company details
    const questions = [
      "What is your annual turnover range?",
      "How many employees do you have?",
      "Do you have multiple locations or branches?",
      "What type of business operations do you conduct? (Manufacturing, Trading, Services, etc.)",
      "Do you deal with imports/exports?",
      "Do you have any existing compliance obligations you're aware of?"
    ];
    
    setAiQuestions(questions);
    setAiStep("questionnaire");
  };

  const handleQuestionnaireSubmit = async () => {
    setIsGenerating(true);
    setAiStep("results");
    
    // Simulate AI processing and generate compliance items
    setTimeout(() => {
      const generated = [
        {
          id: "gen1",
          title: "GST Registration",
          description: "Register for GST as your turnover exceeds threshold",
          complianceHead: "GST",
          subHead: "Registration",
          frequency: "One-time",
          priority: "high",
          dueDate: "Within 30 days of threshold breach"
        },
        {
          id: "gen2", 
          title: "GSTR-3B Monthly Return",
          description: "Monthly GST return filing",
          complianceHead: "GST",
          subHead: "Returns",
          frequency: "Monthly",
          priority: "high",
          dueDate: "20th of following month"
        },
        {
          id: "gen3",
          title: "TDS Return - Quarterly",
          description: "TDS return filing for salary payments",
          complianceHead: "TDS",
          subHead: "Returns",
          frequency: "Quarterly", 
          priority: "medium",
          dueDate: "Last day of following month"
        },
        {
          id: "gen4",
          title: "ESI Registration",
          description: "Register under ESI Act for employee benefits",
          complianceHead: "ESI",
          subHead: "Registration",
          frequency: "One-time",
          priority: "medium",
          dueDate: "Within 15 days of threshold breach"
        }
      ];
      
      setGeneratedCompliances(generated);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAddToCalendar = (compliance: any) => {
    toast({
      title: "Added to Calendar",
      description: `${compliance.title} has been added to your compliance calendar`
    });
  };

  // Render AI Generator view
  const renderAIGeneratorView = () => {
    if (aiStep === "company_details") {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Compliance Calendar Generator
            </CardTitle>
            <p className="text-muted-foreground">
              Provide your company details to generate a personalized compliance calendar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails({...companyDetails, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={companyDetails.industry} onValueChange={(value) => setCompanyDetails({...companyDetails, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={companyDetails.size} onValueChange={(value) => setCompanyDetails({...companyDetails, size: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (200+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Primary Location</Label>
                <Input
                  id="location"
                  value={companyDetails.location}
                  onChange={(e) => setCompanyDetails({...companyDetails, location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Select value={companyDetails.businessType} onValueChange={(value) => setCompanyDetails({...companyDetails, businessType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private_limited">Private Limited Company</SelectItem>
                  <SelectItem value="public_limited">Public Limited Company</SelectItem>
                  <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                  <SelectItem value="partnership">Partnership Firm</SelectItem>
                  <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="section8">Section 8 Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleCompanyDetailsSubmit} className="w-full">
              Continue to Questionnaire
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    if (aiStep === "questionnaire") {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>AI Compliance Assessment</CardTitle>
            <p className="text-muted-foreground">
              Answer these questions to get personalized compliance recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiQuestions.map((question, index) => (
              <div key={index}>
                <Label htmlFor={`q-${index}`}>{question}</Label>
                <Textarea
                  id={`q-${index}`}
                  value={aiAnswers[index] || ""}
                  onChange={(e) => setAiAnswers({...aiAnswers, [index]: e.target.value})}
                  placeholder="Enter your answer..."
                  rows={2}
                />
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAiStep("company_details")}>
                Back
              </Button>
              <Button onClick={handleQuestionnaireSubmit} className="flex-1">
                Generate Compliance Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (aiStep === "results") {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Generated Compliance Calendar for {companyDetails.name}
              </CardTitle>
              <p className="text-muted-foreground">
                Based on your company details, here are the applicable compliance requirements
              </p>
            </CardHeader>
          </Card>
          
          {isGenerating ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p>AI is analyzing your requirements...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {generatedCompliances.map((compliance) => (
                <Card key={compliance.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{compliance.title}</h3>
                          <Badge variant={compliance.priority === "high" ? "destructive" : "secondary"}>
                            {compliance.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{compliance.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {compliance.complianceHead} - {compliance.subHead}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {compliance.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {compliance.dueDate}
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => handleAddToCalendar(compliance)}>
                        Add to Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isGenerating && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAiStep("company_details")}>
                Start Over
              </Button>
              <Button onClick={() => setCalendarView("month")}>
                View Calendar
              </Button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Compliance Calendar</h2>
          <Badge variant="outline">
            {getFilteredTasks().length} tasks
          </Badge>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={calendarView === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("month")}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Month
          </Button>
          <Button
            variant={calendarView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("list")}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={calendarView === "compliance_type" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("compliance_type")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            By Type
          </Button>
          <Button
            variant={calendarView === "ai_generator" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarView("ai_generator")}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Generator
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-32 text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Tasks</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entity</Label>
                    <Select value={filters.entity} onValueChange={(value) => setFilters({...filters, entity: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Entities">All Entities</SelectItem>
                        <SelectItem value="ABC Pvt Ltd">ABC Pvt Ltd</SelectItem>
                        <SelectItem value="XYZ Corp">XYZ Corp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={filters.complianceType} onValueChange={(value) => setFilters({...filters, complianceType: value})}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="GST">GST</SelectItem>
                        <SelectItem value="TDS">TDS</SelectItem>
                        <SelectItem value="ROC">ROC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={() => setIsAISuggestionsOpen(true)}>
            <Brain className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowExternalSync(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleExport("ics")}>
                  Export as ICS
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleExport("csv")}>
                  Export as CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Calendar Content */}
      {calendarView === "ai_generator" ? (
        renderAIGeneratorView()
      ) : (
        <Card>
          <CardContent className="p-6">
            {calendarView === "month" && renderMonthView()}
            {calendarView === "list" && renderListView()}
            {calendarView === "compliance_type" && (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Compliance Type view coming soon</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hover Tooltip for Tasks */}
      {hoveredTask && (
        <div className="fixed z-50 p-3 bg-popover border rounded-lg shadow-lg max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getBucketColor(hoveredTask.complianceBucket)} text-white`}>
                {hoveredTask.complianceBucket}
              </Badge>
              <span className="font-medium">{hoveredTask.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{hoveredTask.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span>Assigned to: {hoveredTask.assignedToName}</span>
              <Button size="sm" variant="outline" className="h-6 text-xs">
                Reassign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Dialog */}
      <Dialog open={isAISuggestionsOpen} onOpenChange={setIsAISuggestionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Calendar Suggestions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getAISuggestions().map(suggestion => (
              <Card key={suggestion.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* External Sync Dialog */}
      <Dialog open={showExternalSync} onOpenChange={setShowExternalSync}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Calendar Sync</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleExternalSync("google")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Sync with Google Calendar
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleExternalSync("outlook")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Sync with Microsoft Outlook
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};