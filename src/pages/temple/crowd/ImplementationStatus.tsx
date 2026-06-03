import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, AlertTriangle, LayoutDashboard, Zap, Smartphone, Brain, Camera } from "lucide-react";

const ImplementationStatus = () => {
  const navigate = useNavigate();

  // Current Implementation Analysis
  const currentStatus = {
    phase: "Phase 0 - Prototype/Demo",
    description: "UI Framework Ready - Awaiting Phase 1 Integration",
    progress: 15, // 15% - UI complete, but no real data integration
  };

  const phase1Requirements = [
    { feature: "Mobile/Tablet Interface for Volunteers", status: "ui-only", description: "UI designed but no mobile app built" },
    { feature: "Booking System Integration", status: "not-started", description: "No connection to booking module" },
    { feature: "Manual Count Updates", status: "ui-only", description: "Forms exist but data not persisted" },
    { feature: "Historical Pattern Analysis", status: "not-started", description: "No historical data collection" },
  ];

  const phase2Requirements = [
    { feature: "QR/Ticket Scanning at Gates", status: "not-started", description: "No scanning hardware/software integration" },
    { feature: "Automatic Occupancy Updates", status: "simulated", description: "Mock data only - no real automation" },
    { feature: "Alert Rules Automation", status: "ui-only", description: "Rules can be created but don't trigger actions" },
    { feature: "Counter Transaction Integration", status: "not-started", description: "No connection to counter systems" },
  ];

  const phase3Requirements = [
    { feature: "CCTV AI People Counting", status: "not-started", description: "No CCTV integration" },
    { feature: "Thermal Sensors", status: "not-started", description: "No sensor hardware" },
    { feature: "Motion Detection", status: "not-started", description: "No motion sensors" },
    { feature: "Advanced Predictive Analytics", status: "simulated", description: "Charts show mock predictions only" },
  ];

  const whatIsImplemented = [
    { item: "Complete UI/UX for all screens", status: "complete" },
    { item: "Dashboard with hierarchical view", status: "complete" },
    { item: "Heatmap visualization", status: "complete" },
    { item: "Queue management interface", status: "complete" },
    { item: "Alert rule creation UI", status: "complete" },
    { item: "Control panel interface", status: "complete" },
    { item: "Prediction charts (mock data)", status: "complete" },
    { item: "Navigation between all screens", status: "complete" },
  ];

  const whatIsMissing = [
    { item: "Real-time data from QR/ticket scans", status: "missing" },
    { item: "Booking system integration", status: "missing" },
    { item: "Mobile app for volunteers", status: "missing" },
    { item: "Actual gate control hardware", status: "missing" },
    { item: "Alert automation triggers", status: "missing" },
    { item: "Counter transaction feeds", status: "missing" },
    { item: "CCTV/sensor integration", status: "missing" },
    { item: "Historical data storage", status: "missing" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Complete</Badge>;
      case "ui-only":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> UI Only</Badge>;
      case "simulated":
        return <Badge variant="outline" className="gap-1"><AlertTriangle className="h-3 w-3" /> Simulated</Badge>;
      case "not-started":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Not Started</Badge>;
      case "missing":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Missing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Current Implementation Status</h1>
          <p className="text-sm text-muted-foreground mt-1">Analysis of what's implemented vs. what's needed</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      {/* Current Phase Status */}
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-5 w-5" /> Current Implementation Phase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{currentStatus.phase}</h3>
                <Badge variant="secondary" className="text-sm">{currentStatus.progress}% Complete</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{currentStatus.description}</p>
              <Progress value={currentStatus.progress} className="h-3" />
            </div>
            <div className="p-3 rounded bg-white border border-amber-200">
              <p className="text-sm font-medium text-amber-900 mb-1">Status Summary:</p>
              <p className="text-xs text-amber-700">
                The system currently has a <strong>complete UI framework</strong> with <strong>simulated/mock data</strong>. 
                All screens are functional for demonstration, but <strong>no real data integration</strong> exists yet. 
                The system is ready for <strong>Phase 1 implementation</strong> to connect real data sources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Implemented */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> What's Currently Implemented
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {whatIsImplemented.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-green-50 border-green-200 flex items-center justify-between">
                <span className="text-sm">{item.item}</span>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What's Missing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" /> What's Missing (For Phase 1)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {whatIsMissing.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-red-50 border-red-200 flex items-center justify-between">
                <span className="text-sm">{item.item}</span>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase 1 Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-600" /> Phase 1 Requirements Status
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Manual Updates + Booking-Based Prediction</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phase1Requirements.map((req, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{req.feature}</span>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-muted-foreground">{req.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-1">Phase 1 Readiness:</p>
            <p className="text-xs text-blue-700">
              <strong>0%</strong> - UI is ready, but no backend integration exists. Need to connect booking system, 
              build mobile app, and implement data persistence.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2 Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" /> Phase 2 Requirements Status
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Entry Scan Automation + Alert Rules</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phase2Requirements.map((req, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{req.feature}</span>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-muted-foreground">{req.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
            <p className="text-xs font-medium text-amber-900 mb-1">Phase 2 Readiness:</p>
            <p className="text-xs text-amber-700">
              <strong>0%</strong> - Requires Phase 1 completion first. Need QR scanners, hardware integration, 
              and actual automation triggers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase 3 Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-4 w-4 text-purple-600" /> Phase 3 Requirements Status
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">CCTV/Sensor AI Integration</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phase3Requirements.map((req, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{req.feature}</span>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-muted-foreground">{req.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded bg-purple-50 border border-purple-200">
            <p className="text-xs font-medium text-purple-900 mb-1">Phase 3 Readiness:</p>
            <p className="text-xs text-purple-700">
              <strong>0%</strong> - Requires Phase 2 completion first. Needs expensive hardware (CCTV AI, sensors) 
              and advanced infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" /> Next Steps to Reach Phase 1
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                <span className="font-semibold">Connect Booking System</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Integrate with existing booking module to get upcoming slot reservations and predicted attendance
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                <span className="font-semibold">Build Mobile App for Volunteers</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Create React Native or mobile web app for field staff to update crowd density and queue lengths
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                <span className="font-semibold">Implement Data Persistence</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Set up database to store manual updates, historical patterns, and enable data analysis
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">4</div>
                <span className="font-semibold">Replace Mock Data with Real API Calls</span>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                Connect dashboard to backend APIs to fetch real-time crowd data instead of simulated updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImplementationStatus;
