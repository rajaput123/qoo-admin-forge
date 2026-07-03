import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/SearchableSelect";

const templeTypeOptions = [
  { value: "hindu", label: "Hindu Temple" },
  { value: "jain", label: "Jain Temple" },
  { value: "buddhist", label: "Buddhist Temple" },
  { value: "sikh", label: "Sikh Gurudwara" },
  { value: "other", label: "Other" },
];

interface TempleDetailsStepProps {
  formData: {
    templeLegalName: string;
    displayName: string;
    deityName: string;
    templeType: string;
    yearEstablished: string;
    shortDescription: string;
  };
  onFormChange: (field: string, value: string) => void;
  onAddNewTempleType?: () => void;
}

const TempleDetailsStep = ({ formData, onFormChange, onAddNewTempleType }: TempleDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Temple Details</h2>
        <p className="text-sm text-muted-foreground">Basic information about your temple</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="templeLegalName">Temple Legal Name *</Label>
          <Input 
            id="templeLegalName" 
            placeholder="e.g., Sri Venkateswara Temple Trust"
            value={formData.templeLegalName}
            onChange={(e) => onFormChange('templeLegalName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name *</Label>
          <Input 
            id="displayName" 
            placeholder="e.g., Tirumala Temple"
            value={formData.displayName}
            onChange={(e) => onFormChange('displayName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deityName">Primary Deity Name *</Label>
          <Input 
            id="deityName" 
            placeholder="e.g., Lord Venkateswara"
            value={formData.deityName}
            onChange={(e) => onFormChange('deityName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Temple Type *</Label>
          <SearchableSelect
            options={templeTypeOptions}
            value={formData.templeType}
            onValueChange={(value) => onFormChange('templeType', value)}
            placeholder="Select Temple Type"
            onAddNew={onAddNewTempleType}
            addNewLabel="Add New Type"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="yearEstablished">Year Established</Label>
          <Input 
            id="yearEstablished" 
            placeholder="e.g., 1509"
            value={formData.yearEstablished}
            onChange={(e) => onFormChange('yearEstablished', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea 
            id="shortDescription" 
            placeholder="Brief description of your temple (history, significance, etc.)"
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => onFormChange('shortDescription', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TempleDetailsStep;
