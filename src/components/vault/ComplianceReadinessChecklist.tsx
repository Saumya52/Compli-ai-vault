import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Upload, AlertTriangle, Calendar } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";

interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  status: "uploaded" | "missing" | "expired";
  dueDate: Date;
  uploadedDate?: Date;
  expiryDate?: Date;
  isRequired: boolean;
  frequency: "monthly" | "quarterly" | "yearly" | "one-time";
  lastVersion?: string;
}

interface ComplianceReadinessChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  complianceType: string;
}

const mockComplianceDocuments: ComplianceDocument[] = [
  {
    id: "1",
    name: "GSTR-1 Filing",
    type: "GST",
    status: "uploaded",
    dueDate: new Date(2024, 1, 11),
    uploadedDate: new Date(2024, 1, 8),
    isRequired: true,
    frequency: "monthly",
    lastVersion: "v2.1"
  },
  {
    id: "2", 
    name: "GSTR-3B Filing",
    type: "GST",
    status: "missing",
    dueDate: new Date(2024, 1, 20),
    isRequired: true,
    frequency: "monthly"
  },
  {
    id: "3",
    name: "TDS Certificate",
    type: "TDS",
    status: "expired",
    dueDate: new Date(2024, 0, 15),
    uploadedDate: new Date(2023, 11, 10),
    expiryDate: new Date(2024, 0, 31),
    isRequired: true,
    frequency: "quarterly"
  },
  {
    id: "4",
    name: "Board Resolution",
    type: "ROC",
    status: "uploaded",
    dueDate: new Date(2024, 2, 30),
    uploadedDate: new Date(2024, 1, 15),
    isRequired: false,
    frequency: "yearly"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "uploaded": return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "missing": return <XCircle className="w-5 h-5 text-red-500" />;
    case "expired": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    default: return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "uploaded": return "bg-green-100 text-green-800 border-green-300";
    case "missing": return "bg-red-100 text-red-800 border-red-300";
    case "expired": return "bg-orange-100 text-orange-800 border-orange-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getDaysUntilDue = (dueDate: Date) => {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const ComplianceReadinessChecklist: React.FC<ComplianceReadinessChecklistProps> = ({
  isOpen,
  onClose,
  entityName,
  complianceType
}) => {
  const [documents] = useState<ComplianceDocument[]>(mockComplianceDocuments);
  
  const totalDocuments = documents.length;
  const uploadedDocuments = documents.filter(doc => doc.status === "uploaded").length;
  const missingDocuments = documents.filter(doc => doc.status === "missing").length;
  const expiredDocuments = documents.filter(doc => doc.status === "expired").length;
  const completionPercentage = (uploadedDocuments / totalDocuments) * 100;

  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.status === "missing" && b.status !== "missing") return -1;
    if (b.status === "missing" && a.status !== "missing") return 1;
    if (a.status === "expired" && b.status !== "expired") return -1;
    if (b.status === "expired" && a.status !== "expired") return 1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Compliance Readiness Checklist - {entityName}
          </DialogTitle>
        </DialogHeader>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <Progress value={completionPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="text-2xl font-bold text-green-600">{uploadedDocuments}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Missing</p>
                  <p className="text-2xl font-bold text-red-600">{missingDocuments}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-orange-600">{expiredDocuments}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Multiple
            </Button>
          </div>

          {sortedDocuments.map((doc) => {
            const daysUntilDue = getDaysUntilDue(doc.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

            return (
              <Card key={doc.id} className={`${
                doc.status === "missing" ? "border-red-200 bg-red-50/50" : 
                doc.status === "expired" ? "border-orange-200 bg-orange-50/50" : 
                "border-green-200 bg-green-50/50"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{doc.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          {doc.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {format(doc.dueDate, 'MMM dd, yyyy')}
                              {isOverdue && (
                                <span className="text-red-600 font-medium ml-1">
                                  (Overdue by {Math.abs(daysUntilDue)} days)
                                </span>
                              )}
                              {isDueSoon && (
                                <span className="text-orange-600 font-medium ml-1">
                                  (Due in {daysUntilDue} days)
                                </span>
                              )}
                            </div>
                            <div>Frequency: {doc.frequency}</div>
                            {doc.uploadedDate && (
                              <div>Uploaded: {format(doc.uploadedDate, 'MMM dd, yyyy')}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.status === "missing" && (
                        <Button size="sm" variant="default">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      )}
                      {doc.status === "expired" && (
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          Re-upload
                        </Button>
                      )}
                      {doc.status === "uploaded" && (
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Generate Report
            </Button>
            <Button>
              Upload Missing Documents
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};