import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/SearchableSelect";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const countryOptions = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "singapore", label: "Singapore" },
  { value: "malaysia", label: "Malaysia" },
];

const stateOptions = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "west-bengal", label: "West Bengal" },
];

const districtOptions = [
  { value: "bangalore-urban", label: "Bangalore Urban" },
  { value: "bangalore-rural", label: "Bangalore Rural" },
  { value: "chennai", label: "Chennai" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "mumbai", label: "Mumbai" },
  { value: "pune", label: "Pune" },
  { value: "tirupati", label: "Tirupati" },
];

interface LocationStepProps {
  formData: {
    country: string;
    state: string;
    district: string;
    city: string;
    fullAddress: string;
    postalCode: string;
    googleMapPin: string;
  };
  onFormChange: (field: string, value: string) => void;
}

const LocationStep = ({ formData, onFormChange }: LocationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Temple Location</h2>
        <p className="text-sm text-muted-foreground">Where is your temple located?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Country *</Label>
          <SearchableSelect
            options={countryOptions}
            value={formData.country}
            onValueChange={(value) => onFormChange('country', value)}
            placeholder="Select Country"
            searchPlaceholder="Search countries..."
          />
        </div>
        
        <div className="space-y-2">
          <Label>State / Province *</Label>
          <SearchableSelect
            options={stateOptions}
            value={formData.state}
            onValueChange={(value) => onFormChange('state', value)}
            placeholder="Select State"
            searchPlaceholder="Search states..."
          />
        </div>
        
        <div className="space-y-2">
          <Label>District *</Label>
          <SearchableSelect
            options={districtOptions}
            value={formData.district}
            onValueChange={(value) => onFormChange('district', value)}
            placeholder="Select District"
            searchPlaceholder="Search districts..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City / Town *</Label>
          <Input 
            id="city" 
            placeholder="e.g., Tirupati"
            value={formData.city}
            onChange={(e) => onFormChange('city', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullAddress">Full Address *</Label>
          <Textarea 
            id="fullAddress" 
            placeholder="Enter complete temple address with landmarks"
            rows={2}
            value={formData.fullAddress}
            onChange={(e) => onFormChange('fullAddress', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input 
            id="postalCode" 
            placeholder="e.g., 517501"
            value={formData.postalCode}
            onChange={(e) => onFormChange('postalCode', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="googleMapPin">Google Map Link</Label>
          <div className="flex gap-2">
            <Input 
              id="googleMapPin" 
              placeholder="Paste Google Maps URL"
              className="flex-1"
              value={formData.googleMapPin}
              onChange={(e) => onFormChange('googleMapPin', e.target.value)}
            />
            <Button type="button" variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep;
