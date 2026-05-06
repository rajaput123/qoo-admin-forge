import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, ArrowRight, AlertTriangle, Users2, Zap, LayoutDashboard } from "lucide-react";

interface Queue {
  id: string;
  name: string;
  type: "darshan" | "counter" | "entry";
  location: string;
  queueLength: number;
  estimatedWaitTime: number;
  throughput: number;
  hasFastLane: boolean;
  fastLaneLength?: number;
  suggestedVolunteers: number;
  status: "normal" | "busy" | "critical";
}

const queues: Queue[] = [
  {
    id: "Q-001",
    name: "General Darshan Line 1",
    type: "darshan",
    location: "Main Sanctum",
    queueLength: 145,
    estimatedWaitTime: 42,
    throughput: 3.5,
    hasFastLane: true,
    fastLaneLength: 25,
    suggestedVolunteers: 3,
    status: "busy",
  },
  {
    id: "Q-002",
    name: "General Darshan Line 2",
    type: "darshan",
    location: "Main Sanctum",
    queueLength: 128,
    estimatedWaitTime: 38,
    throughput: 3.4,
    hasFastLane: true,
    fastLaneLength: 18,
    suggestedVolunteers: 2,
    status: "normal",
  },
  {
    id: "Q-003",
    name: "Special Darshan Line",
    type: "darshan",
    location: "VIP Area",
    queueLength: 45,
    estimatedWaitTime: 15,
    throughput: 3.0,
    hasFastLane: false,
    suggestedVolunteers: 1,
    status: "normal",
  },
  {
    id: "Q-004",
    name: "Donation Counter 1",
    type: "counter",
    location: "Main Hall",
    queueLength: 32,
    estimatedWaitTime: 8,
    throughput: 4.0,
    hasFastLane: false,
    suggestedVolunteers: 1,
    status: "normal",
  },
  {
    id: "Q-005",
    name: "Prasadam Counter 1",
    type: "counter",
    location: "Annadanam Hall",
    queueLength: 120,
    estimatedWaitTime: 30,
    throughput: 4.0,
    hasFastLane: false,
    suggestedVolunteers: 4,
    status: "critical",
  },
  {
    id: "Q-006",
    name: "Entry Gate 1",
    type: "entry",
    location: "Main Entrance",
    queueLength: 85,
    estimatedWaitTime: 12,
    throughput: 7.0,
    hasFastLane: false,
    suggestedVolunteers: 2,
    status: "busy",
  },
  {
    id: "Q-007",
    name: "Entry Gate 2",
    type: "entry",
    location: "East Entrance",
    queueLength: 52,
    estimatedWaitTime: 7,
    throughput: 7.5,
    hasFastLane: false,
    suggestedVolunteers: 1,
    status: "normal",
  },
];

const QueueManagement = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"all" | "darshan" | "counter" | "entry">("all");

  const filteredQueues = selectedType === "all" 
    ? queues 
    : queues.filter(q => q.type === selectedType);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "busy":
        return <Badge variant="secondary">Busy</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "darshan":
        return "🕉️";
      case "counter":
        return "🏪";
      case "entry":
        return "🚪";
      default:
        return "📍";
    }
  };

  const totalQueues = queues.length;
  const totalQueueLength = queues.reduce((sum, q) => sum + q.queueLength, 0);
  const criticalQueues = queues.filter(q => q.status === "critical").length;
  const avgWaitTime = Math.round(queues.reduce((sum, q) => sum + q.estimatedWaitTime, 0) / queues.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Queue Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor queues at darshan lines, counters, and entry gates</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalQueues}</p>
            <p className="text-xs text-muted-foreground">Active queues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users2 className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold">{totalQueueLength}</p>
            <p className="text-xs text-muted-foreground">Total in queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{avgWaitTime} min</p>
            <p className="text-xs text-muted-foreground">Avg wait time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold">{criticalQueues}</p>
            <p className="text-xs text-muted-foreground">Critical queues</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("all")}
        >
          All Queues
        </Button>
        <Button
          variant={selectedType === "darshan" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("darshan")}
        >
          Darshan Lines
        </Button>
        <Button
          variant={selectedType === "counter" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("counter")}
        >
          Counters
        </Button>
        <Button
          variant={selectedType === "entry" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("entry")}
        >
          Entry Gates
        </Button>
      </div>

      {/* Queues Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Queue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Queue Length</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Throughput</TableHead>
                <TableHead>Fast/Slow Lane</TableHead>
                <TableHead>Volunteers</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueues.map(queue => (
                <TableRow key={queue.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(queue.type)}</span>
                      <div>
                        <p className="font-medium">{queue.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{queue.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{queue.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{queue.queueLength}</span>
                      <span className="text-xs text-muted-foreground">people</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold">{queue.estimatedWaitTime} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-green-600" />
                      <span className="text-sm">{queue.throughput}/min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {queue.hasFastLane ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Fast: {queue.fastLaneLength}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          Slow: {queue.queueLength - (queue.fastLaneLength || 0)}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Single lane</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{queue.suggestedVolunteers}</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(queue.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Critical Queues Alert */}
      {criticalQueues > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" /> Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {queues
                .filter(q => q.status === "critical")
                .map(queue => (
                  <div key={queue.id} className="p-3 rounded-lg bg-white border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-700">{queue.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {queue.queueLength} people waiting • {queue.estimatedWaitTime} min wait time
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Deploy {queue.suggestedVolunteers} volunteers
                        </Badge>
                        <Button size="sm" variant="destructive">
                          Deploy
                        </Button>
                      </div>
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

export default QueueManagement;
