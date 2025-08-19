import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Upload, Eye, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandingConfig {
  logo: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  footer: string;
  complianceSignature: string;
  emailHeader: string;
  reportWatermark: string;
}

const colorPresets = [
  {
    name: 'Corporate Blue',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#f8fafc',
    text: '#1e293b'
  },
  {
    name: 'Professional Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#f0fdf4',
    text: '#064e3b'
  },
  {
    name: 'Modern Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    background: '#faf5ff',
    text: '#581c87'
  },
  {
    name: 'Elegant Gray',
    primary: '#374151',
    secondary: '#6b7280',
    accent: '#9ca3af',
    background: '#f9fafb',
    text: '#111827'
  }
];

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito'
];

export const BrandingConfiguration = () => {
  const { toast } = useToast();
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>({
    logo: '',
    companyName: 'Compliance Pro',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    fontFamily: 'Inter',
    footer: '© 2024 Compliance Pro. All rights reserved. This system is for authorized personnel only.',
    complianceSignature: 'This document has been digitally generated and signed by the Compliance Management System.',
    emailHeader: 'Compliance Management System',
    reportWatermark: 'CONFIDENTIAL - COMPLIANCE DOCUMENT'
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleConfigChange = (field: keyof BrandingConfig, value: string) => {
    setBrandingConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setBrandingConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      backgroundColor: preset.background,
      textColor: preset.text
    }));
    toast({
      title: "Color Preset Applied",
      description: `${preset.name} theme has been applied`
    });
  };

  const handleSaveConfig = () => {
    // Save configuration logic would go here
    toast({
      title: "Branding Saved",
      description: "Your branding configuration has been saved successfully"
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file and get a URL
      const mockUrl = URL.createObjectURL(file);
      setBrandingConfig(prev => ({
        ...prev,
        logo: mockUrl
      }));
      toast({
        title: "Logo Uploaded",
        description: "Your logo has been uploaded successfully"
      });
    }
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(brandingConfig, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Theme Exported",
      description: "Your branding configuration has been exported"
    });
  };

  const PreviewComponent = () => (
    <div 
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: brandingConfig.backgroundColor,
        color: brandingConfig.textColor,
        fontFamily: brandingConfig.fontFamily
      }}
    >
      <div className="flex items-center space-x-3 mb-6">
        {brandingConfig.logo && (
          <img src={brandingConfig.logo} alt="Logo" className="h-12 w-12 object-contain" />
        )}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: brandingConfig.primaryColor }}>
            {brandingConfig.companyName}
          </h1>
          <p style={{ color: brandingConfig.secondaryColor }}>
            {brandingConfig.emailHeader}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div 
          className="p-4 rounded"
          style={{ backgroundColor: brandingConfig.primaryColor, color: 'white' }}
        >
          <h3 className="font-medium">Primary Action Button</h3>
          <p className="text-sm opacity-90">This shows your primary brand color</p>
        </div>
        
        <div 
          className="p-4 rounded border"
          style={{ 
            borderColor: brandingConfig.secondaryColor,
            backgroundColor: `${brandingConfig.secondaryColor}10`
          }}
        >
          <h3 className="font-medium" style={{ color: brandingConfig.secondaryColor }}>
            Secondary Elements
          </h3>
          <p className="text-sm">Content area with secondary colors</p>
        </div>
        
        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-sm" style={{ color: brandingConfig.textColor + '80' }}>
            {brandingConfig.footer}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Branding Configuration</span>
              </CardTitle>
              <CardDescription>
                Customize your compliance system's appearance and branding
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button variant="outline" onClick={exportTheme}>
                <Download className="w-4 h-4 mr-2" />
                Export Theme
              </Button>
              <Button onClick={handleSaveConfig}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={brandingConfig.companyName}
                      onChange={(e) => handleConfigChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="logoUpload">Company Logo</Label>
                    <div className="space-y-2">
                      <Input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      {brandingConfig.logo && (
                        <div className="p-2 border rounded flex items-center space-x-2">
                          <img src={brandingConfig.logo} alt="Logo preview" className="h-8 w-8 object-contain" />
                          <span className="text-sm text-muted-foreground">Logo uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <select
                      id="fontFamily"
                      value={brandingConfig.fontFamily}
                      onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Color Presets</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {colorPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          onClick={() => applyColorPreset(preset)}
                          className="h-auto p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: preset.primary }}
                              />
                              <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: preset.secondary }}
                              />
                              <div 
                                className="w-3 h-3 rounded" 
                                style={{ backgroundColor: preset.accent }}
                              />
                            </div>
                            <span className="text-sm">{preset.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brandingConfig.primaryColor}
                          onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingConfig.primaryColor}
                          onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brandingConfig.secondaryColor}
                          onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingConfig.secondaryColor}
                          onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={brandingConfig.accentColor}
                          onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingConfig.accentColor}
                          onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={brandingConfig.backgroundColor}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={brandingConfig.backgroundColor}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label htmlFor="emailHeader">Email Header</Label>
                    <Input
                      id="emailHeader"
                      value={brandingConfig.emailHeader}
                      onChange={(e) => handleConfigChange('emailHeader', e.target.value)}
                      placeholder="Email header text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="footer">Footer Text</Label>
                    <Textarea
                      id="footer"
                      value={brandingConfig.footer}
                      onChange={(e) => handleConfigChange('footer', e.target.value)}
                      placeholder="Footer text that appears on all pages"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="complianceSignature">Compliance Signature</Label>
                    <Textarea
                      id="complianceSignature"
                      value={brandingConfig.complianceSignature}
                      onChange={(e) => handleConfigChange('complianceSignature', e.target.value)}
                      placeholder="Digital signature text for compliance documents"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reportWatermark">Report Watermark</Label>
                    <Input
                      id="reportWatermark"
                      value={brandingConfig.reportWatermark}
                      onChange={(e) => handleConfigChange('reportWatermark', e.target.value)}
                      placeholder="Watermark text for reports"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {previewMode && (
              <div>
                <Label className="text-base font-medium">Live Preview</Label>
                <div className="mt-2">
                  <PreviewComponent />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Current Color Palette</CardTitle>
          <CardDescription>
            Your current brand colors that will be applied across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {[
              { name: 'Primary', value: brandingConfig.primaryColor },
              { name: 'Secondary', value: brandingConfig.secondaryColor },
              { name: 'Accent', value: brandingConfig.accentColor },
              { name: 'Background', value: brandingConfig.backgroundColor },
              { name: 'Text', value: brandingConfig.textColor }
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div 
                  className="w-full h-20 rounded-lg border mb-2"
                  style={{ backgroundColor: color.value }}
                />
                <div>
                  <p className="font-medium">{color.name}</p>
                  <p className="text-sm text-muted-foreground">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};