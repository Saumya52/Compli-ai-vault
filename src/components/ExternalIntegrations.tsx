import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Cloud, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  FolderSync,
  Clock,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface IntegrationService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isConnected: boolean;
  isEnabled: boolean;
  lastSync?: Date;
  folders?: number;
  files?: number;
  status: "connected" | "disconnected" | "syncing" | "error";
  features: string[];
}

interface ExternalIntegrationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalIntegrations = ({ isOpen, onClose }: ExternalIntegrationsProps) => {
  const { toast } = useToast();
  
  const [services, setServices] = React.useState<IntegrationService[]>([
    {
      id: "googledrive",
      name: "Google Drive",
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      description: "Sync documents with Google Drive workspace",
      isConnected: false,
      isEnabled: false,
      status: "disconnected",
      features: ["Two-way sync", "Folder mapping", "Real-time updates", "Shared drives"]
    },
    {
      id: "onedrive",
      name: "Microsoft OneDrive",
      icon: <Cloud className="w-6 h-6 text-blue-500" />,
      description: "Connect with OneDrive for Business",
      isConnected: true,
      isEnabled: true,
      lastSync: new Date(Date.now() - 300000), // 5 mins ago
      folders: 12,
      files: 345,
      status: "connected",
      features: ["Business integration", "SharePoint sync", "Teams collaboration", "Version control"]
    },
    {
      id: "tally",
      name: "Tally ERP",
      icon: <FolderSync className="w-6 h-6 text-green-600" />,
      description: "Import financial documents from Tally ERP",
      isConnected: true,
      isEnabled: false,
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      folders: 8,
      files: 156,
      status: "error",
      features: ["Automated import", "Voucher sync", "Financial reports", "GST documents"]
    },
    {
      id: "zoho",
      name: "Zoho Docs",
      icon: <Cloud className="w-6 h-6 text-orange-600" />,
      description: "Integrate with Zoho Workspace and Documents",
      isConnected: false,
      isEnabled: false,
      status: "disconnected",
      features: ["Document editing", "Collaborative tools", "Workflow automation", "Digital signatures"]
    }
  ]);

  const [syncProgress, setSyncProgress] = React.useState<Record<string, number>>({});

  const handleConnect = async (serviceId: string) => {
    toast({
      title: "Connecting...",
      description: "Opening authentication window",
    });
    
    // Simulate OAuth flow
    setTimeout(() => {
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isConnected: true, status: "connected" as const }
          : service
      ));
      toast({
        title: "Connected Successfully",
        description: `${services.find(s => s.id === serviceId)?.name} has been connected`,
      });
    }, 2000);
  };

  const handleDisconnect = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            isConnected: false, 
            isEnabled: false, 
            status: "disconnected" as const,
            lastSync: undefined,
            folders: undefined,
            files: undefined
          }
        : service
    ));
    toast({
      title: "Disconnected",
      description: `${services.find(s => s.id === serviceId)?.name} has been disconnected`,
    });
  };

  const handleToggleSync = (serviceId: string, enabled: boolean) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isEnabled: enabled }
        : service
    ));
    
    if (enabled) {
      handleSync(serviceId);
    }
  };

  const handleSync = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service?.isConnected) return;

    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: "syncing" as const }
        : service
    ));

    setSyncProgress(prev => ({ ...prev, [serviceId]: 0 }));

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        const currentProgress = prev[serviceId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setServices(prevServices => prevServices.map(service => 
            service.id === serviceId 
              ? { 
                  ...service, 
                  status: "connected" as const,
                  lastSync: new Date(),
                  files: Math.floor(Math.random() * 500) + 100
                }
              : service
          ));
          toast({
            title: "Sync Complete",
            description: `${service.name} sync completed successfully`,
          });
          return { ...prev, [serviceId]: 0 };
        }
        return { ...prev, [serviceId]: currentProgress + 10 };
      });
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>;
      case "syncing":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          Syncing
        </Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>External Integrations</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {/* Integration Services */}
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {service.icon}
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(service.status)}
                        {service.isConnected && (
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Connection Status */}
                    {!service.isConnected ? (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">
                          Connect to enable document synchronization
                        </span>
                        <Button onClick={() => handleConnect(service.id)}>
                          Connect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Sync Controls */}
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Auto-sync enabled</span>
                            <Switch
                              checked={service.isEnabled}
                              onCheckedChange={(checked) => handleToggleSync(service.id, checked)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSync(service.id)}
                              disabled={service.status === "syncing"}
                            >
                              {service.status === "syncing" ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                              )}
                              Sync Now
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(service.id)}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>

                        {/* Sync Progress */}
                        {service.status === "syncing" && syncProgress[service.id] !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Syncing documents...</span>
                              <span>{syncProgress[service.id]}%</span>
                            </div>
                            <Progress value={syncProgress[service.id]} />
                          </div>
                        )}

                        {/* Stats */}
                        {service.isConnected && service.lastSync && (
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>{service.folders} folders</span>
                              <span>{service.files} files</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Last sync: {service.lastSync.toLocaleTimeString()}
                            </div>
                          </div>
                        )}

                        {/* Error Alert */}
                        {service.status === "error" && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Sync failed. Please check your connection and try again.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Import/Export Actions */}
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Bulk Import</h4>
                      <p className="text-sm text-muted-foreground">Import documents from connected services</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    Start Import
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-6 h-6 text-primary" />
                    <div>
                      <h4 className="font-medium">Bulk Export</h4>
                      <p className="text-sm text-muted-foreground">Export vault documents to external services</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Start Export
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};