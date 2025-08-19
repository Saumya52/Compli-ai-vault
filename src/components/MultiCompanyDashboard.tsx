import { useClient } from "@/contexts/ClientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";

export const MultiCompanyDashboard = () => {
  const { clients } = useClient();

  // Mock data for demonstration - in real app this would come from API
  const getClientMetrics = (clientId: string) => {
    const metrics = {
      '1': { complianceHealth: 85, urgentTasks: 2, pendingDocs: 5, lastActivity: '2 hours ago' },
      '2': { complianceHealth: 92, urgentTasks: 1, pendingDocs: 3, lastActivity: '4 hours ago' },
      '3': { complianceHealth: 78, urgentTasks: 3, pendingDocs: 7, lastActivity: '1 day ago' },
    };
    return metrics[clientId as keyof typeof metrics] || { complianceHealth: 80, urgentTasks: 1, pendingDocs: 4, lastActivity: '1 hour ago' };
  };

  const overallStats = {
    totalClients: clients.length,
    avgComplianceHealth: Math.round(clients.reduce((acc, client) => acc + getClientMetrics(client.id).complianceHealth, 0) / clients.length),
    totalUrgentTasks: clients.reduce((acc, client) => acc + getClientMetrics(client.id).urgentTasks, 0),
    totalPendingDocs: clients.reduce((acc, client) => acc + getClientMetrics(client.id).pendingDocs, 0),
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthVariant = (health: number): "default" | "secondary" | "destructive" | "outline" => {
    if (health >= 90) return "default";
    if (health >= 75) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold">{overallStats.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg Compliance</p>
                <p className="text-2xl font-bold">{overallStats.avgComplianceHealth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Urgent Tasks</p>
                <p className="text-2xl font-bold">{overallStats.totalUrgentTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Pending Docs</p>
                <p className="text-2xl font-bold">{overallStats.totalPendingDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Clients Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => {
              const metrics = getClientMetrics(client.id);
              return (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{client.name}</h3>
                        <Badge variant="outline">{client.type}</Badge>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PAN: {client.pan} • Created: {client.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Compliance Health */}
                    <div className="text-center min-w-[100px]">
                      <p className="text-sm text-muted-foreground mb-1">Compliance</p>
                      <div className="flex items-center gap-2">
                        <Progress value={metrics.complianceHealth} className="w-16 h-2" />
                        <span className={`text-sm font-medium ${getHealthColor(metrics.complianceHealth)}`}>
                          {metrics.complianceHealth}%
                        </span>
                      </div>
                    </div>

                    {/* Urgent Tasks */}
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm text-muted-foreground mb-1">Urgent</p>
                      <Badge variant={metrics.urgentTasks > 0 ? "destructive" : "default"}>
                        {metrics.urgentTasks} tasks
                      </Badge>
                    </div>

                    {/* Pending Docs */}
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm text-muted-foreground mb-1">Pending</p>
                      <Badge variant="secondary">
                        {metrics.pendingDocs} docs
                      </Badge>
                    </div>

                    {/* Last Activity */}
                    <div className="text-center min-w-[100px]">
                      <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {metrics.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Health Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Excellent (90%+)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm font-medium">1 client</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Good (75-89%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">1 client</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Needs Attention (&lt;75%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm font-medium">1 client</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">High Priority</p>
                  <p className="text-xs text-muted-foreground">StartupVenture OPC - 3 overdue tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Due This Week</p>
                  <p className="text-xs text-muted-foreground">5 tasks across all clients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">On Track</p>
                  <p className="text-xs text-muted-foreground">InnovateTech LLP - All compliances up to date</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};