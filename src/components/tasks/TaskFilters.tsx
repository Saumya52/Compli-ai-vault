import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  CalendarIcon, 
  Building, 
  User, 
  FileText, 
  Clock,
  Tag,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface TaskFilters {
  bucket: string;
  frequency: string;
  entity: string;
  status: string;
  assignee: string;
  tags: string[];
  dueDateFrom: Date | null;
  dueDateTo: Date | null;
  search: string;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

export const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  className 
}: TaskFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const buckets = [
    "All Buckets",
    "GST",
    "Income Tax", 
    "TDS",
    "PF",
    "ESI",
    "ROC",
    "Labor Law",
    "Environmental"
  ];

  const frequencies = [
    "All Frequencies",
    "Daily",
    "Weekly", 
    "Monthly",
    "Quarterly",
    "Half-Yearly",
    "Yearly",
    "One-time"
  ];

  const entities = [
    "All Entities",
    "ABC Pvt Ltd",
    "XYZ Corp",
    "Tech Solutions Inc",
    "Green Energy Ltd",
    "Global Trade Co"
  ];

  const statuses = [
    "All Status",
    "Open",
    "In Progress", 
    "Escalated",
    "Completed",
    "Overdue",
    "On Hold"
  ];

  const assignees = [
    "All Assignees",
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Brown",
    "Unassigned"
  ];

  const availableTags = [
    "Urgent",
    "Repeat Filing",
    "Follow-up",
    "High Priority",
    "Client Request",
    "Audit Required",
    "Documentation Pending",
    "Review Needed"
  ];

  const updateFilter = (key: keyof TaskFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter("tags", [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter("tags", filters.tags.filter(t => t !== tag));
  };

  const hasActiveFilters = () => {
    return filters.bucket !== "All Buckets" ||
           filters.frequency !== "All Frequencies" ||
           filters.entity !== "All Entities" ||
           filters.status !== "All Status" ||
           filters.assignee !== "All Assignees" ||
           filters.tags.length > 0 ||
           filters.dueDateFrom !== null ||
           filters.dueDateTo !== null ||
           filters.search.trim() !== "";
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.bucket !== "All Buckets") count++;
    if (filters.frequency !== "All Frequencies") count++;
    if (filters.entity !== "All Entities") count++;
    if (filters.status !== "All Status") count++;
    if (filters.assignee !== "All Assignees") count++;
    if (filters.tags.length > 0) count++;
    if (filters.dueDateFrom || filters.dueDateTo) count++;
    if (filters.search.trim()) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="Search tasks by title, description, or assignee..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pr-10"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => updateFilter("search", "")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filter Toggle Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-medium">Advanced Filters</span>
              {hasActiveFilters() && (
                <Badge variant="secondary" className="text-xs">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters() && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearFilters}
                  className="text-xs h-7"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs h-7"
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>

          {/* Active Filters Preview */}
          {!isExpanded && hasActiveFilters() && (
            <div className="flex flex-wrap gap-2">
              {filters.bucket !== "All Buckets" && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {filters.bucket}
                </Badge>
              )}
              {filters.entity !== "All Entities" && (
                <Badge variant="outline" className="text-xs">
                  <Building className="w-3 h-3 mr-1" />
                  {filters.entity}
                </Badge>
              )}
              {filters.status !== "All Status" && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {filters.status}
                </Badge>
              )}
              {filters.assignee !== "All Assignees" && (
                <Badge variant="outline" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  {filters.assignee}
                </Badge>
              )}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {(filters.dueDateFrom || filters.dueDateTo) && (
                <Badge variant="outline" className="text-xs">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  Date Range
                </Badge>
              )}
            </div>
          )}

          {/* Expanded Filter Controls */}
          {isExpanded && (
            <>
              <Separator />
              
              {/* Main Filters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Bucket Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Bucket
                  </Label>
                  <Select 
                    value={filters.bucket} 
                    onValueChange={(value) => updateFilter("bucket", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {buckets.map((bucket) => (
                        <SelectItem key={bucket} value={bucket} className="text-xs">
                          {bucket}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Frequency Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Frequency
                  </Label>
                  <Select 
                    value={filters.frequency} 
                    onValueChange={(value) => updateFilter("frequency", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq} className="text-xs">
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Entity Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Entity
                  </Label>
                  <Select 
                    value={filters.entity} 
                    onValueChange={(value) => updateFilter("entity", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity} value={entity} className="text-xs">
                          {entity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Status
                  </Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => updateFilter("status", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Assignee
                  </Label>
                  <Select 
                    value={filters.assignee} 
                    onValueChange={(value) => updateFilter("assignee", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee} className="text-xs">
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Due Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-8 text-xs"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {filters.dueDateFrom ? format(filters.dueDateFrom, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dueDateFrom || undefined}
                        onSelect={(date) => updateFilter("dueDateFrom", date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Due Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-8 text-xs"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {filters.dueDateTo ? format(filters.dueDateTo, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dueDateTo || undefined}
                        onSelect={(date) => updateFilter("dueDateTo", date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Tags
                </Label>
                
                {/* Selected Tags */}
                {filters.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Available Tags */}
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !filters.tags.includes(tag))
                    .map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-accent"
                        onClick={() => addTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};