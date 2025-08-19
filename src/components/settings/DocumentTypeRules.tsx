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
import { FileText, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'file' | 'dropdown';
  required: boolean;
  options?: string[];
}

interface DocumentTypeRule {
  id: string;
  name: string;
  description: string;
  complianceHeadId: string;
  complianceHeadName: string;
  validationFields: ValidationField[];
  fileExtensions: string[];
  maxFileSize: number; // in MB
  aiValidationEnabled: boolean;
  isActive: boolean;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'file', label: 'File Upload' },
  { value: 'dropdown', label: 'Dropdown' }
];

const commonFileExtensions = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip'
];

export const DocumentTypeRules = () => {
  const { toast } = useToast();
  const [documentRules, setDocumentRules] = useState<DocumentTypeRule[]>([
    {
      id: '1',
      name: 'GSTR-3B',
      description: 'Monthly GST Return Form',
      complianceHeadId: 'gst-head',
      complianceHeadName: 'GST',
      validationFields: [
        { id: '1', name: 'Due Date', type: 'date', required: true },
        { id: '2', name: 'Entity Name', type: 'text', required: true },
        { id: '3', name: 'GSTIN', type: 'text', required: true },
        { id: '4', name: 'Return Period', type: 'dropdown', required: true, options: ['Apr-2024', 'May-2024', 'Jun-2024'] }
      ],
      fileExtensions: ['pdf', 'zip'],
      maxFileSize: 10,
      aiValidationEnabled: true,
      isActive: true
    },
    {
      id: '2',
      name: 'Form MGT-7',
      description: 'Annual Return for Companies',
      complianceHeadId: 'roc-head',
      complianceHeadName: 'ROC',
      validationFields: [
        { id: '1', name: 'Financial Year', type: 'dropdown', required: true, options: ['2023-24', '2024-25'] },
        { id: '2', name: 'Company Name', type: 'text', required: true },
        { id: '3', name: 'CIN', type: 'text', required: true }
      ],
      fileExtensions: ['pdf', 'doc', 'docx'],
      maxFileSize: 25,
      aiValidationEnabled: false,
      isActive: true
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<DocumentTypeRule | null>(null);
  const [formData, setFormData] = useState<Partial<DocumentTypeRule>>({
    name: '',
    description: '',
    complianceHeadId: '',
    validationFields: [],
    fileExtensions: [],
    maxFileSize: 10,
    aiValidationEnabled: true,
    isActive: true
  });

  const complianceHeads = [
    { id: 'gst-head', name: 'GST' },
    { id: 'roc-head', name: 'ROC' },
    { id: 'income-tax-head', name: 'Income Tax' },
    { id: 'labour-head', name: 'Labour Law' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      complianceHeadId: '',
      validationFields: [],
      fileExtensions: [],
      maxFileSize: 10,
      aiValidationEnabled: true,
      isActive: true
    });
  };

  const handleSaveRule = () => {
    if (!formData.name || !formData.complianceHeadId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const complianceHead = complianceHeads.find(h => h.id === formData.complianceHeadId);
    const rule: DocumentTypeRule = {
      id: editingRule?.id || Date.now().toString(),
      name: formData.name!,
      description: formData.description!,
      complianceHeadId: formData.complianceHeadId!,
      complianceHeadName: complianceHead?.name || '',
      validationFields: formData.validationFields || [],
      fileExtensions: formData.fileExtensions || [],
      maxFileSize: formData.maxFileSize || 10,
      aiValidationEnabled: formData.aiValidationEnabled || false,
      isActive: formData.isActive || true
    };

    if (editingRule) {
      setDocumentRules(rules => rules.map(r => r.id === editingRule.id ? rule : r));
      toast({
        title: "Rule Updated",
        description: "Document type rule has been updated successfully"
      });
    } else {
      setDocumentRules(rules => [...rules, rule]);
      toast({
        title: "Rule Created",
        description: "New document type rule has been created successfully"
      });
    }

    resetForm();
    setEditingRule(null);
    setIsCreateDialogOpen(false);
  };

  const handleEditRule = (rule: DocumentTypeRule) => {
    setFormData(rule);
    setEditingRule(rule);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setDocumentRules(rules => rules.filter(r => r.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Document type rule has been deleted successfully"
    });
  };

  const addValidationField = () => {
    const newField: ValidationField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false
    };
    setFormData({
      ...formData,
      validationFields: [...(formData.validationFields || []), newField]
    });
  };

  const updateValidationField = (index: number, field: Partial<ValidationField>) => {
    const updatedFields = [...(formData.validationFields || [])];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setFormData({ ...formData, validationFields: updatedFields });
  };

  const removeValidationField = (index: number) => {
    const updatedFields = formData.validationFields?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, validationFields: updatedFields });
  };

  const toggleFileExtension = (extension: string) => {
    const currentExtensions = formData.fileExtensions || [];
    if (currentExtensions.includes(extension)) {
      setFormData({
        ...formData,
        fileExtensions: currentExtensions.filter(ext => ext !== extension)
      });
    } else {
      setFormData({
        ...formData,
        fileExtensions: [...currentExtensions, extension]
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
                <FileText className="w-5 h-5" />
                <span>Document Type Rules</span>
              </CardTitle>
              <CardDescription>
                Define validation rules and expected fields for different document types
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingRule(null); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? 'Edit Document Type Rule' : 'Create Document Type Rule'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure validation requirements for document uploads
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentName">Document Type Name</Label>
                      <Input
                        id="documentName"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., GSTR-3B, Form MGT-7"
                      />
                    </div>
                    <div>
                      <Label htmlFor="complianceHead">Compliance Head</Label>
                      <Select
                        value={formData.complianceHeadId}
                        onValueChange={(value) => setFormData({ ...formData, complianceHeadId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select compliance head" />
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
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the document type and its purpose"
                    />
                  </div>

                  {/* Validation Fields */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Validation Fields</Label>
                      <Button variant="outline" size="sm" onClick={addValidationField}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {(formData.validationFields || []).map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="grid grid-cols-4 gap-3 items-end">
                            <div>
                              <Label>Field Name</Label>
                              <Input
                                value={field.name}
                                onChange={(e) => updateValidationField(index, { name: e.target.value })}
                                placeholder="Field name"
                              />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: any) => updateValidationField(index, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.required}
                                onCheckedChange={(checked) => updateValidationField(index, { required: !!checked })}
                              />
                              <Label>Required</Label>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeValidationField(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {field.type === 'dropdown' && (
                            <div className="mt-3">
                              <Label>Options (comma-separated)</Label>
                              <Input
                                value={field.options?.join(', ') || ''}
                                onChange={(e) => updateValidationField(index, { 
                                  options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                                })}
                                placeholder="Option 1, Option 2, Option 3"
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* File Settings */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-base font-medium">Allowed File Extensions</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {commonFileExtensions.map((ext) => (
                          <div key={ext} className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.fileExtensions?.includes(ext) || false}
                              onCheckedChange={() => toggleFileExtension(ext)}
                            />
                            <Label className="text-sm">.{ext}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={formData.maxFileSize}
                        onChange={(e) => setFormData({ ...formData, maxFileSize: parseInt(e.target.value) || 10 })}
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.aiValidationEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, aiValidationEnabled: !!checked })}
                      />
                      <Label>Enable AI Validation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                      />
                      <Label>Active</Label>
                    </div>
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
            {documentRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant="outline">{rule.complianceHeadName}</Badge>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {rule.aiValidationEnabled && (
                          <Badge variant="secondary">AI Validation</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm font-medium">Validation Fields ({rule.validationFields.length})</Label>
                      <div className="mt-2 space-y-1">
                        {rule.validationFields.map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {field.name} ({field.type})
                            </Badge>
                            {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">File Extensions</Label>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rule.fileExtensions.map((ext) => (
                          <Badge key={ext} variant="secondary" className="text-xs">
                            .{ext}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Max File Size</Label>
                      <p className="mt-2 text-sm">{rule.maxFileSize} MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};