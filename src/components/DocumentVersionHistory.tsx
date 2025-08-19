import { useState } from "react";
import { Clock, Download, Eye, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentVersion {
  id: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: string;
  changes: string;
  isCurrent: boolean;
}

interface DocumentVersionHistoryProps {
  documentName: string;
  versions: DocumentVersion[];
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentVersionHistory = ({ 
  documentName, 
  versions, 
  isOpen, 
  onClose 
}: DocumentVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleDownloadVersion = (versionId: string) => {
    // TODO: Implement version download
    console.log('Downloading version:', versionId);
  };

  const handlePreviewVersion = (versionId: string) => {
    // TODO: Implement version preview
    console.log('Previewing version:', versionId);
  };

  const handleRestoreVersion = (versionId: string) => {
    // TODO: Implement version restore
    console.log('Restoring version:', versionId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Version History: {documentName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border ${
                  version.isCurrent 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card'
                } hover:bg-accent/50 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Version {version.version}</span>
                        {version.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {version.uploadedBy} • {version.uploadedAt.toLocaleDateString()} • {version.size}
                      </div>
                      {version.changes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Changes: {version.changes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlePreviewVersion(version.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadVersion(version.id)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      {!version.isCurrent && (
                        <DropdownMenuItem onClick={() => handleRestoreVersion(version.id)}>
                          <Clock className="w-4 h-4 mr-2" />
                          Restore This Version
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};