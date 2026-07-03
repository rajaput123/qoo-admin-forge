import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Phone, Mail, Globe, Edit, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BasicInfo = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Basic Information</h1>
            <p className="text-muted-foreground">Manage your temple's core details and public profile</p>
          </div>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Details
          </Button>
        </div>

        {/* Temple Profile Card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Temple Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Temple Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-foreground">Sri Venkateswara Temple</h2>
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                One of the most famous Hindu temples dedicated to Lord Venkateswara, a form of Vishnu.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Tirupati, Andhra Pradesh
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Est. 1509
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legal Details */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Legal Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Temple Legal Name</p>
                <p className="text-sm font-medium text-foreground">Sri Venkateswara Temple Trust</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trust Registration Number</p>
                <p className="text-sm font-medium text-foreground">TRN/2020/12345</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Legal Entity Type</p>
                <p className="text-sm font-medium text-foreground">Public Charitable Trust</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Primary Deity</p>
                <p className="text-sm font-medium text-foreground">Lord Venkateswara</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">info@temple.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <p className="text-sm font-medium text-primary">www.temple.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="glass-card rounded-2xl p-6 md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Address</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">
                  Temple Street, Tirumala Hills<br />
                  Tirupati, Chittoor District<br />
                  Andhra Pradesh - 517501, India
                </p>
                <Button variant="link" size="sm" className="px-0 mt-2 h-auto">
                  View on Google Maps
                </Button>
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="glass-card rounded-2xl p-6 md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Temple Timings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Morning Opening</p>
                <p className="text-sm font-medium text-foreground">5:00 AM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Morning Closing</p>
                <p className="text-sm font-medium text-foreground">12:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Evening Opening</p>
                <p className="text-sm font-medium text-foreground">4:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Evening Closing</p>
                <p className="text-sm font-medium text-foreground">9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;
