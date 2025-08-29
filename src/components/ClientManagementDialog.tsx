import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, Users, TrendingUp, Calendar, FileText, 
  AlertTriangle, CheckCircle, Clock, Plus, Edit, 
  Trash2, Search, Filter, Download, Mail, Phone,
  MapPin, CreditCard, Eye, BarChart3
} from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ClientAnalytics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  complianceScore: number;
  lastActivity: Date;
  documentsCount: number;
  upcomingDeadlines: number;
}

const clientTypes = [
  { value: 'pvt-ltd', label: 'Private Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'opc', label: 'One Person Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'proprietorship', label: 'Proprietorship' }
];

interface ClientManagementDialogProps {
  children?: React.ReactNode;
}

export const ClientManagementDialog: React.FC<ClientManagementDialogProps> = ({ children }) => {
  const { clients, refreshClients, isLoading } = useClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientAnalytics, setClientAnalytics] = useState<Record<string, ClientAnalytics>>({});

  // Mock analytics data - in real app this would come from API
  const generateMockAnalytics = (clientId: string): ClientAnalytics => {
    const baseMetrics = {
      '1': { totalTasks: 45, completedTasks: 38, overdueTasks: 2, complianceScore: 85, documentsCount: 156, upcomingDeadlines: 5 },
      '2': { totalTasks: 32, completedTasks: 29, overdueTasks: 1, complianceScore: 92, documentsCount: 98, upcomingDeadlines: 3 },
      '3': { totalTasks: 28, completedTasks: 22, overdueTasks: 3, complianceScore: 76, documentsCount: 67, upcomingDeadlines: 7 },
    };
    
    return {
      ...(baseMetrics[clientId as keyof typeof baseMetrics] || baseMetrics['1']),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
  };

  useEffect(() => {
    if (isOpen) {
      // Generate analytics for all clients
      const analytics: Record<string, ClientAnalytics> = {};
      clients.forEach(client => {
        analytics[client.id] = generateMockAnalytics(client.id);
      });
      setClientAnalytics(analytics);
    }
  }, [isOpen, clients]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefreshClients = async () => {
    await refreshClients();
    toast({
      title: "Clients Refreshed",
      description: "Client list has been updated from server",
    });
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'Pvt Ltd': return '🏢';
      case 'LLP': return '🤝';
      case 'OPC': return '👤';
      case 'Partnership': return '🤝';
      case 'Proprietorship': return '👨‍💼';
      default: return '🏢';
    }
  };

  const renderClientOverview = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleRefreshClients} disabled={isLoading}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Client Cards */}
      <ScrollArea className="h-96">
        <div className="grid gap-4">
          {filteredClients.map((client) => {
            const analytics = clientAnalytics[client.id];
            return (
              <Card 
                key={client.id} 
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedClient === client.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getClientTypeIcon(client.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{client.name}</h3>
                          <Badge variant="outline">{client.type}</Badge>
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Client since {client.createdAt}
                          {client.pan && ` • PAN: ${client.pan}`}
                        </div>
                      </div>
                    </div>
                    
                    {analytics && (
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getComplianceScoreColor(analytics.complianceScore).split(' ')[0]}`}>
                          {analytics.complianceScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Compliance Score</div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedClient === client.id && analytics && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{analytics.totalTasks}</div>
                          <div className="text-xs text-muted-foreground">Total Tasks</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{analytics.completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="text-lg font-bold text-red-600">{analytics.overdueTasks}</div>
                          <div className="text-xs text-muted-foreground">Overdue</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600">{analytics.upcomingDeadlines}</div>
                          <div className="text-xs text-muted-foreground">Due Soon</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last activity: {format(analytics.lastActivity, 'MMM dd, yyyy')}
                        </span>
                        <span className="text-muted-foreground">
                          {analytics.documentsCount} documents in vault
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {filteredClients.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No clients found</p>
          <p className="text-sm">
            {searchTerm ? 'Try adjusting your search' : 'Add your first client to get started'}
          </p>
        </div>
      )}
    </div>
  );

  const renderClientAnalytics = () => (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Clients</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Avg Compliance</p>
                <p className="text-2xl font-bold">
                  {Math.round(Object.values(clientAnalytics).reduce((acc, curr) => acc + curr.complianceScore, 0) / Object.keys(clientAnalytics).length) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Total Overdue</p>
                <p className="text-2xl font-bold">
                  {Object.values(clientAnalytics).reduce((acc, curr) => acc + curr.overdueTasks, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Client Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientTypes.map((type) => {
              const count = clients.filter(c => c.type === type.value).length;
              const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
              
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getClientTypeIcon(type.value)}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start">
            <Building2 className="w-4 h-4 mr-2" />
            Manage Clients
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Client Management Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Client Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderClientOverview()}
          </TabsContent>

          <TabsContent value="analytics">
            {renderClientAnalytics()}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Client Management Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Client Type</Label>
                    <Input value="Pvt Ltd" readOnly />
                  </div>
                  <div>
                    <Label>Auto-assign Compliance Heads</Label>
                    <Input value="GST, ROC, Income Tax" readOnly />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Additional client management settings can be configured here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};