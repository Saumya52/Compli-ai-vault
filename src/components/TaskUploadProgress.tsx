import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, AlertTriangle } from 'lucide-react';

interface TaskUploadResult {
  fileName: string;
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  duplicates: number;
  errors: string[];
  warnings: string[];
}

interface TaskUploadProgressProps {
  isVisible: boolean;
  result: TaskUploadResult | null;
  onClose: () => void;
}

export const TaskUploadProgress: React.FC<TaskUploadProgressProps> = ({
  isVisible,
  result,
  onClose
}) => {
  if (!isVisible || !result) return null;

  const successRate = result.totalTasks > 0 ? (result.successfulTasks / result.totalTasks) * 100 : 0;

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Complete
          </CardTitle>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Success Rate</span>
            <span className="font-medium">{Math.round(successRate)}%</span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Success: {result.successfulTasks}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Failed: {result.failedTasks}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>Duplicates: {result.duplicates}</span>
          </div>
          <div className="text-muted-foreground">
            Total: {result.totalTasks}
          </div>
        </div>

        {result.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600">Errors:</h4>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {result.errors.slice(0, 3).map((error, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              ))}
              {result.errors.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{result.errors.length - 3} more errors
                </div>
              )}
            </div>
          </div>
        )}

        {result.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-yellow-600">Warnings:</h4>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {result.warnings.slice(0, 2).map((warning, index) => (
                <div key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                  {warning}
                </div>
              ))}
              {result.warnings.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{result.warnings.length - 2} more warnings
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};