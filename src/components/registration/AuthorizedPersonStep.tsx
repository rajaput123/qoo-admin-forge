import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchableSelect from "@/components/SearchableSelect";
import { Check, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const roleOptions = [
  { value: "trustee", label: "Trustee" },
  { value: "chairman", label: "Chairman" },
  { value: "manager", label: "Temple Manager" },
  { value: "administrator", label: "Administrator" },
  { value: "executive-officer", label: "Executive Officer" },
  { value: "priest", label: "Chief Priest" },
];

interface AuthorizedPersonStepProps {
  formData: {
    personName: string;
    personRole: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onFormChange: (field: string, value: string) => void;
  otpSent: boolean;
  otpVerified: boolean;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
}

const AuthorizedPersonStep = ({ 
  formData, 
  onFormChange, 
  otpSent, 
  otpVerified, 
  onSendOtp, 
  onVerifyOtp 
}: AuthorizedPersonStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifyOtp();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Authorized Person</h2>
        <p className="text-sm text-muted-foreground">Primary temple administrator details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personName">Full Name *</Label>
          <Input 
            id="personName" 
            placeholder="Enter your full name"
            value={formData.personName}
            onChange={(e) => onFormChange('personName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Role / Designation *</Label>
          <SearchableSelect
            options={roleOptions}
            value={formData.personRole}
            onValueChange={(value) => onFormChange('personRole', value)}
            placeholder="Select Role"
          />
        </div>
        
        {/* Mobile with OTP */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mobile">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Mobile Number * <span className="text-xs text-muted-foreground">(Primary Login ID)</span>
            </div>
          </Label>
          <div className="flex gap-2">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                +91
              </span>
              <Input 
                id="mobile" 
                placeholder="98765 43210"
                className="rounded-l-none flex-1 w-40"
                value={formData.mobile}
                onChange={(e) => onFormChange('mobile', e.target.value)}
                disabled={otpVerified}
              />
            </div>
            {!otpVerified && (
              <Button 
                type="button" 
                variant={otpSent ? "outline" : "default"}
                onClick={onSendOtp}
                disabled={!formData.mobile || formData.mobile.length < 10}
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
            )}
            {otpVerified && (
              <div className="flex items-center gap-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>
        
        {/* OTP Input */}
        {otpSent && !otpVerified && (
          <div className="space-y-3 md:col-span-2">
            <Label>Enter OTP sent to your mobile</Label>
            <div className="flex items-center gap-4">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button 
                type="button" 
                onClick={handleVerify}
                disabled={otp.length < 6}
              >
                Verify
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Didn't receive? <button type="button" className="text-primary underline" onClick={onSendOtp}>Resend OTP</button>
            </p>
          </div>
        )}
        
        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </div>
          </Label>
          <Input 
            id="email" 
            type="email"
            placeholder="admin@temple.org"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
          />
        </div>
        
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Create Password *
            </div>
          </Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => onFormChange('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => onFormChange('confirmPassword', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Your mobile number will be your primary login ID. Make sure it's accurate as it cannot be changed after registration.
        </p>
      </div>
    </div>
  );
};

export default AuthorizedPersonStep;
