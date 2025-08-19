import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, List, FileText, Plus, MessageCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ClientSummaryCardsProps {
  className?: string;
}

interface Client {
  id: string;
  name: string;
  complianceHealth: "good" | "warning" | "critical";
  openTasks: number;
  lastInteraction: {
    type: string;
    date: string;
  };
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "TechCorp Industries",
    complianceHealth: "good",
    openTasks: 3,
    lastInteraction: { type: "Document Upload", date: "2 hours ago" }
  },
  {
    id: "2", 
    name: "GreenEnergy Solutions",
    complianceHealth: "warning",
    openTasks: 7,
    lastInteraction: { type: "MIS Report Sent", date: "1 day ago" }
  },
  {
    id: "3",
    name: "RetailMax Pvt Ltd",
    complianceHealth: "critical",
    openTasks: 12,
    lastInteraction: { type: "Task Created", date: "3 days ago" }
  },
  {
    id: "4",
    name: "FinanceFirst Corp",
    complianceHealth: "good",
    openTasks: 2,
    lastInteraction: { type: "Vault Access", date: "5 hours ago" }
  }
];

const getHealthIcon = (health: string) => {
  switch (health) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-status-success" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-status-warning" />;
    case "critical":
      return <XCircle className="h-4 w-4 text-status-error" />;
    default:
      return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getHealthColor = (health: string) => {
  switch (health) {
    case "good":
      return "bg-status-success/10 text-status-success border-status-success/20";
    case "warning":
      return "bg-status-warning/10 text-status-warning border-status-warning/20";
    case "critical":
      return "bg-status-error/10 text-status-error border-status-error/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const ClientSummaryCards = ({ className }: ClientSummaryCardsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockClients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-medium leading-tight">{client.name}</CardTitle>
              <Badge className={`${getHealthColor(client.complianceHealth)} border`}>
                {getHealthIcon(client.complianceHealth)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Open Tasks:</span>
              <span className="font-medium">{client.openTasks}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{client.lastInteraction.type}</span>
              <span className="block">{client.lastInteraction.date}</span>
            </div>
            <div className="flex gap-1 pt-2">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Vault
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Task
              </Button>
              <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                <MessageCircle className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {mockClients.map((client) => (
        <Card key={client.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getHealthIcon(client.complianceHealth)}
                  <span className="font-medium">{client.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {client.openTasks} tasks
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {client.lastInteraction.type} • {client.lastInteraction.date}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Vault
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Task
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Client Overview</CardTitle>
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" size="sm">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" size="sm">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "grid" ? renderGridView() : renderListView()}
      </CardContent>
    </Card>
  );
};