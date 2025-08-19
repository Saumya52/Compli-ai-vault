import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, User, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface WatermarkSettings {
  includeUserName: boolean;
  includeTimestamp: boolean;
  includeCompanyName: boolean;
  includeDocumentId: boolean;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  opacity: number;
  fontSize: number;
  textColor: string;
}

interface DocumentWatermarkingProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentId?: string;
  userName?: string;
}

const defaultSettings: WatermarkSettings = {
  includeUserName: true,
  includeTimestamp: true,
  includeCompanyName: true,
  includeDocumentId: false,
  position: "bottom-right",
  opacity: 50,
  fontSize: 12,
  textColor: "#666666"
};

export const DocumentWatermarking: React.FC<DocumentWatermarkingProps> = ({
  isOpen,
  onClose,
  documentName,
  documentId = "DOC-2024-001",
  userName = "Priya Sharma"
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<WatermarkSettings>(defaultSettings);
  const [companyName, setCompanyName] = useState("ABC Pvt Ltd");
  const [customText, setCustomText] = useState("");

  const generateWatermarkText = () => {
    const parts = [];
    
    if (settings.includeUserName) {
      parts.push(`Downloaded by ${userName}`);
    }
    
    if (settings.includeTimestamp) {
      parts.push(`on ${format(new Date(), 'dd-MMM-yyyy HH:mm')}`);
    }
    
    if (settings.includeCompanyName) {
      parts.push(`• ${companyName}`);
    }
    
    if (settings.includeDocumentId) {
      parts.push(`• ID: ${documentId}`);
    }
    
    if (customText) {
      parts.push(`• ${customText}`);
    }
    
    return parts.join(' ');
  };

  const handleDownload = (format: 'pdf' | 'original') => {
    const watermarkText = generateWatermarkText();
    
    // Simulate watermarking process
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: `${documentName} is being downloaded with watermark: "${watermarkText}"`,
      });
      onClose();
    }, 1000);
  };

  const previewWatermark = generateWatermarkText();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Document Watermarking Settings
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Document</Label>
              <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm truncate">{documentName}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Watermark Content</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="userName"
                    checked={settings.includeUserName}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, includeUserName: checked as boolean }))
                    }
                  />
                  <Label htmlFor="userName" className="text-sm">Include user name</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamp"
                    checked={settings.includeTimestamp}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, includeTimestamp: checked as boolean }))
                    }
                  />
                  <Label htmlFor="timestamp" className="text-sm">Include download timestamp</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="companyName"
                    checked={settings.includeCompanyName}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, includeCompanyName: checked as boolean }))
                    }
                  />
                  <Label htmlFor="companyName" className="text-sm">Include company name</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentId"
                    checked={settings.includeDocumentId}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, includeDocumentId: checked as boolean }))
                    }
                  />
                  <Label htmlFor="documentId" className="text-sm">Include document ID</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="customText" className="text-sm font-medium">Custom Text (Optional)</Label>
              <Input
                id="customText"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Add custom watermark text"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="position" className="text-sm font-medium">Watermark Position</Label>
              <Select
                value={settings.position}
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="opacity" className="text-sm font-medium">Opacity (%)</Label>
                <Input
                  id="opacity"
                  type="number"
                  min="10"
                  max="100"
                  value={settings.opacity}
                  onChange={(e) => setSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="fontSize" className="text-sm font-medium">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  min="8"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Watermark Preview</Label>
            
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-6 relative">
                <div className="text-center text-gray-400 mb-4">
                  <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Document Preview</p>
                  <p className="text-xs">{documentName}</p>
                </div>
                
                {/* Watermark Preview */}
                <div 
                  className={`absolute text-gray-600 transform ${
                    settings.position === "top-left" ? "top-4 left-4" :
                    settings.position === "top-right" ? "top-4 right-4" :
                    settings.position === "bottom-left" ? "bottom-4 left-4" :
                    settings.position === "bottom-right" ? "bottom-4 right-4" :
                    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  }`}
                  style={{ 
                    opacity: settings.opacity / 100,
                    fontSize: `${settings.fontSize}px`,
                    color: settings.textColor,
                    maxWidth: settings.position === "center" ? "80%" : "60%",
                    lineHeight: 1.2
                  }}
                >
                  {previewWatermark}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>User: {userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Download Time: {format(new Date(), 'dd-MMM-yyyy HH:mm')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>Security: Watermarked for traceability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handleDownload('original')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Original
            </Button>
            <Button onClick={() => handleDownload('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Download with Watermark
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};