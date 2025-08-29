import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, Clock, FileText, Calendar, Users,
  BarChart3, PieChart, Activity, Target
} from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ClientInsightsPanelProps {
  className?: string;
}

// Mock data for client insights
const complianceHealthTrend = [
  { month: 'Jan', score: 82 },
  { month: 'Feb', score: 85 },
  { month: 'Mar', score: 88 },
  { month: 'Apr', score: 91 },
  { month: 'May', score: 89 },
  { month: 'Jun', score: 93 }
];

const taskDistribution = [
  { name: 'GST', value: 35, color: '#3b82f6' },
  { name: 'TDS', value: 25, color: '#10b981' },
  { name: 'ROC', value: 20, color: '#f59e0b' },
  { name: 'Labour', value: 15, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' }
];

const clientPerformanceMetrics = [
  { metric: 'Task Completion Rate', current: 91, target: 95, trend: 'up' },
  { metric: 'On-time Filing Rate', current: 87, target: 90, trend: 'up' },
  { metric: 'Document Validation Rate', current: 94, target: 95, trend: 'stable' },
  { metric: 'Client Satisfaction', current: 4.2, target: 4.5, trend: 'up', isRating: true }
];

const upcomingRisks = [
  {
    id: '1',
    title: 'GST Return Filing Deadline',
    description: 'Multiple clients have GST returns due within 3 days',
    severity: 'high',
    affectedClients: 8,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'TDS Certificate Expiry',
    description: 'TDS certificates expiring for 5 clients this month',
    severity: 'medium',
    affectedClients: 5,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Annual Return Filing',
    description: 'ROC annual returns due for 3 clients',
    severity: 'medium',
    affectedClients: 3,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const clientTypes = [
  { value: 'pvt-ltd', label: 'Private Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'opc', label: 'One Person Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'proprietorship', label: 'Proprietorship' }
];

export const ClientInsightsPanel: React.FC<ClientInsightsPanelProps> = ({ className }) => {
  const { clients, currentClient } = useClient();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatMetricValue = (value: number, isRating: boolean = false) => {
    if (isRating) {
      return `${value.toFixed(1)}/5.0`;
    }
    return `${value}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Client Portfolio Insights
            </CardTitle>
            <Badge variant="outline">
              {clients.length} Active Clients
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4">
                {clientPerformanceMetrics.map((metric, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{metric.metric}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Current: {formatMetricValue(metric.current, metric.isRating)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Target: {formatMetricValue(metric.target, metric.isRating)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatMetricValue(metric.current, metric.isRating)}
                          </div>
                          <Progress 
                            value={metric.isRating ? (metric.current / 5) * 100 : metric.current} 
                            className="w-20 h-2 mt-1" 
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compliance Health Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={complianceHealthTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[75, 100]} />
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
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Task Distribution by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={taskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {taskDistribution.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs">{entry.name} ({entry.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Client Type Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientTypes.map((type) => {
                        const count = clients.filter(c => c.type === type.value).length;
                        const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
                        
                        return (
                          <div key={type.value} className="flex items-center justify-between">
                            <span className="text-sm">{type.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Compliance Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingRisks.map((risk) => (
                      <Card key={risk.id} className={`p-4 border ${getSeverityColor(risk.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              <h4 className="font-medium">{risk.title}</h4>
                              <Badge className={getSeverityColor(risk.severity)}>
                                {risk.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {risk.affectedClients} clients affected
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {risk.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};