import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Bell, Calendar, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReminderRule {
  id: string;
  name: string;
  type: 'global' | 'compliance-head' | 'sub-head';
  target?: string; // compliance head or sub-head ID
  intervals: string[];
  isActive: boolean;
  description: string;
}

const defaultIntervals = [
  'T-30', 'T-15', 'T-7', 'T-3', 'T-1', 'D+1', 'D+3', 'D+7', 'D+15'
];

const intervalTypes = [
  { value: 'T-30', label: '30 days before' },
  { value: 'T-15', label: '15 days before' },
  { value: 'T-7', label: '7 days before' },
  { value: 'T-3', label: '3 days before' },
  { value: 'T-1', label: '1 day before' },
  { value: 'D+1', label: '1 day after' },
  { value: 'D+3', label: '3 days after' },
  { value: 'D+7', label: '7 days after' },
  { value: 'D+15', label: '15 days after' },
  { value: 'D+30', label: '30 days after' }
];

export const ReminderLogicConfigurator = () => {
  const { toast } = useToast();
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    {
      id: '1',
      name: 'Global Default',
      type: 'global',
      intervals: ['T-7', 'T-3', 'D+1'],
      isActive: true,
      description: 'Default reminder schedule for all compliance items'
    },
    {
      id: '2',
      name: 'GST Reminders',
      type: 'compliance-head',
      target: 'gst-head',
      intervals: ['T-15', 'T-7', 'T-3', 'T-1', 'D+1'],
      isActive: true,
      description: 'Specific reminder schedule for GST compliance'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('global');
  const [editingRule, setEditingRule] = useState<ReminderRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<ReminderRule>>({
    name: '',
    type: 'global',
    intervals: [],
    isActive: true,
    description: ''
  });

  const complianceHeads = [
    { id: 'gst-head', name: 'GST' },
    { id: 'roc-head', name: 'ROC' },
    { id: 'income-tax-head', name: 'Income Tax' },
    { id: 'labour-head', name: 'Labour Law' }
  ];

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.intervals?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const rule: ReminderRule = {
      id: editingRule?.id || Date.now().toString(),
      name: newRule.name!,
      type: newRule.type!,
      target: newRule.target,
      intervals: newRule.intervals!,
      isActive: newRule.isActive!,
      description: newRule.description!
    };

    if (editingRule) {
      setReminderRules(rules => rules.map(r => r.id === editingRule.id ? rule : r));
      toast({
        title: "Rule Updated",
        description: "Reminder rule has been updated successfully"
      });
    } else {
      setReminderRules(rules => [...rules, rule]);
      toast({
        title: "Rule Created",
        description: "New reminder rule has been created successfully"
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setNewRule({
      name: '',
      type: 'global',
      intervals: [],
      isActive: true,
      description: ''
    });
    setEditingRule(null);
  };

  const handleEditRule = (rule: ReminderRule) => {
    setNewRule(rule);
    setEditingRule(rule);
  };

  const handleDeleteRule = (ruleId: string) => {
    setReminderRules(rules => rules.filter(r => r.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Reminder rule has been deleted successfully"
    });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setReminderRules(rules => rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const addInterval = (interval: string) => {
    if (!newRule.intervals?.includes(interval)) {
      setNewRule({
        ...newRule,
        intervals: [...(newRule.intervals || []), interval]
      });
    }
  };

  const removeInterval = (interval: string) => {
    setNewRule({
      ...newRule,
      intervals: newRule.intervals?.filter(i => i !== interval) || []
    });
  };

  const getIntervalLabel = (interval: string) => {
    const type = intervalTypes.find(t => t.value === interval);
    return type?.label || interval;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Reminder Logic Configurator</span>
          </CardTitle>
          <CardDescription>
            Configure reminder intervals globally and per compliance head/sub-head
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global">Global Settings</TabsTrigger>
              <TabsTrigger value="rules">Reminder Rules</TabsTrigger>
              <TabsTrigger value="create">Create Rule</TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Default Intervals</CardTitle>
                  <CardDescription>
                    These intervals will be used as default for all compliance items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {intervalTypes.map((interval) => (
                      <div key={interval.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`global-${interval.value}`}
                          className="rounded border-input"
                          defaultChecked={['T-7', 'T-3', 'D+1'].includes(interval.value)}
                        />
                        <Label htmlFor={`global-${interval.value}`} className="text-sm">
                          {interval.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Global Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              {reminderRules.map((rule) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Bell className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{rule.name}</h3>
                            <Badge variant={rule.type === 'global' ? 'default' : 'secondary'}>
                              {rule.type}
                            </Badge>
                            <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
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
                        {rule.type !== 'global' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-sm font-medium">Reminder Intervals</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {rule.intervals.map((interval) => (
                          <Badge key={interval} variant="outline">
                            {getIntervalLabel(interval)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingRule ? 'Edit Reminder Rule' : 'Create Reminder Rule'}
                  </CardTitle>
                  <CardDescription>
                    Set up custom reminder intervals for specific compliance areas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ruleName">Rule Name</Label>
                      <Input
                        id="ruleName"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ruleType">Rule Type</Label>
                      <Select
                        value={newRule.type}
                        onValueChange={(value: any) => setNewRule({ ...newRule, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="compliance-head">Compliance Head</SelectItem>
                          <SelectItem value="sub-head">Sub-Head</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(newRule.type === 'compliance-head' || newRule.type === 'sub-head') && (
                    <div>
                      <Label htmlFor="target">Target {newRule.type === 'compliance-head' ? 'Compliance Head' : 'Sub-Head'}</Label>
                      <Select
                        value={newRule.target}
                        onValueChange={(value) => setNewRule({ ...newRule, target: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target" />
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
                  )}

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      placeholder="Enter rule description"
                    />
                  </div>

                  <div>
                    <Label>Reminder Intervals</Label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {intervalTypes.map((interval) => (
                          <Button
                            key={interval.value}
                            variant={newRule.intervals?.includes(interval.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (newRule.intervals?.includes(interval.value)) {
                                removeInterval(interval.value);
                              } else {
                                addInterval(interval.value);
                              }
                            }}
                          >
                            {interval.label}
                          </Button>
                        ))}
                      </div>
                      {newRule.intervals && newRule.intervals.length > 0 && (
                        <div>
                          <Label className="text-sm">Selected Intervals:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {newRule.intervals.map((interval) => (
                              <Badge key={interval} variant="default">
                                {getIntervalLabel(interval)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newRule.isActive}
                      onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSaveRule}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingRule ? 'Update Rule' : 'Create Rule'}
                    </Button>
                    {editingRule && (
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};