import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompare, FileText, Plus, Minus, RotateCcw, Download } from "lucide-react";
import { format } from "date-fns";

interface DocumentVersion {
  id: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: string;
  changes: string;
  isCurrent: boolean;
  contentPreview: string;
}

interface DocumentVersionComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  versions: DocumentVersion[];
}

const mockVersions: DocumentVersion[] = [
  {
    id: "1",
    version: "3.0",
    uploadedBy: "John Doe",
    uploadedAt: new Date('2024-01-20'),
    size: "2.4 MB",
    changes: "Updated compliance details and added new signatures",
    isCurrent: true,
    contentPreview: `Section 1: Company Information
- Company Name: ABC Pvt Ltd
- Registration Number: U12345DL2020PTC123456
- Registered Address: 123 Business Park, New Delhi - 110001
- Contact Details: +91-11-12345678

Section 2: Compliance Status
- GST Registration: Active (GSTIN: 07AAACA1234A1Z5)
- PAN: AAACA1234A
- TAN: DELA12345A
- ESI Registration: 12345678900001234

Section 3: Board Resolution Details
RESOLVED THAT the company hereby authorizes Mr. John Doe (DIN: 12345678) 
to act as the authorized signatory for all compliance related matters 
including but not limited to:
- Filing of statutory returns
- Correspondence with regulatory authorities
- Digital signature applications`
  },
  {
    id: "2",
    version: "2.0",
    uploadedBy: "Jane Smith",
    uploadedAt: new Date('2024-01-15'),
    size: "2.1 MB",
    changes: "Added new board member signatures",
    isCurrent: false,
    contentPreview: `Section 1: Company Information
- Company Name: ABC Pvt Ltd
- Registration Number: U12345DL2020PTC123456
- Registered Address: 123 Business Park, New Delhi - 110001
- Contact Details: +91-11-12345678

Section 2: Compliance Status
- GST Registration: Active (GSTIN: 07AAACA1234A1Z5)
- PAN: AAACA1234A
- TAN: DELA12345A

Section 3: Board Resolution Details
RESOLVED THAT the company hereby authorizes Mr. John Doe (DIN: 12345678) 
to act as the authorized signatory for all compliance related matters 
including but not limited to:
- Filing of statutory returns
- Correspondence with regulatory authorities`
  }
];

interface Change {
  type: "added" | "removed" | "modified";
  line: number;
  content: string;
  oldContent?: string;
}

const detectChanges = (oldContent: string, newContent: string): Change[] => {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const changes: Change[] = [];

  // Simple diff algorithm - in production, use a proper diff library
  const maxLines = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';
    
    if (!oldLine && newLine) {
      changes.push({
        type: "added",
        line: i + 1,
        content: newLine
      });
    } else if (oldLine && !newLine) {
      changes.push({
        type: "removed", 
        line: i + 1,
        content: oldLine
      });
    } else if (oldLine !== newLine) {
      changes.push({
        type: "modified",
        line: i + 1,
        content: newLine,
        oldContent: oldLine
      });
    }
  }
  
  return changes;
};

export const DocumentVersionComparison: React.FC<DocumentVersionComparisonProps> = ({
  isOpen,
  onClose,
  documentName,
  versions = mockVersions
}) => {
  const [selectedVersion1, setSelectedVersion1] = useState<string>(versions[1]?.id || "");
  const [selectedVersion2, setSelectedVersion2] = useState<string>(versions[0]?.id || "");

  const version1 = versions.find(v => v.id === selectedVersion1);
  const version2 = versions.find(v => v.id === selectedVersion2);

  const changes = version1 && version2 ? detectChanges(version1.contentPreview, version2.contentPreview) : [];

  const addedChanges = changes.filter(c => c.type === "added");
  const removedChanges = changes.filter(c => c.type === "removed");
  const modifiedChanges = changes.filter(c => c.type === "modified");

  const renderDiffView = () => {
    if (!version1 || !version2) return null;

    const oldLines = version1.contentPreview.split('\n');
    const newLines = version2.contentPreview.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Old Version */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">
            Version {version1.version} - {format(version1.uploadedAt, 'MMM dd, yyyy')}
          </h4>
          <div className="border rounded-lg p-3 bg-red-50 max-h-96 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {oldLines.map((line, index) => {
                const change = changes.find(c => c.line === index + 1);
                return (
                  <div 
                    key={index}
                    className={`${
                      change?.type === "removed" ? "bg-red-200 text-red-800" :
                      change?.type === "modified" ? "bg-yellow-200 text-yellow-800" :
                      ""
                    } px-1`}
                  >
                    {index + 1}. {line}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        {/* New Version */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">
            Version {version2.version} - {format(version2.uploadedAt, 'MMM dd, yyyy')}
          </h4>
          <div className="border rounded-lg p-3 bg-green-50 max-h-96 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {newLines.map((line, index) => {
                const change = changes.find(c => c.line === index + 1);
                return (
                  <div 
                    key={index}
                    className={`${
                      change?.type === "added" ? "bg-green-200 text-green-800" :
                      change?.type === "modified" ? "bg-yellow-200 text-yellow-800" :
                      ""
                    } px-1`}
                  >
                    {index + 1}. {line}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            Document Version Comparison - {documentName}
          </DialogTitle>
        </DialogHeader>

        {/* Version Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Compare From (Older Version)</label>
            <Select value={selectedVersion1} onValueChange={setSelectedVersion1}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    Version {version.version} - {format(version.uploadedAt, 'MMM dd, yyyy')} 
                    {version.isCurrent && " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Compare To (Newer Version)</label>
            <Select value={selectedVersion2} onValueChange={setSelectedVersion2}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    Version {version.version} - {format(version.uploadedAt, 'MMM dd, yyyy')}
                    {version.isCurrent && " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparison Summary */}
        {version1 && version2 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Added Lines</span>
                  <Badge variant="default" className="bg-green-600">
                    {addedChanges.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Removed Lines</span>
                  <Badge variant="destructive">
                    {removedChanges.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Modified Lines</span>
                  <Badge variant="secondary" className="bg-yellow-600 text-white">
                    {modifiedChanges.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comparison Content */}
        <Tabs defaultValue="diff" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diff">Side-by-Side Diff</TabsTrigger>
            <TabsTrigger value="changes">Change Summary</TabsTrigger>
            <TabsTrigger value="metadata">Version Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="diff" className="space-y-4">
            {renderDiffView()}
          </TabsContent>

          <TabsContent value="changes" className="space-y-4">
            <div className="space-y-4">
              {/* Added Changes */}
              {addedChanges.length > 0 && (
                <Card className="border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-600" />
                      Added Content ({addedChanges.length} lines)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {addedChanges.map((change, index) => (
                      <div key={index} className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                        <div className="text-xs text-green-600 mb-1">Line {change.line}</div>
                        <div className="text-sm font-mono">{change.content}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Removed Changes */}
              {removedChanges.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Minus className="w-4 h-4 text-red-600" />
                      Removed Content ({removedChanges.length} lines)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {removedChanges.map((change, index) => (
                      <div key={index} className="bg-red-50 p-2 rounded border-l-4 border-red-400">
                        <div className="text-xs text-red-600 mb-1">Line {change.line}</div>
                        <div className="text-sm font-mono">{change.content}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Modified Changes */}
              {modifiedChanges.length > 0 && (
                <Card className="border-yellow-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-yellow-600" />
                      Modified Content ({modifiedChanges.length} lines)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {modifiedChanges.map((change, index) => (
                      <div key={index} className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                        <div className="text-xs text-yellow-600 mb-1">Line {change.line}</div>
                        <div className="space-y-1">
                          <div className="text-xs text-red-600">- {change.oldContent}</div>
                          <div className="text-xs text-green-600">+ {change.content}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {changes.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg text-muted-foreground">No differences found</p>
                    <p className="text-sm text-muted-foreground">
                      The selected versions have identical content
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {version1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Version {version1.version}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Uploaded by:</strong> {version1.uploadedBy}</div>
                    <div><strong>Upload date:</strong> {format(version1.uploadedAt, 'MMM dd, yyyy HH:mm')}</div>
                    <div><strong>File size:</strong> {version1.size}</div>
                    <div><strong>Changes:</strong> {version1.changes}</div>
                    {version1.isCurrent && <Badge>Current Version</Badge>}
                  </CardContent>
                </Card>
              )}

              {version2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Version {version2.version}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Uploaded by:</strong> {version2.uploadedBy}</div>
                    <div><strong>Upload date:</strong> {format(version2.uploadedAt, 'MMM dd, yyyy HH:mm')}</div>
                    <div><strong>File size:</strong> {version2.size}</div>
                    <div><strong>Changes:</strong> {version2.changes}</div>
                    {version2.isCurrent && <Badge>Current Version</Badge>}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Diff Report
            </Button>
            <Button>
              Create Template from Version
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};