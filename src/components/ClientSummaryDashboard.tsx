import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useClient } from "@/contexts/ClientContext";
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3
} from "lucide-react";

interface ClientSummaryDashboardProps {
  className?: string;
}

// Mock data for client summaries
const getClientSummary = (clientId: string) => {
  const summaries: Record<string, any> = {
    '1': {
      complianceHealth: 85,
      upcomingDeadlines: {
        week: 2,
        twoWeeks: 4,
        month: 7
      },
      pendingItems: {
        documents: 3,
        tickets: 2,
        approvals: 1
      },
      lastMIS: {
        date: '2024-11-15',
        type: 'Monthly GST Return',
        status: 'Filed'
      },
      recentActivity: [
        { type: 'filing', description: 'GST Return - October 2024', date: '2024-11-15' },
        { type: 'document', description: 'Board Resolution uploaded', date: '2024-11-12' },
        { type: 'compliance', description: 'TDS Certificate generated', date: '2024-11-10' }
      ],
      complianceBreakdown: {
        roc: 90,
        gst: 85,
        labour: 80,
        income_tax: 88
      }
    },
    '2': {
      complianceHealth: 92,
      upcomingDeadlines: {
        week: 1,
        twoWeeks: 2,
        month: 3
      },
      pendingItems: {
        documents: 1,
        tickets: 0,
        approvals: 2
      },
      lastMIS: {
        date: '2024-11-14',
        type: 'Annual Return',
        status: 'Filed'
      },
      recentActivity: [
        { type: 'filing', description: 'Annual Return filed', date: '2024-11-14' },
        { type: 'compliance', description: 'Audit completion certificate', date: '2024-11-11' }
      ],
      complianceBreakdown: {
        roc: 95,
        gst: 90,
        labour: 88,
        income_tax: 95
      }
    },
    '3': {
      complianceHealth: 76,
      upcomingDeadlines: {
        week: 3,
        twoWeeks: 6,
        month: 9
      },
      pendingItems: {
        documents: 5,
        tickets: 3,
        approvals: 2
      },
      lastMIS: {
        date: '2024-11-08',
        type: 'GST Return - September 2024',
        status: 'Pending'
      },
      recentActivity: [
        { type: 'alert', description: 'GST Return deadline approaching', date: '2024-11-16' },
        { type: 'document', description: 'Bank statement uploaded', date: '2024-11-10' }
      ],
      complianceBreakdown: {
        roc: 75,
        gst: 70,
        labour: 85,
        income_tax: 75
      }
    }
  };
  
  return summaries[clientId] || summaries['1'];
};

export const ClientSummaryDashboard = ({ className }: ClientSummaryDashboardProps) => {
  const { currentClient, clients } = useClient();

  if (!currentClient) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No Client Selected</h3>
              <p className="text-sm text-muted-foreground">Select a client to view their summary dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = getClientSummary(currentClient.id);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Client Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-xl">{currentClient.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{currentClient.type}</Badge>
                  <span>•</span>
                  <span>Client since {new Date(currentClient.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Health */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Compliance Health</h4>
              {summary.complianceHealth >= 85 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{summary.complianceHealth}%</div>
              <Progress value={summary.complianceHealth} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Next 7 Days</h4>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{summary.upcomingDeadlines.week}</div>
            <p className="text-xs text-muted-foreground">
              {summary.upcomingDeadlines.month} total this month
            </p>
          </CardContent>
        </Card>

        {/* Pending Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Pending Items</h4>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">
              {summary.pendingItems.documents + summary.pendingItems.tickets + summary.pendingItems.approvals}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.pendingItems.documents} docs, {summary.pendingItems.tickets} tickets, {summary.pendingItems.approvals} approvals
            </p>
          </CardContent>
        </Card>

        {/* Last MIS */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Last Filing</h4>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-sm font-medium">{summary.lastMIS.type}</div>
            <p className="text-xs text-muted-foreground">
              {new Date(summary.lastMIS.date).toLocaleDateString()} • {summary.lastMIS.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(summary.complianceBreakdown).map(([type, score]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                  <span className="text-muted-foreground">{score as number}%</span>
                </div>
                <Progress value={score as number} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === 'filing' && <FileText className="w-4 h-4 text-blue-500" />}
                    {activity.type === 'document' && <FileText className="w-4 h-4 text-green-500" />}
                    {activity.type === 'compliance' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines Detail */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.upcomingDeadlines.week}</div>
              <p className="text-sm text-muted-foreground">Next 7 Days</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{summary.upcomingDeadlines.twoWeeks}</div>
              <p className="text-sm text-muted-foreground">Next 15 Days</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.upcomingDeadlines.month}</div>
              <p className="text-sm text-muted-foreground">Next 30 Days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};