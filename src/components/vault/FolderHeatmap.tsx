import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FolderStatus {
  id: string;
  name: string;
  healthScore: number;
  status: "compliant" | "pending" | "overdue";
  documentsCount: number;
  pendingValidations: number;
  overdueItems: number;
  trend: "up" | "down" | "stable";
  entity: string;
  complianceType: string;
}

const mockFolderData: FolderStatus[] = [
  {
    id: "1",
    name: "GST Filings Q4 2024",
    healthScore: 95,
    status: "compliant",
    documentsCount: 24,
    pendingValidations: 1,
    overdueItems: 0,
    trend: "up",
    entity: "ABC Pvt Ltd",
    complianceType: "GST"
  },
  {
    id: "2",
    name: "TDS Returns March 2024",
    healthScore: 65,
    status: "pending",
    documentsCount: 18,
    pendingValidations: 5,
    overdueItems: 2,
    trend: "down",
    entity: "XYZ Corp",
    complianceType: "TDS"
  },
  {
    id: "3",
    name: "ROC Annual Filings",
    healthScore: 35,
    status: "overdue",
    documentsCount: 12,
    pendingValidations: 3,
    overdueItems: 8,
    trend: "down",
    entity: "DEF Limited",
    complianceType: "ROC"
  },
  {
    id: "4",
    name: "PF Compliance 2024",
    healthScore: 88,
    status: "compliant",
    documentsCount: 16,
    pendingValidations: 2,
    overdueItems: 0,
    trend: "stable",
    entity: "ABC Pvt Ltd",
    complianceType: "PF"
  },
  {
    id: "5",
    name: "ESI Monthly Returns",
    healthScore: 42,
    status: "overdue",
    documentsCount: 20,
    pendingValidations: 6,
    overdueItems: 12,
    trend: "down",
    entity: "GHI Industries",
    complianceType: "ESI"
  },
  {
    id: "6",
    name: "Income Tax Assessments",
    healthScore: 78,
    status: "pending",
    documentsCount: 14,
    pendingValidations: 3,
    overdueItems: 1,
    trend: "up",
    entity: "XYZ Corp",
    complianceType: "Income Tax"
  }
];

interface FolderHeatmapProps {
  folders?: FolderStatus[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "compliant": return "bg-green-500";
    case "pending": return "bg-yellow-500";
    case "overdue": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

const getHealthColor = (healthScore: number) => {
  if (healthScore >= 80) return "text-green-600 bg-green-100";
  if (healthScore >= 60) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
    default: return <Minus className="w-4 h-4 text-gray-500" />;
  }
};

const getHealthBarWidth = (healthScore: number) => {
  return `${healthScore}%`;
};

export const FolderHeatmap: React.FC<FolderHeatmapProps> = ({ 
  folders = mockFolderData 
}) => {
  const compliantFolders = folders.filter(f => f.status === "compliant").length;
  const pendingFolders = folders.filter(f => f.status === "pending").length;
  const overdueFolders = folders.filter(f => f.status === "overdue").length;
  const averageHealth = Math.round(folders.reduce((acc, f) => acc + f.healthScore, 0) / folders.length);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Health</p>
                <p className={`text-2xl font-bold ${getHealthColor(averageHealth).split(' ')[0]}`}>
                  {averageHealth}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getHealthColor(averageHealth)}`}>
                <Folder className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Compliant</p>
                <p className="text-2xl font-bold text-green-700">{compliantFolders}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{pendingFolders}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-700">{overdueFolders}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Folder Compliance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  folder.status === "compliant" ? "border-green-200 bg-green-50/30 hover:bg-green-50/50" :
                  folder.status === "pending" ? "border-yellow-200 bg-yellow-50/30 hover:bg-yellow-50/50" :
                  "border-red-200 bg-red-50/30 hover:bg-red-50/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-primary" />
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(folder.status)}`} />
                  </div>
                  {getTrendIcon(folder.trend)}
                </div>

                {/* Folder Name & Entity */}
                <div className="mb-3">
                  <h4 className="font-semibold text-sm truncate">{folder.name}</h4>
                  <p className="text-xs text-muted-foreground">{folder.entity}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {folder.complianceType}
                  </Badge>
                </div>

                {/* Health Score Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className={`font-semibold ${getHealthColor(folder.healthScore).split(' ')[0]}`}>
                      {folder.healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        folder.healthScore >= 80 ? "bg-green-500" :
                        folder.healthScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: getHealthBarWidth(folder.healthScore) }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center p-1 bg-white/50 rounded">
                    <div className="font-semibold">{folder.documentsCount}</div>
                    <div className="text-muted-foreground">Docs</div>
                  </div>
                  <div className="text-center p-1 bg-white/50 rounded">
                    <div className="font-semibold text-yellow-600">{folder.pendingValidations}</div>
                    <div className="text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center p-1 bg-white/50 rounded">
                    <div className="font-semibold text-red-600">{folder.overdueItems}</div>
                    <div className="text-muted-foreground">Overdue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Status Legend:</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Fully Compliant (80-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Pending Validation (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Overdue Items (&lt;60%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};