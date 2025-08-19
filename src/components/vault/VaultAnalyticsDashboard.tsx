import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";
import { 
  Upload, Download, Users, FolderOpen, TrendingUp, 
  AlertCircle, Clock, CheckCircle, Calendar, Eye 
} from "lucide-react";

// Mock data for analytics
const uploadVolumeData = [
  { month: "Jan", uploads: 245, downloads: 189 },
  { month: "Feb", uploads: 312, downloads: 234 },
  { month: "Mar", uploads: 198, downloads: 156 },
  { month: "Apr", uploads: 287, downloads: 203 },
  { month: "May", uploads: 356, downloads: 278 },
  { month: "Jun", uploads: 421, downloads: 312 }
];

const folderAccessData = [
  { name: "GST Filings", accesses: 1247, size: "2.3 GB" },
  { name: "Board Resolutions", accesses: 892, size: "1.1 GB" },
  { name: "TDS Returns", accesses: 734, size: "896 MB" },
  { name: "ROC Documents", accesses: 567, size: "1.8 GB" },
  { name: "Bank Documents", accesses: 445, size: "654 MB" },
  { name: "Invoices", accesses: 334, size: "3.2 GB" }
];

const documentStatusData = [
  { name: "Validated", value: 68, color: "#10b981" },
  { name: "Pending", value: 23, color: "#f59e0b" },
  { name: "Expired", value: 9, color: "#ef4444" }
];

const userActivityData = [
  { date: "2024-01-15", activeUsers: 12 },
  { date: "2024-01-16", activeUsers: 18 },
  { date: "2024-01-17", activeUsers: 15 },
  { date: "2024-01-18", activeUsers: 22 },
  { date: "2024-01-19", activeUsers: 28 },
  { date: "2024-01-20", activeUsers: 19 },
  { date: "2024-01-21", activeUsers: 24 }
];

const expiryMetricsData = [
  { period: "This Week", expiring: 5, expired: 2 },
  { period: "Next Week", expiring: 8, expired: 0 },
  { period: "This Month", expiring: 23, expired: 7 },
  { period: "Next Month", expiring: 31, expired: 0 }
];

const topUsers = [
  { name: "Priya Sharma", role: "Compliance Manager", uploads: 89, lastActive: "2 hours ago" },
  { name: "Rajesh Kumar", role: "CA", uploads: 67, lastActive: "1 day ago" },
  { name: "Anita Patel", role: "Senior Associate", uploads: 45, lastActive: "3 hours ago" },
  { name: "Vikram Singh", role: "Junior Associate", uploads: 32, lastActive: "5 hours ago" },
  { name: "Meera Gupta", role: "Admin", uploads: 28, lastActive: "1 hour ago" }
];

export const VaultAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("6months");

  const totalUploads = uploadVolumeData.reduce((acc, curr) => acc + curr.uploads, 0);
  const totalDownloads = uploadVolumeData.reduce((acc, curr) => acc + curr.downloads, 0);
  const totalStorage = "12.8 GB";
  const activeUsers = 45;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vault Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into document management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Uploads</p>
                <p className="text-2xl font-bold text-blue-600">{totalUploads.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last period
                </p>
              </div>
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold text-green-600">{totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last period
                </p>
              </div>
              <Download className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold text-purple-600">{totalStorage}</p>
                <p className="text-xs text-muted-foreground mt-1">of 50 GB available</p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-orange-600">{activeUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">in last 30 days</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="volume" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="volume">Upload Volume</TabsTrigger>
          <TabsTrigger value="access">Folder Access</TabsTrigger>
          <TabsTrigger value="status">Document Status</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Download Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={uploadVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="uploads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="downloads" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Accessed Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {folderAccessData.map((folder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{folder.name}</p>
                        <p className="text-sm text-muted-foreground">{folder.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{folder.accesses.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={documentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {documentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {documentStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name} ({entry.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Validations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span>Awaiting Review</span>
                  </div>
                  <Badge variant="secondary">23 docs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span>Failed Validation</span>
                  </div>
                  <Badge variant="destructive">5 docs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Recently Validated</span>
                  </div>
                  <Badge variant="default">68 docs</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{user.uploads} uploads</p>
                        <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Expiry Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expiryMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expiring" fill="#f59e0b" />
                  <Bar dataKey="expired" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Expiring Soon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Already Expired</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};