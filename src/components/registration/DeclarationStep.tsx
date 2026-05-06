import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, Shield, AlertCircle } from "lucide-react";

interface DeclarationStepProps {
  formData: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    authorizedConfirmed: boolean;
    accuracyConfirmed: boolean;
  };
  onFormChange: (field: string, value: boolean) => void;
}

const DeclarationStep = ({ formData, onFormChange }: DeclarationStepProps) => {
  const allAccepted = formData.termsAccepted && formData.privacyAccepted &&
    formData.authorizedConfirmed && formData.accuracyConfirmed;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Declaration & Consent</h2>
        <p className="text-sm text-muted-foreground">Please review and accept the following</p>
      </div>

      <div className="space-y-4">
        {/* Terms of Service */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3 mb-3">
            <FileCheck className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Terms of Service</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                By registering, you agree to our Terms of Service, which govern your use of the platform.
                This includes acceptable use policies, service availability, and your responsibilities as a temple administrator.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-8">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => onFormChange('termsAccepted', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
              I accept the <span className="text-primary underline cursor-pointer">Terms of Service</span> *
            </Label>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3 mb-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We collect and process your data in accordance with our Privacy Policy.
                Your temple and personal information will be used to provide our services and will not be shared with third parties without consent.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-8">
            <Checkbox
              id="privacy"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => onFormChange('privacyAccepted', checked as boolean)}
            />
            <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
              I have read and agree to the <span className="text-primary underline cursor-pointer">Privacy Policy</span> *
            </Label>
          </div>
        </div>

        {/* Authorization Confirmation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="authorized"
              className="mt-1"
              checked={formData.authorizedConfirmed}
              onCheckedChange={(checked) => onFormChange('authorizedConfirmed', checked as boolean)}
            />
            <Label htmlFor="authorized" className="text-sm font-normal cursor-pointer leading-relaxed">
              I confirm that I am <strong>authorized to register</strong> this temple and act on behalf of the trust/organization. *
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="accuracy"
              className="mt-1"
              checked={formData.accuracyConfirmed}
              onCheckedChange={(checked) => onFormChange('accuracyConfirmed', checked as boolean)}
            />
            <Label htmlFor="accuracy" className="text-sm font-normal cursor-pointer leading-relaxed">
              I confirm that all information provided in this registration is <strong>accurate and complete</strong> to the best of my knowledge. *
            </Label>
          </div>
        </div>
      </div>

      {/* Submission Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">What happens next?</h4>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
              <li>Your registration will be submitted for review</li>
              <li>Our team will verify your temple and trust details</li>
              <li>You will receive SMS and email notification upon approval</li>
              <li>Once approved, you can login using your mobile number</li>
            </ul>
          </div>
        </div>
      </div>

      {!allAccepted && (
        <p className="text-sm text-muted-foreground text-center">
          Please accept all required consents to submit your registration
        </p>
      )}
    </div>
  );
};

export default DeclarationStep;
