import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Search, PackageSearch, Eye } from "lucide-react";
import { eventResources, resourceConflicts, getAllActiveConflicts, getResourceAllocation } from "@/data/eventData";
import { useEvents } from "@/modules/events/hooks";
import SelectWithAddNew from "@/components/SelectWithAddNew";

const statusColors: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    Partial: "bg-amber-100 text-amber-700",
    Conflict: "bg-red-100 text-red-700",
    Pending: "bg-blue-100 text-blue-700",
};

const severityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-blue-100 text-blue-700",
};

const EventResources = () => {
    const navigate = useNavigate();
    const events = useEvents();
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("");
    const [resourceTypeFilter, setResourceTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredResources = eventResources.filter(r => {
        if (search && !r.resourceName.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
        if (eventFilter && eventFilter !== "All Events" && r.eventId !== eventFilter) return false;
        if (resourceTypeFilter && resourceTypeFilter !== "All Types" && r.resourceType !== resourceTypeFilter) return false;
        if (statusFilter && statusFilter !== "All Status" && r.status !== statusFilter) return false;
        return true;
    });

    const activeConflicts = getAllActiveConflicts();
    const totalResources = eventResources.length;
    const availableResources = eventResources.filter(r => r.status === "Available").length;
    const conflictedResources = eventResources.filter(r => r.status === "Conflict").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Event Resources</h1>
                    <p className="text-sm text-muted-foreground mt-1">Resource allocation & conflict management</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Resources</p>
                                <p className="text-2xl font-bold mt-1">{totalResources}</p>
                                <p className="text-xs text-muted-foreground mt-1">All events</p>
                            </div>
                            <PackageSearch className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Available</p>
                                <p className="text-2xl font-bold mt-1 text-green-600">{availableResources}</p>
                                <p className="text-xs text-muted-foreground mt-1">Ready to use</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Conflicts</p>
                                <p className="text-2xl font-bold mt-1 text-red-600">{conflictedResources}</p>
                                <p className="text-xs text-muted-foreground mt-1">Needs resolution</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Active Conflicts</p>
                                <p className="text-2xl font-bold mt-1 text-amber-600">{activeConflicts.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">Unresolved</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Conflicts Alert */}
            {activeConflicts.length > 0 && (
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-medium text-red-900 mb-2">Active Resource Conflicts</h3>
                            <div className="space-y-2">
                                {activeConflicts.map(conflict => (
                                    <div key={conflict.id} className="text-sm text-red-800 bg-white rounded p-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{conflict.conflictDescription}</span>
                                            <Badge className={`${severityColors[conflict.severity]} border-0 text-xs`}>{conflict.severity}</Badge>
                                        </div>
                                        <p className="text-xs text-red-600 mt-1">
                                            Events: {events.find(e => e.id === conflict.eventId1)?.name} ↔ {events.find(e => e.id === conflict.eventId2)?.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resource Allocation Table */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Resource Allocation</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search resources..." className="pl-9 h-9 w-56" value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <SelectWithAddNew
                                value={eventFilter}
                                onValueChange={setEventFilter}
                                placeholder="All Events"
                                options={["All Events", ...events.map(e => e.id)]}
                                onAddNew={() => {}}
                                className="h-9 w-40"
                            />
                            <SelectWithAddNew
                                value={resourceTypeFilter}
                                onValueChange={setResourceTypeFilter}
                                placeholder="All Types"
                                options={["All Types", "Material", "Personnel", "Infrastructure"]}
                                onAddNew={() => {}}
                                className="h-9 w-40"
                            />
                            <SelectWithAddNew
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                                placeholder="All Status"
                                options={["All Status", "Available", "Partial", "Conflict", "Pending"]}
                                onAddNew={() => {}}
                                className="h-9 w-40"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Resource Name</TableHead>
                                <TableHead className="text-right">Required</TableHead>
                                <TableHead className="text-right">Allocated</TableHead>
                                <TableHead className="text-right">Fulfillment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                        No resources found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResources.map(resource => {
                                    const event = events.find(e => e.id === resource.eventId);
                                    const fulfillmentPercent = resource.requiredQuantity > 0
                                        ? (resource.allocatedQuantity / resource.requiredQuantity) * 100
                                        : 0;

                                    return (
                                        <TableRow
                                            key={resource.id}
                                            className={`cursor-pointer ${resource.status === "Conflict" ? "bg-red-50" : ""}`}
                                            onClick={() => navigate(`/temple/events/${resource.eventId}`)}
                                        >
                                            <TableCell className="font-medium text-sm max-w-[150px] truncate" title={event?.name}>
                                                {event?.name || "Unknown"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">{resource.resourceType}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{resource.resourceName}</TableCell>
                                            <TableCell className="text-right text-sm">
                                                {resource.requiredQuantity} {resource.unit}
                                            </TableCell>
                                            <TableCell className="text-right text-sm">
                                                {resource.allocatedQuantity} {resource.unit}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`text-sm font-medium ${fulfillmentPercent >= 100 ? "text-green-600" :
                                                        fulfillmentPercent >= 50 ? "text-amber-600" :
                                                            "text-red-600"
                                                    }`}>
                                                    {fulfillmentPercent.toFixed(0)}%
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${statusColors[resource.status]} border-0 text-xs`}>
                                                    {resource.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={resource.notes}>
                                                {resource.notes || "-"}
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/temple/events/${resource.eventId}`)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventResources;
