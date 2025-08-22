import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  History,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  FileCheck,
  FileX,
  Plus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { uploadTaskDocument } from "@/utils/api";

export interface TaskDocumentVersion {
  id: string;
  fileName: string;
  version: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  size: string;
  status: "pending" | "validated" | "failed" | "approved";
  comments?: string;
  validationIssues?: string[];
}

export interface TaskDocument {
  id: string;
  name: string;
  category: string;
  isRequired: boolean;
  versions: TaskDocumentVersion[];
  currentVersion?: TaskDocumentVersion;
}

interface TaskDocumentsProps {
  taskId: string;
  onDocumentUpload?: (taskId: string, file: File) => void;
}

export const TaskDocuments = ({ taskId, onDocumentUpload }: TaskDocumentsProps) => {
  const { toast } = useToast();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TaskDocument | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<TaskDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // Load documents from API
  const loadDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      // TODO: Implement getTaskDocuments API call
      // const result = await getTaskDocuments(taskId);
      // if (result.success && result.data) {
      //   setDocuments(result.data);
      // }
      
      // For now, keep empty array - no mock data
      setDocuments([]);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  React.useEffect(() => {
    loadDocuments();
  }, [taskId]);
  // Document upload to API
  const handleFileUploadToAPI = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadTaskDocument(taskId, file, "supporting_document");
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded successfully`,
        });
        
        // Refresh documents list from API
        await loadDocuments();
        setTimeout(() => {
          setIsUploading(false);
          setShowUploadDialog(false);
          setUploadProgress(0);
        }, 1000);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive"
      });
    }

    // Reset file input
    const fileInput = event.target;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // If parent component provides upload handler, use it
    if (onDocumentUpload) {
      onDocumentUpload(taskId, file);
      setShowUploadDialog(false);
      return;
    }

    // Otherwise use API upload
    handleFileUploadToAPI(event);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": 
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated": 
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <FileX className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleDownload = (document: TaskDocumentVersion) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.fileName}`,
    });
  };

  const handleView = (document: TaskDocumentVersion) => {
    toast({
      title: "Opening Document",
      description: `Opening ${document.fileName} in viewer`,
    });
  };

  const handleShowHistory = (document: TaskDocument) => {
    setSelectedDocument(document);
    setShowHistoryDialog(true);
  };

  const getPendingValidationCount = () => {
    return documents.reduce((count, doc) => {
      if (doc.currentVersion?.status === "pending") return count + 1;
      return count;
    }, 0);
  };

  const getFailedValidationCount = () => {
    return documents.reduce((count, doc) => {
      if (doc.currentVersion?.status === "failed") return count + 1;
      return count;
    }, 0);
  };

  const getMissingDocumentsCount = () => {
    return documents.filter(doc => doc.isRequired && !doc.currentVersion).length;
  };

  return (
    <div className="space-y-4">
      {/* Document Status Summary */}
      {documents.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">{getPendingValidationCount()}</div>
                <div className="text-xs text-muted-foreground">Pending Validation</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-sm font-medium">{getFailedValidationCount()}</div>
                <div className="text-xs text-muted-foreground">Failed Validation</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-sm font-medium">{getMissingDocumentsCount()}</div>
                <div className="text-xs text-muted-foreground">Missing Documents</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {documents.length > 0 && <Separator />}

      {/* Documents List */}
      {isLoadingDocuments ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((document) => (
            <Card key={document.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{document.name}</h4>
                    {document.isRequired && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">{document.category}</Badge>
                  </div>
                  
                  {document.currentVersion ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(document.currentVersion.status)}
                        <span className="font-medium">{document.currentVersion.fileName}</span>
                        <Badge className={getStatusColor(document.currentVersion.status)} variant="secondary">
                          {document.currentVersion.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {document.currentVersion.uploadedByName || document.currentVersion.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(document.currentVersion.uploadedAt, "MMM dd, yyyy HH:mm")}
                        </span>
                        <span>v{document.currentVersion.version}</span>
                        <span>{document.currentVersion.size}</span>
                      </div>
                      
                      {document.currentVersion.validationIssues && (
                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-2">
                          <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                            Validation Issues:
                          </div>
                          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                            {document.currentVersion.validationIssues.map((issue, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-red-500">•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {document.currentVersion.comments && (
                        <div className="text-xs text-muted-foreground italic">
                          "{document.currentVersion.comments}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No document uploaded yet
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {document.currentVersion && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(document.currentVersion!)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(document.currentVersion!)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  {document.versions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShowHistory(document)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No documents uploaded yet</p>
          <p className="text-xs">Upload documents to track validation status</p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowUploadDialog(true)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Upload New Document
      </Button>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isUploading ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Uploading document...</div>
                <Progress value={uploadProgress} />
                <div className="text-xs text-muted-foreground text-center">
                  {uploadProgress}% complete
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Drop files here or click to browse
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Supports PDF, DOC, DOCX, XLS, XLSX files up to 25MB
                    </div>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  💡 Documents will be automatically validated using AI for compliance requirements
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Document History - {selectedDocument?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {selectedDocument?.versions.map((version) => (
                <Card key={version.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(version.status)}
                        <span className="font-medium">{version.fileName}</span>
                        <Badge className={getStatusColor(version.status)} variant="secondary">
                          {version.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>v{version.version}</span>
                        <span>{version.uploadedByName || version.uploadedBy}</span>
                        <span>{format(version.uploadedAt, "MMM dd, yyyy HH:mm")}</span>
                        <span>{version.size}</span>
                      </div>
                      
                      {version.comments && (
                        <div className="text-xs text-muted-foreground italic">
                          "{version.comments}"
                        </div>
                      )}
                      
                      {version.validationIssues && (
                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-2">
                          <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
                            Issues:
                          </div>
                          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                            {version.validationIssues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(version)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(version)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};