import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, Clock, Lightbulb, Target, Zap 
} from "lucide-react";

interface NarrativeInsight {
  metric: string;
  value: number | string;
  trend: "up" | "down" | "stable";
  impact: "positive" | "negative" | "neutral";
  significance: "high" | "medium" | "low";
}

interface AIReportNarrativeProps {
  reportType: string;
  reportData: any;
  timeframe: string;
}

const generateInsights = (reportType: string, reportData: any): NarrativeInsight[] => {
  // Mock AI-generated insights based on report type
  const baseInsights: NarrativeInsight[] = [];
  
  switch (reportType) {
    case "compliance-summary":
      baseInsights.push(
        { metric: "Compliance Score", value: "87%", trend: "up", impact: "positive", significance: "high" },
        { metric: "Completion Rate", value: "91%", trend: "up", impact: "positive", significance: "medium" },
        { metric: "Overdue Tasks", value: 6, trend: "down", impact: "positive", significance: "high" },
        { metric: "Critical Issues", value: 2, trend: "stable", impact: "negative", significance: "medium" }
      );
      break;
    case "overdue-tasks":
      baseInsights.push(
        { metric: "Total Overdue", value: 23, trend: "up", impact: "negative", significance: "high" },
        { metric: "Avg Days Overdue", value: "5.2 days", trend: "up", impact: "negative", significance: "medium" },
        { metric: "Critical Overdue", value: 3, trend: "stable", impact: "negative", significance: "high" },
        { metric: "Resolution Rate", value: "76%", trend: "down", impact: "negative", significance: "medium" }
      );
      break;
    default:
      baseInsights.push(
        { metric: "Overall Performance", value: "Good", trend: "stable", impact: "positive", significance: "medium" },
        { metric: "Key Metrics", value: "Stable", trend: "stable", impact: "neutral", significance: "low" }
      );
  }
  
  return baseInsights;
};

const generateNarrative = (insights: NarrativeInsight[], reportType: string, timeframe: string): string => {
  const complianceScore = insights.find(i => i.metric === "Compliance Score")?.value;
  const overdueTasks = insights.find(i => i.metric === "Overdue Tasks" || i.metric === "Total Overdue")?.value;
  
  let narrative = "";
  
  // Opening summary
  if (complianceScore) {
    narrative += `Compliance performance ${timeframe} shows a score of ${complianceScore}. `;
  }
  
  // Key findings
  const negativeInsights = insights.filter(i => i.impact === "negative" && i.significance === "high");
  const positiveInsights = insights.filter(i => i.impact === "positive" && i.significance === "high");
  
  if (negativeInsights.length > 0) {
    const topConcerns = negativeInsights.map(i => i.metric).slice(0, 2);
    narrative += `Top areas requiring attention: ${topConcerns.join(" and ")}. `;
  }
  
  if (overdueTasks) {
    if (typeof overdueTasks === "number" && overdueTasks > 0) {
      narrative += `${overdueTasks} tasks are currently overdue, primarily in TDS and Labour compliance areas. `;
    }
  }
  
  // Document validation insights
  const validationInsights = insights.filter(i => i.metric.includes("validation") || i.metric.includes("document"));
  if (validationInsights.length > 0) {
    narrative += "Document validation shows mixed results with some items requiring manual review. ";
  }
  
  // Positive trends
  if (positiveInsights.length > 0) {
    narrative += `Positive developments include improved ${positiveInsights[0]?.metric.toLowerCase()}. `;
  }
  
  // Recommendations
  narrative += "Recommended actions: prioritize overdue items, enhance validation processes, and maintain current momentum in high-performing areas.";
  
  return narrative;
};

const getRecommendations = (insights: NarrativeInsight[], reportType: string): string[] => {
  const recommendations: string[] = [];
  
  const criticalIssues = insights.filter(i => i.impact === "negative" && i.significance === "high");
  
  if (criticalIssues.length > 0) {
    recommendations.push("Address critical overdue items within 48 hours");
    recommendations.push("Implement escalation protocols for high-priority tasks");
  }
  
  const validationIssues = insights.filter(i => i.metric.toLowerCase().includes("validation"));
  if (validationIssues.length > 0) {
    recommendations.push("Review and improve document validation workflows");
    recommendations.push("Increase AI validation accuracy through model tuning");
  }
  
  recommendations.push("Schedule weekly review meetings for compliance tracking");
  recommendations.push("Enhance automated reminder systems for upcoming deadlines");
  
  return recommendations;
};

export const AIReportNarrative: React.FC<AIReportNarrativeProps> = ({
  reportType,
  reportData,
  timeframe
}) => {
  const [insights, setInsights] = useState<NarrativeInsight[]>([]);
  const [narrative, setNarrative] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    setIsGenerating(true);
    
    const timer = setTimeout(() => {
      const generatedInsights = generateInsights(reportType, reportData);
      const generatedNarrative = generateNarrative(generatedInsights, reportType, timeframe);
      const generatedRecommendations = getRecommendations(generatedInsights, reportType);
      
      setInsights(generatedInsights);
      setNarrative(generatedNarrative);
      setRecommendations(generatedRecommendations);
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [reportType, reportData, timeframe]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-600 bg-green-100";
      case "negative": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI-Generated Narrative Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">
              AI is analyzing your data and generating insights...
            </span>
          </div>
          <Progress value={66} className="w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI-Generated Narrative Summary
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Auto-generated
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm leading-relaxed">{narrative}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4" />
            Key Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {getTrendIcon(insight.trend)}
                  <div>
                    <div className="font-medium text-sm">{insight.metric}</div>
                    <div className="text-xs text-muted-foreground">
                      Significance: {insight.significance}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{insight.value}</div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getImpactColor(insight.impact)}`}
                  >
                    {insight.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="w-4 h-4" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="w-4 h-4" />
            Immediate Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm">3 critical items require immediate attention</span>
              <Button size="sm" variant="outline" className="ml-auto">
                View Details
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">8 tasks approaching deadline this week</span>
              <Button size="sm" variant="outline" className="ml-auto">
                Schedule Review
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">12 documents successfully validated</span>
              <Button size="sm" variant="outline" className="ml-auto">
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};