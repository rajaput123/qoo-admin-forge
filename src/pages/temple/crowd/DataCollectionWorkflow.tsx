import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Smartphone, 
  Brain, 
  GitBranch, 
  Settings, 
  LayoutDashboard, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap,
  Camera,
  QrCode,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Radio,
  Shield
} from "lucide-react";

const DataCollectionWorkflow = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState<"1" | "2" | "3">("1");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Collection & Operational Workflow</h1>
          <p className="text-sm text-muted-foreground mt-1">Hybrid approach: Automatic, Semi-automatic, and Predictive intelligence</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      {/* Overview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Automatic Sources</span>
              </div>
              <p className="text-sm text-muted-foreground">Entry/exit scans, counter transactions, optional CCTV/sensors</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Semi-Automatic</span>
              </div>
              <p className="text-sm text-muted-foreground">Mobile/tablet inputs from volunteers and security staff</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">Predictive Intelligence</span>
              </div>
              <p className="text-sm text-muted-foreground">Booking forecasts, event schedules, historical patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="automatic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent">
          <TabsTrigger value="automatic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent">
            Automatic
          </TabsTrigger>
          <TabsTrigger value="semi-auto" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent">
            Semi-Auto
          </TabsTrigger>
          <TabsTrigger value="predictive" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent">
            Predictive
          </TabsTrigger>
          <TabsTrigger value="flow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent">
            Data Flow
          </TabsTrigger>
        </TabsList>

        {/* Automatic Data Sources */}
        <TabsContent value="automatic" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" /> Automatic Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Entry/Exit Scans */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Entry/Exit Ticket/QR Scans</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Entry scan → <strong>+1</strong> to zone occupancy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5" />
                      <span>Exit scan → <strong>-1</strong> from zone occupancy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Real-time updates to live dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Automatic zone assignment based on ticket type</span>
                    </li>
                  </ul>
                </div>

                {/* Counter Transactions */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Counter Transactions</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Darshan ticket sales → Expected zone load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Seva bookings → Predicted attendance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Prasadam coupons → Hall capacity planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span>Contributes to predicted crowd surge</span>
                    </li>
                  </ul>
                </div>

                {/* CCTV/Sensors (Optional) */}
                <div className="p-4 rounded-lg border bg-muted/30 border-dashed">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">CCTV Analytics / Sensors</h3>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>AI-powered people counting (if available)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Thermal sensors for crowd density</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>Motion detection for queue monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Can override manual counts when active</span>
                    </li>
                  </ul>
                </div>

                {/* Live Updates Display */}
                <div className="p-4 rounded-lg border bg-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Live Dashboard Updates</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Main Sanctum</span>
                        <span className="font-semibold">420 → 425</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">+5 from entry scans (last 2 min)</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Queue Corridor A</span>
                        <span className="font-semibold">720 → 715</span>
                      </div>
                      <Progress value={89} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">-5 from exit scans (last 2 min)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Semi-Automatic Field Inputs */}
        <TabsContent value="semi-auto" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-600" /> Semi-Automatic Field Inputs
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Mobile/tablet interface for volunteers and security staff</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Mobile Interface Features */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Mobile/Tablet Interface
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Crowd Density Level</span>
                        <Badge variant="outline">Quick Update</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">Low</Button>
                        <Button size="sm" variant="outline" className="flex-1">Medium</Button>
                        <Button size="sm" variant="secondary" className="flex-1">High</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Adjusts zone occupancy estimate</p>
                    </div>

                    <div className="p-3 rounded border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Queue Length</span>
                        <Badge variant="outline">Manual Count</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="145" className="flex-1 px-2 py-1 border rounded text-sm" />
                        <span className="text-xs text-muted-foreground">people</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Updates waiting time estimates</p>
                    </div>

                    <div className="p-3 rounded border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Gate Status</span>
                        <Badge variant="outline">Control</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="flex-1">Open</Button>
                        <Button size="sm" variant="outline" className="flex-1">Closed</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Controls entry flow</p>
                    </div>
                  </div>
                </div>

                {/* Override Capabilities */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Override & Adjustments
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span><strong>Override automatic counts</strong> when sensors are inaccurate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span><strong>Adjust zone occupancy</strong> based on visual assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span><strong>Report temporary blockages</strong> or diversions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span><strong>Emergency updates</strong> take priority over automatic data</span>
                    </li>
                  </ul>

                  <div className="mt-4 p-3 rounded border bg-amber-50 border-amber-200">
                    <p className="text-xs font-medium text-amber-900 mb-1">Override Example:</p>
                    <p className="text-xs text-amber-700">
                      Automatic count: 420 | Staff override: 450 (visual count) | System uses: 450
                    </p>
                  </div>
                </div>
              </div>

              {/* Field Staff Workflow */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                    <Users className="h-4 w-4" /> Field Staff Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                      <span>Staff observes crowd</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                      <span>Opens mobile app</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                      <span>Updates density/queue</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">4</div>
                      <span>Dashboard updates instantly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Input Sources */}
        <TabsContent value="predictive" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" /> Predictive Input Sources
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">System intelligence for forecasting crowd surges</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Booking Counts */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Booking Counts</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Upcoming time slot bookings → Expected attendance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Darshan slot reservations → Zone load prediction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Seva bookings → Hall capacity forecast</span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 rounded bg-background text-xs">
                    <p className="font-medium mb-1">Example:</p>
                    <p>Next 30 min: 45 bookings → Predicted +45 people in Main Sanctum</p>
                  </div>
                </div>

                {/* Event Schedules */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold">Event Schedules</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Festival days → Surge multiplier applied</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Special ceremonies → Zone-specific predictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>VIP visits → Security zone adjustments</span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 rounded bg-background text-xs">
                    <p className="font-medium mb-1">Example:</p>
                    <p>Festival day: +150% base prediction</p>
                  </div>
                </div>

                {/* Historical Patterns */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Historical Patterns</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Same day last week/month → Baseline prediction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Peak hour patterns → Time-based adjustments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Seasonal trends → Long-term forecasting</span>
                    </li>
                  </ul>
                </div>

                {/* Time-of-Day Trends */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Time-of-Day Trends</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Morning aarti (6-8 AM) → Peak prediction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Evening darshan (6-8 PM) → High traffic forecast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Lunch hours (12-2 PM) → Prasadam hall surge</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Prediction Display */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-purple-900">
                    <AlertTriangle className="h-4 w-4" /> Predicted Congestion Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 rounded border bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Main Sanctum - 15:30</span>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Predicted: 92% occupancy (460/500) - Peak hour + Event surge
                      </p>
                    </div>
                    <div className="p-3 rounded border bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Queue Corridor A - 15:00</span>
                        <Badge variant="secondary">High</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Predicted: 88% occupancy (704/800) - Booking overflow
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Flow Design */}
        <TabsContent value="flow" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" /> Data Flow Design
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">How all inputs merge into Live Crowd Status Engine</p>
            </CardHeader>
            <CardContent>
              {/* Data Flow Diagram */}
              <div className="space-y-6">
                {/* Input Sources */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-sm">Booking Predictions</p>
                    <p className="text-xs text-muted-foreground mt-1">Expected attendance</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 text-center">
                    <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-sm">Entry Scan Confirmations</p>
                    <p className="text-xs text-muted-foreground mt-1">Real-time counts</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-purple-50 border-purple-200 text-center">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-sm">Volunteer Updates</p>
                    <p className="text-xs text-muted-foreground mt-1">Manual adjustments</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-amber-50 border-amber-200 text-center border-dashed">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <p className="font-semibold text-sm">AI/Sensor Inputs</p>
                    <p className="text-xs text-muted-foreground mt-1">Optional</p>
                  </div>
                </div>

                {/* Merge Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-8 w-8 text-primary rotate-90 mb-2" />
                    <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-semibold text-primary">Data Fusion Engine</p>
                    </div>
                    <ArrowRight className="h-8 w-8 text-primary rotate-90 mt-2" />
                  </div>
                </div>

                {/* Output */}
                <div className="p-6 rounded-lg border-2 border-primary bg-primary/5 text-center">
                  <LayoutDashboard className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="text-lg font-bold mb-2">Live Crowd Status Engine</h3>
                  <p className="text-sm text-muted-foreground mb-4">Single source of truth for all crowd data</p>
                  
                  <div className="grid md:grid-cols-4 gap-3 mt-4">
                    <div className="p-3 rounded bg-background border">
                      <p className="text-xs text-muted-foreground">Current Occupancy</p>
                      <p className="text-lg font-bold">420/500</p>
                      <p className="text-xs text-green-600">84%</p>
                    </div>
                    <div className="p-3 rounded bg-background border">
                      <p className="text-xs text-muted-foreground">Queue Length</p>
                      <p className="text-lg font-bold">145</p>
                      <p className="text-xs text-amber-600">~42 min wait</p>
                    </div>
                    <div className="p-3 rounded bg-background border">
                      <p className="text-xs text-muted-foreground">Entry Rate</p>
                      <p className="text-lg font-bold">45/min</p>
                      <p className="text-xs text-blue-600">↑ Increasing</p>
                    </div>
                    <div className="p-3 rounded bg-background border">
                      <p className="text-xs text-muted-foreground">Predicted (30min)</p>
                      <p className="text-lg font-bold">485</p>
                      <p className="text-xs text-red-600">97% - Critical</p>
                    </div>
                  </div>
                </div>

                {/* Priority Rules */}
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Data Priority Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                        <span><strong>Emergency/Manual Overrides</strong> - Highest priority</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                        <span><strong>Volunteer Field Updates</strong> - Override automatic counts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                        <span><strong>Entry/Exit Scans</strong> - Real-time automatic updates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                        <span><strong>Predictive Intelligence</strong> - Used for forecasting</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Control Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" /> Admin Control Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Manual Adjustments
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Manually adjust zone counts when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Override system estimates with admin authority</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Bulk updates for multiple zones</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Radio className="h-4 w-4" /> Gate & Flow Control
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Close/open entry gates digitally</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Trigger automated announcements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Set alert rules and automation triggers</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Volunteer Management
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Assign volunteers to crowded areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Send notifications to field staff</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Track volunteer deployment status</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Alert & Automation
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Configure alert thresholds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Auto-close gates at capacity limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Emergency protocol triggers</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Dashboard Output */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-primary" /> Real-Time Dashboard Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3">Current Status Display</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Occupancy vs Capacity</span>
                    <span className="font-semibold">420/500 (84%)</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Queue Length</span>
                    <span className="font-semibold">145 people</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Entry vs Exit Rate</span>
                    <span className="font-semibold">45/min ↑ | 38/min ↓</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Net: +7/min</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <h3 className="font-semibold mb-3">Alert & Automation Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-amber-50">
                  <span className="text-sm">High Occupancy Alert</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-green-50">
                  <span className="text-sm">Auto Gate Control</span>
                  <Badge variant="outline">Standby</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-50">
                  <span className="text-sm">Predicted Surge (30min)</span>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Phases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Implementation Phase Strategy
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Gradual automation adoption - Start simple, scale up</p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPhase} onValueChange={(v) => setSelectedPhase(v as "1" | "2" | "3")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1">Phase 1</TabsTrigger>
              <TabsTrigger value="2">Phase 2</TabsTrigger>
              <TabsTrigger value="3">Phase 3</TabsTrigger>
            </TabsList>

            <TabsContent value="1" className="mt-4">
              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-lg">Phase 1: Manual Updates + Booking-Based Prediction</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Features:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-1" />
                        <span>Mobile/tablet interface for volunteer updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-1" />
                        <span>Booking system integration for predictions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-1" />
                        <span>Basic dashboard with manual counts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-1" />
                        <span>Historical pattern analysis</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Cost:</p>
                    <p className="text-sm">Low - Uses existing booking system, mobile apps only</p>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Timeline:</p>
                    <p className="text-sm">2-4 weeks - Quick deployment</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="2" className="mt-4">
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Phase 2: Entry Scan Automation + Alert Rules</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Features:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 mt-1" />
                        <span>QR code/ticket scanning at entry/exit gates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 mt-1" />
                        <span>Automatic occupancy updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 mt-1" />
                        <span>Alert rules and automation triggers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-blue-600 mt-1" />
                        <span>Counter transaction integration</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Cost:</p>
                    <p className="text-sm">Medium - QR scanners, integration development</p>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Timeline:</p>
                    <p className="text-sm">4-8 weeks - Hardware installation + integration</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="3" className="mt-4">
              <div className="p-4 rounded-lg border bg-purple-50 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">Phase 3: CCTV/Sensor AI Integration</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Features:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-purple-600 mt-1" />
                        <span>AI-powered people counting from CCTV</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-purple-600 mt-1" />
                        <span>Thermal sensors for density detection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-purple-600 mt-1" />
                        <span>Motion detection for queue monitoring</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-purple-600 mt-1" />
                        <span>Advanced predictive analytics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Cost:</p>
                    <p className="text-sm">High - AI software, sensors, infrastructure</p>
                  </div>
                  <div className="p-3 rounded bg-white border">
                    <p className="font-medium text-sm mb-2">Timeline:</p>
                    <p className="text-sm">8-12 weeks - Advanced setup and calibration</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCollectionWorkflow;
