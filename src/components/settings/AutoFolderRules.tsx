import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderTree, Plus, Edit, Trash2, Folder, Lock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FolderRule {
  id: string;
  name: string;
  triggerType: 'compliance-head' | 'sub-head' | 'entity' | 'document-type';
  triggerValue: string;
  folderStructure: string;
  accessLevel: 'public' | 'restricted' | 'private';
  defaultUsers: string[];
  isActive: boolean;
  createdAt: string;
  lastExecuted?: string;
}

interface FolderCreationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  folderPath: string;
  triggerData: string;
  createdAt: string;
  status: 'success' | 'error';
}

const accessLevels = [
  { value: 'public', label: 'Public', description: 'All users can access' },
  { value: 'restricted', label: 'Restricted', description: 'Specific users only' },
  { value: 'private', label: 'Private', description: 'Admin only' }
];

const triggerTypes = [
  { value: 'compliance-head', label: 'Compliance Head Creation' },
  { value: 'sub-head', label: 'Sub-Head Creation' },
  { value: 'entity', label: 'Entity Creation' },
  { value: 'document-type', label: 'Document Type Creation' }
];

export const AutoFolderRules = () => {
  const { toast } = useToast();
  const [folderRules, setFolderRules] = useState<FolderRule[]>([
    {
      id: '1',
      name: 'Compliance Head Folders',
      triggerType: 'compliance-head',
      triggerValue: '*',
      folderStructure: '/{{compliance_head}}/{{year}}/{{month}}',
      accessLevel: 'restricted',
      defaultUsers: ['admin', 'compliance-manager'],
      isActive: true,
      createdAt: '2024-01-10',
      lastExecuted: '2024-01-15'
    },
    {
      id: '2',
      name: 'GST Sub-Head Structure',
      triggerType: 'sub-head',
      triggerValue: 'GST',
      folderStructure: '/GST/{{sub_head}}/{{entity}}/{{quarter}}',
      accessLevel: 'restricted',
      defaultUsers: ['gst-team', 'admin'],
      isActive: true,
      createdAt: '2024-01-12'
    }
  ]);

  const [creationLogs, setCreationLogs] = useState<FolderCreationLog[]>([
    {
      id: '1',
      ruleId: '1',
      ruleName: 'Compliance Head Folders',
      folderPath: '/ROC/2024/January',
      triggerData: 'ROC compliance head created',
      createdAt: '2024-01-15 10:30 AM',
      status: 'success'
    },
    {
      id: '2',
      ruleId: '2',
      ruleName: 'GST Sub-Head Structure',
      folderPath: '/GST/GSTR-3B/ABC Corp/Q4-2024',
      triggerData: 'GSTR-3B sub-head created for ABC Corp',
      createdAt: '2024-01-14 02:15 PM',
      status: 'success'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FolderRule | null>(null);
  const [formData, setFormData] = useState<Partial<FolderRule>>({
    name: '',
    triggerType: 'compliance-head',
    triggerValue: '',
    folderStructure: '',
    accessLevel: 'restricted',
    defaultUsers: [],
    isActive: true
  });

  const availableUsers = [
    'admin',
    'compliance-manager',
    'gst-team',
    'roc-team',
    'finance-team',
    'audit-team'
  ];

  const folderVariables = [
    '{{compliance_head}}',
    '{{sub_head}}',
    '{{entity}}',
    '{{year}}',
    '{{month}}',
    '{{quarter}}',
    '{{document_type}}',
    '{{user_name}}'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      triggerType: 'compliance-head',
      triggerValue: '',
      folderStructure: '',
      accessLevel: 'restricted',
      defaultUsers: [],
      isActive: true
    });
  };

  const handleSaveRule = () => {
    if (!formData.name || !formData.folderStructure) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const rule: FolderRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name!,
      triggerType: formData.triggerType!,
      triggerValue: formData.triggerValue!,
      folderStructure: formData.folderStructure!,
      accessLevel: formData.accessLevel!,
      defaultUsers: formData.defaultUsers || [],
      isActive: formData.isActive!,
      createdAt: editingRule?.createdAt || new Date().toISOString().split('T')[0],
      lastExecuted: editingRule?.lastExecuted
    };

    if (editingRule) {
      setFolderRules(rules => rules.map(r => r.id === editingRule.id ? rule : r));
      toast({
        title: "Rule Updated",
        description: "Auto-folder rule has been updated successfully"
      });
    } else {
      setFolderRules(rules => [...rules, rule]);
      toast({
        title: "Rule Created",
        description: "New auto-folder rule has been created successfully"
      });
    }

    resetForm();
    setEditingRule(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditRule = (rule: FolderRule) => {
    setFormData(rule);
    setEditingRule(rule);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setFolderRules(rules => rules.filter(r => r.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Auto-folder rule has been deleted successfully"
    });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setFolderRules(rules => rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const insertVariable = (variable: string) => {
    const currentStructure = formData.folderStructure || '';
    setFormData({
      ...formData,
      folderStructure: currentStructure + (currentStructure.endsWith('/') ? '' : '/') + variable
    });
  };

  const toggleUser = (user: string) => {
    const currentUsers = formData.defaultUsers || [];
    if (currentUsers.includes(user)) {
      setFormData({
        ...formData,
        defaultUsers: currentUsers.filter(u => u !== user)
      });
    } else {
      setFormData({
        ...formData,
        defaultUsers: [...currentUsers, user]
      });
    }
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return <Lock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FolderTree className="w-5 h-5" />
                <span>Auto-Folder Rules</span>
              </CardTitle>
              <CardDescription>
                Configure automatic vault folder creation for compliance items
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingRule(null); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? 'Edit Auto-Folder Rule' : 'Create Auto-Folder Rule'}
                  </DialogTitle>
                  <DialogDescription>
                    Set up automatic folder creation when compliance items are added
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter rule name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="triggerType">Trigger Type</Label>
                      <Select
                        value={formData.triggerType}
                        onValueChange={(value: any) => setFormData({ ...formData, triggerType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="triggerValue">Trigger Value</Label>
                      <Input
                        id="triggerValue"
                        value={formData.triggerValue}
                        onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                        placeholder="* for all, or specific name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="folderStructure">Folder Structure</Label>
                    <Input
                      id="folderStructure"
                      value={formData.folderStructure}
                      onChange={(e) => setFormData({ ...formData, folderStructure: e.target.value })}
                      placeholder="/{{compliance_head}}/{{year}}/{{month}}"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {folderVariables.map((variable) => (
                        <Button
                          key={variable}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable)}
                        >
                          {variable}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accessLevel">Default Access Level</Label>
                    <Select
                      value={formData.accessLevel}
                      onValueChange={(value: any) => setFormData({ ...formData, accessLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Default Users</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableUsers.map((user) => (
                        <div key={user} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`user-${user}`}
                            checked={formData.defaultUsers?.includes(user) || false}
                            onChange={() => toggleUser(user)}
                            className="rounded border-input"
                          />
                          <Label htmlFor={`user-${user}`} className="text-sm">
                            {user}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRule}>
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {folderRules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {triggerTypes.find(t => t.value === rule.triggerType)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Creates: {rule.folderStructure}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          {getAccessIcon(rule.accessLevel)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {rule.accessLevel}
                          </span>
                        </div>
                        {rule.lastExecuted && (
                          <span className="text-xs text-muted-foreground">
                            Last used: {rule.lastExecuted}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRuleStatus(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Folder Creation Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Folder Creations</CardTitle>
          <CardDescription>
            View folders automatically created by your rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Folder Path</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creationLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.ruleName}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {log.folderPath}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm">{log.triggerData}</TableCell>
                  <TableCell className="text-sm">{log.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};