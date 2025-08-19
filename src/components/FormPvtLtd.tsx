import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, AlertCircle, FileText, Users, Building, CreditCard, Shield, Zap } from "lucide-react";

interface CompanyFormationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  duration: string;
  cost: string;
  icon: any;
  category: "preparation" | "registration" | "post_incorporation";
  mcaIntegration?: boolean;
  substeps?: string[];
}

const FormPvtLtd = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  const steps: CompanyFormationStep[] = [
    // Preparation Phase
    {
      id: "name-reservation",
      title: "Company Name Reservation",
      description: "Reserve your company name through MCA portal (RUN service)",
      status: "pending",
      duration: "1-2 days",
      cost: "₹1,000",
      icon: Building,
      category: "preparation",
      mcaIntegration: true,
      substeps: [
        "Check name availability",
        "Submit RUN application",
        "Pay government fees",
        "Receive name approval"
      ]
    },
    {
      id: "dsc-certificate",
      title: "Digital Signature Certificate",
      description: "Obtain DSC for directors from authorized certifying agency",
      status: "pending",
      duration: "1 day",
      cost: "₹1,500 per director",
      icon: Shield,
      category: "preparation",
      mcaIntegration: false,
      substeps: [
        "Apply for Class 2 DSC",
        "Submit required documents",
        "Complete verification",
        "Download DSC"
      ]
    },
    {
      id: "din-application",
      title: "Director Identification Number (DIN)",
      description: "Apply for DIN for all proposed directors",
      status: "pending",
      duration: "1-2 days",
      cost: "₹500 per director",
      icon: Users,
      category: "preparation",
      mcaIntegration: true,
      substeps: [
        "Fill DIR-3 form",
        "Upload director documents",
        "Pay processing fees",
        "Receive DIN"
      ]
    },
    
    // Registration Phase
    {
      id: "incorporation-spice",
      title: "Company Incorporation (SPICe+)",
      description: "File incorporation documents through SPICe+ form",
      status: "pending",
      duration: "15-20 days",
      cost: "₹4,000 + stamp duty",
      icon: FileText,
      category: "registration",
      mcaIntegration: true,
      substeps: [
        "Prepare SPICe+ form",
        "Upload MOA & AOA",
        "Submit incorporation documents",
        "Pay stamp duty & fees",
        "Await CIN allocation"
      ]
    },
    {
      id: "pan-tan",
      title: "PAN & TAN Application",
      description: "Apply for company PAN and TAN through NSDL/UTIITSL",
      status: "pending",
      duration: "7-10 days",
      cost: "₹1,000",
      icon: CreditCard,
      category: "registration",
      mcaIntegration: false,
      substeps: [
        "Fill PAN application (Form 49A)",
        "Fill TAN application (Form 49B)",
        "Submit supporting documents",
        "Receive PAN & TAN"
      ]
    },
    
    // Post Incorporation
    {
      id: "bank-account",
      title: "Bank Account Opening",
      description: "Open current account for the company",
      status: "pending",
      duration: "3-5 days",
      cost: "As per bank charges",
      icon: Building,
      category: "post_incorporation",
      mcaIntegration: false,
      substeps: [
        "Choose bank & branch",
        "Submit incorporation documents",
        "Complete KYC for directors",
        "Activate current account"
      ]
    },
    {
      id: "gst-registration",
      title: "GST Registration",
      description: "Register for GST if turnover threshold is met",
      status: "pending",
      duration: "7-15 days",
      cost: "Free",
      icon: FileText,
      category: "post_incorporation",
      mcaIntegration: false,
      substeps: [
        "Determine GST applicability",
        "Fill GST REG-01 form",
        "Upload required documents",
        "Receive GSTIN"
      ]
    },
    {
      id: "compliance-setup",
      title: "Compliance Setup",
      description: "Set up statutory registers and compliance calendar",
      status: "pending",
      duration: "1-2 days",
      cost: "₹2,000",
      icon: CheckCircle,
      category: "post_incorporation",
      mcaIntegration: false,
      substeps: [
        "Create statutory registers",
        "Set up compliance calendar",
        "Prepare board resolutions",
        "Issue share certificates"
      ]
    }
  ];

  const handleStepClick = (stepId: string) => {
    // Toggle step completion status
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getStepIcon = (step: CompanyFormationStep) => {
    const IconComponent = step.icon;
    if (completedSteps.includes(step.id)) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    return <IconComponent className="w-6 h-6 text-muted-foreground" />;
  };

  const getStepStatus = (step: CompanyFormationStep) => {
    if (completedSteps.includes(step.id)) {
      return "completed";
    }
    return step.status;
  };

  const getCategorySteps = (category: string) => {
    return steps.filter(step => step.category === category);
  };

  const getCompletionPercentage = () => {
    return Math.round((completedSteps.length / steps.length) * 100);
  };

  const getTotalCost = () => {
    return "₹15,000 - ₹25,000";
  };

  const getTotalDuration = () => {
    return "30-45 days";
  };

  const renderStepCard = (step: CompanyFormationStep) => (
    <Card 
      key={step.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        completedSteps.includes(step.id) ? 'border-green-500 bg-green-50' : 'hover:border-primary'
      }`}
      onClick={() => handleStepClick(step.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStepIcon(step)}
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.duration}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {step.cost}
                </Badge>
                {step.mcaIntegration && (
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    <Zap className="w-3 h-3 mr-1" />
                    MCA Integrated
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {completedSteps.includes(step.id) && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-3">
          {step.description}
        </CardDescription>
        {step.substeps && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Key Steps:</p>
            <ul className="text-xs space-y-1">
              {step.substeps.map((substep, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Circle className="w-2 h-2 text-muted-foreground fill-current" />
                  {substep}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Form a Private Limited Company</h1>
            <p className="text-muted-foreground mt-1">
              Complete step-by-step guide to incorporate your Pvt Ltd company without a CA
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>
        
        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Progress value={getCompletionPercentage()} className="h-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedSteps.length}/{steps.length}</div>
                  <div className="text-sm text-muted-foreground">Steps Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{getTotalDuration()}</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{getTotalCost()}</div>
                  <div className="text-sm text-muted-foreground">Estimated Cost</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preparation Phase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Phase 1: Preparation</h2>
          <Badge variant="outline">Before Incorporation</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCategorySteps("preparation").map(renderStepCard)}
        </div>
      </div>

      {/* Registration Phase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Phase 2: Registration</h2>
          <Badge variant="outline">MCA Filing</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCategorySteps("registration").map(renderStepCard)}
        </div>
      </div>

      {/* Post Incorporation Phase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Phase 3: Post Incorporation</h2>
          <Badge variant="outline">Business Setup</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCategorySteps("post_incorporation").map(renderStepCard)}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Ready to Start?</h3>
              <p className="text-sm text-muted-foreground">
                Click any step above to begin the process. Our MCA integration will guide you through each step.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Download Checklist
              </Button>
              <Button>
                Start Incorporation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormPvtLtd;