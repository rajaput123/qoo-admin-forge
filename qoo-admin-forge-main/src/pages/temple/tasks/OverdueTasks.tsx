import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import TaskInlineDetail from "@/components/tasks/TaskInlineDetail";
import type { Task } from "@/modules/tasks/types";
import { taskSelectors, useCurrentUser, useTasks } from "@/modules/tasks/hooks";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const priorityColor: Record<string, string> = { Critical: "bg-red-50 text-red-700 border-red-200", High: "bg-orange-50 text-orange-700 border-orange-200", Medium: "bg-amber-50 text-amber-700 border-amber-200", Low: "bg-green-50 text-green-700 border-green-200" };

const OverdueTasks = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const user = useCurrentUser();
  const tasksAll = useTasks();
  const tasks = tasksAll.filter((t) => taskSelectors.canViewTask(user, t));
  const overdue = tasks.filter((t) => taskSelectors.isTaskOverdue(t, new Date()));

  const daysOverdue = (dueDate: string) => differenceInCalendarDays(new Date(), parseISO(dueDate));

  if (selectedTask) {
    return <TaskInlineDetail task={selectedTask} onBack={() => setSelectedTask(null)} onTaskUpdate={setSelectedTask} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />Overdue Tasks
          </h1>
          <p className="text-muted-foreground text-sm">{overdue.length} tasks past due date</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (overdue.length === 0) return;
            const top = overdue
              .slice()
              .sort((a, b) => daysOverdue(b.dueDate) - daysOverdue(a.dueDate))
              .slice(0, 3)
              .map((t) => `${t.title} → ${t.assignedTo}`)
              .join(", ");
            toast({
              title: "Reminder sent",
              description: `${overdue.length} overdue tasks reminded. ${top}${overdue.length > 3 ? "…" : ""}`,
            });
          }}
          disabled={overdue.length === 0}
        >
          Send reminder
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Overdue</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overdue.sort((a, b) => daysOverdue(b.dueDate) - daysOverdue(a.dueDate)).map(t => (
              <TableRow key={t.taskId} className="cursor-pointer" onClick={() => setSelectedTask(t)}>
                <TableCell>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description.substring(0, 60)}...</p>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{t.linkedModule}</Badge></TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{t.type}</Badge></TableCell>
                <TableCell>
                  <p className="text-sm">{t.assignedTo}</p>
                  <p className="text-[10px] text-muted-foreground">by {t.assignedBy}</p>
                </TableCell>
                <TableCell className="text-sm text-destructive font-medium">{t.dueDate}</TableCell>
                <TableCell><Badge variant="destructive" className="text-xs">{daysOverdue(t.dueDate)} days</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] ${priorityColor[t.priority]}`}>{t.priority}</Badge></TableCell>
              </TableRow>
            ))}
            {overdue.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No overdue tasks 🎉</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>


    </motion.div>
  );
};

export default OverdueTasks;
