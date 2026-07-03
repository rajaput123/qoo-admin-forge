import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  QrCode, 
  Smartphone, 
  Users, 
  Eye, 
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  DoorOpen,
  Radio
} from "lucide-react";

const PracticalOperations = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practical Crowd Data Collection & Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-world methods: How to actually collect data and manage crowds</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      {/* Key Insight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" /> The Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            <strong>You're right:</strong> We cannot predict who will come next. Crowd management must work with 
            <strong> real-time data collection</strong> and <strong>actual observations</strong>, not just predictions.
          </p>
          <div className="p-3 rounded bg-background border">
            <p className="text-xs font-medium mb-2">Solution Approach:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <strong>Count people as they enter/exit</strong> (not predict)</li>
              <li>• <strong>Use staff observations</strong> for real-time updates</li>
              <li>• <strong>Combine multiple data sources</strong> for accuracy</li>
              <li>• <strong>Predictions are supplementary</strong> - only for planning, not real-time control</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Main Methods */}
      <Tabs defaultValue="counting" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent">
          <TabsTrigger value="counting" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700">
            Counting Methods
          </TabsTrigger>
          <TabsTrigger value="staff" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700">
            Staff Operations
          </TabsTrigger>
          <TabsTrigger value="combining" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700">
            Combining Data
          </TabsTrigger>
          <TabsTrigger value="operations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700">
            Daily Operations
          </TabsTrigger>
        </TabsList>

        {/* Counting Methods */}
        <TabsContent value="counting" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Count People in Real-Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Method 1: Entry/Exit Counting */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Method 1: Entry/Exit Ticket/QR Scanning</h3>
                  <Badge variant="default">Most Accurate</Badge>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">How It Works:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                        <div>
                          <p className="font-medium">Devotee arrives at gate</p>
                          <p className="text-xs text-muted-foreground">Has ticket/QR code (from booking or walk-in purchase)</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-3" />
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                        <div>
                          <p className="font-medium">Security/Staff scans QR code</p>
                          <p className="text-xs text-muted-foreground">Using mobile app or scanner device at entry gate</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-3" />
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                        <div>
                          <p className="font-medium">System automatically adds +1 to zone occupancy</p>
                          <p className="text-xs text-muted-foreground">Based on ticket type, assigns to correct zone (Main Sanctum, VIP, etc.)</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-3" />
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                        <div>
                          <p className="font-medium">Dashboard updates instantly</p>
                          <p className="text-xs text-muted-foreground">Control room sees real-time count increase</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded bg-blue-50 border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">Exit Process (Same but Reverse):</p>
                    <p className="text-xs text-blue-700">
                      When devotee leaves, scan exit QR → System subtracts -1 from zone occupancy → Dashboard updates
                    </p>
                  </div>
                  <div className="p-3 rounded bg-amber-50 border border-amber-200">
                    <p className="text-xs font-medium text-amber-900 mb-1">Practical Note:</p>
                    <p className="text-xs text-amber-700">
                      Even if some people don't scan (walk-ins without tickets), staff can manually count and update. 
                      This method gives <strong>accurate baseline</strong> for ticket-holders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Method 2: Manual Counting */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Method 2: Visual Counting by Staff</h3>
                  <Badge variant="secondary">Backup Method</Badge>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">How It Works:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span><strong>Security staff at each zone</strong> visually counts people</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span><strong>Every 5-10 minutes</strong>, staff updates count via mobile app</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span><strong>Mobile app</strong> has simple interface: "Current count: [number]"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span><strong>System uses latest manual count</strong> to update dashboard</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-blue-50 border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">Counting Techniques:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Count in sections (left side, right side, center)</li>
                      <li>• Use clicker/counter device for accuracy</li>
                      <li>• Count people entering vs. leaving to get net change</li>
                      <li>• Update when count changes significantly (±10 people)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Method 3: Density Estimation */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Method 3: Density Level Estimation</h3>
                  <Badge variant="outline">Quick Method</Badge>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">How It Works:</p>
                    <p className="text-sm mb-3">
                      Staff doesn't count exact numbers, but estimates <strong>density level</strong>:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded border text-center">
                        <div className="w-full h-8 bg-green-200 rounded mb-1"></div>
                        <p className="text-xs font-medium">Low (0-50%)</p>
                        <p className="text-[10px] text-muted-foreground">Plenty of space</p>
                      </div>
                      <div className="p-2 rounded border text-center">
                        <div className="w-full h-8 bg-amber-200 rounded mb-1"></div>
                        <p className="text-xs font-medium">Medium (50-80%)</p>
                        <p className="text-[10px] text-muted-foreground">Getting crowded</p>
                      </div>
                      <div className="p-2 rounded border text-center">
                        <div className="w-full h-8 bg-red-200 rounded mb-1"></div>
                        <p className="text-xs font-medium">High (80-100%)</p>
                        <p className="text-[10px] text-muted-foreground">Very crowded</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      System converts density level to estimated count: Low = 30% capacity, Medium = 65% capacity, High = 90% capacity
                    </p>
                  </div>
                  <div className="p-3 rounded bg-purple-50 border border-purple-200">
                    <p className="text-xs font-medium text-purple-900 mb-1">When to Use:</p>
                    <p className="text-xs text-purple-700">
                      Quick updates when exact count is not critical. Useful for <strong>rapid status updates</strong> 
                      during peak hours when counting is difficult.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Operations */}
        <TabsContent value="staff" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Staff Operational Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mobile App Interface */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Mobile App for Field Staff</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">Simple Interface:</p>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 rounded border bg-muted/30">
                        <p className="font-medium text-xs">Zone: Main Sanctum</p>
                        <input type="number" placeholder="420" className="w-full mt-1 px-2 py-1 border rounded text-lg font-bold" />
                        <p className="text-xs text-muted-foreground mt-1">Current count</p>
                      </div>
                      <div className="p-2 rounded border bg-muted/30">
                        <p className="font-medium text-xs">Queue Length</p>
                        <input type="number" placeholder="145" className="w-full mt-1 px-2 py-1 border rounded" />
                        <p className="text-xs text-muted-foreground mt-1">People waiting</p>
                      </div>
                      <Button className="w-full">Update Count</Button>
                    </div>
                  </div>
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">Quick Actions:</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Low Density
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Medium Density
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        High Density
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <DoorOpen className="h-4 w-4" />
                        Gate Status: Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Roles */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Staff Roles & Responsibilities
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-background border">
                    <p className="font-medium text-sm mb-2">Entry Gate Staff</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Scan tickets/QR codes</li>
                      <li>• Count walk-ins manually</li>
                      <li>• Update entry count every 5 min</li>
                      <li>• Report gate status</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-background border">
                    <p className="font-medium text-sm mb-2">Zone Security</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Visual count of zone occupancy</li>
                      <li>• Monitor queue lengths</li>
                      <li>• Update density level</li>
                      <li>• Report blockages/issues</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded bg-background border">
                    <p className="font-medium text-sm mb-2">Control Room Operator</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Monitor dashboard</li>
                      <li>• Make control decisions</li>
                      <li>• Override counts if needed</li>
                      <li>• Trigger alerts/announcements</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Update Frequency */}
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
                  <Clock className="h-5 w-5" /> Update Frequency Guidelines
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-white">
                    <span>Normal Hours</span>
                    <Badge variant="outline">Every 10-15 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white">
                    <span>Peak Hours</span>
                    <Badge variant="secondary">Every 5 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white">
                    <span>Critical Situation</span>
                    <Badge variant="destructive">Every 2-3 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white">
                    <span>After Major Action</span>
                    <Badge variant="default">Immediately</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Combining Data */}
        <TabsContent value="combining" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Combine Multiple Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-3">Data Priority & Merging Logic</h3>
                <div className="space-y-4">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">Example Scenario:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div className="flex-1">
                          <p className="font-medium">QR Scans show: 420 people</p>
                          <p className="text-xs text-muted-foreground">(Only ticket-holders counted)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div className="flex-1">
                          <p className="font-medium">Staff visual count: 450 people</p>
                          <p className="text-xs text-muted-foreground">(Includes walk-ins without tickets)</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-4" />
                      <div className="p-2 rounded bg-green-50 border border-green-200">
                        <p className="text-sm font-medium text-green-900">System Uses: 450 people</p>
                        <p className="text-xs text-green-700">
                          Manual count takes priority because it includes all people (ticket holders + walk-ins)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">Priority Rules:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-[10px]">1</Badge>
                        <span><strong>Emergency/Manual Override</strong> - Highest priority (admin override)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">2</Badge>
                        <span><strong>Staff Manual Count</strong> - Overrides automatic (includes all people)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">3</Badge>
                        <span><strong>QR/Ticket Scans</strong> - Baseline count (ticket-holders only)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">4</Badge>
                        <span><strong>Predictions</strong> - Only for planning, not real-time control</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-amber-50 border border-amber-200">
                    <p className="text-xs font-medium text-amber-900 mb-1">Key Insight:</p>
                    <p className="text-xs text-amber-700">
                      <strong>Real-time control uses actual counts, not predictions.</strong> Predictions help plan ahead 
                      (e.g., "We expect 500 people in 30 minutes"), but actual crowd management decisions are based on 
                      <strong> what's happening right now</strong> (e.g., "We currently have 450 people").
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Operations */}
        <TabsContent value="operations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Operational Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Morning Setup */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Morning Setup (6:00 AM)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Control room operator opens dashboard</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>All zones start at 0 count (temple opens)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Staff at entry gates ready with scanners/mobile apps</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Check booking system for expected attendance today</span>
                  </div>
                </div>
              </div>

              {/* During Operations */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" /> During Operations (6:00 AM - 10:00 PM)
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-background border">
                    <p className="text-sm font-medium mb-2">Continuous Process:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>People arrive → Entry gate staff scans ticket OR counts manually</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Count updates in mobile app → Syncs to dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Zone security monitors crowd → Updates density/queue length</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>Control room sees real-time data → Makes decisions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>People leave → Exit scan OR manual count update</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded bg-blue-50 border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-1">Decision Making:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• If occupancy &gt; 90% → Close entry gate or redirect crowd</li>
                      <li>• If queue &gt; 200 people → Deploy more volunteers</li>
                      <li>• If entry rate &gt; exit rate → Monitor closely for congestion</li>
                      <li>• If prediction shows surge coming → Prepare in advance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* End of Day */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" /> End of Day (10:00 PM)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>All zones should reach 0 count (everyone has left)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>System saves daily statistics for historical analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Review peak hours, bottlenecks, and issues</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Takeaways */}
      <Card className="border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-green-900">
            <CheckCircle2 className="h-5 w-5" /> Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Count, don't predict:</strong> Real-time crowd management uses actual counts from entry/exit scans and staff observations</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Multiple methods:</strong> Combine QR scans (accurate for ticket-holders) + manual counts (includes walk-ins) for complete picture</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Staff are essential:</strong> Even with automation, human observation and manual updates ensure accuracy</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Predictions are supplementary:</strong> Use for planning (e.g., "prepare for 500 people"), but control decisions use real-time data</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Simple is better:</strong> Start with manual counting + mobile app updates. Add automation (QR scans) later as Phase 2</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticalOperations;
