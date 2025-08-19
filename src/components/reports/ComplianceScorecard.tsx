import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar
} from "recharts";
import { 
  TrendingUp, TrendingDown, Award, AlertTriangle, 
  Calendar, Building, Users, Target 
} from "lucide-react";
import { format, subMonths, startOfMonth } from "date-fns";

interface CompliancePeriod {
  period: string;
  score: number;
  completionRate: number;
  overdueCount: number;
  criticalIssues: number;
}

interface DepartmentScore {
  department: string;
  currentScore: number;
  previousScore: number;
  trend: "up" | "down" | "stable";
  tasksCompleted: number;
  totalTasks: number;
}

interface EntityScore {
  entity: string;
  currentScore: number;
  previousScore: number;
  trend: "up" | "down" | "stable";
  criticalIssues: number;
  completionRate: number;
}

// Mock data for compliance scorecard
const complianceTrends: CompliancePeriod[] = [
  { period: "Q1 2024", score: 82, completionRate: 85, overdueCount: 15, criticalIssues: 3 },
  { period: "Q2 2024", score: 87, completionRate: 89, overdueCount: 12, criticalIssues: 2 },
  { period: "Q3 2024", score: 91, completionRate: 94, overdueCount: 8, criticalIssues: 1 },
  { period: "Q4 2024", score: 89, completionRate: 91, overdueCount: 10, criticalIssues: 2 }
];

const departmentScores: DepartmentScore[] = [
  { department: "Tax & Compliance", currentScore: 94, previousScore: 91, trend: "up", tasksCompleted: 89, totalTasks: 95 },
  { department: "Corporate Affairs", currentScore: 87, previousScore: 89, trend: "down", tasksCompleted: 78, totalTasks: 82 },
  { department: "HR & Labour", currentScore: 83, previousScore: 81, trend: "up", tasksCompleted: 67, totalTasks: 75 },
  { department: "Finance", currentScore: 92, previousScore: 92, trend: "stable", tasksCompleted: 84, totalTasks: 88 },
  { department: "Legal", currentScore: 88, previousScore: 85, trend: "up", tasksCompleted: 72, totalTasks: 79 }
];

const entityScores: EntityScore[] = [
  { entity: "ABC Pvt Ltd", currentScore: 96, previousScore: 94, trend: "up", criticalIssues: 0, completionRate: 98 },
  { entity: "XYZ Corp", currentScore: 89, previousScore: 91, trend: "down", criticalIssues: 2, completionRate: 92 },
  { entity: "DEF Limited", currentScore: 72, previousScore: 75, trend: "down", criticalIssues: 5, completionRate: 78 },
  { entity: "GHI Industries", currentScore: 91, previousScore: 88, trend: "up", criticalIssues: 1, completionRate: 95 },
  { entity: "JKL Enterprises", currentScore: 85, previousScore: 83, trend: "up", criticalIssues: 3, completionRate: 87 }
];

const monthlyTrends = [
  { month: "Jan", score: 85, tasks: 156 },
  { month: "Feb", score: 87, tasks: 162 },
  { month: "Mar", score: 83, tasks: 148 },
  { month: "Apr", score: 89, tasks: 171 },
  { month: "May", score: 91, tasks: 183 },
  { month: "Jun", score: 88, tasks: 167 }
];

const bucketComparison = [
  { bucket: "GST", current: 92, previous: 89, color: "#3b82f6" },
  { bucket: "TDS", current: 87, previous: 91, color: "#10b981" },
  { bucket: "ROC", current: 94, previous: 92, color: "#f59e0b" },
  { bucket: "Labour", current: 78, previous: 82, color: "#ef4444" },
  { bucket: "Income Tax", current: 90, previous: 88, color: "#8b5cf6" }
];

export const ComplianceScorecard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [comparisonMode, setComparisonMode] = useState("quarter");

  const currentPeriodScore = complianceTrends[complianceTrends.length - 1];
  const previousPeriodScore = complianceTrends[complianceTrends.length - 2];
  const scoreChange = currentPeriodScore.score - previousPeriodScore.score;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 95) return "Excellent";
    if (score >= 90) return "Very Good";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5" />
            Compliance Scorecard
          </h3>
          <p className="text-sm text-muted-foreground">
            Performance comparison across periods, departments, and entities
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={comparisonMode === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => setComparisonMode("month")}
          >
            Monthly View
          </Button>
          <Button 
            variant={comparisonMode === "quarter" ? "default" : "outline"} 
            size="sm"
            onClick={() => setComparisonMode("quarter")}
          >
            Quarterly View
          </Button>
        </div>
      </div>

      {/* Overall Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="text-3xl font-bold text-primary">{currentPeriodScore.score}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {scoreChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : scoreChange < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full" />
                  )}
                  <span className={`text-sm ${scoreChange > 0 ? 'text-green-600' : scoreChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange}% vs last period
                  </span>
                </div>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance Level</p>
                <p className="text-lg font-semibold">{getPerformanceLevel(currentPeriodScore.score)}</p>
                <Badge className={getScoreColor(currentPeriodScore.score)}>
                  {currentPeriodScore.score >= 90 ? 'High' : currentPeriodScore.score >= 80 ? 'Medium' : 'Low'} Risk
                </Badge>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{currentPeriodScore.completionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Tasks completed on time</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{currentPeriodScore.criticalIssues}</p>
                <p className="text-xs text-muted-foreground mt-1">Requiring immediate attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="departments">Department Comparison</TabsTrigger>
          <TabsTrigger value="entities">Entity Performance</TabsTrigger>
          <TabsTrigger value="buckets">Bucket Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={comparisonMode === "quarter" ? complianceTrends : monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={comparisonMode === "quarter" ? "period" : "month"} />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={complianceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="completionRate" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="overdueCount" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentScores} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="department" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="currentScore" fill="#3b82f6" />
                    <Bar dataKey="previousScore" fill="#94a3b8" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentScores.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{dept.department}</p>
                          <p className="text-xs text-muted-foreground">
                            {dept.tasksCompleted}/{dept.totalTasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(dept.trend)}
                        <Badge className={getScoreColor(dept.currentScore)}>
                          {dept.currentScore}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entityScores.map((entity, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{entity.entity}</CardTitle>
                    {getTrendIcon(entity.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{entity.currentScore}%</div>
                    <div className="text-xs text-muted-foreground">
                      vs {entity.previousScore}% last period
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>Completion Rate</span>
                      <span className="font-medium">{entity.completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Critical Issues</span>
                      <Badge variant={entity.criticalIssues === 0 ? "default" : "destructive"} className="text-xs">
                        {entity.criticalIssues}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Badge className={`w-full justify-center ${getScoreColor(entity.currentScore)}`}>
                      {getPerformanceLevel(entity.currentScore)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="buckets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bucket Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bucketComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bucket" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Period" />
                    <Bar dataKey="previous" fill="#94a3b8" name="Previous Period" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bucket Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bucketComparison.map((bucket, index) => {
                    const change = bucket.current - bucket.previous;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: bucket.color }}
                          />
                          <span className="font-medium text-sm">{bucket.bucket}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{bucket.current}%</span>
                          <span className={`text-xs ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            ({change > 0 ? '+' : ''}{change}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};