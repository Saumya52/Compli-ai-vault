import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Plus, Edit, Trash2, MapPin, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Entity {
  id: string;
  name: string;
  type: 'company' | 'llp' | 'partnership' | 'proprietorship' | 'trust' | 'society';
  registrationNumber: string;
  panNumber: string;
  gstNumber?: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  isActive: boolean;
  branches: Branch[];
  assignedUsers: string[];
  complianceHeads: string[];
}

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber?: string;
  isActive: boolean;
}

const entityTypes = [
  { value: 'company', label: 'Private/Public Company' },
  { value: 'llp', label: 'Limited Liability Partnership' },
  { value: 'partnership', label: 'Partnership Firm' },
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'trust', label: 'Trust' },
  { value: 'society', label: 'Society' }
];

export const EntityBranchManagement = () => {
  const { toast } = useToast();
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: '1',
      name: 'ABC Technologies Pvt Ltd',
      type: 'company',
      registrationNumber: 'U72200DL2020PTC123456',
      panNumber: 'AAACT1234C',
      gstNumber: '07AAACT1234C1ZZ',
      address: '123 Tech Park, Sector 5, Gurgaon, Haryana 122001',
      contactPerson: 'John Doe',
      email: 'compliance@abctech.com',
      phone: '+91-9876543210',
      isActive: true,
      branches: [
        {
          id: 'b1',
          name: 'Mumbai Branch',
          code: 'MUM001',
          address: '456 Business Center, Andheri East, Mumbai 400069',
          contactPerson: 'Jane Smith',
          email: 'mumbai@abctech.com',
          phone: '+91-9876543211',
          gstNumber: '27AAACT1234C1ZX',
          isActive: true
        }
      ],
      assignedUsers: ['user1', 'user2'],
      complianceHeads: ['GST', 'ROC', 'Income Tax']
    },
    {
      id: '2',
      name: 'XYZ Consultancy LLP',
      type: 'llp',
      registrationNumber: 'AAI-1234',
      panNumber: 'AACFX5555P',
      address: '789 Corporate Plaza, Sector 62, Noida, UP 201309',
      contactPerson: 'Robert Wilson',
      email: 'admin@xyzconsult.com',
      phone: '+91-9876543212',
      isActive: true,
      branches: [],
      assignedUsers: ['user3'],
      complianceHeads: ['Labour Law', 'ROC']
    }
  ]);

  const [isEntityDialogOpen, setIsEntityDialogOpen] = useState(false);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editingBranch, setEditingBranch] = useState<{ entity: Entity; branch: Branch | null }>({ entity: null as any, branch: null });
  const [selectedEntityForBranch, setSelectedEntityForBranch] = useState<string>('');

  const [entityFormData, setEntityFormData] = useState<Partial<Entity>>({
    name: '',
    type: 'company',
    registrationNumber: '',
    panNumber: '',
    gstNumber: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    isActive: true,
    assignedUsers: [],
    complianceHeads: []
  });

  const [branchFormData, setBranchFormData] = useState<Partial<Branch>>({
    name: '',
    code: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    isActive: true
  });

  const availableUsers = ['user1', 'user2', 'user3', 'admin', 'manager'];
  const availableComplianceHeads = ['GST', 'ROC', 'Income Tax', 'Labour Law', 'Environmental', 'FEMA'];

  const resetEntityForm = () => {
    setEntityFormData({
      name: '',
      type: 'company',
      registrationNumber: '',
      panNumber: '',
      gstNumber: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
      isActive: true,
      assignedUsers: [],
      complianceHeads: []
    });
  };

  const resetBranchForm = () => {
    setBranchFormData({
      name: '',
      code: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstNumber: '',
      isActive: true
    });
  };

  const handleSaveEntity = () => {
    if (!entityFormData.name || !entityFormData.panNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const entity: Entity = {
      id: editingEntity?.id || Date.now().toString(),
      name: entityFormData.name!,
      type: entityFormData.type!,
      registrationNumber: entityFormData.registrationNumber!,
      panNumber: entityFormData.panNumber!,
      gstNumber: entityFormData.gstNumber,
      address: entityFormData.address!,
      contactPerson: entityFormData.contactPerson!,
      email: entityFormData.email!,
      phone: entityFormData.phone!,
      isActive: entityFormData.isActive!,
      branches: editingEntity?.branches || [],
      assignedUsers: entityFormData.assignedUsers || [],
      complianceHeads: entityFormData.complianceHeads || []
    };

    if (editingEntity) {
      setEntities(entities => entities.map(e => e.id === editingEntity.id ? entity : e));
      toast({
        title: "Entity Updated",
        description: "Entity has been updated successfully"
      });
    } else {
      setEntities(entities => [...entities, entity]);
      toast({
        title: "Entity Created",
        description: "New entity has been created successfully"
      });
    }

    resetEntityForm();
    setEditingEntity(null);
    setIsEntityDialogOpen(false);
  };

  const handleSaveBranch = () => {
    if (!branchFormData.name || !branchFormData.code || !selectedEntityForBranch) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const branch: Branch = {
      id: editingBranch.branch?.id || Date.now().toString(),
      name: branchFormData.name!,
      code: branchFormData.code!,
      address: branchFormData.address!,
      contactPerson: branchFormData.contactPerson!,
      email: branchFormData.email!,
      phone: branchFormData.phone!,
      gstNumber: branchFormData.gstNumber,
      isActive: branchFormData.isActive!
    };

    setEntities(entities => entities.map(entity => {
      if (entity.id === selectedEntityForBranch) {
        if (editingBranch.branch) {
          // Update existing branch
          return {
            ...entity,
            branches: entity.branches.map(b => b.id === editingBranch.branch!.id ? branch : b)
          };
        } else {
          // Add new branch
          return {
            ...entity,
            branches: [...entity.branches, branch]
          };
        }
      }
      return entity;
    }));

    resetBranchForm();
    setEditingBranch({ entity: null as any, branch: null });
    setSelectedEntityForBranch('');
    setIsBranchDialogOpen(false);
    
    toast({
      title: editingBranch.branch ? "Branch Updated" : "Branch Created",
      description: `Branch has been ${editingBranch.branch ? 'updated' : 'created'} successfully`
    });
  };

  const handleEditEntity = (entity: Entity) => {
    setEntityFormData(entity);
    setEditingEntity(entity);
    setIsEntityDialogOpen(true);
  };

  const handleEditBranch = (entity: Entity, branch: Branch) => {
    setBranchFormData(branch);
    setEditingBranch({ entity, branch });
    setSelectedEntityForBranch(entity.id);
    setIsBranchDialogOpen(true);
  };

  const handleDeleteEntity = (entityId: string) => {
    setEntities(entities => entities.filter(e => e.id !== entityId));
    toast({
      title: "Entity Deleted",
      description: "Entity has been deleted successfully"
    });
  };

  const handleDeleteBranch = (entityId: string, branchId: string) => {
    setEntities(entities => entities.map(entity =>
      entity.id === entityId
        ? { ...entity, branches: entity.branches.filter(b => b.id !== branchId) }
        : entity
    ));
    toast({
      title: "Branch Deleted",
      description: "Branch has been deleted successfully"
    });
  };

  const toggleEntityUser = (userId: string) => {
    const currentUsers = entityFormData.assignedUsers || [];
    if (currentUsers.includes(userId)) {
      setEntityFormData({
        ...entityFormData,
        assignedUsers: currentUsers.filter(u => u !== userId)
      });
    } else {
      setEntityFormData({
        ...entityFormData,
        assignedUsers: [...currentUsers, userId]
      });
    }
  };

  const toggleComplianceHead = (head: string) => {
    const currentHeads = entityFormData.complianceHeads || [];
    if (currentHeads.includes(head)) {
      setEntityFormData({
        ...entityFormData,
        complianceHeads: currentHeads.filter(h => h !== head)
      });
    } else {
      setEntityFormData({
        ...entityFormData,
        complianceHeads: [...currentHeads, head]
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Entity & Branch Management</span>
              </CardTitle>
              <CardDescription>
                Manage legal entities and their branches with user assignments
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    resetBranchForm();
                    setEditingBranch({ entity: null as any, branch: null });
                    setSelectedEntityForBranch('');
                  }}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Branch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingBranch.branch ? 'Edit Branch' : 'Add New Branch'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingBranch.branch ? 'Update branch information' : 'Add a new branch to an existing entity'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {!editingBranch.branch && (
                      <div>
                        <Label htmlFor="parentEntity">Parent Entity</Label>
                        <Select value={selectedEntityForBranch} onValueChange={setSelectedEntityForBranch}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entity" />
                          </SelectTrigger>
                          <SelectContent>
                            {entities.map((entity) => (
                              <SelectItem key={entity.id} value={entity.id}>
                                {entity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                          id="branchName"
                          value={branchFormData.name}
                          onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="branchCode">Branch Code</Label>
                        <Input
                          id="branchCode"
                          value={branchFormData.code}
                          onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="branchAddress">Address</Label>
                      <Textarea
                        id="branchAddress"
                        value={branchFormData.address}
                        onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="branchContact">Contact Person</Label>
                        <Input
                          id="branchContact"
                          value={branchFormData.contactPerson}
                          onChange={(e) => setBranchFormData({ ...branchFormData, contactPerson: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="branchGst">GST Number</Label>
                        <Input
                          id="branchGst"
                          value={branchFormData.gstNumber}
                          onChange={(e) => setBranchFormData({ ...branchFormData, gstNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="branchEmail">Email</Label>
                        <Input
                          id="branchEmail"
                          type="email"
                          value={branchFormData.email}
                          onChange={(e) => setBranchFormData({ ...branchFormData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="branchPhone">Phone</Label>
                        <Input
                          id="branchPhone"
                          value={branchFormData.phone}
                          onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBranchDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveBranch}>
                      {editingBranch.branch ? 'Update Branch' : 'Add Branch'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isEntityDialogOpen} onOpenChange={setIsEntityDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    resetEntityForm();
                    setEditingEntity(null);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Entity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEntity ? 'Edit Entity' : 'Add New Entity'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingEntity ? 'Update entity information' : 'Create a new legal entity'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entityName">Entity Name *</Label>
                        <Input
                          id="entityName"
                          value={entityFormData.name}
                          onChange={(e) => setEntityFormData({ ...entityFormData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="entityType">Entity Type</Label>
                        <Select
                          value={entityFormData.type}
                          onValueChange={(value: any) => setEntityFormData({ ...entityFormData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {entityTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="regNumber">Registration Number</Label>
                        <Input
                          id="regNumber"
                          value={entityFormData.registrationNumber}
                          onChange={(e) => setEntityFormData({ ...entityFormData, registrationNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="panNumber">PAN Number *</Label>
                        <Input
                          id="panNumber"
                          value={entityFormData.panNumber}
                          onChange={(e) => setEntityFormData({ ...entityFormData, panNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={entityFormData.gstNumber}
                        onChange={(e) => setEntityFormData({ ...entityFormData, gstNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={entityFormData.address}
                        onChange={(e) => setEntityFormData({ ...entityFormData, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={entityFormData.contactPerson}
                          onChange={(e) => setEntityFormData({ ...entityFormData, contactPerson: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={entityFormData.email}
                          onChange={(e) => setEntityFormData({ ...entityFormData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={entityFormData.phone}
                          onChange={(e) => setEntityFormData({ ...entityFormData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Assigned Users</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {availableUsers.map((user) => (
                          <div key={user} className="flex items-center space-x-2">
                            <Checkbox
                              checked={entityFormData.assignedUsers?.includes(user) || false}
                              onCheckedChange={() => toggleEntityUser(user)}
                            />
                            <Label className="text-sm">{user}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Compliance Heads</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {availableComplianceHeads.map((head) => (
                          <div key={head} className="flex items-center space-x-2">
                            <Checkbox
                              checked={entityFormData.complianceHeads?.includes(head) || false}
                              onCheckedChange={() => toggleComplianceHead(head)}
                            />
                            <Label className="text-sm">{head}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEntityDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEntity}>
                      {editingEntity ? 'Update Entity' : 'Create Entity'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {entities.map((entity) => (
              <Card key={entity.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{entity.name}</h3>
                        <Badge variant="outline">{entity.type}</Badge>
                        <Badge variant={entity.isActive ? 'default' : 'secondary'}>
                          {entity.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>PAN: {entity.panNumber}</span>
                        {entity.gstNumber && <span>GST: {entity.gstNumber}</span>}
                        <span>{entity.branches.length} branches</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntity(entity)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntity(entity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">Assigned Users</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.assignedUsers.map((user) => (
                        <Badge key={user} variant="secondary" className="text-xs">
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Compliance Heads</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.complianceHeads.map((head) => (
                        <Badge key={head} variant="outline" className="text-xs">
                          {head}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Contact</Label>
                    <div className="text-sm text-muted-foreground">
                      <div>{entity.contactPerson}</div>
                      <div>{entity.email}</div>
                    </div>
                  </div>
                </div>

                {entity.branches.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Branches ({entity.branches.length})</Label>
                    <div className="mt-2 space-y-2">
                      {entity.branches.map((branch) => (
                        <div key={branch.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{branch.name}</span>
                                <Badge variant="outline" className="text-xs">{branch.code}</Badge>
                                {branch.gstNumber && (
                                  <Badge variant="secondary" className="text-xs">
                                    GST: {branch.gstNumber}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {branch.address}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBranch(entity, branch)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBranch(entity.id, branch.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};