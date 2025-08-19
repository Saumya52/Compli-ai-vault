import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IndianRupee, TrendingUp, Calendar, FileCheck } from "lucide-react";

interface BillingStatusSnapshotProps {
  className?: string;
}

interface BillingData {
  invoiced: number;
  paid: number;
  overdue: number;
  upcomingPayments: Array<{
    client: string;
    amount: number;
    date: string;
  }>;
  autoMISDelivery: {
    completed: number;
    pending: number;
  };
}

const mockBillingData: BillingData = {
  invoiced: 850000,
  paid: 620000,
  overdue: 125000,
  upcomingPayments: [
    { client: "TechCorp Industries", amount: 45000, date: "Jan 15" },
    { client: "GreenEnergy Solutions", amount: 32000, date: "Jan 20" },
    { client: "RetailMax Pvt Ltd", amount: 28000, date: "Jan 25" }
  ],
  autoMISDelivery: {
    completed: 18,
    pending: 4
  }
};

export const BillingStatusSnapshot = ({ className }: BillingStatusSnapshotProps) => {
  const paidPercentage = Math.round((mockBillingData.paid / mockBillingData.invoiced) * 100);
  const overduePercentage = Math.round((mockBillingData.overdue / mockBillingData.invoiced) * 100);
  const misCompletionRate = Math.round((mockBillingData.autoMISDelivery.completed / (mockBillingData.autoMISDelivery.completed + mockBillingData.autoMISDelivery.pending)) * 100);

  const formatAmount = (amount: number) => {
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Billing Status</CardTitle>
          <Badge variant="outline" className="text-xs">
            Current Month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Financial Overview */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <IndianRupee className="h-3 w-3" />
                <span className="text-xs font-medium">Invoiced</span>
              </div>
              <div className="font-bold text-sm">{formatAmount(mockBillingData.invoiced)}</div>
            </div>
            <div className="text-center p-3 bg-status-success/5 rounded-lg border border-status-success/10">
              <div className="flex items-center justify-center gap-1 text-status-success mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Paid</span>
              </div>
              <div className="font-bold text-sm">{formatAmount(mockBillingData.paid)}</div>
            </div>
            <div className="text-center p-3 bg-status-error/5 rounded-lg border border-status-error/10">
              <div className="flex items-center justify-center gap-1 text-status-error mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs font-medium">Overdue</span>
              </div>
              <div className="font-bold text-sm">{formatAmount(mockBillingData.overdue)}</div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Collection Progress</span>
              <span className="font-medium">{paidPercentage}% collected</span>
            </div>
            <Progress value={paidPercentage} className="h-2" />
            {overduePercentage > 0 && (
              <div className="text-xs text-status-error">
                {overduePercentage}% overdue
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Upcoming Payment Cycles</h4>
          <div className="space-y-2">
            {mockBillingData.upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                <span className="font-medium">{payment.client}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{payment.date}</span>
                  <span className="font-medium">{formatAmount(payment.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto MIS Delivery */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">Auto MIS Report Delivery</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tied to invoice clearing</span>
            <Badge variant="secondary" className="text-xs">
              {misCompletionRate}% completion rate
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Completed: {mockBillingData.autoMISDelivery.completed}</span>
            <span>Pending: {mockBillingData.autoMISDelivery.pending}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};