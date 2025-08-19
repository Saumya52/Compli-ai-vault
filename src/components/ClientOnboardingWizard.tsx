import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Upload, Plus, X } from "lucide-react";
import { useClient, type Client } from "@/contexts/ClientContext";
import { useToast } from "@/hooks/use-toast";

interface ClientOnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

interface BoardMember {
  name: string;
  designation: string;
  din?: string;
  email: string;
  phone: string;
}

const complianceTypes = [
  { id: 'roc', label: 'ROC (Registrar of Companies)', description: 'Annual filings, board resolutions' },
  { id: 'gst', label: 'GST (Goods & Services Tax)', description: 'Monthly/Quarterly returns' },
  { id: 'labour', label: 'Labour & Employment', description: 'PF, ESI, professional tax' },
  { id: 'income_tax', label: 'Income Tax', description: 'TDS, advance tax, returns' },
  { id: 'fema', label: 'FEMA Compliance', description: 'Foreign exchange regulations' },
  { id: 'environment', label: 'Environmental', description: 'Pollution clearances' },
  { id: 'factory', label: 'Factory Act', description: 'Manufacturing licenses' },
  { id: 'shops', label: 'Shops & Establishment', description: 'Trade licenses' }
];

export const ClientOnboardingWizard = ({ open, onClose }: ClientOnboardingWizardProps) => {
  const { addClient } = useClient();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    pan: '',
    cin: '',
    gst: '',
    tan: '',
    registeredAddress: '',
    contactEmail: '',
    contactPhone: '',
  });
  
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([
    { name: '', designation: 'Director', din: '', email: '', phone: '' }
  ]);
  
  const [selectedCompliances, setSelectedCompliances] = useState<string[]>(['roc', 'gst', 'income_tax']);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const steps = [
    { title: "Company Details", description: "Basic company information" },
    { title: "Board Members", description: "Directors and key personnel" },
    { title: "Compliance Setup", description: "Select applicable compliance types" },
    { title: "Document Upload", description: "Upload incorporation documents" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.companyName,
      type: formData.companyType as Client['type'],
      pan: formData.pan,
      cin: formData.cin,
      gst: formData.gst,
      tan: formData.tan,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    addClient(newClient);
    
    toast({
      title: "Client Added Successfully",
      description: `${formData.companyName} has been onboarded successfully.`,
    });

    // Reset form and close
    setCurrentStep(0);
    setFormData({
      companyName: '',
      companyType: '',
      pan: '',
      cin: '',
      gst: '',
      tan: '',
      registeredAddress: '',
      contactEmail: '',
      contactPhone: '',
    });
    setBoardMembers([{ name: '', designation: 'Director', din: '', email: '', phone: '' }]);
    setSelectedCompliances(['roc', 'gst', 'income_tax']);
    setUploadedDocs([]);
    onClose();
  };

  const addBoardMember = () => {
    setBoardMembers([...boardMembers, { name: '', designation: 'Director', din: '', email: '', phone: '' }]);
  };

  const removeBoardMember = (index: number) => {
    setBoardMembers(boardMembers.filter((_, i) => i !== index));
  };

  const updateBoardMember = (index: number, field: keyof BoardMember, value: string) => {
    const updated = [...boardMembers];
    updated[index] = { ...updated[index], [field]: value };
    setBoardMembers(updated);
  };

  const toggleCompliance = (complianceId: string) => {
    setSelectedCompliances(prev =>
      prev.includes(complianceId)
        ? prev.filter(id => id !== complianceId)
        : [...prev, complianceId]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="companyType">Company Type *</Label>
                <Select value={formData.companyType} onValueChange={(value) => setFormData({ ...formData, companyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pvt Ltd">Private Limited</SelectItem>
                    <SelectItem value="LLP">Limited Liability Partnership</SelectItem>
                    <SelectItem value="OPC">One Person Company</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  placeholder="ABCTY1234D"
                />
              </div>
              <div>
                <Label htmlFor="cin">CIN Number</Label>
                <Input
                  id="cin"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  placeholder="U72900DL2020PTC123456"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  placeholder="07ABCTY1234D1Z5"
                />
              </div>
              <div>
                <Label htmlFor="tan">TAN Number</Label>
                <Input
                  id="tan"
                  value={formData.tan}
                  onChange={(e) => setFormData({ ...formData, tan: e.target.value })}
                  placeholder="DELR12345F"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Registered Address</Label>
              <Textarea
                id="address"
                value={formData.registeredAddress}
                onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                placeholder="Enter complete registered address"
                rows={3}
              />
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Board Members & Key Personnel</h3>
              <Button onClick={addBoardMember} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            
            {boardMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Member {index + 1}</CardTitle>
                    {boardMembers.length > 1 && (
                      <Button
                        onClick={() => removeBoardMember(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateBoardMember(index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label>Designation</Label>
                      <Select
                        value={member.designation}
                        onValueChange={(value) => updateBoardMember(index, 'designation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Director">Director</SelectItem>
                          <SelectItem value="Managing Director">Managing Director</SelectItem>
                          <SelectItem value="CEO">CEO</SelectItem>
                          <SelectItem value="CFO">CFO</SelectItem>
                          <SelectItem value="Company Secretary">Company Secretary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>DIN (if applicable)</Label>
                      <Input
                        value={member.din}
                        onChange={(e) => updateBoardMember(index, 'din', e.target.value)}
                        placeholder="12345678"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateBoardMember(index, 'email', e.target.value)}
                        placeholder="email@domain.com"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={member.phone}
                        onChange={(e) => updateBoardMember(index, 'phone', e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Select Applicable Compliance Types</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the compliance areas that apply to your client's business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {complianceTypes.map((compliance) => (
                <Card
                  key={compliance.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCompliances.includes(compliance.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleCompliance(compliance.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedCompliances.includes(compliance.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{compliance.label}</h4>
                          {['roc', 'gst', 'income_tax'].includes(compliance.id) && (
                            <Badge variant="secondary" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{compliance.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Incorporation Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload key documents to auto-populate the client vault.
              </p>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <h4 className="font-medium">Upload Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, JPG, PNG (Max 10MB each)
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Recommended Documents:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Certificate of Incorporation</li>
                  <li>• Memorandum of Association</li>
                  <li>• Articles of Association</li>
                  <li>• PAN Card</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Optional Documents:</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• GST Registration Certificate</li>
                  <li>• TAN Allotment Letter</li>
                  <li>• Bank Account Opening Letter</li>
                  <li>• FSSAI License (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Onboarding Wizard</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Stepper */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-px mx-4 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="px-4">
            {renderStepContent()}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between px-4 pt-6 border-t">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === 0 && (!formData.companyName || !formData.companyType)}
            >
              {currentStep === steps.length - 1 ? 'Complete Onboarding' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};