import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Users, Bell, FileText, Plug, FolderTree, Palette, Building, Activity } from 'lucide-react';
import ComplianceTaxonomy from './ComplianceTaxonomy';
import { RolePermissionsMatrix } from './settings/RolePermissionsMatrix';
import { ReminderLogicConfigurator } from './settings/ReminderLogicConfigurator';
import { NotificationTemplates } from './settings/NotificationTemplates';
import { DocumentTypeRules } from './settings/DocumentTypeRules';
import { ExternalIntegrations } from './settings/ExternalIntegrations';
import { AutoFolderRules } from './settings/AutoFolderRules';
import { BrandingConfiguration } from './settings/BrandingConfiguration';
import { EntityBranchManagement } from './settings/EntityBranchManagement';
import { ActivityLogViewer } from './settings/ActivityLogViewer';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("taxonomy");

  const settingsTabs = [
    {
      id: "taxonomy",
      label: "Compliance Taxonomy",
      icon: FileText,
      description: "Manage compliance heads and sub-heads"
    },
    {
      id: "permissions",
      label: "Roles & Permissions",
      icon: Users,
      description: "Configure user access and permissions"
    },
    {
      id: "reminders",
      label: "Reminder Logic",
      icon: Bell,
      description: "Set up reminder intervals and schedules"
    },
    {
      id: "notifications",
      label: "Notification Templates",
      icon: Bell,
      description: "Customize email and message templates"
    },
    {
      id: "document-rules",
      label: "Document Type Rules",
      icon: FileText,
      description: "Define document validation rules"
    },
    {
      id: "integrations",
      label: "External Integrations",
      icon: Plug,
      description: "Manage third-party app connections"
    },
    {
      id: "folder-rules",
      label: "Auto-Folder Rules",
      icon: FolderTree,
      description: "Configure automatic vault organization"
    },
    {
      id: "branding",
      label: "Branding",
      icon: Palette,
      description: "Customize appearance and branding"
    },
    {
      id: "entities",
      label: "Entity & Branch",
      icon: Building,
      description: "Manage organizational entities"
    },
    {
      id: "activity-log",
      label: "Activity Log",
      icon: Activity,
      description: "View system configuration changes"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your compliance management system
            </p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-border">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1">
              {settingsTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs text-center leading-tight">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="taxonomy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Taxonomy Management</CardTitle>
                  <CardDescription>
                    Create and manage compliance heads and sub-heads with default settings, frequencies, and validation rules.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceTaxonomy />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <RolePermissionsMatrix />
            </TabsContent>

            <TabsContent value="reminders" className="space-y-6">
              <ReminderLogicConfigurator />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationTemplates />
            </TabsContent>

            <TabsContent value="document-rules" className="space-y-6">
              <DocumentTypeRules />
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <ExternalIntegrations />
            </TabsContent>

            <TabsContent value="folder-rules" className="space-y-6">
              <AutoFolderRules />
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <BrandingConfiguration />
            </TabsContent>

            <TabsContent value="entities" className="space-y-6">
              <EntityBranchManagement />
            </TabsContent>

            <TabsContent value="activity-log" className="space-y-6">
              <ActivityLogViewer />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;