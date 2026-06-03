import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/SearchableSelect";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";

const legalEntityOptions = [
  { value: "public-trust", label: "Public Charitable Trust" },
  { value: "private-trust", label: "Private Trust" },
  { value: "society", label: "Registered Society" },
  { value: "section-8", label: "Section 8 Company" },
  { value: "endowment", label: "Endowment Board" },
  { value: "government", label: "Government Managed" },
  { value: "private", label: "Privately Owned" },
];

interface TrustLegalStepProps {
  formData: {
    trustName: string;
    trustRegNumber: string;
    legalEntityType: string;
    registrationDate: string;
    trustCertificate: string | null;
  };
  onFormChange: (field: string, value: string | null) => void;
  onAddNewEntityType?: () => void;
}

const TrustLegalStep = ({ formData, onFormChange, onAddNewEntityType }: TrustLegalStepProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = () => {
    // Mock file upload
    setFileName("trust_certificate.pdf");
    onFormChange('trustCertificate', 'trust_certificate.pdf');
  };

  const handleRemoveFile = () => {
    setFileName(null);
    onFormChange('trustCertificate', null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Trust & Legal Details</h2>
        <p className="text-sm text-muted-foreground">Legal entity information for verification</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="trustName">Trust / Organization Name *</Label>
          <Input 
            id="trustName" 
            placeholder="e.g., Sri Venkateswara Temple Trust Board"
            value={formData.trustName}
            onChange={(e) => onFormChange('trustName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trustRegNumber">Registration Number *</Label>
          <Input 
            id="trustRegNumber" 
            placeholder="e.g., TRN/2020/12345"
            value={formData.trustRegNumber}
            onChange={(e) => onFormChange('trustRegNumber', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Legal Entity Type *</Label>
          <SearchableSelect
            options={legalEntityOptions}
            value={formData.legalEntityType}
            onValueChange={(value) => onFormChange('legalEntityType', value)}
            placeholder="Select Entity Type"
            onAddNew={onAddNewEntityType}
            addNewLabel="Add New Type"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registrationDate">Registration Date</Label>
          <Input 
            id="registrationDate" 
            type="date"
            value={formData.registrationDate}
            onChange={(e) => onFormChange('registrationDate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Trust Registration Certificate</Label>
          <p className="text-xs text-muted-foreground mb-2">Optional but recommended for faster verification</p>
          
          {!fileName ? (
            <div 
              onClick={handleFileUpload}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, JPG, or PNG (max. 5MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">Uploaded successfully</p>
              </div>
              <button 
                type="button"
                onClick={handleRemoveFile}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Bank details will be collected during the verification process after your registration is approved.
        </p>
      </div>
    </div>
  );
};

export default TrustLegalStep;
