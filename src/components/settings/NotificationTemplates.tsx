import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Bell, Edit, Save, Eye, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms';
  category: 'task-creation' | 'document-upload' | 'ticket-closure' | 'escalation' | 'digest';
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

const templateCategories = [
  { value: 'task-creation', label: 'Task Creation' },
  { value: 'document-upload', label: 'Document Upload Pending' },
  { value: 'ticket-closure', label: 'Ticket Auto-Closure' },
  { value: 'escalation', label: 'Escalation Alerts' },
  { value: 'digest', label: 'Weekly Digest' }
];

const availableVariables = [
  '{{task_name}}', '{{assignee_name}}', '{{due_date}}', '{{compliance_head}}',
  '{{entity_name}}', '{{document_type}}', '{{filing_date}}', '{{status}}',
  '{{ticket_id}}', '{{escalation_level}}', '{{company_name}}', '{{user_name}}'
];

export const NotificationTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Task Creation Email',
      type: 'email',
      category: 'task-creation',
      subject: 'New Task Assigned: {{task_name}}',
      body: 'Dear {{assignee_name}},\n\nA new task has been assigned to you:\n\nTask: {{task_name}}\nCompliance Head: {{compliance_head}}\nDue Date: {{due_date}}\nEntity: {{entity_name}}\n\nPlease log in to the system to view details.\n\nBest regards,\n{{company_name}} Compliance Team',
      variables: ['{{task_name}}', '{{assignee_name}}', '{{due_date}}', '{{compliance_head}}', '{{entity_name}}', '{{company_name}}'],
      isActive: true
    },
    {
      id: '2',
      name: 'Document Upload Reminder',
      type: 'whatsapp',
      category: 'document-upload',
      subject: '',
      body: 'Hi {{assignee_name}}, reminder to upload {{document_type}} for {{entity_name}}. Due: {{due_date}}. Ticket: {{ticket_id}}',
      variables: ['{{assignee_name}}', '{{document_type}}', '{{entity_name}}', '{{due_date}}', '{{ticket_id}}'],
      isActive: true
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSaveTemplate = (template: NotificationTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
      toast({
        title: "Template Updated",
        description: "Notification template has been updated successfully"
      });
    } else {
      setTemplates([...templates, { ...template, id: Date.now().toString() }]);
      toast({
        title: "Template Created",
        description: "New notification template has been created successfully"
      });
    }
    setEditingTemplate(null);
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId ? { ...template, isActive: !template.isActive } : template
    ));
  };

  const insertVariable = (variable: string, field: 'subject' | 'body') => {
    if (!editingTemplate) return;
    
    const template = { ...editingTemplate };
    if (field === 'subject') {
      template.subject += variable;
    } else {
      template.body += variable;
    }
    setEditingTemplate(template);
  };

  const renderTemplateEditor = () => {
    if (!editingTemplate) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={editingTemplate.name}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="templateType">Type</Label>
            <Select
              value={editingTemplate.type}
              onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="templateCategory">Category</Label>
          <Select
            value={editingTemplate.category}
            onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {editingTemplate.type === 'email' && (
          <div>
            <Label htmlFor="templateSubject">Subject</Label>
            <div className="space-y-2">
              <Input
                id="templateSubject"
                value={editingTemplate.subject}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
              />
              <div className="flex flex-wrap gap-1">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable, 'subject')}
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="templateBody">Message Body</Label>
          <div className="space-y-2">
            <Textarea
              id="templateBody"
              value={editingTemplate.body}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
              rows={8}
            />
            <div className="flex flex-wrap gap-1">
              {availableVariables.map((variable) => (
                <Button
                  key={variable}
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable, 'body')}
                >
                  {variable}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={editingTemplate.isActive}
            onCheckedChange={(checked) => setEditingTemplate({ ...editingTemplate, isActive: checked })}
          />
          <Label>Active</Label>
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => handleSaveTemplate(editingTemplate)}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" onClick={() => setEditingTemplate(null)}>
            Cancel
          </Button>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Template Preview</DialogTitle>
                <DialogDescription>
                  Preview how the template will look with sample data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {editingTemplate.type === 'email' && (
                  <div>
                    <Label>Subject:</Label>
                    <div className="p-3 bg-muted rounded">
                      {editingTemplate.subject.replace(/\{\{(\w+)\}\}/g, '[Sample $1]')}
                    </div>
                  </div>
                )}
                <div>
                  <Label>Body:</Label>
                  <div className="p-3 bg-muted rounded whitespace-pre-wrap">
                    {editingTemplate.body.replace(/\{\{(\w+)\}\}/g, '[Sample $1]')}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Templates</span>
          </CardTitle>
          <CardDescription>
            Customize email, WhatsApp, and SMS templates for various compliance events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Manage Templates</TabsTrigger>
              <TabsTrigger value="create">Create Template</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                {templateCategories.map((category) => {
                  const categoryTemplates = templates.filter(t => t.category === category.value);
                  return (
                    <Card key={category.value}>
                      <CardHeader>
                        <CardTitle className="text-lg">{category.label}</CardTitle>
                        <CardDescription>
                          Templates for {category.label.toLowerCase()} notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {categoryTemplates.length > 0 ? (
                          <div className="space-y-3">
                            {categoryTemplates.map((template) => (
                              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-primary/10 rounded">
                                    {template.type === 'email' && <Mail className="w-4 h-4" />}
                                    {template.type === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
                                    {template.type === 'sms' && <MessageSquare className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">{template.name}</span>
                                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                                        {template.isActive ? 'Active' : 'Inactive'}
                                      </Badge>
                                      <Badge variant="outline">{template.type}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {template.type === 'email' ? template.subject : template.body.substring(0, 60) + '...'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={template.isActive}
                                    onCheckedChange={() => toggleTemplateStatus(template.id)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingTemplate(template)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            No templates configured for this category
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </CardTitle>
                  <CardDescription>
                    Design custom notification templates with dynamic variables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {editingTemplate ? (
                    renderTemplateEditor()
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Select a template to edit or create a new one
                      </p>
                      <Button onClick={() => setEditingTemplate({
                        id: '',
                        name: '',
                        type: 'email',
                        category: 'task-creation',
                        subject: '',
                        body: '',
                        variables: [],
                        isActive: true
                      })}>
                        Create New Template
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Variable Helper */}
      <Card>
        <CardHeader>
          <CardTitle>Available Variables</CardTitle>
          <CardDescription>
            Use these variables in your templates to insert dynamic content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {availableVariables.map((variable) => (
              <Badge key={variable} variant="outline" className="justify-center">
                {variable}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};