import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, TrendingUp, AlertTriangle, Users, Clock, 
  CheckCircle, XCircle, Calendar, BarChart3, Activity,
  Download, Eye, Filter
} from "lucide-react";
import { format } from "date-fns";

interface PresetReportProps {
  onGenerateReport: (reportType: string, config?: any) => void;
  onDrillDown: (type: string, data: any) => void;
}

const presetReportTypes = [
  {
    id: "compliance-summary",
    title: "Compliance Summary",
    description: "Overview of all compliance activities and status",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
    metrics: {
      total: 156,
      completed: 142,
      pending: 8,
      overdue: 6,
      completionRate: 91
    }
  },
  {
    id: "overdue-tasks",
    title: "Overdue Tasks",
    description: "Tasks that have passed their due dates",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
    metrics: {
      critical: 3,
      high: 8,
      medium: 12,
      totalOverdue: 23,
      avgDaysOverdue: 5.2
    }
  },
  {
    id: "filing-status-bucket",
    title: "Filing Status by Bucket",
    description: "Compliance status grouped by regulatory buckets",
    icon: BarChart3,
    color: "bg-green-100 text-green-600",
    metrics: {
      gst: { total: 45, completed: 42, pending: 3 },
      tds: { total: 28, completed: 25, pending: 3 },
      roc: { total: 15, completed: 14, pending: 1 },
      labour: { total: 32, completed: 28, pending: 4 }
    }
  },
  {
    id: "user-activity",
    title: "User Activity Log", 
    description: "Track user actions and performance metrics",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    metrics: {
      activeUsers: 25,
      totalActions: 342,
      avgActionsPerUser: 13.7,
      topPerformer: "Priya Sharma"
    }
  },
  {
    id: "auto-closed-tickets",
    title: "Auto-Closed Tickets",
    description: "Tickets automatically resolved by the system",
    icon: CheckCircle,
    color: "bg-cyan-100 text-cyan-600",
    metrics: {
      thisMonth: 45,
      lastMonth: 38,
      successRate: 94.2,
      avgClosureTime: "2.3 hours"
    }
  },
  {
    id: "document-validation",
    title: "Document Validation Status",
    description: "AI validation results and document quality metrics",
    icon: Activity,
    color: "bg-orange-100 text-orange-600",
    metrics: {
      validated: 89,
      pending: 12,
      failed: 5,
      passRate: 94.7
    }
  },
  {
    id: "entity-compliance",
    title: "Entity-wise Compliance",
    description: "Compliance performance broken down by entity",
    icon: TrendingUp,
    color: "bg-indigo-100 text-indigo-600",
    metrics: {
      entities: 8,
      avgCompliance: 87.5,
      topEntity: "ABC Pvt Ltd (96%)",
      lowestEntity: "DEF Corp (72%)"
    }
  }
];

export const PresetReports: React.FC<PresetReportProps> = ({ onGenerateReport, onDrillDown }) => {
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: string) => {
    setLoadingReport(reportType);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onGenerateReport(reportType);
    setLoadingReport(null);
  };

  const formatMetricValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Preset Report Types</h3>
          <p className="text-sm text-muted-foreground">
            Pre-configured reports with commonly used metrics and filters
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Customize All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetReportTypes.map((report) => {
          const IconComponent = report.icon;
          const isLoading = loadingReport === report.id;
          
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {format(new Date(), 'MMM dd')}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold">
                  {report.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {report.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Key Metrics Preview */}
                <div className="space-y-2">
                  {report.id === "compliance-summary" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Completion Rate</span>
                        <span className="text-sm font-semibold text-green-600">
                          {report.metrics.completionRate}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{report.metrics.completed}</div>
                          <div className="text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-yellow-600">{report.metrics.pending}</div>
                          <div className="text-muted-foreground">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{report.metrics.overdue}</div>
                          <div className="text-muted-foreground">Overdue</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {report.id === "overdue-tasks" && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-semibold text-red-600">{report.metrics.totalOverdue}</div>
                        <div className="text-muted-foreground">Total Overdue</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-600">{report.metrics.avgDaysOverdue}</div>
                        <div className="text-muted-foreground">Avg Days</div>
                      </div>
                    </div>
                  )}
                  
                  {report.id === "filing-status-bucket" && (
                    <div className="space-y-1">
                      {Object.entries(report.metrics).map(([bucket, data]: [string, any]) => (
                        <div 
                          key={bucket} 
                          className="flex justify-between items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded"
                          onClick={() => onDrillDown('bucket', { bucket, data })}
                        >
                          <span className="uppercase font-medium">{bucket}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-green-600">{data.completed}</span>
                            <span className="text-muted-foreground">/{data.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(report.id === "user-activity" || report.id === "auto-closed-tickets" || 
                    report.id === "document-validation" || report.id === "entity-compliance") && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(report.metrics).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-semibold">{formatMetricValue(value)}</div>
                          <div className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3 mr-1" />
                    )}
                    {isLoading ? 'Generating...' : 'Generate'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDrillDown('preview', report)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-muted-foreground">Report Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">91%</div>
              <div className="text-sm text-muted-foreground">Avg Compliance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-muted-foreground">Items Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">342</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};