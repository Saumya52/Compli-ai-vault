import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Building, MapPin, FileText, Users } from "lucide-react";

interface FilterOptions {
  entity: string;
  state: string;
  complianceType: string;
  assignedUser: string;
}

interface QuickFilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

export const QuickFilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  className 
}: QuickFilterPanelProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const entities = [
    "All Entities",
    "ABC Pvt Ltd",
    "XYZ Corp",
    "Tech Solutions Inc",
    "Green Energy Ltd",
    "Global Trade Co"
  ];

  const states = [
    "All States",
    "Maharashtra",
    "Karnataka",
    "Delhi",
    "Tamil Nadu",
    "Gujarat",
    "West Bengal"
  ];

  const complianceTypes = [
    "All Types",
    "GST",
    "Income Tax",
    "PF",
    "ESI",
    "Labor Law",
    "Corporate",
    "Environmental"
  ];

  const assignedUsers = [
    "All Users",
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Brown",
    "Unassigned"
  ];

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters.entity !== "All Entities" || 
           filters.state !== "All States" || 
           filters.complianceType !== "All Types" || 
           filters.assignedUser !== "All Users";
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.entity !== "All Entities") count++;
    if (filters.state !== "All States") count++;
    if (filters.complianceType !== "All Types") count++;
    if (filters.assignedUser !== "All Users") count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Filter Toggle Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-medium">Quick Filters</span>
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

          {/* Active Filters Preview (when collapsed) */}
          {!isExpanded && hasActiveFilters() && (
            <div className="flex flex-wrap gap-2">
              {filters.entity !== "All Entities" && (
                <Badge variant="outline" className="text-xs">
                  <Building className="w-3 h-3 mr-1" />
                  {filters.entity}
                </Badge>
              )}
              {filters.state !== "All States" && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {filters.state}
                </Badge>
              )}
              {filters.complianceType !== "All Types" && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {filters.complianceType}
                </Badge>
              )}
              {filters.assignedUser !== "All Users" && (
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {filters.assignedUser}
                </Badge>
              )}
            </div>
          )}

          {/* Filter Controls (when expanded) */}
          {isExpanded && (
            <>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Entity Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    Entity
                  </label>
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

                {/* State Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    State
                  </label>
                  <Select 
                    value={filters.state} 
                    onValueChange={(value) => updateFilter("state", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state} className="text-xs">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Compliance Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Type
                  </label>
                  <Select 
                    value={filters.complianceType} 
                    onValueChange={(value) => updateFilter("complianceType", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assigned User Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Assignee
                  </label>
                  <Select 
                    value={filters.assignedUser} 
                    onValueChange={(value) => updateFilter("assignedUser", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedUsers.map((user) => (
                        <SelectItem key={user} value={user} className="text-xs">
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};