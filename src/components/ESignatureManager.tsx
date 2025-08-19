import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Mail,
  Calendar,
  Download,
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
  status: "pending" | "sent" | "viewed" | "signed" | "declined";
  signedAt?: Date;
  ipAddress?: string;
}

interface ESignDocument {
  id: string;
  fileName: string;
  status: "draft" | "sent" | "in_progress" | "completed" | "declined" | "expired";
  createdAt: Date;
  updatedAt: Date;
  signers: Signer[];
  provider: "zoho" | "docusign";
  expiresAt?: Date;
  message?: string;
  completionRate: number;
}

interface ESignatureManagerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocument?: string;
}

export const ESignatureManager = ({ isOpen, onClose, selectedDocument }: ESignatureManagerProps) => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = React.useState<"documents" | "create">("documents");
  const [newDocument, setNewDocument] = React.useState<{
    fileName: string;
    message: string;
    provider: "zoho" | "docusign";
    expiryDays: number;
  }>({
    fileName: selectedDocument || "",
    message: "",
    provider: "zoho",
    expiryDays: 30
  });
  const [signers, setSigners] = React.useState<Omit<Signer, "id" | "status">[]>([
    { name: "", email: "", role: "Signer", order: 1 }
  ]);

  // Mock data
  const [documents] = React.useState<ESignDocument[]>([
    {
      id: "1",
      fileName: "Service Agreement - ABC Corp.pdf",
      status: "in_progress",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      provider: "docusign",
      expiresAt: new Date(Date.now() + 2592000000), // 30 days from now
      message: "Please review and sign the service agreement",
      completionRate: 66,
      signers: [
        {
          id: "s1",
          name: "John Doe",
          email: "john@abccorp.com",
          role: "Client",
          order: 1,
          status: "signed",
          signedAt: new Date(Date.now() - 3600000),
          ipAddress: "192.168.1.100"
        },
        {
          id: "s2", 
          name: "Jane Smith",
          email: "jane@company.com",
          role: "Service Provider",
          order: 2,
          status: "sent"
        },
        {
          id: "s3",
          name: "Bob Wilson",
          email: "bob@abccorp.com", 
          role: "Witness",
          order: 3,
          status: "pending"
        }
      ]
    },
    {
      id: "2",
      fileName: "NDA - Tech Solutions.pdf",
      status: "completed",
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
      provider: "zoho",
      completionRate: 100,
      signers: [
        {
          id: "s4",
          name: "Alice Brown",
          email: "alice@techsolutions.com",
          role: "Client",
          order: 1,
          status: "signed",
          signedAt: new Date(Date.now() - 86400000)
        },
        {
          id: "s5",
          name: "Charlie Davis",
          email: "charlie@company.com",
          role: "Service Provider", 
          order: 2,
          status: "signed",
          signedAt: new Date(Date.now() - 86400000)
        }
      ]
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>;
      case "sent":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Send className="w-3 h-3 mr-1" />
          Sent
        </Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Declined
        </Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getSignerStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Signed
        </Badge>;
      case "viewed":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Viewed
        </Badge>;
      case "sent":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Sent
        </Badge>;
      case "declined":
        return <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Declined
        </Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const addSigner = () => {
    setSigners(prev => [...prev, {
      name: "",
      email: "",
      role: "Signer",
      order: prev.length + 1
    }]);
  };

  const removeSigner = (index: number) => {
    setSigners(prev => prev.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: string, value: string) => {
    setSigners(prev => prev.map((signer, i) => 
      i === index ? { ...signer, [field]: value } : signer
    ));
  };

  const handleSendForSignature = () => {
    toast({
      title: "Document Sent",
      description: "The document has been sent for signature",
    });
    setActiveTab("documents");
    // Reset form
    setNewDocument({ fileName: "", message: "", provider: "zoho", expiryDays: 30 });
    setSigners([{ name: "", email: "", role: "Signer", order: 1 }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>E-Signature Manager</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b">
          <Button 
            variant={activeTab === "documents" ? "default" : "ghost"}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </Button>
          <Button 
            variant={activeTab === "create" ? "default" : "ghost"}
            onClick={() => setActiveTab("create")}
          >
            Create Request
          </Button>
        </div>

        <ScrollArea className="h-[60vh]">
          {activeTab === "documents" ? (
            /* Documents List */
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{doc.fileName}</CardTitle>
                          <CardDescription>
                            Created {format(doc.createdAt, "MMM dd, yyyy")} • 
                            Provider: {doc.provider === "zoho" ? "Zoho Sign" : "DocuSign"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    {doc.status === "in_progress" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion Progress</span>
                          <span>{doc.completionRate}%</span>
                        </div>
                        <Progress value={doc.completionRate} />
                      </div>
                    )}

                    {/* Signers */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Signers ({doc.signers.length})</h4>
                      <div className="space-y-2">
                        {doc.signers.map((signer) => (
                          <div key={signer.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {signer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{signer.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {signer.role}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {signer.email}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {getSignerStatusBadge(signer.status)}
                              {signer.signedAt && (
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(signer.signedAt, "MMM dd, HH:mm")}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    {doc.message && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        <strong>Message:</strong> {doc.message}
                      </div>
                    )}

                    {/* Expiry */}
                    {doc.expiresAt && (
                      <div className="text-xs text-muted-foreground">
                        Expires: {format(doc.expiresAt, "MMM dd, yyyy")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Create Request Form */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileName">Document</Label>
                  <Input
                    id="fileName"
                    value={newDocument.fileName}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="Select or enter document name"
                  />
                </div>
                <div>
                  <Label htmlFor="provider">E-Signature Provider</Label>
                  <Select value={newDocument.provider} onValueChange={(value: "zoho" | "docusign") => 
                    setNewDocument(prev => ({ ...prev, provider: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoho">Zoho Sign</SelectItem>
                      <SelectItem value="docusign">DocuSign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message to Signers</Label>
                <Textarea
                  id="message"
                  value={newDocument.message}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please review and sign this document..."
                  rows={3}
                />
              </div>

              <div className="w-32">
                <Label htmlFor="expiry">Expires in (days)</Label>
                <Input
                  id="expiry"
                  type="number"
                  value={newDocument.expiryDays}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDays: parseInt(e.target.value) }))}
                  min={1}
                  max={365}
                />
              </div>

              <Separator />

              {/* Signers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Signers</h3>
                  <Button onClick={addSigner} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Signer
                  </Button>
                </div>

                <div className="space-y-4">
                  {signers.map((signer, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={signer.name}
                            onChange={(e) => updateSigner(index, "name", e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={signer.email}
                            onChange={(e) => updateSigner(index, "email", e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select value={signer.role} onValueChange={(value) => updateSigner(index, "role", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Signer">Signer</SelectItem>
                              <SelectItem value="Approver">Approver</SelectItem>
                              <SelectItem value="Witness">Witness</SelectItem>
                              <SelectItem value="Client">Client</SelectItem>
                              <SelectItem value="Service Provider">Service Provider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          {signers.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeSigner(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {activeTab === "documents" ? 
              `${documents.length} signature requests` : 
              "Configure signers and send for signature"
            }
          </div>
          <div className="flex gap-2">
            {activeTab === "create" && (
              <Button 
                onClick={handleSendForSignature}
                disabled={!newDocument.fileName || signers.some(s => !s.name || !s.email)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send for Signature
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};