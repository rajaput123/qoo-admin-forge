import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Camera, Save, Globe, Phone, Mail, MapPin, Clock, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const TempleProfile = () => {
  const handleSave = () => {
    toast.success("Profile saved successfully");
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Temple Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your temple's identity, location, and legal details</p>
          </div>
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Temple Image & Logo */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Branding</h3>
          <div className="flex items-start gap-6 flex-wrap">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Temple Photo</Label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Temple Logo</Label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                  <Camera className="h-6 w-6 text-muted-foreground" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs text-muted-foreground mb-2">Upload your temple photo and logo for branding across the platform.</p>
              <Button variant="outline" size="sm">Upload Image</Button>
            </div>
          </div>
        </div>

        {/* Basic Details — aligned with Registration Step 2 */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Temple Name *</Label>
              <Input defaultValue="Sri Venkateswara Temple Trust" />
            </div>
            <div className="space-y-2">
              <Label>Temple Alternate Name</Label>
              <Input defaultValue="Tirumala Temple" />
            </div>
            <div className="space-y-2">
              <Label>Temple Type *</Label>
              <Select defaultValue="trust-managed">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="trust-managed">Trust Managed</SelectItem>
                  <SelectItem value="govt-managed">Government Managed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Deity *</Label>
              <Input defaultValue="Lord Venkateswara" />
            </div>
            <div className="space-y-2">
              <Label>Secondary Deities</Label>
              <Input defaultValue="Goddess Padmavathi" />
            </div>
            <div className="space-y-2">
              <Label>Established Year</Label>
              <Input defaultValue="1509" />
            </div>
            <div className="space-y-2">
              <Label>Temple Category</Label>
              <Input defaultValue="Pilgrimage Center" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short Description</Label>
              <Textarea
                rows={3}
                defaultValue="One of the most famous Hindu temples dedicated to Lord Venkateswara, a form of Vishnu, located atop the seventh peak of Tirumala Hills."
              />
            </div>
          </div>
        </div>

        {/* Location — aligned with Registration Step 3 */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select defaultValue="india">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>State / Province *</Label>
              <Select defaultValue="andhra-pradesh">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District *</Label>
              <Select defaultValue="tirupati">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tirupati">Tirupati</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Taluk / Mandal</Label>
              <Select defaultValue="">
                <SelectTrigger><SelectValue placeholder="Select Taluk" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="taluk-1">Taluk 1</SelectItem>
                  <SelectItem value="taluk-2">Taluk 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City / Town *</Label>
              <Select defaultValue="tirupati-city">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tirupati-city">Tirupati</SelectItem>
                  <SelectItem value="tirumala">Tirumala</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pincode *</Label>
              <Input defaultValue="517501" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address Line 1 *</Label>
              <Input defaultValue="Temple Street, Tirumala Hills" />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input defaultValue="Near Gopuram Entrance" />
            </div>
            <div className="space-y-2">
              <Label>Landmark</Label>
              <Input defaultValue="Main Gopuram" />
            </div>
          </div>
        </div>

        {/* Trust & Legal Details */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Trust & Legal Details
          </h3>
          
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Required</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2 md:col-span-2">
              <Label>Trust / Entity Name *</Label>
              <Input defaultValue="Sri Venkateswara Temple Trust Board" />
            </div>
            <div className="space-y-2">
              <Label>Legal Type *</Label>
              <Select defaultValue="charitable-trust">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="charitable-trust">Charitable Trust</SelectItem>
                  <SelectItem value="society">Society</SelectItem>
                  <SelectItem value="religious-institution">Religious Institution</SelectItem>
                  <SelectItem value="govt-board">Govt. Board / Endowment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Registration Number *</Label>
              <Input defaultValue="TRN/2020/12345" />
            </div>
            <div className="space-y-2">
              <Label>PAN *</Label>
              <Input defaultValue="AACTS1234P" />
            </div>
          </div>

          <Separator className="mb-4" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Optional</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Registration Date</Label>
              <Input type="date" defaultValue="1985-06-15" />
            </div>
            <div className="space-y-2">
              <Label>12A Number</Label>
              <Input defaultValue="12A/2020/56789" />
            </div>
            <div className="space-y-2">
              <Label>80G Number</Label>
              <Input defaultValue="80G/2020/98765" />
            </div>
          </div>
        </div>

        {/* Contact Information — aligned with Registration Step 5 (Admin) */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Admin Name</Label>
              <Input defaultValue="Rajesh Sharma" disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input defaultValue="Chairman" disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> Mobile (Primary Login)
                </div>
              </Label>
              <Input defaultValue="+91 98765 43210" disabled className="bg-muted/50" />
              <p className="text-[11px] text-muted-foreground">Mobile number cannot be changed — it is your login ID</p>
            </div>
            <div className="space-y-2">
              <Label>Alternate Phone</Label>
              <Input defaultValue="+91 98765 43211" />
            </div>
            <div className="space-y-2">
              <Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </div>
              </Label>
              <Input type="email" defaultValue="admin@temple.org" />
            </div>
            <div className="space-y-2">
              <Label>Official Temple Email</Label>
              <Input type="email" defaultValue="info@temple.org" />
            </div>
            <div className="space-y-2">
              <Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> Website
                </div>
              </Label>
              <Input defaultValue="www.temple.org" />
            </div>
          </div>
        </div>

        {/* System Metadata (Read-only) */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" /> System Metadata
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Temple ID</p>
              <p className="font-mono text-sm text-foreground">TMP-2026-001234</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tenant ID</p>
              <p className="font-mono text-sm text-foreground">TNT-2026-001234</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
              <Badge variant="secondary">Temple</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subscription Plan</p>
              <Badge variant="secondary">Starter (Free)</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Account Status</p>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">Active</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Registered On</p>
              <p className="text-sm text-foreground">February 17, 2026</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm text-foreground">February 17, 2026</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Verification Status</p>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">Verified</Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TempleProfile;
