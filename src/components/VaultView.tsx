import { useState } from "react";
import { Folder, FolderPlus, File, Upload, Search, Filter, History, Shield, Tag, Archive, Clock, Star, Pin, Bot, Bell, FileSignature, Cloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Import the new components
import { DocumentVersionHistory } from "./DocumentVersionHistory";
import { FolderPermissions } from "./FolderPermissions";
import { DocumentTagger } from "./DocumentTagger";
import { AdvancedSearch } from "./AdvancedSearch";
import { RetentionRules } from "./RetentionRules";
import { AuditTrail } from "./AuditTrail";
import { ExternalIntegrations } from "./ExternalIntegrations";
import { ESignatureManager } from "./ESignatureManager";
import { AISearchAssistant } from "./AISearchAssistant";

interface VaultViewProps {
  tasks: any[];
}

const VaultView = ({ tasks }: VaultViewProps) => {
  const { toast } = useToast();
  // Auto-generate MIS folders based on fiscal quarters and years
  const generateMISFolders = () => {
    const currentYear = new Date().getFullYear();
    const fiscalYears = [currentYear - 1, currentYear, currentYear + 1];
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    
    const misFolders = [];
    fiscalYears.forEach(year => {
      quarters.forEach(quarter => {
        misFolders.push({
          id: `mis-${year}-${quarter}`,
          name: `MIS Reports FY${year} ${quarter}`,
          type: "mis",
          files: Math.floor(Math.random() * 15), // Mock file count
          fiscalYear: year,
          quarter,
          subfolders: [
            "Compliance Summary",
            "Recurring Tracker", 
            "Document Status",
            "Auto-Closed Tickets",
            "Alerts & Escalations",
            "User Activity",
            "Audit Trails",
            "Entity-wise Reports",
            "Missed Deadlines",
            "Proof Packages"
          ]
        });
      });
    });
    return misFolders;
  };

  const [folders, setFolders] = useState([
    { id: 1, name: "Board Resolutions", type: "static", files: 0, isPinned: false, hasAlerts: false },
    { id: 2, name: "Incorporation Documents", type: "static", files: 0, isPinned: true, hasAlerts: false },
    { id: 3, name: "Bank Documents", type: "static", files: 0, isPinned: false, hasAlerts: true },
    { id: 4, name: "Invoices", type: "static", files: 0, isPinned: false, hasAlerts: false },
    { id: 5, name: "Authorization Letters", type: "static", files: 0, isPinned: false, hasAlerts: false },
    { id: 6, name: "Agreements", type: "static", files: 0, isPinned: false, hasAlerts: true },
  ]);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Dialog states for new features
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isTaggerOpen, setIsTaggerOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isRetentionRulesOpen, setIsRetentionRulesOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isESignOpen, setIsESignOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);

  // Generate compliance ticket folders from tasks
  const complianceFolders = tasks.map((task, index) => ({
    id: `compliance-${task.id || index}`,
    name: `${task.name} - ${task.bucket}`,
    type: "compliance",
    files: 0,
    dueDate: task.dueDate,
    subfolders: ["Supporting Documents", "Filed Returns", "Correspondence"]
  }));

  const misFolders = generateMISFolders();
  const allFolders = [...folders, ...complianceFolders, ...misFolders];

  const filteredFolders = allFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        type: "custom",
        files: 0,
        isPinned: false,
        hasAlerts: false
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName("");
      setIsCreateDialogOpen(false);
      toast({
        title: "Folder Created",
        description: `"${newFolder.name}" has been created successfully`,
      });
    }
  };

  // Mock data for version history
  const mockVersions = [
    {
      id: "1",
      version: "3.0",
      uploadedBy: "John Doe",
      uploadedAt: new Date('2024-01-15'),
      size: "2.4 MB",
      changes: "Updated compliance details",
      isCurrent: true
    },
    {
      id: "2",
      version: "2.0",
      uploadedBy: "Jane Smith",
      uploadedAt: new Date('2024-01-10'),
      size: "2.1 MB",
      changes: "Added signatures",
      isCurrent: false
    }
  ];

  // Mock data for permissions
  const mockPermissions = [
    {
      id: "1",
      userEmail: "admin@company.com",
      role: "admin" as const,
      grantedBy: "System",
      grantedAt: new Date('2024-01-01')
    }
  ];

  // Mock data for shareable links
  const mockShareableLinks = [
    {
      id: "1",
      url: "https://vault.app/share/abc123",
      permission: "view" as const,
      expiresAt: new Date('2024-02-15'),
      createdBy: "admin@company.com",
      createdAt: new Date('2024-01-15'),
      accessCount: 5
    }
  ];

  // Mock data for document metadata
  const mockMetadata = {
    formName: "GSTR-3B",
    period: "March 2024",
    filingDate: new Date('2024-04-20'),
    entityName: "ABC Pvt Ltd"
  };

  // Mock data for retention rules
  const mockRetentionRules = [
    {
      id: "1",
      name: "Archive old invoices",
      targetType: "folder" as const,
      targetValue: "Invoices",
      retentionPeriod: 7,
      retentionUnit: "years" as const,
      action: "archive" as const,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      nextExecution: new Date('2025-01-01')
    }
  ];

  const handlePinFolder = (folderId: number) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId ? { ...folder, isPinned: !folder.isPinned } : folder
      )
    );
    toast({
      title: "Folder Updated",
      description: "Folder pin status updated",
    });
  };

  const handleAdvancedSearch = (filters: any) => {
    console.log("Advanced search filters:", filters);
    toast({
      title: "Search Executed",
      description: "Advanced search completed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Document Vault</h2>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                    Create Folder
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search folders and documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAdvancedSearchOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Search
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsRetentionRulesOpen(true)}
        >
          <Archive className="w-4 h-4 mr-2" />
          Retention Rules
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAISearchOpen(true)}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
      </div>

      {/* Folder Grid */}
      <div className="space-y-6">
        {/* Static Folders Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Document Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFolders
              .filter(folder => folder.type === "static" || folder.type === "custom")
              .map((folder) => (
                <div
                  key={folder.id}
                  className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Folder className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">
                            {folder.name}
                          </p>
                          {'isPinned' in folder && folder.isPinned && (
                            <Pin className="w-4 h-4 text-primary" />
                          )}
                          {'hasAlerts' in folder && folder.hasAlerts && (
                            <Bell className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {folder.files} files
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          <Search className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedFolder(folder.name);
                            setIsPermissionsOpen(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePinFolder(folder.id)}
                        >
                          <Pin className="w-4 h-4 mr-2" />
                          {'isPinned' in folder && folder.isPinned ? 'Unpin' : 'Pin'} Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedDocument(folder.name);
                            setIsTaggerOpen(true);
                          }}
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedDocument(folder.name);
                            setIsVersionHistoryOpen(true);
                          }}
                        >
                          <History className="w-4 h-4 mr-2" />
                          Version History
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedDocument(folder.name);
                            setIsESignOpen(true);
                          }}
                        >
                          <FileSignature className="w-4 h-4 mr-2" />
                          E-Signature
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsAuditTrailOpen(true)}>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Audit Trail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsIntegrationsOpen(true)}>
                          <Cloud className="w-4 h-4 mr-2" />
                          External Sync
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* MIS Folders Section */}
        {misFolders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">MIS Reports Archive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFolders
                .filter(folder => folder.type === "mis")
                .map((folder) => (
                  <div
                    key={folder.id}
                    className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Folder className="w-6 h-6 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {folder.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {folder.files} reports
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {'subfolders' in folder && folder.subfolders?.slice(0, 4).map((subfolder, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground text-center"
                        >
                          {subfolder}
                        </div>
                      ))}
                    </div>
                    {'subfolders' in folder && folder.subfolders && folder.subfolders.length > 4 && (
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        +{folder.subfolders.length - 4} more...
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Compliance Folders Section */}
        {complianceFolders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Compliance Tickets</h3>
            <div className="space-y-3">
              {filteredFolders
                .filter(folder => folder.type === "compliance")
                .map((folder) => (
                  <div
                    key={folder.id}
                    className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Folder className="w-6 h-6 text-status-warning" />
                        <div>
                          <p className="font-medium text-foreground">
                            {folder.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due: {'dueDate' in folder && folder.dueDate ? new Date(folder.dueDate).toLocaleDateString() : 'Not set'}
                          </p>
                        </div>
                      </div>
                       <div className="flex space-x-2">
                         {'subfolders' in folder && folder.subfolders?.map((subfolder, index) => (
                           <div
                             key={index}
                             className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                           >
                             {subfolder}
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {filteredFolders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No folders found</p>
            <p>Try adjusting your search or create a new folder</p>
          </div>
        )}
      </div>

      {/* Enhanced Dialog Components */}
      <DocumentVersionHistory
        documentName={selectedDocument || ""}
        versions={mockVersions}
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />

      <FolderPermissions
        folderName={selectedFolder || ""}
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        permissions={mockPermissions}
        shareableLinks={mockShareableLinks}
      />

      <DocumentTagger
        documentName={selectedDocument || ""}
        isOpen={isTaggerOpen}
        onClose={() => setIsTaggerOpen(false)}
        existingTags={[]}
        metadata={mockMetadata}
      />

      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
        availableTags={["GST", "Compliance", "Invoice", "March 2024"]}
        availableUsers={["admin@company.com", "user@company.com"]}
      />

      <RetentionRules
        isOpen={isRetentionRulesOpen}
        onClose={() => setIsRetentionRulesOpen(false)}
        rules={mockRetentionRules}
        folders={folders.map(f => f.name)}
        tags={["GST", "Compliance", "Invoice"]}
      />

      <AuditTrail
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
        auditEntries={[
          {
            id: "1",
            action: "upload",
            fileName: "GSTR-3B_March_2024.pdf",
            folderPath: "/GST/FY2024-25",
            userEmail: "admin@company.com",
            userName: "Admin User",
            timestamp: new Date(Date.now() - 3600000),
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0...",
            fileSize: "2.4 MB"
          }
        ]}
      />

      <ExternalIntegrations
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />

      <ESignatureManager
        isOpen={isESignOpen}
        onClose={() => setIsESignOpen(false)}
        selectedDocument={selectedDocument || undefined}
      />

      <AISearchAssistant
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
      />
    </div>
  );
};

export default VaultView;