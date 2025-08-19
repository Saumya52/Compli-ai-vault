import { useState } from "react";
import { Search, Filter, Calendar, Tag, FileType, User, ScanText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// DatePicker component will be handled with regular input date
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface SearchFilters {
  query: string;
  fileTypes: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  tags: string[];
  uploadedBy: string;
  ocrEnabled: boolean;
  booleanOperator: 'AND' | 'OR';
  exactMatch: boolean;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  availableTags: string[];
  availableUsers: string[];
}

export const AdvancedSearch = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  availableTags, 
  availableUsers 
}: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    fileTypes: [],
    dateRange: {},
    tags: [],
    uploadedBy: "",
    ocrEnabled: true,
    booleanOperator: 'AND',
    exactMatch: false
  });

  const fileTypes = [
    'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 
    'JPG', 'PNG', 'GIF', 'TXT', 'ZIP', 'RAR'
  ];

  const handleFileTypeToggle = (fileType: string) => {
    setFilters(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(fileType)
        ? prev.fileTypes.filter(type => type !== fileType)
        : [...prev.fileTypes, fileType]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      query: "",
      fileTypes: [],
      dateRange: {},
      tags: [],
      uploadedBy: "",
      ocrEnabled: true,
      booleanOperator: 'AND',
      exactMatch: false
    });
  };

  const buildQueryPreview = () => {
    const parts = [];
    
    if (filters.query) {
      const queryPart = filters.exactMatch ? `"${filters.query}"` : filters.query;
      parts.push(`Text: ${queryPart}`);
    }
    
    if (filters.fileTypes.length > 0) {
      parts.push(`Type: ${filters.fileTypes.join(', ')}`);
    }
    
    if (filters.tags.length > 0) {
      parts.push(`Tags: ${filters.tags.join(', ')}`);
    }
    
    if (filters.uploadedBy) {
      parts.push(`User: ${filters.uploadedBy}`);
    }
    
    if (filters.dateRange.from || filters.dateRange.to) {
      const from = filters.dateRange.from?.toLocaleDateString() || 'Start';
      const to = filters.dateRange.to?.toLocaleDateString() || 'End';
      parts.push(`Date: ${from} - ${to}`);
    }
    
    return parts.length > 0 ? parts.join(` ${filters.booleanOperator} `) : 'No filters applied';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Search & OCR
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label>Search Query</Label>
            <Textarea
              placeholder="Enter search terms, phrases, or full-text content..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="min-h-[80px]"
            />
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exactMatch"
                  checked={filters.exactMatch}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, exactMatch: !!checked }))
                  }
                />
                <Label htmlFor="exactMatch" className="text-sm">Exact phrase match</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ocrEnabled"
                  checked={filters.ocrEnabled}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, ocrEnabled: !!checked }))
                  }
                />
                <Label htmlFor="ocrEnabled" className="text-sm flex items-center gap-1">
                  <ScanText className="w-3 h-3" />
                  Search inside PDF content (OCR)
                </Label>
              </div>
            </div>
          </div>

          {/* Boolean Operator */}
          <div className="space-y-2">
            <Label>Search Logic</Label>
            <Select 
              value={filters.booleanOperator} 
              onValueChange={(value: 'AND' | 'OR') => 
                setFilters(prev => ({ ...prev, booleanOperator: value }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND (all terms must match)</SelectItem>
                <SelectItem value="OR">OR (any term can match)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* File Types */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileType className="w-4 h-4" />
              File Types
            </Label>
            <div className="flex flex-wrap gap-2">
              {fileTypes.map((type) => (
                <Badge
                  key={type}
                  variant={filters.fileTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFileTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Label>
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={filters.dateRange.from?.toISOString().split('T')[0] || ''}
                  onChange={(e) => 
                    setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, from: e.target.value ? new Date(e.target.value) : undefined }
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={filters.dateRange.to?.toISOString().split('T')[0] || ''}
                  onChange={(e) => 
                    setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, to: e.target.value ? new Date(e.target.value) : undefined }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded By */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Uploaded By
            </Label>
            <Select 
              value={filters.uploadedBy} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, uploadedBy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All users</SelectItem>
                {availableUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Query Preview */}
          <div className="space-y-2">
            <Label>Search Preview</Label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {buildQueryPreview()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};