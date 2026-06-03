import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Map, Filter, AlertTriangle, Building2, DoorOpen, MonitorSmartphone, Home } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "temple" | "zone" | "hall" | "counter";
  x: number;
  y: number;
  current: number;
  capacity: number;
  connections: string[];
  parentId?: string;
}

interface Connection {
  from: string;
  to: string;
}

const templeNodes: Node[] = [
  // Temple (root)
  { id: "TEMPLE", name: "Sri Venkateswara Temple", type: "temple", x: 400, y: 50, current: 0, capacity: 0, connections: ["Z-001", "Z-002", "Z-003", "Z-004"] },
  
  // Zones
  { id: "Z-001", name: "Main Sanctum", type: "zone", x: 200, y: 150, current: 420, capacity: 500, connections: ["H-001", "H-002"], parentId: "TEMPLE" },
  { id: "Z-002", name: "Queue Corridor A", type: "zone", x: 400, y: 150, current: 720, capacity: 800, connections: ["H-003"], parentId: "TEMPLE" },
  { id: "Z-003", name: "Prasadam Hall", type: "zone", x: 600, y: 150, current: 480, capacity: 1200, connections: ["H-004", "C-003", "C-004"], parentId: "TEMPLE" },
  { id: "Z-004", name: "East Courtyard", type: "zone", x: 300, y: 300, current: 1200, capacity: 3000, connections: ["H-005"], parentId: "TEMPLE" },
  
  // Halls
  { id: "H-001", name: "Main Darshan Hall", type: "hall", x: 150, y: 250, current: 280, capacity: 350, connections: ["C-001", "C-002"], parentId: "Z-001" },
  { id: "H-002", name: "Queue Corridor", type: "hall", x: 250, y: 250, current: 140, capacity: 150, connections: [], parentId: "Z-001" },
  { id: "H-003", name: "Waiting Hall", type: "hall", x: 400, y: 250, current: 350, capacity: 500, connections: [], parentId: "Z-002" },
  { id: "H-004", name: "Annadanam Hall", type: "hall", x: 600, y: 250, current: 350, capacity: 800, connections: ["C-003", "C-004"], parentId: "Z-003" },
  { id: "H-005", name: "Cultural Hall", type: "hall", x: 300, y: 400, current: 800, capacity: 2000, connections: ["C-005"], parentId: "Z-004" },
  
  // Counters
  { id: "C-001", name: "Entry Counter 1", type: "counter", x: 100, y: 350, current: 15, capacity: 20, connections: [], parentId: "H-001" },
  { id: "C-002", name: "Entry Counter 2", type: "counter", x: 200, y: 350, current: 18, capacity: 20, connections: [], parentId: "H-001" },
  { id: "C-003", name: "Prasadam Counter 1", type: "counter", x: 550, y: 350, current: 25, capacity: 30, connections: [], parentId: "H-004" },
  { id: "C-004", name: "Prasadam Counter 2", type: "counter", x: 650, y: 350, current: 22, capacity: 30, connections: [], parentId: "H-004" },
  { id: "C-005", name: "Info Counter", type: "counter", x: 300, y: 500, current: 8, capacity: 10, connections: [], parentId: "H-005" },
];

const connections: Connection[] = [
  { from: "TEMPLE", to: "Z-001" },
  { from: "TEMPLE", to: "Z-002" },
  { from: "TEMPLE", to: "Z-003" },
  { from: "TEMPLE", to: "Z-004" },
  { from: "Z-001", to: "H-001" },
  { from: "Z-001", to: "H-002" },
  { from: "Z-002", to: "H-003" },
  { from: "Z-003", to: "H-004" },
  { from: "Z-004", to: "H-005" },
  { from: "H-001", to: "C-001" },
  { from: "H-001", to: "C-002" },
  { from: "H-004", to: "C-003" },
  { from: "H-004", to: "C-004" },
  { from: "H-005", to: "C-005" },
];

const HeatmapView = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedHall, setSelectedHall] = useState<string>("all");
  const [selectedEventArea, setSelectedEventArea] = useState<string>("all");
  const [timeWindow, setTimeWindow] = useState<string>("realtime");
  const [nodes, setNodes] = useState<Node[]>(templeNodes);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.type === "temple") return node;
        return {
          ...node,
          current: Math.max(0, node.current + Math.floor(Math.random() * 10) - 5),
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (current: number, capacity: number) => {
    if (capacity === 0) return { fill: "#6b7280", stroke: "#4b5563", text: "N/A" };
    const pct = (current / capacity) * 100;
    if (pct >= 90) return { fill: "#ef4444", stroke: "#dc2626", text: "Critical" };
    if (pct >= 70) return { fill: "#f59e0b", stroke: "#d97706", text: "Moderate" };
    return { fill: "#22c55e", stroke: "#16a34a", text: "Safe" };
  };

  const getNodeSize = (type: string) => {
    switch (type) {
      case "temple": return 60;
      case "zone": return 50;
      case "hall": return 40;
      case "counter": return 30;
      default: return 35;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "temple": return Home;
      case "zone": return Building2;
      case "hall": return DoorOpen;
      case "counter": return MonitorSmartphone;
      default: return Home;
    }
  };

  const filteredNodes = nodes.filter(node => {
    if (selectedZone !== "all" && node.type === "zone" && node.id !== selectedZone) return false;
    if (selectedHall !== "all" && node.type === "hall" && node.id !== selectedHall) return false;
    if (selectedEventArea !== "all") {
      if (selectedEventArea === "main" && !node.id.includes("Z-001") && !node.id.includes("Z-002")) return false;
      if (selectedEventArea === "courtyard" && !node.id.includes("Z-004")) return false;
      if (selectedEventArea === "hall" && node.type !== "hall") return false;
    }
    return true;
  });

  const filteredConnections = connections.filter(conn => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    return filteredNodes.includes(fromNode!) && filteredNodes.includes(toNode!);
  });

  const handleNodeClick = (node: Node) => {
    if (node.type === "zone") {
      navigate(`/temple/crowd/zone/${node.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Heatmap Visualization</h1>
          <p className="text-sm text-muted-foreground mt-1">Graphical node-based temple structure with density colors</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">By Zone</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="Z-001">Main Sanctum</SelectItem>
                  <SelectItem value="Z-002">Queue Corridor A</SelectItem>
                  <SelectItem value="Z-003">Prasadam Hall</SelectItem>
                  <SelectItem value="Z-004">East Courtyard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">By Hall</Label>
              <Select value={selectedHall} onValueChange={setSelectedHall}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  <SelectItem value="H-001">Main Darshan Hall</SelectItem>
                  <SelectItem value="H-002">Queue Corridor</SelectItem>
                  <SelectItem value="H-003">Waiting Hall</SelectItem>
                  <SelectItem value="H-004">Annadanam Hall</SelectItem>
                  <SelectItem value="H-005">Cultural Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">By Event Area</Label>
              <Select value={selectedEventArea} onValueChange={setSelectedEventArea}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="main">Main Temple</SelectItem>
                  <SelectItem value="courtyard">Courtyard</SelectItem>
                  <SelectItem value="hall">Event Halls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Time Window</Label>
              <Select value={timeWindow} onValueChange={setTimeWindow}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="1h">Last 1 Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
        <span className="text-sm font-medium">Density Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500"></div>
          <span className="text-xs">Safe (0-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500"></div>
          <span className="text-xs">Moderate (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500"></div>
          <span className="text-xs">Critical (90%+)</span>
        </div>
        <div className="ml-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Temple</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            <span>Hall</span>
          </div>
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4" />
            <span>Counter</span>
          </div>
        </div>
      </div>

      {/* Node-Based Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="h-4 w-4" /> Temple Structure Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[700px] border-2 border-muted-foreground/20 rounded-lg bg-gradient-to-br from-muted/10 to-muted/30 overflow-auto">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Connections/Lines */}
              {filteredConnections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={`${conn.from}-${conn.to}-${idx}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity={0.4}
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const color = getDensityColor(node.current, node.capacity);
                const size = getNodeSize(node.type);
                const pct = node.capacity > 0 ? (node.current / node.capacity) * 100 : 0;
                const isHovered = hoveredNode === node.id;
                const Icon = getNodeIcon(node.type);

                return (
                  <g key={node.id}>
                    {/* Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={size}
                      fill={color.fill}
                      stroke={color.stroke}
                      strokeWidth={isHovered ? 4 : 2}
                      opacity={isHovered ? 1 : 0.9}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{
                        filter: isHovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : "none",
                      }}
                    />

                    {/* Node Label Background */}
                    <rect
                      x={node.x - 60}
                      y={node.y + size + 5}
                      width="120"
                      height="50"
                      fill="rgba(0,0,0,0.7)"
                      rx="4"
                      className="pointer-events-none"
                    />

                    {/* Node Name */}
                    <text
                      x={node.x}
                      y={node.y + size + 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {node.name.length > 15 ? node.name.substring(0, 15) + "..." : node.name}
                    </text>

                    {/* Node Stats */}
                    {node.capacity > 0 && (
                      <>
                        <text
                          x={node.x}
                          y={node.y + size + 35}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          className="pointer-events-none"
                        >
                          {Math.round(pct)}% • {node.current}/{node.capacity}
                        </text>
                      </>
                    )}

                    {/* Icon in center */}
                    <foreignObject
                      x={node.x - 12}
                      y={node.y - 12}
                      width="24"
                      height="24"
                      className="pointer-events-none"
                    >
                      <div className="flex items-center justify-center w-full h-full text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </foreignObject>

                    {/* Critical Alert Indicator */}
                    {pct >= 90 && (
                      <circle
                        cx={node.x + size - 5}
                        cy={node.y - size + 5}
                        r="8"
                        fill="#ef4444"
                        className="animate-pulse"
                      >
                        <title>Critical Alert</title>
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Critical Areas List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" /> Critical Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredNodes
              .filter(node => node.capacity > 0 && (node.current / node.capacity) * 100 >= 90)
              .map(node => {
                const pct = (node.current / node.capacity) * 100;
                const Icon = getNodeIcon(node.type);
                return (
                  <div
                    key={node.id}
                    className="p-3 rounded-lg border border-red-300 bg-red-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-700">{node.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {node.current.toLocaleString()} / {node.capacity.toLocaleString()} ({pct.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    {node.type === "zone" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => navigate(`/temple/crowd/zone/${node.id}`)}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                );
              })}
            {filteredNodes.filter(node => node.capacity > 0 && (node.current / node.capacity) * 100 >= 90).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No critical areas at this time</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapView;
