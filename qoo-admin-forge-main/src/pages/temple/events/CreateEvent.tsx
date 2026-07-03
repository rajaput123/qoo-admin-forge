import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { eventTypes, structures } from "@/data/eventData";
import { eventActions } from "@/modules/events/hooks";
import type { TempleEvent } from "@/data/eventData";
import { cn } from "@/lib/utils";

// Step components
import BasicInfoStep from "@/components/events/steps/BasicInfoStep";
import RegistrationStep from "@/components/events/steps/RegistrationStep";
import SevaLinkingStep from "@/components/events/steps/SevaLinkingStep";
import DonationsStep from "@/components/events/steps/DonationsStep";
import ManpowerStep from "@/components/events/steps/ManpowerStep";
import ExpensesStep from "@/components/events/steps/ExpensesStep";

const STEPS = [
  { id: "basic", label: "Basic Info", number: 1 },
  { id: "registration", label: "Registration", number: 2 },
  { id: "sevas", label: "Seva Linking", number: 3 },
  { id: "donations", label: "Donations", number: 4 },
  { id: "manpower", label: "Manpower", number: 5 },
  { id: "expenses", label: "Expenses", number: 6 },
] as const;

export interface BasicInfoData {
  name: string;
  type: TempleEvent["type"];
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibility: "Public" | "Private" | "Internal";
  status: "Draft" | "Published" | "Completed" | "Cancelled";
  description: string;
  bannerFile: File | null;
  bannerPreview: string;
  imageFiles: File[];
  imagePreviews: string[];
  videoFiles: File[];
  videoPreviews: string[];
}

export interface RegistrationData {
  enabled: boolean;
  registrationStart: string;
  registrationEnd: string;
  maxCapacity: number;
  allowWaitlist: boolean;
  registrationFee: number;
  approvalMode: "auto" | "manual";
  qrCheckin: boolean;
  requiredFields: {
    name: boolean;
    phone: boolean;
    email: boolean;
    address: boolean;
  };
}

export type EventDonationEightyGType = "80G" | "Non-80G";

export interface DonationsData {
  enabled: boolean;
  accountName: string;
  eightyGType: EventDonationEightyGType | "";
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: "",
    type: "Festival",
    location: "",
    startDate: new Date().toISOString().slice(0, 10),
    startTime: "06:00",
    endDate: new Date().toISOString().slice(0, 10),
    endTime: "21:00",
    visibility: "Public",
    status: "Draft",
    description: "",
    bannerFile: null,
    bannerPreview: "",
    imageFiles: [],
    imagePreviews: [],
    videoFiles: [],
    videoPreviews: [],
  });

  // Step 2: Registration
  const [registration, setRegistration] = useState<RegistrationData>({
    enabled: false,
    registrationStart: "",
    registrationEnd: "",
    maxCapacity: 1000,
    allowWaitlist: false,
    registrationFee: 0,
    approvalMode: "auto",
    qrCheckin: false,
    requiredFields: { name: true, phone: true, email: false, address: false },
  });

  // Step 4: Donations
  const [donations, setDonations] = useState<DonationsData>({
    enabled: false,
    accountName: "",
    eightyGType: "",
  });

  // Validation
  const stepErrors = useMemo(() => {
    const errors: Record<number, string[]> = {};
    // Step 0: Basic Info
    const e0: string[] = [];
    if (!basicInfo.name.trim()) e0.push("Event title is required");
    if (!basicInfo.location.trim()) e0.push("Location is required");
    if (basicInfo.endDate < basicInfo.startDate) e0.push("End date cannot be before start date");
    if (e0.length) errors[0] = e0;
    return errors;
  }, [basicInfo]);

  const getStepStatus = (index: number): "current" | "completed" | "error" | "upcoming" => {
    if (index === currentStep) return "current";
    if (stepErrors[index]?.length && visitedSteps.has(index)) return "error";
    if (visitedSteps.has(index) && !stepErrors[index]?.length) return "completed";
    return "upcoming";
  };

  const goToStep = (index: number) => {
    setVisitedSteps((prev) => new Set([...prev, index]));
    setCurrentStep(index);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  const handleCreate = (publish: boolean) => {
    if (!basicInfo.name.trim()) {
      toast.error("Event name is required");
      goToStep(0);
      return;
    }
    if (!basicInfo.location.trim()) {
      toast.error("Location is required");
      goToStep(0);
      return;
    }

    const event = eventActions.createEvent({
      name: basicInfo.name.trim(),
      type: basicInfo.type,
      templeId: "TMP-001",
      structureId: basicInfo.location.trim(),
      structureName: basicInfo.location.trim(),
      startDate: basicInfo.startDate,
      endDate: basicInfo.endDate,
      estimatedBudget: 0,
      actualSpend: 0,
      estimatedFootfall: registration.maxCapacity.toString(),
      description: basicInfo.description.trim(),
      status: "Published",
      organizer: "Temple Admin",
      capacity: registration.maxCapacity,
      linkedSeva: [],
      bannerPreview: basicInfo.bannerPreview || undefined,
      imagePreviews: basicInfo.imagePreviews.length > 0 ? basicInfo.imagePreviews : undefined,
      videoPreviews: basicInfo.videoPreviews.length > 0 ? basicInfo.videoPreviews : undefined,
    });

    toast.success(`Event ${publish ? "published" : "saved as draft"}!`);
    navigate(`/temple/events/${event.id}`);
  };

  const completionPercent = useMemo(() => {
    let filled = 0;
    let total = 7;
    if (basicInfo.name && basicInfo.location) filled++;
    if (visitedSteps.has(1)) filled++;
    if (visitedSteps.has(2)) filled++;
    if (visitedSteps.has(3)) filled++;
    if (visitedSteps.has(4)) filled++;
    if (visitedSteps.has(5)) filled++;
    if (visitedSteps.has(6)) filled++;
    return Math.round((filled / total) * 100);
  }, [basicInfo, visitedSteps]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/temple/events")} className="rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create New Event</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Fill all sections to create a comprehensive event</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleCreate(false)}>Save as Draft</Button>
          <Button onClick={() => handleCreate(true)} className="bg-primary hover:bg-primary/90">Publish</Button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(index)}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 shrink-0",
                      status === "current" && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                      status === "completed" && "bg-green-600 text-white",
                      status === "error" && "bg-destructive text-destructive-foreground",
                      status === "upcoming" && "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : status === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-colors hidden lg:block",
                      status === "current" && "text-foreground",
                      status === "completed" && "text-green-700",
                      status === "error" && "text-destructive",
                      status === "upcoming" && "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-[2px] mx-3",
                      (getStepStatus(index) === "completed") ? "bg-green-400" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {currentStep === 0 && (
              <BasicInfoStep data={basicInfo} onChange={setBasicInfo} errors={stepErrors[0]} />
            )}
            {currentStep === 1 && (
              <RegistrationStep data={registration} onChange={setRegistration} />
            )}
            {currentStep === 2 && <SevaLinkingStep />}
            {currentStep === 3 && (
              <DonationsStep data={donations} onChange={setDonations} />
            )}
            {currentStep === 4 && <ManpowerStep />}
            {currentStep === 5 && <ExpensesStep />}
          </motion.div>
        </AnimatePresence>

        {/* Step Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length} · {completionPercent}% complete
          </span>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>Next Step</Button>
          ) : (
            <Button onClick={() => handleCreate(true)} className="bg-primary hover:bg-primary/90">
              Publish Event
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateEvent;
