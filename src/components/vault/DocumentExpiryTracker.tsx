import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Clock, Bell, Download } from "lucide-react";
import { format, differenceInDays, isBefore, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ExpiringDocument {
  id: string;
  fileName: string;
  type: string;
  entity: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  urgencyLevel: "critical" | "warning" | "info";
  autoRenewal: boolean;
  reminderSent: boolean;
}

const mockExpiringDocuments: ExpiringDocument[] = [
  {
    id: "1",
    fileName: "GST Registration Certificate.pdf",
    type: "GST",
    entity: "ABC Pvt Ltd",
    expiryDate: addDays(new Date(), 15),
    daysUntilExpiry: 15,
    urgencyLevel: "warning",
    autoRenewal: true,
    reminderSent: true
  },
  {
    id: "2",
    fileName: "Trade License.pdf", 
    type: "License",
    entity: "XYZ Corp",
    expiryDate: addDays(new Date(), 3),
    daysUntilExpiry: 3,
    urgencyLevel: "critical",
    autoRenewal: false,
    reminderSent: false
  },
  {
    id: "3",
    fileName: "Power of Attorney.pdf",
    type: "Authorization",
    entity: "ABC Pvt Ltd",
    expiryDate: addDays(new Date(), 45),
    daysUntilExpiry: 45,
    urgencyLevel: "info",
    autoRenewal: false,
    reminderSent: false
  },
  {
    id: "4",
    fileName: "Auditor Certificate.pdf",
    type: "Compliance",
    entity: "DEF Limited",
    expiryDate: addDays(new Date(), -5),
    daysUntilExpiry: -5,
    urgencyLevel: "critical",
    autoRenewal: false,
    reminderSent: true
  }
];

const getUrgencyColor = (urgencyLevel: string, daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return "bg-red-600 text-white border-red-700";
  switch (urgencyLevel) {
    case "critical": return "bg-red-100 text-red-800 border-red-300";
    case "warning": return "bg-orange-100 text-orange-800 border-orange-300";
    case "info": return "bg-blue-100 text-blue-800 border-blue-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getUrgencyIcon = (urgencyLevel: string, daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return <AlertCircle className="w-4 h-4 text-red-600" />;
  switch (urgencyLevel) {
    case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "warning": return <Clock className="w-4 h-4 text-orange-500" />;
    default: return <Calendar className="w-4 h-4 text-blue-500" />;
  }
};

export const DocumentExpiryTracker: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ExpiringDocument[]>(mockExpiringDocuments);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "expired">("all");

  const expiredDocs = documents.filter(doc => doc.daysUntilExpiry < 0);
  const criticalDocs = documents.filter(doc => doc.daysUntilExpiry >= 0 && doc.daysUntilExpiry <= 7);
  const warningDocs = documents.filter(doc => doc.daysUntilExpiry > 7 && doc.daysUntilExpiry <= 30);

  const filteredDocuments = documents.filter(doc => {
    switch (filter) {
      case "expired": return doc.daysUntilExpiry < 0;
      case "critical": return doc.daysUntilExpiry >= 0 && doc.daysUntilExpiry <= 7;
      case "warning": return doc.daysUntilExpiry > 7 && doc.daysUntilExpiry <= 30;
      default: return true;
    }
  }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const handleSendReminder = (docId: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, reminderSent: true } : doc
      )
    );
    toast({
      title: "Reminder Sent",
      description: "Expiry reminder has been sent to relevant stakeholders",
    });
  };

  const handleDownloadExpiry = (format: "csv" | "pdf") => {
    toast({
      title: "Download Started",
      description: `Expiry report is being generated in ${format.toUpperCase()} format`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Expired</p>
                <p className="text-2xl font-bold text-red-700">{expiredDocs.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Critical (≤7 days)</p>
                <p className="text-2xl font-bold text-orange-700">{criticalDocs.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Warning (≤30 days)</p>
                <p className="text-2xl font-bold text-yellow-700">{warningDocs.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Tracked</p>
                <p className="text-2xl font-bold text-blue-700">{documents.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Documents
          </Button>
          <Button 
            variant={filter === "expired" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("expired")}
          >
            Expired ({expiredDocs.length})
          </Button>
          <Button 
            variant={filter === "critical" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical ({criticalDocs.length})
          </Button>
          <Button 
            variant={filter === "warning" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("warning")}
          >
            Warning ({warningDocs.length})
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadExpiry("csv")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadExpiry("pdf")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {filteredDocuments.map((doc) => (
          <Card 
            key={doc.id} 
            className={`${
              doc.daysUntilExpiry < 0 ? "border-red-300 bg-red-50/50" :
              doc.urgencyLevel === "critical" ? "border-red-200 bg-red-50/30" :
              doc.urgencyLevel === "warning" ? "border-orange-200 bg-orange-50/30" :
              "border-gray-200"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getUrgencyIcon(doc.urgencyLevel, doc.daysUntilExpiry)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{doc.fileName}</h4>
                      <Badge className={`text-xs ${getUrgencyColor(doc.urgencyLevel, doc.daysUntilExpiry)}`}>
                        {doc.daysUntilExpiry < 0 ? "EXPIRED" : 
                         doc.daysUntilExpiry === 0 ? "EXPIRES TODAY" :
                         `${doc.daysUntilExpiry} days left`}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                      {doc.autoRenewal && (
                        <Badge variant="secondary" className="text-xs">
                          Auto-renewal
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>Entity: {doc.entity}</span>
                        <span>Expires: {format(doc.expiryDate, 'MMM dd, yyyy')}</span>
                        {doc.reminderSent && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Bell className="w-3 h-3" />
                            <span>Reminder sent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!doc.reminderSent && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendReminder(doc.id)}
                    >
                      <Bell className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>
                  )}
                  <Button size="sm" variant="default">
                    Renew/Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No documents found</p>
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "No expiring documents to track" : `No ${filter} documents found`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};