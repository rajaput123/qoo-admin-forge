import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, AlertCircle, ShieldCheck } from "lucide-react";

interface Props {
  fyLabel: string;        // "2024-25"
  fyStartYear: number;    // 2024
  receiptsIssued: number; // total receipts in FY
  registerCount: number;  // total donations recorded in FY
}

type Status = "green" | "amber" | "red";
type DeadlineStatus = "Completed" | "Pending" | "Upcoming";

function StatusDot({ status }: { status: Status }) {
  const cls =
    status === "green" ? "bg-green-500" :
    status === "amber" ? "bg-amber-500" :
    "bg-red-500";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} aria-hidden />;
}

function deadlineStatusBadge(s: DeadlineStatus) {
  if (s === "Completed") return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
  if (s === "Pending") return <Badge className="bg-red-100 text-red-700"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
  return <Badge className="bg-blue-100 text-blue-700"><Clock className="h-3 w-3 mr-1" />Upcoming</Badge>;
}

function computeDeadlineStatus(due: Date, completed: boolean): DeadlineStatus {
  const now = new Date();
  if (completed) return "Completed";
  if (now > due) return "Pending";
  return "Upcoming";
}

const ComplianceTracker = ({
  fyLabel,
  fyStartYear,
  receiptsIssued,
  registerCount,
}: Props) => {
  const checklist: { label: string; status: Status; detail: string }[] = [
    {
      label: "Receipts issued",
      status: receiptsIssued > 0 ? "green" : "red",
      detail: `${receiptsIssued} receipt${receiptsIssued !== 1 ? "s" : ""} in FY ${fyLabel}`,
    },
    {
      label: "Donation register updated",
      status: registerCount > 0 ? "green" : "red",
      detail: `${registerCount} donation${registerCount !== 1 ? "s" : ""} recorded`,
    },
    { label: "Audit completed", status: "amber", detail: "Track externally — mark when done" },
    { label: "ITR-7 filed", status: "amber", detail: "Annual return to be filed" },
  ];

  const deadlines: { item: string; date: string; due: Date; completed: boolean }[] = [
    { item: "Audit completion",  date: `30 Sep ${fyStartYear + 1}`, due: new Date(`${fyStartYear + 1}-09-30`), completed: false },
    { item: "ITR-7 filing",      date: `31 Oct ${fyStartYear + 1}`, due: new Date(`${fyStartYear + 1}-10-31`), completed: false },
    { item: "80G renewal",       date: `Mar 2028`,                  due: new Date(`2028-03-31`),               completed: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Compliance Checklist — FY {fyLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {checklist.map(c => (
              <li key={c.label} className="flex items-start gap-3">
                <StatusDot status={c.status} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Statutory Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map(d => (
                <TableRow key={d.item}>
                  <TableCell className="font-medium text-sm">{d.item}</TableCell>
                  <TableCell className="text-sm">{d.date}</TableCell>
                  <TableCell>{deadlineStatusBadge(computeDeadlineStatus(d.due, d.completed))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTracker;