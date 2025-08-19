import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, Filter, Calendar, Users, FileText, 
  Building, CheckCircle, Save, Play, Trash2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportFilter {
  dateRange: {
    from: string;
    to: string;
    preset: string;
  };
  complianceHead: string[];
  complianceSubhead: string[];
  entity: string[];
  status: string[];
  assignee: string[];
  bucket: string[];
  documentType: string[];
  validationResult: string[];
}

interface CustomReportBuilderProps {
  onGenerateReport: (filters: ReportFilter, outputFormat: string) => void;
  onSaveTemplate: (name: string, filters: ReportFilter) => void;
}

const filterOptions = {
  complianceHead: ["Tax Compliance", "Regulatory Compliance", "Corporate Governance", "Labour Compliance", "Environmental"],
  complianceSubhead: ["GST", "TDS", "Income Tax", "ROC", "SEBI", "RBI", "PF", "ESI", "Labour License"],
  entity: ["ABC Pvt Ltd", "XYZ Corp", "DEF Limited", "GHI Industries", "JKL Enterprises"],
  status: ["Completed", "Pending", "Overdue", "In Progress", "Escalated", "On Hold"],
  assignee: ["Priya Sharma", "Rajesh Kumar", "Anita Patel", "Vikram Singh", "Meera Gupta", "Suresh Nair"],
  bucket: ["ROC", "GST", "TDS", "Labour", "Income Tax", "Environmental", "Corporate", "Regulatory"],
  documentType: ["Return", "Certificate", "License", "Registration", "Filing", "Application", "Report"],
  validationResult: ["Passed", "Failed", "Pending", "Not Initiated", "In Progress", "Requires Review"]
};

const datePresets = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thismonth", label: "This Month" },
  { value: "lastmonth", label: "Last Month" },
  { value: "thisquarter", label: "This Quarter" },
  { value: "thisyear", label: "This Year" },
  { value: "custom", label: "Custom Range" }
];

const outputFormats = [
  { value: "pdf", label: "PDF Report", icon: FileText },
  { value: "excel", label: "Excel Spreadsheet", icon: FileText },
  { value: "csv", label: "CSV Data", icon: FileText },
  { value: "zip", label: "ZIP with Documents", icon: FileText }
];

export const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({
  onGenerateReport,
  onSaveTemplate
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: { from: "", to: "", preset: "last30days" },
    complianceHead: [],
    complianceSubhead: [],
    entity: [],
    status: [],
    assignee: [],
    bucket: [],
    documentType: [],
    validationResult: []
  });
  
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [templateName, setTemplateName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilterChange = (filterType: keyof ReportFilter, value: string, checked?: boolean) => {
    if (filterType === "dateRange") {
      setFilters(prev => ({
        ...prev,
        dateRange: { ...prev.dateRange, [value]: value }
      }));
    } else {
      const filterArray = filters[filterType] as string[];
      if (checked !== undefined) {
        if (checked) {
          setFilters(prev => ({
            ...prev,
            [filterType]: [...filterArray, value]
          }));
        } else {
          setFilters(prev => ({
            ...prev,
            [filterType]: filterArray.filter(item => item !== value)
          }));
        }
      }
    }
  };

  const handleDateRangeChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: { from: "", to: "", preset: "last30days" },
      complianceHead: [],
      complianceSubhead: [],
      entity: [],
      status: [],
      assignee: [],
      bucket: [],
      documentType: [],
      validationResult: []
    });
  };

  const getSelectedFiltersCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === "dateRange") {
        return count + (value.preset !== "last30days" || value.from || value.to ? 1 : 0);
      }
      return count + (Array.isArray(value) ? value.length : 0);
    }, 0);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onGenerateReport(filters, outputFormat);
    setIsGenerating(false);
    
    toast({
      title: "Report Generated",
      description: `Custom report has been generated in ${outputFormat.toUpperCase()} format`,
    });
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }
    
    onSaveTemplate(templateName, filters);
    setTemplateName("");
    
    toast({
      title: "Template Saved",
      description: `Report template "${templateName}" has been saved`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Custom Report Builder
          </h3>
          <p className="text-sm text-muted-foreground">
            Create customized reports with advanced filtering options
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {getSelectedFiltersCount()} filters active
          </Badge>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filter Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  {/* Date Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select 
                        value={filters.dateRange.preset} 
                        onValueChange={(value) => handleDateRangeChange("preset", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {datePresets.map(preset => (
                            <SelectItem key={preset.value} value={preset.value}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={filters.dateRange.from}
                        onChange={(e) => handleDateRangeChange("from", e.target.value)}
                        disabled={filters.dateRange.preset !== "custom"}
                      />
                      <Input
                        type="date"
                        value={filters.dateRange.to}
                        onChange={(e) => handleDateRangeChange("to", e.target.value)}
                        disabled={filters.dateRange.preset !== "custom"}
                      />
                    </div>
                  </div>

                  {/* Compliance Head */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Compliance Head</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.complianceHead.map((head) => (
                        <div key={head} className="flex items-center space-x-2">
                          <Checkbox
                            id={`head-${head}`}
                            checked={filters.complianceHead.includes(head)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("complianceHead", head, checked as boolean)
                            }
                          />
                          <Label htmlFor={`head-${head}`} className="text-xs">
                            {head}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Entity */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Entity
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.entity.map((entity) => (
                        <div key={entity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`entity-${entity}`}
                            checked={filters.entity.includes(entity)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("entity", entity, checked as boolean)
                            }
                          />
                          <Label htmlFor={`entity-${entity}`} className="text-xs">
                            {entity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Status
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {filterOptions.status.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("status", status, checked as boolean)
                            }
                          />
                          <Label htmlFor={`status-${status}`} className="text-xs">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  {/* Compliance Subhead */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Compliance Subhead</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {filterOptions.complianceSubhead.map((subhead) => (
                        <div key={subhead} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subhead-${subhead}`}
                            checked={filters.complianceSubhead.includes(subhead)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("complianceSubhead", subhead, checked as boolean)
                            }
                          />
                          <Label htmlFor={`subhead-${subhead}`} className="text-xs">
                            {subhead}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Assignee
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.assignee.map((assignee) => (
                        <div key={assignee} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assignee-${assignee}`}
                            checked={filters.assignee.includes(assignee)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("assignee", assignee, checked as boolean)
                            }
                          />
                          <Label htmlFor={`assignee-${assignee}`} className="text-xs">
                            {assignee}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bucket */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Bucket</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {filterOptions.bucket.map((bucket) => (
                        <div key={bucket} className="flex items-center space-x-2">
                          <Checkbox
                            id={`bucket-${bucket}`}
                            checked={filters.bucket.includes(bucket)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("bucket", bucket, checked as boolean)
                            }
                          />
                          <Label htmlFor={`bucket-${bucket}`} className="text-xs">
                            {bucket}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Document Type
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {filterOptions.documentType.map((docType) => (
                        <div key={docType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`doctype-${docType}`}
                            checked={filters.documentType.includes(docType)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("documentType", docType, checked as boolean)
                            }
                          />
                          <Label htmlFor={`doctype-${docType}`} className="text-xs">
                            {docType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="validation" className="space-y-4">
                  {/* Validation Result */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Validation Result</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {filterOptions.validationResult.map((result) => (
                        <div key={result} className="flex items-center space-x-2">
                          <Checkbox
                            id={`validation-${result}`}
                            checked={filters.validationResult.includes(result)}
                            onCheckedChange={(checked) => 
                              handleFilterChange("validationResult", result, checked as boolean)
                            }
                          />
                          <Label htmlFor={`validation-${result}`} className="text-xs">
                            {result}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Output Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Output Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outputFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <div
                    key={format.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      outputFormat === format.value 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setOutputFormat(format.value)}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{format.label}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Save as Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Template name (e.g., 'CFO Weekly Digest')"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </CardContent>
          </Card>

          <Button 
            className="w-full"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};