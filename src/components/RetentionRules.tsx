import { useState } from "react";
import { Clock, Archive, Trash2, Plus, Calendar, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface RetentionRule {
  id: string;
  name: string;
  targetType: 'folder' | 'fileType' | 'tag';
  targetValue: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  action: 'archive' | 'delete';
  isActive: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  nextExecution?: Date;
}

interface RetentionRulesProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RetentionRule[];
  folders: string[];
  tags: string[];
}

export const RetentionRules = ({ 
  isOpen, 
  onClose, 
  rules, 
  folders, 
  tags 
}: RetentionRulesProps) => {
  const { toast } = useToast();
  const [retentionRules, setRetentionRules] = useState<RetentionRule[]>(rules);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    targetType: 'folder' as 'folder' | 'fileType' | 'tag',
    targetValue: "",
    retentionPeriod: 365,
    retentionUnit: 'days' as 'days' | 'months' | 'years',
    action: 'archive' as 'archive' | 'delete'
  });

  const fileTypes = ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'JPG', 'PNG'];

  const handleCreateRule = () => {
    if (!newRule.name.trim() || !newRule.targetValue) return;

    const rule: RetentionRule = {
      id: Date.now().toString(),
      name: newRule.name,
      targetType: newRule.targetType,
      targetValue: newRule.targetValue,
      retentionPeriod: newRule.retentionPeriod,
      retentionUnit: newRule.retentionUnit,
      action: newRule.action,
      isActive: true,
      createdAt: new Date(),
      nextExecution: calculateNextExecution(newRule.retentionPeriod, newRule.retentionUnit)
    };

    setRetentionRules(prev => [...prev, rule]);
    setNewRule({
      name: "",
      targetType: 'folder',
      targetValue: "",
      retentionPeriod: 365,
      retentionUnit: 'days',
      action: 'archive'
    });
    setIsCreating(false);

    toast({
      title: "Retention Rule Created",
      description: `Rule "${rule.name}" has been created and activated`,
    });
  };

  const handleToggleRule = (ruleId: string) => {
    setRetentionRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setRetentionRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Retention rule has been removed",
    });
  };

  const calculateNextExecution = (period: number, unit: string): Date => {
    const now = new Date();
    switch (unit) {
      case 'days':
        return new Date(now.getTime() + period * 24 * 60 * 60 * 1000);
      case 'months':
        return new Date(now.getFullYear(), now.getMonth() + period, now.getDate());
      case 'years':
        return new Date(now.getFullYear() + period, now.getMonth(), now.getDate());
      default:
        return now;
    }
  };

  const getTargetOptions = () => {
    switch (newRule.targetType) {
      case 'folder':
        return folders;
      case 'fileType':
        return fileTypes;
      case 'tag':
        return tags;
      default:
        return [];
    }
  };

  const formatRetentionPeriod = (period: number, unit: string) => {
    return `${period} ${unit}${period !== 1 ? '' : unit.slice(0, -1)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Document Retention Rules
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Create New Rule */}
          {isCreating ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create New Rule</h3>
                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    placeholder="e.g., Archive old invoices"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Target Type</Label>
                  <Select 
                    value={newRule.targetType} 
                    onValueChange={(value: 'folder' | 'fileType' | 'tag') => 
                      setNewRule(prev => ({ ...prev, targetType: value, targetValue: "" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folder">Folder</SelectItem>
                      <SelectItem value="fileType">File Type</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Select 
                    value={newRule.targetValue} 
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, targetValue: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTargetOptions().map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select 
                    value={newRule.action} 
                    onValueChange={(value: 'archive' | 'delete') => 
                      setNewRule(prev => ({ ...prev, action: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="archive">Archive</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Retention Period</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newRule.retentionPeriod}
                    onChange={(e) => setNewRule(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select 
                    value={newRule.retentionUnit} 
                    onValueChange={(value: 'days' | 'months' | 'years') => 
                      setNewRule(prev => ({ ...prev, retentionUnit: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateRule} 
                disabled={!newRule.name.trim() || !newRule.targetValue}
                className="w-full"
              >
                Create Rule
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Retention Rule
            </Button>
          )}

          {/* Existing Rules */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Rules</h3>
            
            {retentionRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No retention rules configured</p>
                <p className="text-sm">Create rules to automatically manage document lifecycle</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {retentionRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-lg border ${
                        rule.isActive ? 'border-border' : 'border-border/50 bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge variant={rule.isActive ? "default" : "secondary"}>
                              {rule.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant={rule.action === 'delete' ? "destructive" : "outline"}>
                              {rule.action === 'delete' ? <Trash2 className="w-3 h-3 mr-1" /> : <Archive className="w-3 h-3 mr-1" />}
                              {rule.action.charAt(0).toUpperCase() + rule.action.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <Folder className="w-3 h-3" />
                              Target: {rule.targetType} = "{rule.targetValue}"
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              Retention: {formatRetentionPeriod(rule.retentionPeriod, rule.retentionUnit)}
                            </div>
                            {rule.nextExecution && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Next execution: {rule.nextExecution.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
