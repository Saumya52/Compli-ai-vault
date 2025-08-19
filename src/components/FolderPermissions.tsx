import { useState } from "react";
import { Shield, Users, Clock, Link, Copy, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface Permission {
  id: string;
  userEmail: string;
  role: 'view' | 'edit' | 'admin';
  grantedBy: string;
  grantedAt: Date;
}

interface ShareableLink {
  id: string;
  url: string;
  permission: 'view' | 'download';
  expiresAt: Date;
  createdBy: string;
  createdAt: Date;
  accessCount: number;
}

interface FolderPermissionsProps {
  folderName: string;
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  shareableLinks: ShareableLink[];
}

export const FolderPermissions = ({ 
  folderName, 
  isOpen, 
  onClose, 
  permissions, 
  shareableLinks 
}: FolderPermissionsProps) => {
  const { toast } = useToast();
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<'view' | 'edit' | 'admin'>('view');
  const [linkPermission, setLinkPermission] = useState<'view' | 'download'>('view');
  const [linkExpiry, setLinkExpiry] = useState("7"); // days

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    // TODO: Implement add user permission
    console.log('Adding user permission:', { email: newUserEmail, role: newUserRole });
    setNewUserEmail("");
    setNewUserRole('view');
    toast({
      title: "User Added",
      description: `${newUserEmail} has been granted ${newUserRole} access`,
    });
  };

  const handleRemoveUser = (permissionId: string) => {
    // TODO: Implement remove user permission
    console.log('Removing user permission:', permissionId);
    toast({
      title: "Access Revoked",
      description: "User access has been removed",
    });
  };

  const handleCreateShareableLink = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(linkExpiry));
    
    // TODO: Implement create shareable link
    const newLink = `https://vault.app/share/${Math.random().toString(36).substring(7)}`;
    console.log('Creating shareable link:', { permission: linkPermission, expiresAt: expiryDate });
    
    navigator.clipboard.writeText(newLink);
    toast({
      title: "Link Created",
      description: "Shareable link copied to clipboard",
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleRevokeLink = (linkId: string) => {
    // TODO: Implement revoke shareable link
    console.log('Revoking shareable link:', linkId);
    toast({
      title: "Link Revoked",
      description: "Shareable link has been deactivated",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'edit': return 'default';
      case 'view': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissions: {folderName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add User Permission */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Permissions
            </h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={newUserRole} onValueChange={(value: 'view' | 'edit' | 'admin') => setNewUserRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddUser} disabled={!newUserEmail.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            {/* Current Permissions */}
            <ScrollArea className="max-h-48">
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{permission.userEmail}</div>
                        <div className="text-sm text-muted-foreground">
                          Granted by {permission.grantedBy} • {permission.grantedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={getRoleColor(permission.role)}>
                        {permission.role.charAt(0).toUpperCase() + permission.role.slice(1)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(permission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Shareable Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link className="w-4 h-4" />
              Shareable Links
            </h3>
            
            <div className="flex gap-2">
              <Select value={linkPermission} onValueChange={(value: 'view' | 'download') => setLinkPermission(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                </SelectContent>
              </Select>
              <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateShareableLink}>
                <Plus className="w-4 h-4 mr-2" />
                Create Link
              </Button>
            </div>
            
            {/* Current Links */}
            <ScrollArea className="max-h-48">
              <div className="space-y-2">
                {shareableLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={link.permission === 'download' ? 'default' : 'secondary'}>
                            {link.permission.charAt(0).toUpperCase() + link.permission.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Expires {link.expiresAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Created by {link.createdBy} • {link.accessCount} accesses
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};