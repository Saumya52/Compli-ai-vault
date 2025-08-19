import { useState } from "react";
import { Calendar, Download, Filter, TrendingUp, AlertTriangle, FileText, Users, Clock, BarChart3, Mail, Activity, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Import enhanced reporting components
import { PresetReports } from "./reports/PresetReports";
import { CustomReportBuilder } from "./reports/CustomReportBuilder";
import { ReportScheduler } from "./reports/ReportScheduler";
import { AIReportNarrative } from "./reports/AIReportNarrative";
import { ComplianceScorecard } from "./reports/ComplianceScorecard";

const MISReports = () => {
  // State for dialog and filters
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2024-01-31");
  const [complianceTypes, setComplianceTypes] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(["ticketId", "complianceType", "taskName", "assignedTo", "dueDate", "status"]);
  const [emailList, setEmailList] = useState("");
  const [subHeadFilter, setSubHeadFilter] = useState("");

  // Mock data for reports
  const complianceSummary = {
    total: 156,
    completed: 142,
    pending: 8,
    overdue: 6,
    completionRate: 91
  };

  const recurringTracker = [
    { name: "TDS Returns", frequency: "Monthly", lastFiled: "2024-01-15", nextDue: "2024-02-15", status: "On Track" },
    { name: "GST Filing", frequency: "Monthly", lastFiled: "2024-01-20", nextDue: "2024-02-20", status: "Due Soon" },
    { name: "Annual Report", frequency: "Yearly", lastFiled: "2023-03-31", nextDue: "2024-03-31", status: "On Track" },
    { name: "Board Meeting", frequency: "Quarterly", lastFiled: "2024-01-10", nextDue: "2024-04-10", status: "On Track" }
  ];

  const documentStatus = [
    { category: "Tax Returns", submitted: 45, required: 48, percentage: 94 },
    { category: "Regulatory Filings", submitted: 28, required: 30, percentage: 93 },
    { category: "Board Resolutions", submitted: 15, required: 15, percentage: 100 },
    { category: "Compliance Certificates", submitted: 22, required: 25, percentage: 88 }
  ];

  const autoClosedTickets = [
    { id: "T001", title: "GST Return Filing", autoClosedDate: "2024-01-15", reason: "Auto-filed successfully" },
    { id: "T002", title: "TDS Payment", autoClosedDate: "2024-01-12", reason: "Payment confirmed" },
    { id: "T003", title: "License Renewal", autoClosedDate: "2024-01-10", reason: "Renewal completed" }
  ];

  const alerts = [
    { type: "Critical", message: "Income Tax return due in 2 days", entity: "ABC Corp", date: "2024-01-20" },
    { type: "Warning", message: "GST filing approaching deadline", entity: "XYZ Ltd", date: "2024-01-18" },
    { type: "Info", message: "Board meeting scheduled", entity: "DEF Inc", date: "2024-01-25" }
  ];

  const userActivity = [
    { user: "John Doe", actions: 25, lastActive: "2024-01-18 14:30", role: "Manager" },
    { user: "Jane Smith", actions: 18, lastActive: "2024-01-18 16:45", role: "Associate" },
    { user: "Mike Johnson", actions: 32, lastActive: "2024-01-18 17:20", role: "Senior Manager" }
  ];

  const missedDeadlines = [
    { compliance: "TDS Return Q3", entity: "ABC Corp", dueDate: "2024-01-10", daysMissed: 8, severity: "High" },
    { compliance: "GST Annual Return", entity: "XYZ Ltd", dueDate: "2024-01-05", daysMissed: 13, severity: "Critical" }
  ];

  // Sample compliance data matching the uploaded image format
  const complianceData = [
    {
      ticketId: "ROC-001",
      complianceType: "ROC",
      taskName: "File MGT-7",
      assignedTo: "Priya Sharma",
      dueDate: "2025-07-31",
      status: "Completed",
      closureType: "Manual",
      aiValidation: "Passed",
      documentLink: "vault/pdfs/ROC-001.pdf"
    },
    {
      ticketId: "GST-023",
      complianceType: "GST",
      taskName: "GSTR-3B July",
      assignedTo: "Raj Kumar",
      dueDate: "2025-07-20",
      status: "Overdue",
      closureType: "Auto via Zoho",
      aiValidation: "Not Initiated",
      documentLink: "vault/pdfs/GST-023.pdf"
    },
    {
      ticketId: "PF-017",
      complianceType: "Labour",
      taskName: "PF Monthly Return",
      assignedTo: "Anjali Jain",
      dueDate: "2025-07-15",
      status: "Pending",
      closureType: "Pending",
      aiValidation: "In Progress",
      documentLink: "vault/pdfs/PF-017.pdf"
    },
    {
      ticketId: "TDS-014",
      complianceType: "TDS",
      taskName: "TDS Q1 Filing",
      assignedTo: "Suresh Nair",
      dueDate: "2025-07-30",
      status: "Completed",
      closureType: "Auto via Zoho",
      aiValidation: "Passed",
      documentLink: "vault/pdfs/TDS-014.pdf"
    }
  ];

  const complianceTypeOptions = ["ROC", "GST", "TDS", "Labour", "Income Tax", "Environmental", "Corporate"];
  const statusOptions = ["Completed", "Pending", "Overdue", "In Progress"];
  const fieldOptions = [
    { id: "ticketId", label: "Ticket ID" },
    { id: "complianceType", label: "Compliance Type" },
    { id: "taskName", label: "Task Name" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "dueDate", label: "Due Date" },
    { id: "status", label: "Status" },
    { id: "closureType", label: "Closure Type" },
    { id: "aiValidation", label: "AI Validation" },
    { id: "documentLink", label: "Document Link" }
  ];

  const exportData = (reportType: string) => {
    // Mock export functionality
    console.log(`Exporting ${reportType} data...`);
  };

  const generateWeeklyDigest = () => {
    // Mock weekly digest generation
    console.log("Generating weekly AI digest...");
  };

  const generateMISReport = () => {
    const filteredData = complianceData.filter(item => {
      const typeMatch = complianceTypes.length === 0 || complianceTypes.includes(item.complianceType);
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(item.status);
      return typeMatch && statusMatch;
    });

    const reportData = filteredData.map(item => {
      const filteredItem: any = {};
      selectedFields.forEach(field => {
        filteredItem[field] = item[field as keyof typeof item];
      });
      return filteredItem;
    });

    console.log("Generating MIS Report with filters:", {
      fromDate,
      toDate,
      complianceTypes,
      statusFilter,
      selectedFields,
      emailList,
      reportData
    });

    // Mock email sending
    if (emailList.trim()) {
      console.log(`Report will be emailed to: ${emailList}`);
    }

    setIsGenerateDialogOpen(false);
  };

  const handleComplianceTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setComplianceTypes([...complianceTypes, type]);
    } else {
      setComplianceTypes(complianceTypes.filter(t => t !== type));
    }
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilter([...statusFilter, status]);
    } else {
      setStatusFilter(statusFilter.filter(s => s !== status));
    }
  };

  const handleFieldChange = (fieldId: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, fieldId]);
    } else {
      setSelectedFields(selectedFields.filter(f => f !== fieldId));
    }
  };

  const handleGenerateReport = (filters: any, outputFormat?: string) => {
    console.log(`Generating report with filters:`, filters, "Format:", outputFormat);
  };

  const handlePresetReport = (reportType: string, config?: any) => {
    console.log(`Generating ${reportType} report with config:`, config);
  };

  const handleDrillDown = (type: string, data: any) => {
    console.log(`Drilling down into ${type}:`, data);
  };

  const handleSaveTemplate = (name: string, filters: any) => {
    console.log(`Saving template "${name}" with filters:`, filters);
  };

  const handleScheduleReport = (schedule: any) => {
    console.log(`Scheduling report:`, schedule);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Enhanced MIS Reports</h2>
          <p className="text-muted-foreground">Advanced reporting with AI insights and automation</p>
        </div>
      </div>

      <Tabs defaultValue="preset" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="preset">Preset Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="scheduler">Auto-Scheduler</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="legacy">Legacy View</TabsTrigger>
        </TabsList>

        <TabsContent value="preset">
          <PresetReports 
            onGenerateReport={handlePresetReport}
            onDrillDown={handleDrillDown}
          />
          <div className="mt-6">
            <AIReportNarrative 
              reportType="compliance-summary"
              reportData={{}}
              timeframe="this week"
            />
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder 
            onGenerateReport={handleGenerateReport}
            onSaveTemplate={handleSaveTemplate}
          />
        </TabsContent>

        <TabsContent value="scheduler">
          <ReportScheduler onScheduleReport={handleScheduleReport} />
        </TabsContent>

        <TabsContent value="scorecard">
          <ComplianceScorecard />
        </TabsContent>

        <TabsContent value="legacy">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Generate MIS Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate Custom MIS Report</DialogTitle>
                <DialogDescription>
                  Configure your MIS report with custom filters and email options
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Compliance Types Filter */}
                <div className="space-y-2">
                  <Label>Compliance Types</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {complianceTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={complianceTypes.includes(type)}
                          onCheckedChange={(checked) => handleComplianceTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label>Status Filter</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) => handleStatusFilterChange(status, checked as boolean)}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fields Selection */}
                <div className="space-y-2">
                  <Label>Include Fields</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldOptions.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={(checked) => handleFieldChange(field.id, checked as boolean)}
                        />
                        <Label htmlFor={`field-${field.id}`} className="text-sm">{field.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email List */}
                <div className="space-y-2">
                  <Label>Email Recipients (comma-separated)</Label>
                  <Textarea
                    placeholder="Enter email addresses separated by commas..."
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={generateMISReport}>
                  <Mail className="w-4 h-4 mr-2" />
                  Generate & Email Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={generateWeeklyDigest} variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Generate Weekly Digest
          </Button>
          <Button onClick={() => exportData("all")} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
        </TabsContent>
      </Tabs>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Head Filter</label>
              <Select value={subHeadFilter} onValueChange={setSubHeadFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub head" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax">Tax Compliance</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="labor">Labor Law</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Compliance MIS Report Data
          </CardTitle>
          <CardDescription>Sample data matching your uploaded format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-2 text-left">Ticket ID</th>
                  <th className="border border-border p-2 text-left">Compliance Type</th>
                  <th className="border border-border p-2 text-left">Task Name</th>
                  <th className="border border-border p-2 text-left">Assigned To</th>
                  <th className="border border-border p-2 text-left">Due Date</th>
                  <th className="border border-border p-2 text-left">Status</th>
                  <th className="border border-border p-2 text-left">Closure Type</th>
                  <th className="border border-border p-2 text-left">AI Validation</th>
                  <th className="border border-border p-2 text-left">Document Link</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/30">
                    <td className="border border-border p-2">{item.ticketId}</td>
                    <td className="border border-border p-2">{item.complianceType}</td>
                    <td className="border border-border p-2">{item.taskName}</td>
                    <td className="border border-border p-2">{item.assignedTo}</td>
                    <td className="border border-border p-2">{item.dueDate}</td>
                    <td className="border border-border p-2">
                      <Badge variant={
                        item.status === "Completed" ? "default" :
                        item.status === "Overdue" ? "destructive" :
                        "secondary"
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="border border-border p-2">{item.closureType}</td>
                    <td className="border border-border p-2">
                      <Badge variant={
                        item.aiValidation === "Passed" ? "default" :
                        item.aiValidation === "Not Initiated" ? "destructive" :
                        "secondary"
                      }>
                        {item.aiValidation}
                      </Badge>
                    </td>
                    <td className="border border-border p-2 text-blue-600 hover:underline cursor-pointer">
                      {item.documentLink}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Compliance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Compliance Summary
              </CardTitle>
              <CardDescription>Overall compliance performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{complianceSummary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Compliances</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">{complianceSummary.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">{complianceSummary.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive">{complianceSummary.overdue}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium">{complianceSummary.completionRate}%</span>
                </div>
                <Progress value={complianceSummary.completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Entity-wise Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Entity-wise Compliance Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["ABC Corporation", "XYZ Limited", "DEF Industries", "GHI Enterprises"].map((entity, index) => (
                  <div key={entity} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{entity}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{95 - index * 2}% compliance</span>
                      <Badge variant={index < 2 ? "default" : "secondary"}>
                        {index < 2 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          {/* Recurring Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recurring Compliance Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recurringTracker.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.frequency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Last Filed: {item.lastFiled}</div>
                      <div className="text-sm">Next Due: {item.nextDue}</div>
                    </div>
                    <Badge variant={item.status === "Due Soon" ? "destructive" : "default"}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Missed Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Missed Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missedDeadlines.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div>
                      <div className="font-medium">{item.compliance}</div>
                      <div className="text-sm text-muted-foreground">{item.entity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Due: {item.dueDate}</div>
                      <div className="text-sm text-destructive">{item.daysMissed} days overdue</div>
                    </div>
                    <Badge variant="destructive">{item.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Document Submission Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Document Submission Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentStatus.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.submitted}/{item.required} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auto-Closed Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Auto-Closed Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {autoClosedTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-sm text-muted-foreground">{ticket.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{ticket.autoClosedDate}</div>
                      <div className="text-sm text-success">{ticket.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Downloadable Proof Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Downloadable Proof Packages</CardTitle>
              <CardDescription>Download compliance proof packages by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Tax Compliance Package", "Regulatory Filing Package", "Corporate Governance Package", "Audit Trail Package"].map((packageName) => (
                  <Button key={packageName} variant="outline" className="h-auto p-4 flex-col items-start">
                    <div className="font-medium">{packageName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alerts & Escalations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alerts & Escalations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <Badge variant={alert.type === "Critical" ? "destructive" : alert.type === "Warning" ? "secondary" : "default"}>
                        {alert.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-muted-foreground">{alert.entity}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Activity Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{user.user.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="font-medium">{user.user}</div>
                        <div className="text-sm text-muted-foreground">{user.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.actions} actions</div>
                      <div className="text-sm text-muted-foreground">Last: {user.lastActive}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete audit log of all system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Compliance task completed", user: "John Doe", timestamp: "2024-01-18 16:30", details: "GST Return filed for ABC Corp" },
                  { action: "Document uploaded", user: "Jane Smith", timestamp: "2024-01-18 15:45", details: "Board resolution uploaded" },
                  { action: "User created", user: "Admin", timestamp: "2024-01-18 14:20", details: "New associate added to system" },
                  { action: "Report generated", user: "Mike Johnson", timestamp: "2024-01-18 13:15", details: "Monthly compliance report generated" }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">{log.details}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{log.user}</div>
                      <div className="text-sm text-muted-foreground">{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MISReports;