import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Activity, Filter, Eye, Download, Search, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'taxonomy' | 'permissions' | 'reminders' | 'notifications' | 'documents' | 'integrations' | 'folders' | 'branding' | 'entities';
  details: string;
  ipAddress: string;
  userAgent: string;
  oldValue?: string;
  newValue?: string;
}

const activityCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'taxonomy', label: 'Compliance Taxonomy' },
  { value: 'permissions', label: 'Roles & Permissions' },
  { value: 'reminders', label: 'Reminder Logic' },
  { value: 'notifications', label: 'Notification Templates' },
  { value: 'documents', label: 'Document Type Rules' },
  { value: 'integrations', label: 'External Integrations' },
  { value: 'folders', label: 'Auto-Folder Rules' },
  { value: 'branding', label: 'Branding Configuration' },
  { value: 'entities', label: 'Entity & Branch Management' }
];

export const ActivityLogViewer = () => {
  const { toast } = useToast();
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      user: 'admin@company.com',
      action: 'Created compliance head',
      category: 'taxonomy',
      details: 'Created new compliance head "Environmental Compliance" with 5 sub-heads',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      newValue: JSON.stringify({
        name: 'Environmental Compliance',
        description: 'Environmental regulations and compliance',
        defaultReminderFrequency: 'Monthly'
      })
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:10',
      user: 'manager@company.com',
      action: 'Updated role permissions',
      category: 'permissions',
      details: 'Modified permissions for "Team Lead" role - added GST bucket access',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      oldValue: JSON.stringify({ buckets: ['ROC', 'Income Tax'] }),
      newValue: JSON.stringify({ buckets: ['ROC', 'Income Tax', 'GST'] })
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:45',
      user: 'admin@company.com',
      action: 'Created reminder rule',
      category: 'reminders',
      details: 'Added new reminder rule for GST compliance with intervals T-15, T-7, T-3, D+1',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      newValue: JSON.stringify({
        name: 'GST Extended Reminders',
        intervals: ['T-15', 'T-7', 'T-3', 'D+1']
      })
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:30',
      user: 'user@company.com',
      action: 'Updated notification template',
      category: 'notifications',
      details: 'Modified email template for task creation notifications',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      oldValue: 'Old email template content',
      newValue: 'New email template with enhanced formatting'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:15',
      user: 'admin@company.com',
      action: 'Connected integration',
      category: 'integrations',
      details: 'Successfully connected Tally integration with API key configuration',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      newValue: JSON.stringify({
        integration: 'Tally',
        status: 'connected',
        syncEnabled: true
      })
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:05:20',
      user: 'manager@company.com',
      action: 'Created document rule',
      category: 'documents',
      details: 'Added validation rule for Form 16 documents with mandatory fields',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      newValue: JSON.stringify({
        documentType: 'Form 16',
        mandatoryFields: ['Employee Name', 'PAN', 'Assessment Year'],
        aiValidation: true
      })
    },
    {
      id: '7',
      timestamp: '2024-01-15 14:00:10',
      user: 'admin@company.com',
      action: 'Updated branding',
      category: 'branding',
      details: 'Changed primary brand color and uploaded new company logo',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      oldValue: JSON.stringify({ primaryColor: '#1e40af', logo: 'old-logo.png' }),
      newValue: JSON.stringify({ primaryColor: '#059669', logo: 'new-logo.png' })
    },
    {
      id: '8',
      timestamp: '2024-01-15 13:55:45',
      user: 'user@company.com',
      action: 'Added entity',
      category: 'entities',
      details: 'Created new entity "XYZ Subsidiary Ltd" with Mumbai and Delhi branches',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      newValue: JSON.stringify({
        entityName: 'XYZ Subsidiary Ltd',
        type: 'company',
        branches: ['Mumbai', 'Delhi']
      })
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>(activityLogs);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    user: '',
    action: '',
    dateFrom: '',
    dateTo: ''
  });

  const applyFilters = () => {
    let filtered = activityLogs;

    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filters.action.toLowerCase()) ||
        log.details.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(log => log.timestamp <= filters.dateTo + ' 23:59:59');
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      user: '',
      action: '',
      dateFrom: '',
      dateTo: ''
    });
    setFilteredLogs(activityLogs);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Category', 'Details', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.category,
        `"${log.details}"`,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Logs Exported",
      description: "Activity logs have been exported successfully"
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryInfo = activityCategories.find(c => c.value === category);
    return (
      <Badge variant="outline" className="text-xs">
        {categoryInfo?.label || category}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Activity Log Viewer</span>
              </CardTitle>
              <CardDescription>
                View all system configuration changes with timestamps and user details
              </CardDescription>
            </div>
            <Button onClick={exportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="categoryFilter">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activityCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="userFilter">User</Label>
                  <Input
                    id="userFilter"
                    value={filters.user}
                    onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                    placeholder="Filter by user"
                  />
                </div>
                <div>
                  <Label htmlFor="actionFilter">Action/Details</Label>
                  <Input
                    id="actionFilter"
                    value={filters.action}
                    onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    placeholder="Search actions"
                  />
                </div>
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={applyFilters}>
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium">{log.user}</div>
                          <div className="text-xs text-muted-foreground">{log.ipAddress}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{getCategoryBadge(log.category)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Activity Log Details</DialogTitle>
                            <DialogDescription>
                              Complete information about this configuration change
                            </DialogDescription>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Timestamp</Label>
                                  <p className="text-sm">{formatTimestamp(selectedLog.timestamp)}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">User</Label>
                                  <p className="text-sm">{selectedLog.user}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Action</Label>
                                  <p className="text-sm">{selectedLog.action}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Category</Label>
                                  <p className="text-sm">{getCategoryBadge(selectedLog.category)}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="font-medium">Details</Label>
                                <p className="text-sm">{selectedLog.details}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">IP Address</Label>
                                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">User Agent</Label>
                                  <p className="text-sm text-muted-foreground truncate" title={selectedLog.userAgent}>
                                    {selectedLog.userAgent}
                                  </p>
                                </div>
                              </div>
                              {(selectedLog.oldValue || selectedLog.newValue) && (
                                <div className="space-y-3">
                                  {selectedLog.oldValue && (
                                    <div>
                                      <Label className="font-medium">Previous Value</Label>
                                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                        {JSON.stringify(JSON.parse(selectedLog.oldValue), null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {selectedLog.newValue && (
                                    <div>
                                      <Label className="font-medium">New Value</Label>
                                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                        {JSON.stringify(JSON.parse(selectedLog.newValue), null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs found matching your filters
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {activityLogs.length} logs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};