import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Mail, Shield, MapPin, Users, RefreshCw, Building2, Database } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Jane Smith", 
    email: "jane.smith@company.com",
    role: "Compliance Officer",
    status: "Active",
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com", 
    role: "Viewer",
    status: "Inactive",
    lastActive: "5 days ago"
  }
];

const roles = [
  "Admin",
  "Compliance Officer", 
  "Manager",
  "Viewer"
];

const permissions = [
  "Read Documents",
  "Upload Documents",
  "Create Tasks",
  "Assign Tasks",
  "View Reports",
  "Export Data",
  "Manage Users"
];

export const UserManagementDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [syncingSystem, setSyncingSystem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    permissions: [] as string[],
    states: "",
    backupApprover: ""
  });

  const handleCreateUser = () => {
    console.log("Creating user:", formData);
    // Here you would typically send data to backend
    setShowCreateForm(false);
    setFormData({
      fullName: "",
      email: "",
      role: "",
      permissions: [],
      states: "",
      backupApprover: ""
    });
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSyncUsers = async (system: string) => {
    setSyncingSystem(system);
    // Simulate API call
    setTimeout(() => {
      console.log(`Syncing users from ${system}`);
      setSyncingSystem(null);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md">
          <Users className="w-4 h-4 mr-2" />
          Create and Manage Users
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Users Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Users</h3>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create User
              </Button>
            </div>

            <div className="space-y-3">
              {mockUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sync Users Section */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Sync Users from External Systems</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Zoho Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Import users and their details from Zoho Payroll system
                  </p>
                  <Button 
                    onClick={() => handleSyncUsers("Zoho Payroll")}
                    disabled={syncingSystem === "Zoho Payroll"}
                    className="w-full"
                    variant="outline"
                  >
                    {syncingSystem === "Zoho Payroll" ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Users
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="w-5 h-5 text-green-600" />
                    Active Directory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect and sync users from Active Directory
                  </p>
                  <Button 
                    onClick={() => handleSyncUsers("Active Directory")}
                    disabled={syncingSystem === "Active Directory"}
                    className="w-full"
                    variant="outline"
                  >
                    {syncingSystem === "Active Directory" ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Users
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Other Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect to other payroll systems (SAP, Oracle, etc.)
                  </p>
                  <Button 
                    onClick={() => handleSyncUsers("Other Payroll")}
                    disabled={syncingSystem === "Other Payroll"}
                    className="w-full"
                    variant="outline"
                  >
                    {syncingSystem === "Other Payroll" ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Users
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create User Form */}
          {showCreateForm && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="states">States/Branches</Label>
                    <Input
                      id="states"
                      value={formData.states}
                      onChange={(e) => setFormData(prev => ({ ...prev, states: e.target.value }))}
                      placeholder="e.g., Delhi, Mumbai"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupApprover">Backup Approver</Label>
                    <Input
                      id="backupApprover"
                      value={formData.backupApprover}
                      onChange={(e) => setFormData(prev => ({ ...prev, backupApprover: e.target.value }))}
                      placeholder="Enter backup approver email"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {permissions.map((permission) => (
                      <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser} className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Create User & Send Welcome Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};