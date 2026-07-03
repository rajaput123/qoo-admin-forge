import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, FileText, BarChart3, Send, Bell, ShieldAlert, Video } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const volumeData = [
  { month: "Sep", messages: 120, announcements: 18, broadcasts: 45 },
  { month: "Oct", messages: 145, announcements: 22, broadcasts: 52 },
  { month: "Nov", messages: 198, announcements: 28, broadcasts: 48 },
  { month: "Dec", messages: 310, announcements: 35, broadcasts: 67 },
  { month: "Jan", messages: 180, announcements: 20, broadcasts: 55 },
  { month: "Feb", messages: 167, announcements: 15, broadcasts: 42 },
];

const channelBreakdown = [
  { name: "SMS", value: 35, color: "#3b82f6" },
  { name: "WhatsApp", value: 28, color: "#22c55e" },
  { name: "Email", value: 20, color: "#f59e0b" },
  { name: "Push", value: 12, color: "#8b5cf6" },
  { name: "Social", value: 5, color: "#ec4899" },
];

const logEntries = [
  { id: "LOG-001", type: "Message", action: "Sent", subject: "Maha Shivaratri Schedule", channel: "SMS + WhatsApp", timestamp: "2024-02-10 09:00:12", user: "System", status: "success" },
  { id: "LOG-002", type: "Announcement", action: "Published", subject: "Temple Timing Change", channel: "Website + App", timestamp: "2024-02-10 08:30:45", user: "Ramesh Kumar", status: "success" },
  { id: "LOG-003", type: "Broadcast", action: "Started", subject: "Morning Abhishekam Live", channel: "YouTube + App", timestamp: "2024-02-10 06:00:00", user: "Tech Team A", status: "success" },
  { id: "LOG-004", type: "Crisis", action: "Reported", subject: "Water Supply Disruption", channel: "Internal", timestamp: "2024-02-10 08:00:15", user: "Suresh P.", status: "escalated" },
  { id: "LOG-005", type: "Message", action: "Failed", subject: "Bulk SMS - Booking Confirmation", channel: "SMS", timestamp: "2024-02-09 22:15:33", user: "System", status: "failed" },
  { id: "LOG-006", type: "Media", action: "Approved", subject: "Press Release - Annual Festival", channel: "Conventional", timestamp: "2024-02-09 15:20:10", user: "Sri Ramesh", status: "success" },
  { id: "LOG-007", type: "Meeting", action: "Completed", subject: "Devotee Q&A Session", channel: "Zoom", timestamp: "2024-02-09 17:00:00", user: "Lakshmi R.", status: "success" },
  { id: "LOG-008", type: "Announcement", action: "Expired", subject: "Parking Lot Notice", channel: "Website + App", timestamp: "2024-02-09 00:00:00", user: "System", status: "archived" },
];

const typeIcons: Record<string, any> = {
  Message: Send,
  Announcement: Bell,
  Broadcast: Video,
  Crisis: ShieldAlert,
  Media: FileText,
  Meeting: FileText,
};

const statusColors: Record<string, string> = {
  success: "text-green-700 bg-green-50 border-green-200",
  failed: "text-red-700 bg-red-50 border-red-200",
  escalated: "text-amber-700 bg-amber-50 border-amber-200",
  archived: "text-muted-foreground bg-muted border-border",
};

const LogsReports = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Communications", value: "1,120", icon: Send },
          { label: "Delivery Success Rate", value: "96.4%", icon: BarChart3 },
          { label: "Crisis Responses", value: "5", icon: ShieldAlert },
          { label: "Broadcasts Archived", value: "67", icon: Video },
        ].map((kpi) => (
          <Card key={kpi.label}><CardContent className="p-4">
            <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Communication Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Logs exported")}><Download className="h-4 w-4 mr-1" />Export Logs</Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logEntries.filter(l => l.subject.toLowerCase().includes(search.toLowerCase())).map((log) => {
                  const Icon = typeIcons[log.type] || FileText;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.id}</TableCell>
                      <TableCell><div className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-muted-foreground" />{log.type}</div></TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{log.subject}</TableCell>
                      <TableCell className="text-xs">{log.channel}</TableCell>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell className="text-xs">{log.user}</TableCell>
                      <TableCell><Badge variant="outline" className={statusColors[log.status]}>{log.status}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Communication Volume (6 Months)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="messages" fill="hsl(var(--primary))" name="Messages" />
                    <Bar dataKey="announcements" fill="hsl(var(--muted-foreground))" name="Announcements" />
                    <Bar dataKey="broadcasts" fill="hsl(var(--accent-foreground))" name="Broadcasts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Channel Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={channelBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${entry.name} ${entry.value}%`}>
                      {channelBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsReports;
