import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Users, Clock, CalendarOff, TrendingUp, Briefcase, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { employees, departments, shifts } from "@/data/hr-dummy-data";
import { getEmployees } from "@/lib/hr-employee-store";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)", "hsl(190,60%,45%)"];

const HRReports = () => {
  const [period, setPeriod] = useState("month");

  // Merge seed + onboarded employees
  const allEmployees = useMemo(() => {
    const onboarded = getEmployees();
    const seedIds = new Set(employees.map(e => e.id));
    return [...employees, ...onboarded.filter(e => !seedIds.has(e.id))];
  }, []);

  const activeEmps = allEmployees.filter(e => e.status === "active");
  const onLeave = allEmployees.filter(e => e.status === "on_leave");
  const inactiveEmps = allEmployees.filter(e => e.status === "inactive");
  const activeDepts = departments.filter(d => d.status === "active");
  const totalSalary = allEmployees.reduce((s, e) => s + (e.basicSalary || 0), 0);

  const deptData = useMemo(() => {
    const map = new Map<string, number>();
    allEmployees.forEach(e => map.set(e.department, (map.get(e.department) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [allEmployees]);

  const statusData = [
    { name: "Active", value: activeEmps.length },
    { name: "On Leave", value: onLeave.length },
    { name: "Inactive", value: inactiveEmps.length },
  ].filter(s => s.value > 0);

  // Salary distribution by department
  const salaryByDept = useMemo(() => {
    const map = new Map<string, number>();
    allEmployees.forEach(e => map.set(e.department, (map.get(e.department) || 0) + (e.basicSalary || 0)));
    return Array.from(map.entries()).map(([name, salary]) => ({ name, salary })).sort((a, b) => b.salary - a.salary);
  }, [allEmployees]);

  // Shift distribution
  const shiftData = useMemo(() => {
    const map = new Map<string, number>();
    allEmployees.forEach(e => {
      const shift = shifts.find(s => s.id === e.shiftId);
      const name = shift ? shift.name : "Unassigned";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [allEmployees]);

  // Designation distribution
  const designationData = useMemo(() => {
    const map = new Map<string, number>();
    allEmployees.forEach(e => map.set(e.designation, (map.get(e.designation) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [allEmployees]);

  const handleExport = () => {
    const csv = ["Employee ID,Name,Department,Designation,Status,Joining Date,Basic Salary", ...allEmployees.map(e => `${e.employeeId},"${e.name}","${e.department}","${e.designation}","${e.status}",${e.joiningDate},${e.basicSalary || 0}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `hr-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("HR report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">People & HR Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Employee analytics, department distribution, salary & shift insights</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Employees", value: allEmployees.length, icon: Users, color: "text-blue-600" },
          { label: "Active", value: activeEmps.length, icon: TrendingUp, color: "text-green-600" },
          { label: "On Leave", value: onLeave.length, icon: CalendarOff, color: "text-amber-600" },
          { label: "Departments", value: activeDepts.length, icon: Briefcase, color: "text-purple-600" },
          { label: "Monthly Salary", value: `₹${(totalSalary / 1000).toFixed(0)}K`, icon: IndianRupee, color: "text-teal-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Department Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={deptData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Employee Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary by Department */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Salary Distribution by Dept<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={salaryByDept}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="salary" fill="hsl(142,60%,40%)" radius={[4,4,0,0]} name="Total Salary" /></BarChart></ResponsiveContainer></CardContent></Card>

        {/* Shift Distribution */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Shift Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={shiftData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{shiftData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Employee Table */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Employee Directory<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Table</Badge></CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2 font-medium text-muted-foreground">ID</th><th className="text-left py-2 font-medium text-muted-foreground">Name</th><th className="text-left py-2 font-medium text-muted-foreground">Dept</th><th className="text-left py-2 font-medium text-muted-foreground">Designation</th><th className="text-left py-2 font-medium text-muted-foreground">Status</th><th className="text-right py-2 font-medium text-muted-foreground">Salary</th></tr></thead>
            <tbody>{allEmployees.slice(0, 15).map(e => (
              <tr key={e.id} className="border-b last:border-0"><td className="py-2 text-muted-foreground">{e.employeeId}</td><td className="py-2">{e.name}</td><td className="py-2 text-muted-foreground">{e.department}</td><td className="py-2 text-muted-foreground">{e.designation}</td><td className="py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'active' ? 'bg-green-100 text-green-700' : e.status === 'on_leave' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{e.status}</span></td><td className="text-right py-2">₹{(e.basicSalary || 0).toLocaleString()}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
};

export default HRReports;
