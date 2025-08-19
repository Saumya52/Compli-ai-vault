import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Shield, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  module: string;
  actions: string[];
  buckets: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isCustom: boolean;
}

const modules = [
  'Vault',
  'Tasks',
  'Calendar',
  'Reports',
  'Settings',
  'Users',
  'Notifications',
  'Integrations'
];

const actions = [
  'Create',
  'Edit',
  'Upload',
  'Approve',
  'Close Ticket',
  'View Only',
  'Delete',
  'Export',
  'Share'
];

const buckets = [
  'GST',
  'ROC',
  'Income Tax',
  'Labour Law',
  'Environmental',
  'FEMA',
  'RBI',
  'SEBI',
  'All Buckets'
];

export const RolePermissionsMatrix = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      isCustom: false,
      permissions: modules.map(module => ({
        module,
        actions: [...actions],
        buckets: ['All Buckets']
      }))
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management access',
      isCustom: false,
      permissions: modules.map(module => ({
        module,
        actions: module === 'Settings' || module === 'Users' ? ['View Only'] : ['Create', 'Edit', 'Upload', 'Approve', 'View Only'],
        buckets: ['All Buckets']
      }))
    },
    {
      id: '3',
      name: 'Team Lead',
      description: 'Team supervision access',
      isCustom: false,
      permissions: modules.map(module => ({
        module,
        actions: ['Create', 'Edit', 'Upload', 'View Only'],
        buckets: ['GST', 'ROC', 'Income Tax']
      }))
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: modules.map(module => ({
      module,
      actions: [] as string[],
      buckets: [] as string[]
    }))
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: modules.map(module => ({
        module,
        actions: [],
        buckets: []
      }))
    });
  };

  const handleCreateRole = () => {
    if (!formData.name.trim()) return;

    const newRole: Role = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      isCustom: true
    };

    setRoles([...roles, newRole]);
    resetForm();
    setIsCreateDialogOpen(false);
    toast({
      title: "Role Created",
      description: `${formData.name} role has been created successfully.`,
    });
  };

  const handleEditRole = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setEditingRole(role);
  };

  const handleUpdateRole = () => {
    if (!editingRole || !formData.name.trim()) return;

    setRoles(roles.map(role =>
      role.id === editingRole.id 
        ? { 
            ...role, 
            name: formData.name, 
            description: formData.description,
            permissions: formData.permissions
          } 
        : role
    ));
    resetForm();
    setEditingRole(null);
    toast({
      title: "Role Updated",
      description: `${formData.name} role has been updated successfully.`,
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role?.isCustom) {
      toast({
        title: "Cannot Delete",
        description: "System roles cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    setRoles(roles.filter(role => role.id !== roleId));
    toast({
      title: "Role Deleted",
      description: "The role has been removed successfully.",
    });
  };

  const togglePermission = (moduleIndex: number, permission: string, type: 'action' | 'bucket') => {
    const newPermissions = [...formData.permissions];
    const module = newPermissions[moduleIndex];
    
    if (type === 'action') {
      if (module.actions.includes(permission)) {
        module.actions = module.actions.filter(a => a !== permission);
      } else {
        module.actions.push(permission);
      }
    } else {
      if (module.buckets.includes(permission)) {
        module.buckets = module.buckets.filter(b => b !== permission);
      } else {
        module.buckets.push(permission);
      }
    }
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const renderPermissionForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="roleName">Role Name</Label>
          <Input
            id="roleName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter role name"
          />
        </div>
        <div>
          <Label htmlFor="roleDescription">Description</Label>
          <Input
            id="roleDescription"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter role description"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Module Permissions</Label>
        {modules.map((module, moduleIndex) => (
          <Card key={module} className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium">{module}</h4>
              
              <div>
                <Label className="text-sm">Actions</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {actions.map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${module}-${action}`}
                        checked={formData.permissions[moduleIndex].actions.includes(action)}
                        onCheckedChange={() => togglePermission(moduleIndex, action, 'action')}
                      />
                      <Label htmlFor={`${module}-${action}`} className="text-sm">{action}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm">Bucket Access</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {buckets.map((bucket) => (
                    <div key={bucket} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${module}-${bucket}`}
                        checked={formData.permissions[moduleIndex].buckets.includes(bucket)}
                        onCheckedChange={() => togglePermission(moduleIndex, bucket, 'bucket')}
                      />
                      <Label htmlFor={`${module}-${bucket}`} className="text-sm">{bucket}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Role & Permissions Matrix</span>
              </CardTitle>
              <CardDescription>
                Manage user roles and configure module-wise access permissions
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Define permissions for a new user role
                  </DialogDescription>
                </DialogHeader>
                {renderPermissionForm()}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <Card key={role.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{role.name}</h3>
                        {!role.isCustom && <Badge variant="secondary">System</Badge>}
                        {role.isCustom && <Badge>Custom</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {role.isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>Bucket Access</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {role.permissions.map((permission) => (
                        <TableRow key={permission.module}>
                          <TableCell className="font-medium">{permission.module}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {permission.actions.map((action) => (
                                <Badge key={action} variant="outline" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {permission.buckets.map((bucket) => (
                                <Badge key={bucket} variant="secondary" className="text-xs">
                                  {bucket}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update permissions for {editingRole?.name}
            </DialogDescription>
          </DialogHeader>
          {renderPermissionForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};