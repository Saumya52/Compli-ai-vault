import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Upload, 
  Eye, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SmartShortcut {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  frequency: number;
  lastUsed: Date;
  category: "upload" | "view" | "report" | "action";
  priority: number;
}

interface SmartShortcutsProps {
  userId: string;
  userRole: "admin" | "cfo" | "team_member";
  className?: string;
}

export const SmartShortcuts = ({ userId, userRole, className }: SmartShortcutsProps) => {
  const { toast } = useToast();

  // Mock user behavior data to generate smart shortcuts
  const getSmartShortcuts = (): SmartShortcut[] => {
    const baseShortcuts: SmartShortcut[] = [
      {
        id: "upload_pf",
        label: "Upload PF Document",
        description: "Upload PF return for ABC Pvt Ltd",
        icon: <Upload className="w-4 h-4" />,
        frequency: 12,
        lastUsed: new Date(Date.now() - 86400000), // 1 day ago
        category: "upload",
        priority: 9
      },
      {
        id: "view_gst_ticket",
        label: "View Last GST Ticket",
        description: "GSTR-3B March 2024 - ABC Pvt Ltd",
        icon: <Eye className="w-4 h-4" />,
        frequency: 8,
        lastUsed: new Date(Date.now() - 3600000), // 1 hour ago
        category: "view",
        priority: 8
      },
      {
        id: "download_certificate",
        label: "Download GST Certificate",
        description: "GST registration certificate",
        icon: <Download className="w-4 h-4" />,
        frequency: 5,
        lastUsed: new Date(Date.now() - 172800000), // 2 days ago
        category: "action",
        priority: 6
      }
    ];

    if (userRole === "admin") {
      return [
        ...baseShortcuts,
        {
          id: "user_management",
          label: "Manage Users",
          description: "Add/edit team members",
          icon: <Users className="w-4 h-4" />,
          frequency: 6,
          lastUsed: new Date(Date.now() - 259200000), // 3 days ago
          category: "action",
          priority: 7
        },
        {
          id: "compliance_report",
          label: "Generate MIS Report",
          description: "Monthly compliance summary",
          icon: <TrendingUp className="w-4 h-4" />,
          frequency: 4,
          lastUsed: new Date(Date.now() - 604800000), // 1 week ago
          category: "report",
          priority: 5
        }
      ];
    }

    if (userRole === "cfo") {
      return [
        ...baseShortcuts,
        {
          id: "financial_report",
          label: "Financial Compliance Report",
          description: "Quarterly financial overview",
          icon: <FileText className="w-4 h-4" />,
          frequency: 7,
          lastUsed: new Date(Date.now() - 432000000), // 5 days ago
          category: "report",
          priority: 8
        }
      ];
    }

    return baseShortcuts;
  };

  // Sort shortcuts by priority and frequency
  const shortcuts = getSmartShortcuts()
    .sort((a, b) => (b.priority * b.frequency) - (a.priority * a.frequency))
    .slice(0, 6); // Show top 6 shortcuts

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "upload": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "view": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "report": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "action": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleShortcutClick = (shortcut: SmartShortcut) => {
    toast({
      title: "Shortcut Activated",
      description: shortcut.label,
    });

    // Mock action execution
    setTimeout(() => {
      toast({
        title: "Action Completed",
        description: shortcut.description,
      });
    }, 1500);
  };

  const getFrequencyText = (frequency: number) => {
    if (frequency >= 10) return "Very frequent";
    if (frequency >= 5) return "Frequent";
    return "Occasional";
  };

  const isRecentlyUsed = (lastUsed: Date) => {
    const daysSinceLastUse = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastUse <= 1;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            Smart Shortcuts
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((shortcut) => (
            <Button
              key={shortcut.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start gap-2 hover:bg-accent relative"
              onClick={() => handleShortcutClick(shortcut)}
            >
              {/* Recently used indicator */}
              {isRecentlyUsed(shortcut.lastUsed) && (
                <div className="absolute top-2 right-2">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                </div>
              )}
              
              <div className="flex items-center gap-2 w-full">
                <div className="p-1 rounded bg-primary/10 text-primary">
                  {shortcut.icon}
                </div>
                <Badge className={`text-xs ${getCategoryColor(shortcut.category)}`}>
                  {shortcut.category}
                </Badge>
              </div>
              
              <div className="text-left w-full">
                <div className="font-medium text-sm">{shortcut.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {shortcut.description}
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getFrequencyText(shortcut.frequency)}
                </span>
                <span>
                  {shortcut.lastUsed.toLocaleDateString()}
                </span>
              </div>
            </Button>
          ))}
        </div>
        
        {shortcuts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Building your shortcuts...</p>
            <p className="text-xs">Use the system to see personalized shortcuts here.</p>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            Customize Shortcuts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};