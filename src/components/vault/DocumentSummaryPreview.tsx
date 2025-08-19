import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface DocumentSummary {
  id: string;
  fileName: string;
  formName: string;
  period: string;
  status: "uploaded" | "validated" | "pending" | "expired";
  uploader: string;
  uploadDate: Date;
  fileSize: string;
  aiGeneratedSummary: string;
  expiryDate?: Date;
  complianceType: string;
  entity: string;
}

interface DocumentSummaryPreviewProps {
  document: DocumentSummary;
  isVisible: boolean;
  position: { x: number; y: number };
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "validated": return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
    case "expired": return <AlertCircle className="w-4 h-4 text-red-500" />;
    default: return <FileText className="w-4 h-4 text-blue-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "validated": return "bg-green-100 text-green-800 border-green-300";
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "expired": return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-blue-100 text-blue-800 border-blue-300";
  }
};

export const DocumentSummaryPreview: React.FC<DocumentSummaryPreviewProps> = ({
  document,
  isVisible,
  position
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 w-80 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold truncate">
                {document.fileName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(document.status)}
                <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 space-y-3">
          {/* Document Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Form:</span>
              <span className="font-medium">{document.formName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Period:</span>
              <span className="font-medium">{document.period}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Entity:</span>
              <span className="font-medium truncate">{document.entity}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="font-medium">{document.fileSize}</span>
            </div>
          </div>

          {/* Upload Info */}
          <div className="border-t pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Uploaded by:</span>
                <span className="font-medium">{document.uploader}</span>
              </div>
              <span className="text-gray-500">{format(document.uploadDate, 'MMM dd, yyyy')}</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="border-t pt-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">AI Summary:</div>
            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
              {document.aiGeneratedSummary}
            </p>
          </div>

          {/* Expiry Warning */}
          {document.expiryDate && (
            <div className="border-t pt-2">
              <div className="flex items-center gap-1 text-xs">
                <AlertCircle className="w-3 h-3 text-orange-500" />
                <span className="text-orange-600 dark:text-orange-400">
                  Expires: {format(document.expiryDate, 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};