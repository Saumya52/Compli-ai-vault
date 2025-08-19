import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

interface ComplianceHealthTrendProps {
  className?: string;
}

export const ComplianceHealthTrend = ({ className }: ComplianceHealthTrendProps) => {
  const [timeRange, setTimeRange] = React.useState<"weekly" | "monthly">("weekly");
  
  // Mock trend data
  const weeklyData = [
    { period: "Week 1", score: 85, completedTasks: 12, totalTasks: 15 },
    { period: "Week 2", score: 78, completedTasks: 14, totalTasks: 18 },
    { period: "Week 3", score: 92, completedTasks: 16, totalTasks: 17 },
    { period: "Week 4", score: 88, completedTasks: 20, totalTasks: 23 },
    { period: "Week 5", score: 95, completedTasks: 18, totalTasks: 19 },
    { period: "Week 6", score: 91, completedTasks: 22, totalTasks: 24 }
  ];

  const monthlyData = [
    { period: "Jan", score: 82, completedTasks: 45, totalTasks: 55 },
    { period: "Feb", score: 87, completedTasks: 52, totalTasks: 60 },
    { period: "Mar", score: 90, completedTasks: 48, totalTasks: 53 },
    { period: "Apr", score: 85, completedTasks: 56, totalTasks: 66 },
    { period: "May", score: 93, completedTasks: 61, totalTasks: 65 },
    { period: "Jun", score: 89, completedTasks: 58, totalTasks: 65 }
  ];

  const currentData = timeRange === "weekly" ? weeklyData : monthlyData;
  const currentScore = currentData[currentData.length - 1]?.score || 0;
  const previousScore = currentData[currentData.length - 2]?.score || 0;
  const scoreChange = currentScore - previousScore;
  
  const getTrendIcon = () => {
    if (scoreChange > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (scoreChange < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (scoreChange > 0) return "text-green-600";
    if (scoreChange < 0) return "text-red-600";
    return "text-gray-500";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Score: <span className="font-medium text-foreground">{data.score}%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Tasks: <span className="font-medium text-foreground">{data.completedTasks}/{data.totalTasks}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Compliance Health Trend</CardTitle>
          <Select value={timeRange} onValueChange={(value: "weekly" | "monthly") => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{currentScore}%</span>
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {scoreChange > 0 ? '+' : ''}{scoreChange}%
              </span>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {timeRange === "weekly" ? "vs last week" : "vs last month"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[60, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Additional Insights */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
              <p className="font-semibold">
                {Math.round(currentData.reduce((acc, item) => acc + item.score, 0) / currentData.length)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Period</p>
              <p className="font-semibold">
                {currentData.reduce((prev, current) => prev.score > current.score ? prev : current).period}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className="font-semibold">
                {scoreChange > 2 ? "Improving" : scoreChange < -2 ? "Declining" : "Stable"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};