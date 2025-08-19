import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface SubHead {
  id: string;
  name: string;
  description: string;
  colorTag: string;
  defaultTicketClosureRights: string;
  defaultReminderFrequency: string;
  aiValidationEnabled: boolean;
}

interface ComplianceHead {
  id: string;
  name: string;
  description: string;
  colorTag: string;
  defaultTicketClosureRights: string;
  defaultReminderFrequency: string;
  aiValidationEnabled: boolean;
  subHeads: SubHead[];
  isExpanded: boolean;
}

const colorOptions = [
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
];

const ticketClosureRights = [
  'Admin Only',
  'Department Head',
  'Team Lead',
  'Any Team Member',
];

const reminderFrequencies = [
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Quarterly',
];

const ComplianceTaxonomy: React.FC = () => {
  const { toast } = useToast();
  const [complianceHeads, setComplianceHeads] = useState<ComplianceHead[]>([
    {
      id: '1',
      name: 'GST',
      description: 'Goods and Services Tax compliance',
      colorTag: 'blue',
      defaultTicketClosureRights: 'Department Head',
      defaultReminderFrequency: 'Monthly',
      aiValidationEnabled: true,
      isExpanded: false,
      subHeads: [
        {
          id: '1-1',
          name: 'GST Return Filing',
          description: 'Monthly GST return submissions',
          colorTag: 'blue',
          defaultTicketClosureRights: 'Team Lead',
          defaultReminderFrequency: 'Monthly',
          aiValidationEnabled: true,
        }
      ]
    },
    {
      id: '2',
      name: 'ROC',
      description: 'Registrar of Companies compliance',
      colorTag: 'green',
      defaultTicketClosureRights: 'Admin Only',
      defaultReminderFrequency: 'Quarterly',
      aiValidationEnabled: false,
      isExpanded: false,
      subHeads: []
    }
  ]);

  const [isAddHeadDialogOpen, setIsAddHeadDialogOpen] = useState(false);
  const [isAddSubHeadDialogOpen, setIsAddSubHeadDialogOpen] = useState(false);
  const [editingHead, setEditingHead] = useState<ComplianceHead | null>(null);
  const [editingSubHead, setEditingSubHead] = useState<{ head: ComplianceHead; subHead: SubHead } | null>(null);
  const [selectedHeadForSubHead, setSelectedHeadForSubHead] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorTag: '',
    defaultTicketClosureRights: '',
    defaultReminderFrequency: '',
    aiValidationEnabled: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      colorTag: '',
      defaultTicketClosureRights: '',
      defaultReminderFrequency: '',
      aiValidationEnabled: false,
    });
  };

  const handleAddHead = () => {
    if (!formData.name.trim()) return;

    const newHead: ComplianceHead = {
      id: Date.now().toString(),
      ...formData,
      subHeads: [],
      isExpanded: false,
    };

    setComplianceHeads([...complianceHeads, newHead]);
    resetForm();
    setIsAddHeadDialogOpen(false);
    toast({
      title: "Compliance Head Added",
      description: `${formData.name} has been added successfully.`,
    });
  };

  const handleEditHead = (head: ComplianceHead) => {
    setFormData({
      name: head.name,
      description: head.description,
      colorTag: head.colorTag,
      defaultTicketClosureRights: head.defaultTicketClosureRights,
      defaultReminderFrequency: head.defaultReminderFrequency,
      aiValidationEnabled: head.aiValidationEnabled,
    });
    setEditingHead(head);
  };

  const handleUpdateHead = () => {
    if (!editingHead || !formData.name.trim()) return;

    setComplianceHeads(complianceHeads.map(head =>
      head.id === editingHead.id ? { ...head, ...formData } : head
    ));
    resetForm();
    setEditingHead(null);
    toast({
      title: "Compliance Head Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteHead = (headId: string) => {
    setComplianceHeads(complianceHeads.filter(head => head.id !== headId));
    toast({
      title: "Compliance Head Deleted",
      description: "The compliance head has been removed.",
    });
  };

  const handleAddSubHead = () => {
    if (!formData.name.trim() || !selectedHeadForSubHead) return;

    const newSubHead: SubHead = {
      id: Date.now().toString(),
      ...formData,
    };

    setComplianceHeads(complianceHeads.map(head =>
      head.id === selectedHeadForSubHead
        ? { ...head, subHeads: [...head.subHeads, newSubHead] }
        : head
    ));
    resetForm();
    setIsAddSubHeadDialogOpen(false);
    setSelectedHeadForSubHead('');
    toast({
      title: "Sub-Head Added",
      description: `${formData.name} has been added successfully.`,
    });
  };

  const handleEditSubHead = (head: ComplianceHead, subHead: SubHead) => {
    setFormData({
      name: subHead.name,
      description: subHead.description,
      colorTag: subHead.colorTag,
      defaultTicketClosureRights: subHead.defaultTicketClosureRights,
      defaultReminderFrequency: subHead.defaultReminderFrequency,
      aiValidationEnabled: subHead.aiValidationEnabled,
    });
    setEditingSubHead({ head, subHead });
  };

  const handleUpdateSubHead = () => {
    if (!editingSubHead || !formData.name.trim()) return;

    setComplianceHeads(complianceHeads.map(head =>
      head.id === editingSubHead.head.id
        ? {
            ...head,
            subHeads: head.subHeads.map(subHead =>
              subHead.id === editingSubHead.subHead.id ? { ...subHead, ...formData } : subHead
            )
          }
        : head
    ));
    resetForm();
    setEditingSubHead(null);
    toast({
      title: "Sub-Head Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteSubHead = (headId: string, subHeadId: string) => {
    setComplianceHeads(complianceHeads.map(head =>
      head.id === headId
        ? { ...head, subHeads: head.subHeads.filter(subHead => subHead.id !== subHeadId) }
        : head
    ));
    toast({
      title: "Sub-Head Deleted",
      description: "The sub-head has been removed.",
    });
  };

  const toggleHeadExpansion = (headId: string) => {
    setComplianceHeads(complianceHeads.map(head =>
      head.id === headId ? { ...head, isExpanded: !head.isExpanded } : head
    ));
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description"
        />
      </div>

      <div>
        <Label htmlFor="colorTag">Color Tag</Label>
        <Select value={formData.colorTag} onValueChange={(value) => setFormData({ ...formData, colorTag: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${color.class}`} />
                  <span>{color.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="ticketClosureRights">Default Ticket Closure Rights</Label>
        <Select value={formData.defaultTicketClosureRights} onValueChange={(value) => setFormData({ ...formData, defaultTicketClosureRights: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select closure rights" />
          </SelectTrigger>
          <SelectContent>
            {ticketClosureRights.map((right) => (
              <SelectItem key={right} value={right}>
                {right}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reminderFrequency">Default Reminder Frequency</Label>
        <Select value={formData.defaultReminderFrequency} onValueChange={(value) => setFormData({ ...formData, defaultReminderFrequency: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {reminderFrequencies.map((frequency) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="aiValidation"
          checked={formData.aiValidationEnabled}
          onCheckedChange={(checked) => setFormData({ ...formData, aiValidationEnabled: checked })}
        />
        <Label htmlFor="aiValidation">AI Validation Toggle</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Taxonomy</h1>
          <p className="text-muted-foreground">Manage compliance heads and sub-heads for your organization</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddHeadDialogOpen} onOpenChange={setIsAddHeadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Compliance Head
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Compliance Head</DialogTitle>
                <DialogDescription>
                  Create a new compliance category for your organization.
                </DialogDescription>
              </DialogHeader>
              {renderForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddHeadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddHead}>Add Head</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddSubHeadDialogOpen} onOpenChange={setIsAddSubHeadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Sub-Head
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sub-Head</DialogTitle>
                <DialogDescription>
                  Add a sub-category under an existing compliance head.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parentHead">Parent Compliance Head</Label>
                  <Select value={selectedHeadForSubHead} onValueChange={setSelectedHeadForSubHead}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent head" />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceHeads.map((head) => (
                        <SelectItem key={head.id} value={head.id}>
                          {head.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderForm()}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubHeadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubHead}>Add Sub-Head</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {complianceHeads.map((head) => (
          <Card key={head.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Collapsible open={head.isExpanded} onOpenChange={() => toggleHeadExpansion(head.id)}>
                  <CollapsibleTrigger className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded">
                    {head.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${head.colorTag}-500`} />
                      <div>
                        <CardTitle className="text-left">{head.name}</CardTitle>
                        <CardDescription className="text-left">{head.description}</CardDescription>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </Collapsible>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={head.aiValidationEnabled ? "default" : "secondary"}>
                    AI: {head.aiValidationEnabled ? "On" : "Off"}
                  </Badge>
                  <Badge variant="outline">{head.defaultReminderFrequency}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditHead(head)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHead(head.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Collapsible open={head.isExpanded}>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Closure Rights:</span> {head.defaultTicketClosureRights}</div>
                      <div><span className="font-medium">Reminder Frequency:</span> {head.defaultReminderFrequency}</div>
                    </div>
                    
                    {head.subHeads.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Sub-Heads ({head.subHeads.length})</h4>
                        <div className="space-y-2">
                          {head.subHeads.map((subHead) => (
                            <div key={subHead.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full bg-${subHead.colorTag}-500`} />
                                <div>
                                  <div className="font-medium">{subHead.name}</div>
                                  <div className="text-sm text-muted-foreground">{subHead.description}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={subHead.aiValidationEnabled ? "default" : "secondary"} className="text-xs">
                                  AI: {subHead.aiValidationEnabled ? "On" : "Off"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSubHead(head, subHead)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSubHead(head.id, subHead.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Edit Head Dialog */}
      <Dialog open={!!editingHead} onOpenChange={() => setEditingHead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Compliance Head</DialogTitle>
            <DialogDescription>
              Update the details of this compliance head.
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHead(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateHead}>Update Head</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sub-Head Dialog */}
      <Dialog open={!!editingSubHead} onOpenChange={() => setEditingSubHead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub-Head</DialogTitle>
            <DialogDescription>
              Update the details of this sub-head.
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubHead(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubHead}>Update Sub-Head</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplianceTaxonomy;