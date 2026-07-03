import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Upload, Building2, MapPin, Phone, Mail, User } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    templeName: "Sri Venkateswara Temple",
    address: "Tirumala, Tirupati, Andhra Pradesh",
    city: "Tirupati",
    state: "Andhra Pradesh",
    pincode: "517504",
    country: "India",
    contactPerson: "Swami Prasad",
    email: "admin@temple.org",
    phone: "+91 877 123 4567",
    emailVerified: true,
    phoneVerified: true,
  });
  const [logo, setLogo] = useState<string | null>(null);

  const handleSave = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your temple organization profile and contact details</p>
      </div>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Temple/Organization Name *</Label>
              <Input
                value={formData.templeName}
                onChange={(e) => setFormData({ ...formData, templeName: e.target.value })}
                placeholder="Enter temple name"
              />
            </div>
            <div>
              <Label>Admin Contact Person *</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div>
            <Label>Address *</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter full address"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>City *</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div>
              <Label>State *</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
              />
            </div>
            <div>
              <Label>Pincode *</Label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="Pincode"
              />
            </div>
          </div>

          <div>
            <Label>Country *</Label>
            <Input
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Country"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="h-4 w-4" /> Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Email Address *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@temple.org"
                />
                {formData.emailVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" /> Not Verified
                  </Badge>
                )}
              </div>
              {!formData.emailVerified && (
                <Button variant="outline" size="sm" className="mt-2">
                  Verify Email
                </Button>
              )}
            </div>
            <div>
              <Label>Phone Number *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                />
                {formData.phoneVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" /> Not Verified
                  </Badge>
                )}
              </div>
              {!formData.phoneVerified && (
                <Button variant="outline" size="sm" className="mt-2">
                  Verify Phone
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No logo</p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <Label>Upload Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 200x200px, PNG or JPG format, max 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
