import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, XCircle, CheckCircle2, ArrowLeft, Edit, Send, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type ApplicationState = "under_review" | "correction_needed" | "rejected" | "approved";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ApplicationState>("under_review");
  const [correctionNote, setCorrectionNote] = useState("");

  const applicationData = {
    referenceNumber: "REG-2026-048291",
    templeName: "Sri Venkateswara Temple",
    submittedDate: "2026-02-14",
    adminName: "Ramesh Kumar",
    mobile: "+91 98765 43210",
    email: "ramesh@temple.org",
  };

  const correctionFields = [
    { field: "Trust Registration Number", issue: "Number format appears invalid. Please re-enter with prefix.", current: "12345" },
    { field: "Temple Photos", issue: "Minimum 3 photos required. Only 1 uploaded.", current: "1 photo" },
  ];

  const rejectionReason = "The submitted registration does not meet the minimum verification requirements. The legal entity documentation could not be verified with the registrar. Please contact support for further assistance.";

  const renderUnderReview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
        <Clock className="h-10 w-10 text-amber-600 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Application Under Review</h1>
      <p className="text-muted-foreground mb-8">
        Your temple registration is being reviewed by our verification team. This usually takes 2-3 business days.
      </p>

      <Card className="text-left mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Reference</span>
            <span className="font-mono font-semibold text-foreground">{applicationData.referenceNumber}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Temple</span>
            <span className="text-sm font-medium">{applicationData.templeName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Submitted</span>
            <span className="text-sm">{applicationData.submittedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Clock className="h-3 w-3 mr-1" /> Under Review
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 text-left mb-6">
        <h3 className="text-sm font-medium text-foreground">Review Progress</h3>
        <Progress value={40} className="h-2" />
        <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground">
          <span className="text-primary font-medium">Submitted</span>
          <span className="text-primary font-medium">Document Check</span>
          <span>Verification</span>
          <span>Approval</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-left text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Need help?</p>
        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +91 1800-XXX-XXXX</div>
        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@templeadmin.com</div>
      </div>
    </motion.div>
  );

  const renderCorrectionNeeded = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Corrections Required</h1>
        <p className="text-muted-foreground">
          Please review and fix the following issues, then resubmit your application.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Issues to Fix</CardTitle>
            <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
              {correctionFields.length} items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {correctionFields.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.field}</span>
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
                  <Edit className="h-3 w-3" /> Edit
                </Button>
              </div>
              <p className="text-sm text-orange-700 bg-orange-50 rounded px-3 py-2">{item.issue}</p>
              <p className="text-xs text-muted-foreground">Current: {item.current}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-3 mb-6">
        <label className="text-sm font-medium text-foreground">Additional Notes (Optional)</label>
        <Textarea
          value={correctionNote}
          onChange={(e) => setCorrectionNote(e.target.value)}
          placeholder="Add any clarifications for the reviewer..."
          rows={3}
        />
      </div>

      <Button className="w-full gap-2" onClick={() => setStatus("under_review")}>
        <Send className="h-4 w-4" /> Resubmit Application
      </Button>
    </motion.div>
  );

  const renderRejected = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <XCircle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Application Rejected</h1>
      <p className="text-muted-foreground mb-6">
        Unfortunately, your registration application has been declined.
      </p>

      <Card className="text-left mb-6">
        <CardContent className="pt-6 space-y-4">
          <div>
            <span className="text-xs uppercase text-muted-foreground tracking-wide">Reference</span>
            <p className="font-mono font-semibold">{applicationData.referenceNumber}</p>
          </div>
          <Separator />
          <div>
            <span className="text-xs uppercase text-muted-foreground tracking-wide">Reason for Rejection</span>
            <p className="text-sm text-red-700 mt-1 bg-red-50 rounded-lg p-3">{rejectionReason}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={() => navigate("/temple-register")}>
          <FileText className="h-4 w-4" /> New Application
        </Button>
        <Button className="flex-1 gap-2">
          <Phone className="h-4 w-4" /> Contact Support
        </Button>
      </div>
    </motion.div>
  );

  const renderApproved = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Registration Approved! 🎉</h1>
      <p className="text-muted-foreground mb-8">
        Your temple has been verified and your admin account is now active.
      </p>

      <Card className="text-left mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Temple</span>
            <span className="text-sm font-medium">{applicationData.templeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Plan Assigned</span>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Starter — 100 Credits</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Admin</span>
            <span className="text-sm">{applicationData.adminName}</span>
          </div>
          <Separator />
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
            <p className="font-medium mb-1">Auto-created for you:</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Main Temple node</li>
              <li>✓ Main Shrine</li>
              <li>✓ Default Darshan Area</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full gap-2" size="lg" onClick={() => navigate("/temple-welcome")}>
        Get Started — Login Now
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-xl font-bold text-primary">Temple Admin</h1>
        </div>
      </header>

      <main className="flex justify-center px-6 py-16">
        {status === "under_review" && renderUnderReview()}
        {status === "correction_needed" && renderCorrectionNeeded()}
        {status === "rejected" && renderRejected()}
        {status === "approved" && renderApproved()}
      </main>

      {/* Demo state switcher */}
      <div className="fixed bottom-4 right-4 bg-card border rounded-lg shadow-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Demo: Switch State</p>
        <div className="flex gap-1.5">
          {(["under_review", "correction_needed", "rejected", "approved"] as ApplicationState[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-[10px] px-2 py-1 rounded ${status === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
