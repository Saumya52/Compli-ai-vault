import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Copy, Download, Edit, Trash2, 
  FolderOpen, Calendar, User, Tag 
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  tags: string[];
  isActive: boolean;
  fileSize: string;
  originalDocument: string;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sourceDocument?: string;
  sourceDocumentId?: string;
}

const mockTemplates: DocumentTemplate[] = [
  {
    id: "1",
    name: "Board Resolution - Director Appointment",
    description: "Standard template for appointing new directors with all required clauses",
    category: "Board Resolutions",
    createdBy: "Legal Team",
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-01-20'),
    usageCount: 12,
    tags: ["Director", "Appointment", "Board"],
    isActive: true,
    fileSize: "156 KB",
    originalDocument: "BR_Director_Appointment_ABC_Ltd.pdf"
  },
  {
    id: "2",
    name: "Authorization Letter - GST Filing",
    description: "Template for authorizing CA firms for GST return filing",
    category: "Authorization Letters",
    createdBy: "Compliance Team",
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-18'),
    usageCount: 28,
    tags: ["GST", "Authorization", "CA"],
    isActive: true,
    fileSize: "89 KB",
    originalDocument: "Auth_Letter_GST_XYZ_Corp.pdf"
  },
  {
    id: "3",
    name: "Annual Return Form - ROC",
    description: "Pre-filled template for ROC annual return with common fields",
    category: "ROC Filings",
    createdBy: "CS Team",
    createdAt: new Date('2023-12-20'),
    lastUsed: new Date('2024-01-05'),
    usageCount: 8,
    tags: ["ROC", "Annual Return", "MCA"],
    isActive: false,
    fileSize: "234 KB",
    originalDocument: "Annual_Return_Template_2024.pdf"
  }
];

const categories = [
  "Board Resolutions",
  "Authorization Letters", 
  "ROC Filings",
  "Bank Documents",
  "Agreements",
  "Compliance Forms"
];

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  isOpen,
  onClose,
  sourceDocument,
  sourceDocumentId
}) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<DocumentTemplate[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState("browse");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "",
    tags: ""
  });

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    const matchesSearch = searchTerm === "" || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in template name and category",
        variant: "destructive"
      });
      return;
    }

    const template: DocumentTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      createdBy: "Current User",
      createdAt: new Date(),
      usageCount: 0,
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isActive: true,
      fileSize: "Unknown",
      originalDocument: sourceDocument || "Manual Template"
    };

    setTemplates(prev => [template, ...prev]);
    setNewTemplate({ name: "", description: "", category: "", tags: "" });
    
    toast({
      title: "Template Created",
      description: `Template "${template.name}" has been created successfully`,
    });
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === template.id 
          ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date() }
          : t
      )
    );
    
    toast({
      title: "Template Used",
      description: `Creating new document from template "${template.name}"`,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Template has been permanently deleted",
    });
  };

  const handleToggleActive = (templateId: string) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === templateId ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Document Template Manager
            {sourceDocument && (
              <Badge variant="outline" className="ml-2">
                From: {sourceDocument}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Templates</TabsTrigger>
            <TabsTrigger value="create">Create New Template</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-semibold">
                          {template.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {!template.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Created by {template.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(template.createdAt, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Used {template.usageCount} times</span>
                        <span>{template.fileSize}</span>
                      </div>
                      {template.lastUsed && (
                        <div className="text-green-600">
                          Last used: {format(template.lastUsed, 'MMM dd')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                        disabled={!template.isActive}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleActive(template.id)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground">No templates found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Template</CardTitle>
                {sourceDocument && (
                  <p className="text-sm text-muted-foreground">
                    Creating template from: {sourceDocument}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input
                      id="templateName"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="templateCategory">Category *</Label>
                    <Select 
                      value={newTemplate.category} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="templateDescription">Description</Label>
                  <Textarea
                    id="templateDescription"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe when and how to use this template"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="templateTags">Tags (comma-separated)</Label>
                  <Input
                    id="templateTags"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., GST, Authorization, Director"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setNewTemplate({ name: "", description: "", category: "", tags: "" })}
                  >
                    Clear
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All Templates
            </Button>
            <Button>
              Import Templates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};