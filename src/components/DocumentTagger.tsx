import { useState } from "react";
import { Tag, Plus, X, Sparkles, Calendar, FileType, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface DocumentTag {
  id: string;
  name: string;
  color: string;
  category: 'custom' | 'auto' | 'metadata';
}

interface DocumentMetadata {
  formName?: string;
  period?: string;
  filingDate?: Date;
  entityName?: string;
  extractedText?: string[];
}

interface DocumentTaggerProps {
  documentName: string;
  isOpen: boolean;
  onClose: () => void;
  existingTags: DocumentTag[];
  metadata: DocumentMetadata;
}

export const DocumentTagger = ({ 
  documentName, 
  isOpen, 
  onClose, 
  existingTags, 
  metadata 
}: DocumentTaggerProps) => {
  const { toast } = useToast();
  const [newTagName, setNewTagName] = useState("");
  const [tags, setTags] = useState<DocumentTag[]>(existingTags);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: DocumentTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: getRandomColor(),
      category: 'custom'
    };
    
    setTags(prev => [...prev, newTag]);
    setNewTagName("");
    toast({
      title: "Tag Added",
      description: `Added tag: ${newTag.name}`,
    });
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const handleExtractMetadata = async () => {
    setIsExtracting(true);
    
    try {
      // TODO: Implement AI metadata extraction
      // This would call an AI service to extract metadata from the document
      
      // Simulated extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const extractedTags: DocumentTag[] = [
        { id: 'meta-1', name: 'GSTR-3B', color: '#3b82f6', category: 'metadata' },
        { id: 'meta-2', name: 'March 2024', color: '#10b981', category: 'metadata' },
        { id: 'meta-3', name: 'Monthly Return', color: '#f59e0b', category: 'metadata' },
      ];
      
      setTags(prev => [...prev, ...extractedTags]);
      
      toast({
        title: "Metadata Extracted",
        description: "AI has extracted relevant tags and metadata",
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Could not extract metadata from document",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metadata': return <Sparkles className="w-3 h-3" />;
      case 'auto': return <Tag className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags & Metadata: {documentName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Manual Tag Addition */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1"
              />
              <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button 
                onClick={handleExtractMetadata} 
                disabled={isExtracting}
                variant="outline"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isExtracting ? 'Extracting...' : 'AI Extract'}
              </Button>
            </div>
          </div>

          {/* Current Tags */}
          <div className="space-y-3">
            <Label>Current Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                  style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                >
                  {getCategoryIcon(tag.category)}
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto w-auto p-0 ml-1"
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Extracted Metadata */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Extracted Metadata
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              {metadata.formName && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileType className="w-3 h-3" />
                    Form Name
                  </Label>
                  <div className="text-sm font-medium">{metadata.formName}</div>
                </div>
              )}
              
              {metadata.period && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Period
                  </Label>
                  <div className="text-sm font-medium">{metadata.period}</div>
                </div>
              )}
              
              {metadata.filingDate && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Filing Date
                  </Label>
                  <div className="text-sm font-medium">{metadata.filingDate.toLocaleDateString()}</div>
                </div>
              )}
              
              {metadata.entityName && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Entity
                  </Label>
                  <div className="text-sm font-medium">{metadata.entityName}</div>
                </div>
              )}
            </div>
            
            {metadata.extractedText && metadata.extractedText.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Key Terms Found</Label>
                <div className="flex flex-wrap gap-1">
                  {metadata.extractedText.slice(0, 10).map((term, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};