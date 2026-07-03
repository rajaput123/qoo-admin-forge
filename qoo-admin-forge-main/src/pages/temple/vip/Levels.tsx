import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Crown, Plus, Settings2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type VipLevel = {
  id: string;
  name: string;
  priority: number;
  bookingOverride: boolean;
  reservedSeats: number;
  fastTrack: boolean;
  discountPercent: number;
  specialEntry: boolean;
  active: boolean;
  activeVipCount: number;
};

const mockLevels: VipLevel[] = [
  {
    id: "L1",
    name: "Platinum",
    priority: 1,
    bookingOverride: true,
    reservedSeats: 10,
    fastTrack: true,
    discountPercent: 20,
    specialEntry: true,
    active: true,
    activeVipCount: 8,
  },
  {
    id: "L2",
    name: "Gold",
    priority: 2,
    bookingOverride: true,
    reservedSeats: 6,
    fastTrack: true,
    discountPercent: 10,
    specialEntry: true,
    active: true,
    activeVipCount: 10,
  },
  {
    id: "L3",
    name: "Silver",
    priority: 3,
    bookingOverride: false,
    reservedSeats: 2,
    fastTrack: false,
    discountPercent: 5,
    specialEntry: false,
    active: true,
    activeVipCount: 6,
  },
];

const Levels = () => {
  const [levels] = useState<VipLevel[]>(mockLevels);
  const [showCreate, setShowCreate] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<VipLevel | null>(null);

  const handleCreate = () => {
    toast.success("VIP Level created (demo)");
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (pendingDelete && pendingDelete.activeVipCount > 0) {
      toast.error("Cannot delete level with active VIPs assigned");
      setPendingDelete(null);
      return;
    }
    toast.success("VIP Level deleted (demo)");
    setPendingDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" />
              VIP Levels & Privileges
            </h1>
            <p className="text-muted-foreground">
              Define VIP levels and their privilege matrix. Changes impact all VIP devotees of that
              level.
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Level
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {levels.map((level) => (
            <Card key={level.id} className="group hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-base">{level.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Priority {level.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Booking Override</span>
                  <Badge variant={level.bookingOverride ? "default" : "secondary"} className="text-[10px]">
                    {level.bookingOverride ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reserved Seating</span>
                  <span className="font-medium">{level.reservedSeats} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Darshan Fast Track</span>
                  <Badge variant={level.fastTrack ? "default" : "secondary"} className="text-[10px]">
                    {level.fastTrack ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium">{level.discountPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Special Entry</span>
                  <Badge variant={level.specialEntry ? "default" : "secondary"} className="text-[10px]">
                    {level.specialEntry ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Active VIPs</span>
                  <span className="font-semibold">{level.activeVipCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabular View */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Level Configuration Table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Privileges</TableHead>
                    <TableHead className="text-center">Active VIPs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level) => (
                    <TableRow key={level.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium">{level.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{level.priority}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {level.bookingOverride && <Badge variant="outline">Override</Badge>}
                          {level.fastTrack && <Badge variant="outline">Fast Track</Badge>}
                          {level.discountPercent > 0 && (
                            <Badge variant="outline">{level.discountPercent}% Discount</Badge>
                          )}
                          {level.specialEntry && <Badge variant="outline">Special Entry</Badge>}
                          {level.reservedSeats > 0 && (
                            <Badge variant="outline">
                              {level.reservedSeats} Reserved Seats
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{level.activeVipCount}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setPendingDelete(level)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Level Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg bg-background">
            <DialogHeader>
              <DialogTitle>Create VIP Level</DialogTitle>
              <DialogDescription>
                Define a new VIP level. Changes will update the Privilege Engine configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Level Name</Label>
                  <Input placeholder="e.g., Platinum" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Priority Rank</Label>
                  <Input type="number" min={1} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Reserved Seating Count</Label>
                  <Input type="number" min={0} className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Discount %</Label>
                  <Input type="number" min={0} max={100} className="h-9" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="text-[11px]">Booking Override</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="text-[11px]">Darshan Fast Track</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="text-[11px]">Special Entry</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Updating privilege definitions should trigger audit logs and confirmation in
                production.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="gap-1" onClick={handleCreate}>
                  <Plus className="h-3 w-3" />
                  Save Level
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
          <DialogContent className="max-w-sm bg-background">
            <DialogHeader>
              <DialogTitle>Delete VIP Level?</DialogTitle>
              <DialogDescription>
                {pendingDelete?.activeVipCount
                  ? "This level has active VIP devotees assigned. Deletion should be blocked until all are moved."
                  : "This will remove the level definition. Existing VIP assignments should be migrated first."}
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border bg-muted/40 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 text-warning" />
              <span>
                In a real system, deletion should be prevented when{" "}
                <strong>activeVipCount &gt; 0</strong> and the action must be fully logged in the
                audit trail.
              </span>
            </div>
            <DialogFooter className="mt-2 flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
                Delete Level
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Levels;

