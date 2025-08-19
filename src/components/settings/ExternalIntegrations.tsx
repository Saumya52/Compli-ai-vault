import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plug, Settings, Key, CheckCircle, XCircle, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'accounting' | 'document' | 'calendar' | 'communication';
  isConnected: boolean;
  apiKey?: string;
  lastSync?: string;
  syncStatus: 'success' | 'error' | 'pending' | 'never';
  logo: string;
}

export const ExternalIntegrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'zoho-books',
      name: 'Zoho Books',
      description: 'Import financial data and export compliance reports',
      category: 'accounting',
      isConnected: true,
      apiKey: '***hidden***',
      lastSync: '2024-01-15 10:30 AM',
      syncStatus: 'success',
      logo: '📊'
    },
    {
      id: 'tally',
      name: 'Tally',
      description: 'Sync accounting data and generate tax reports',
      category: 'accounting',
      isConnected: false,
      syncStatus: 'never',
      logo: '🧮'
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Digital signature integration for compliance documents',
      category: 'document',
      isConnected: true,
      apiKey: '***hidden***',
      lastSync: '2024-01-14 02:15 PM',
      syncStatus: 'success',
      logo: '✍️'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync compliance deadlines and meetings',
      category: 'calendar',
      isConnected: false,
      syncStatus: 'never',
      logo: '📅'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send compliance notifications to Slack channels',
      category: 'communication',
      isConnected: false,
      syncStatus: 'never',
      logo: '💬'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const categoryColors = {
    accounting: 'bg-blue-100 text-blue-800',
    document: 'bg-green-100 text-green-800',
    calendar: 'bg-purple-100 text-purple-800',
    communication: 'bg-orange-100 text-orange-800'
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey('');
    setIsConfigDialogOpen(true);
  };

  const handleSaveConnection = () => {
    if (!selectedIntegration || !apiKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid API key",
        variant: "destructive"
      });
      return;
    }

    setIntegrations(integrations.map(integration =>
      integration.id === selectedIntegration.id
        ? {
            ...integration,
            isConnected: true,
            apiKey: '***hidden***',
            lastSync: new Date().toLocaleString(),
            syncStatus: 'success' as const
          }
        : integration
    ));

    setIsConfigDialogOpen(false);
    setSelectedIntegration(null);
    setApiKey('');

    toast({
      title: "Integration Connected",
      description: `${selectedIntegration.name} has been connected successfully`
    });
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            isConnected: false,
            apiKey: undefined,
            lastSync: undefined,
            syncStatus: 'never' as const
          }
        : integration
    ));

    toast({
      title: "Integration Disconnected",
      description: "Integration has been disconnected successfully"
    });
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            syncStatus: 'pending' as const
          }
        : integration
    ));

    // Simulate sync process
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration =>
        integration.id === integrationId
          ? {
              ...integration,
              lastSync: new Date().toLocaleString(),
              syncStatus: 'success' as const
            }
          : integration
      ));
      
      toast({
        title: "Sync Complete",
        description: "Data has been synchronized successfully"
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="w-5 h-5" />
            <span>External Integrations</span>
          </CardTitle>
          <CardDescription>
            Connect and manage third-party app integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
              <div key={category}>
                <h3 className="text-lg font-medium mb-4 capitalize">
                  {category.replace('-', ' ')} Integrations
                </h3>
                <div className="grid gap-4">
                  {categoryIntegrations.map((integration) => (
                    <Card key={integration.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{integration.logo}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{integration.name}</h4>
                              <Badge className={categoryColors[integration.category]}>
                                {integration.category}
                              </Badge>
                              {integration.isConnected ? (
                                <Badge variant="default">Connected</Badge>
                              ) : (
                                <Badge variant="secondary">Not Connected</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            {integration.lastSync && (
                              <p className="text-xs text-muted-foreground">
                                Last sync: {integration.lastSync}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(integration.syncStatus)}
                          {integration.isConnected ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSync(integration.id)}
                                disabled={integration.syncStatus === 'pending'}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sync
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleConnect(integration)}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Configure
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDisconnect(integration.id)}
                              >
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleConnect(integration)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configure {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect this integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>How to get your API key:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>1. Log in to your {selectedIntegration?.name} account</li>
                <li>2. Navigate to Settings → API or Developer Settings</li>
                <li>3. Generate a new API key with required permissions</li>
                <li>4. Copy and paste the key above</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection}>
              <Key className="w-4 h-4 mr-2" />
              Connect Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
          <CardDescription>
            View recent synchronization activities and logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Zoho Books</TableCell>
                <TableCell>Data Sync</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Success</span>
                  </div>
                </TableCell>
                <TableCell>2024-01-15 10:30 AM</TableCell>
                <TableCell>127 transactions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>DocuSign</TableCell>
                <TableCell>Document Sync</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Success</span>
                  </div>
                </TableCell>
                <TableCell>2024-01-14 02:15 PM</TableCell>
                <TableCell>15 documents</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};