import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, ArrowUpRight, ArrowDownRight, AlertTriangle, Map, List, ChevronRight, Home, Building2, DoorOpen, MonitorSmartphone } from "lucide-react";
import { templeStructures } from "@/data/templeData";

// Mock hierarchical data structure
interface Zone {
  id: string;
  name: string;
  structureId: string;
  current: number;
  capacity: number;
  entryRate: number;
  exitRate: number;
  halls: Hall[];
}

interface Hall {
  id: string;
  name: string;
  zoneId: string;
  current: number;
  capacity: number;
  entryRate: number;
  exitRate: number;
  counters: Counter[];
}

interface Counter {
  id: string;
  name: string;
  hallId: string;
  current: number;
  capacity: number;
  queueLength: number;
}

const mockZones: Zone[] = [
  {
    id: "Z-001",
    name: "Main Sanctum Zone",
    structureId: "STR-001",
    current: 420,
    capacity: 500,
    entryRate: 45,
    exitRate: 38,
    halls: [
      {
        id: "H-001",
        name: "Main Darshan Hall",
        zoneId: "Z-001",
        current: 280,
        capacity: 350,
        entryRate: 30,
        exitRate: 25,
        counters: [
          { id: "C-001", name: "Entry Counter 1", hallId: "H-001", current: 15, capacity: 20, queueLength: 45 },
          { id: "C-002", name: "Entry Counter 2", hallId: "H-001", current: 18, capacity: 20, queueLength: 52 },
        ],
      },
      {
        id: "H-002",
        name: "Queue Corridor",
        zoneId: "Z-001",
        current: 140,
        capacity: 150,
        entryRate: 15,
        exitRate: 12,
        counters: [],
      },
    ],
  },
  {
    id: "Z-002",
    name: "Prasadam Zone",
    structureId: "STR-005",
    current: 480,
    capacity: 1200,
    entryRate: 60,
    exitRate: 55,
    halls: [
      {
        id: "H-003",
        name: "Annadanam Hall",
        zoneId: "Z-002",
        current: 350,
        capacity: 800,
        entryRate: 50,
        exitRate: 48,
        counters: [
          { id: "C-003", name: "Prasadam Counter 1", hallId: "H-003", current: 25, capacity: 30, queueLength: 120 },
          { id: "C-004", name: "Prasadam Counter 2", hallId: "H-003", current: 22, capacity: 30, queueLength: 95 },
        ],
      },
    ],
  },
  {
    id: "Z-003",
    name: "East Courtyard",
    structureId: "STR-001",
    current: 1200,
    capacity: 3000,
    entryRate: 120,
    exitRate: 110,
    halls: [
      {
        id: "H-004",
        name: "Cultural Hall",
        zoneId: "Z-003",
        current: 800,
        capacity: 2000,
        entryRate: 80,
        exitRate: 75,
        counters: [
          { id: "C-005", name: "Info Counter", hallId: "H-004", current: 8, capacity: 10, queueLength: 15 },
        ],
      },
    ],
  },
];

const CrowdDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "heatmap">("list");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["Z-001"]));
  const [liveData, setLiveData] = useState(mockZones);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(zone => ({
        ...zone,
        current: Math.max(0, zone.current + Math.floor(Math.random() * 10) - 5),
        entryRate: Math.max(0, zone.entryRate + Math.floor(Math.random() * 6) - 3),
        exitRate: Math.max(0, zone.exitRate + Math.floor(Math.random() * 6) - 3),
        halls: zone.halls.map(hall => ({
          ...hall,
          current: Math.max(0, hall.current + Math.floor(Math.random() * 8) - 4),
          entryRate: Math.max(0, hall.entryRate + Math.floor(Math.random() * 5) - 2),
          exitRate: Math.max(0, hall.exitRate + Math.floor(Math.random() * 5) - 2),
          counters: hall.counters.map(counter => ({
            ...counter,
            current: Math.max(0, counter.current + Math.floor(Math.random() * 3) - 1),
            queueLength: Math.max(0, counter.queueLength + Math.floor(Math.random() * 10) - 5),
          })),
        })),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (current: number, capacity: number) => {
    const pct = (current / capacity) * 100;
    if (pct >= 90) return { bg: "bg-red-500", text: "text-red-600", border: "border-red-300", badge: "destructive" };
    if (pct >= 70) return { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-300", badge: "secondary" };
    return { bg: "bg-green-500", text: "text-green-600", border: "border-green-300", badge: "outline" };
  };

  const totalCurrent = liveData.reduce((sum, z) => sum + z.current, 0);
  const totalCapacity = liveData.reduce((sum, z) => sum + z.capacity, 0);
  const totalEntryRate = liveData.reduce((sum, z) => sum + z.entryRate, 0);
  const totalExitRate = liveData.reduce((sum, z) => sum + z.exitRate, 0);
  const criticalZones = liveData.filter(z => (z.current / z.capacity) * 100 >= 90);

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStructureName = (structureId: string) => {
    return templeStructures.find(s => s.id === structureId)?.name || structureId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Crowd Dashboard</h1>
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <Activity className="h-3 w-3" /> LIVE
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" /> List View
          </Button>
          <Button
            variant={viewMode === "heatmap" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("heatmap")}
            className="gap-2"
          >
            <Map className="h-4 w-4" /> Heatmap
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-xs">Total</Badge>
            </div>
            <p className="text-2xl font-bold">{totalCurrent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">of {totalCapacity.toLocaleString()} capacity</p>
            <Progress value={(totalCurrent / totalCapacity) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
              <span className="text-xs text-green-600">Entry</span>
            </div>
            <p className="text-2xl font-bold">{totalEntryRate}/min</p>
            <p className="text-xs text-muted-foreground">People entering</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowDownRight className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-600">Exit</span>
            </div>
            <p className="text-2xl font-bold">{totalExitRate}/min</p>
            <p className="text-xs text-muted-foreground">People exiting</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <Badge variant="destructive" className="text-xs">{criticalZones.length}</Badge>
            </div>
            <p className="text-2xl font-bold">{criticalZones.length}</p>
            <p className="text-xs text-muted-foreground">Critical zones</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hierarchical View: Temple → Zones → Halls → Counters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Temple Level */}
              <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Sri Venkateswara Temple</p>
                      <p className="text-xs text-muted-foreground">{liveData.length} zones active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{totalCurrent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total occupancy</p>
                  </div>
                </div>
              </div>

              {/* Zones */}
              {liveData.map(zone => {
                const status = getStatusColor(zone.current, zone.capacity);
                const pct = (zone.current / zone.capacity) * 100;
                const isExpanded = expandedNodes.has(zone.id);

                return (
                  <div key={zone.id} className="space-y-2">
                    <div
                      className={`p-4 rounded-lg border-2 ${status.border} bg-background cursor-pointer hover:bg-muted/50 transition-colors`}
                      onClick={() => navigate(`/temple/crowd/zone/${zone.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(zone.id);
                            }}
                          >
                            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </Button>
                          <Building2 className={`h-5 w-5 ${status.text}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{zone.name}</p>
                              <Badge variant={status.badge as any} className="text-xs">
                                {Math.round(pct)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{getStructureName(zone.structureId)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-lg font-bold">{zone.current.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">of {zone.capacity.toLocaleString()}</p>
                          </div>
                          <div className="w-24">
                            <Progress value={pct} className="h-2" />
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-green-600">
                              <ArrowUpRight className="h-4 w-4 inline mr-1" />
                              {zone.entryRate}/min
                            </div>
                            <div className="text-blue-600">
                              <ArrowDownRight className="h-4 w-4 inline mr-1" />
                              {zone.exitRate}/min
                            </div>
                          </div>
                          {pct >= 90 && (
                            <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Halls (expanded) */}
                    {isExpanded && (
                      <div className="ml-8 space-y-2">
                        {zone.halls.map(hall => {
                          const hallStatus = getStatusColor(hall.current, hall.capacity);
                          const hallPct = (hall.current / hall.capacity) * 100;
                          const hallExpanded = expandedNodes.has(hall.id);

                          return (
                            <div key={hall.id} className="space-y-2">
                              <div
                                className={`p-3 rounded-lg border ${hallStatus.border} bg-muted/30 cursor-pointer hover:bg-muted/50`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(hall.id);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(hall.id);
                                      }}
                                    >
                                      <ChevronRight className={`h-3 w-3 transition-transform ${hallExpanded ? "rotate-90" : ""}`} />
                                    </Button>
                                    <DoorOpen className={`h-4 w-4 ${hallStatus.text}`} />
                                    <div>
                                      <p className="font-medium text-sm">{hall.name}</p>
                                      <Badge variant={hallStatus.badge as any} className="text-[10px]">
                                        {Math.round(hallPct)}%
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right text-sm">
                                      <p className="font-semibold">{hall.current}</p>
                                      <p className="text-xs text-muted-foreground">of {hall.capacity}</p>
                                    </div>
                                    <div className="w-20">
                                      <Progress value={hallPct} className="h-1.5" />
                                    </div>
                                    <div className="text-xs">
                                      <span className="text-green-600">↑{hall.entryRate}</span> / <span className="text-blue-600">↓{hall.exitRate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Counters (expanded) */}
                              {hallExpanded && hall.counters.length > 0 && (
                                <div className="ml-6 space-y-1">
                                  {hall.counters.map(counter => {
                                    const counterStatus = getStatusColor(counter.current, counter.capacity);
                                    const counterPct = (counter.current / counter.capacity) * 100;

                                    return (
                                      <div
                                        key={counter.id}
                                        className={`p-2 rounded border ${counterStatus.border} bg-background text-sm`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <MonitorSmartphone className={`h-3.5 w-3.5 ${counterStatus.text}`} />
                                            <span className="font-medium">{counter.name}</span>
                                          </div>
                                          <div className="flex items-center gap-3 text-xs">
                                            <span>{counter.current}/{counter.capacity}</span>
                                            <span className="text-muted-foreground">Queue: {counter.queueLength}</span>
                                            <Badge variant={counterStatus.badge as any} className="text-[10px]">
                                              {Math.round(counterPct)}%
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Heatmap Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {liveData.map(zone => {
                const status = getStatusColor(zone.current, zone.capacity);
                const pct = (zone.current / zone.capacity) * 100;

                return (
                  <div
                    key={zone.id}
                    className={`p-6 rounded-lg border-2 ${status.border} cursor-pointer hover:scale-105 transition-transform`}
                    style={{ backgroundColor: pct >= 90 ? "#fee2e2" : pct >= 70 ? "#fef3c7" : "#dcfce7" }}
                    onClick={() => navigate(`/temple/crowd/zone/${zone.id}`)}
                  >
                    <div className="text-center">
                      <p className="font-semibold mb-2">{zone.name}</p>
                      <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${status.bg} text-white`}>
                        <span className="text-2xl font-bold">{Math.round(pct)}%</span>
                      </div>
                      <p className="text-sm font-medium">{zone.current.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of {zone.capacity.toLocaleString()}</p>
                      {pct >= 90 && (
                        <Badge variant="destructive" className="mt-2">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Critical
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Alerts */}
      {criticalZones.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" /> Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalZones.map(zone => (
                <div key={zone.id} className="p-3 rounded-lg bg-white border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-700">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(zone.current / zone.capacity * 100).toFixed(1)}% capacity — Immediate action required
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => navigate(`/temple/crowd/zone/${zone.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrowdDashboard;
