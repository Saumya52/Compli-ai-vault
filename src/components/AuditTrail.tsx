import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload, Edit, Eye, Shield, CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";

interface AuditEntry {
  id: string;
  action: "upload" | "download" | "edit" | "view" | "permission_change" | "delete";
  fileName: string;
  folderPath: string;
  userEmail: string;
  userName: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details?: string;
  fileSize?: string;
}

interface AuditTrailProps {
  isOpen: boolean;
  onClose: () => void;
  auditEntries: AuditEntry[];
}

export const AuditTrail = ({ isOpen, onClose, auditEntries }: AuditTrailProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [userFilter, setUserFilter] = React.useState<string>("all");
  const [dateFrom, setDateFrom] = React.useState<Date>();
  const [dateTo, setDateTo] = React.useState<Date>();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload": return <Upload className="w-4 h-4" />;
      case "download": return <Download className="w-4 h-4" />;
      case "edit": return <Edit className="w-4 h-4" />;
      case "view": return <Eye className="w-4 h-4" />;
      case "permission_change": return <Shield className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "upload": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "download": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "edit": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "view": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "permission_change": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "delete": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.folderPath.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    const matchesUser = userFilter === "all" || entry.userEmail === userFilter;
    
    const matchesDate = (!dateFrom || entry.timestamp >= dateFrom) &&
                       (!dateTo || entry.timestamp <= dateTo);
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const uniqueUsers = Array.from(new Set(auditEntries.map(entry => entry.userEmail)));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Audit Trail</DialogTitle>
        </DialogHeader>
        
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files, users, or folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="permission_change">Permission</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setActionFilter("all");
                setUserFilter("all");
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <Separator />

        {/* Audit Entries */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className={`p-2 rounded-full ${getActionColor(entry.action)}`}>
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{entry.fileName}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.action.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(entry.timestamp, "MMM dd, yyyy HH:mm")}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{entry.userName}</span> ({entry.userEmail})
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Path: {entry.folderPath}
                    {entry.fileSize && ` • Size: ${entry.fileSize}`}
                    {entry.details && ` • ${entry.details}`}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    IP: {entry.ipAddress}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No audit entries found matching your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {auditEntries.length} entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};