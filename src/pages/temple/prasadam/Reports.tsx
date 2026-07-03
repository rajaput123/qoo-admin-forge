import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download } from "lucide-react";

const productionData = [
  { day: "Mon", produced: 35000, distributed: 32000, wasted: 800 },
  { day: "Tue", produced: 38000, distributed: 35000, wasted: 650 },
  { day: "Wed", produced: 42000, distributed: 40000, wasted: 500 },
  { day: "Thu", produced: 36000, distributed: 33000, wasted: 900 },
  { day: "Fri", produced: 50000, distributed: 48000, wasted: 400 },
  { day: "Sat", produced: 65000, distributed: 62000, wasted: 700 },
  { day: "Sun", produced: 70000, distributed: 67000, wasted: 600 },
];

const categorySpend = [
  { name: "Laddu", value: 35, color: "#f97316" },
  { name: "Pulihora", value: 20, color: "#eab308" },
  { name: "Sweet Pongal", value: 18, color: "#22c55e" },
  { name: "Vada", value: 15, color: "#3b82f6" },
  { name: "Others", value: 12, color: "#8b5cf6" },
];

const counterReport = [
  { counter: "Counter C1 - Main Gate", allocated: 12000, sold: 9500, free: 1200, wastage: 300, collection: "₹2,37,500", utilization: "92%" },
  { counter: "Counter C2 - East Wing", allocated: 8000, sold: 6500, free: 800, wastage: 200, collection: "₹1,62,500", utilization: "94%" },
  { counter: "Counter C3 - South Gate", allocated: 6000, sold: 4800, free: 600, wastage: 150, collection: "₹1,20,000", utilization: "93%" },
  { counter: "Counter C4 - North Gate", allocated: 5000, sold: 3800, free: 500, wastage: 250, collection: "₹95,000", utilization: "91%" },
];

const ingredientConsumption = [
  { ingredient: "Besan (Gram Flour)", planned: "750 kg", actual: "762 kg", variance: "+1.6%", cost: "₹45,720" },
  { ingredient: "Sugar", planned: "600 kg", actual: "588 kg", variance: "-2.0%", cost: "₹23,520" },
  { ingredient: "Ghee", planned: "360 kg", actual: "370 kg", variance: "+2.8%", cost: "₹1,85,000" },
  { ingredient: "Rice", planned: "500 kg", actual: "510 kg", variance: "+2.0%", cost: "₹25,500" },
  { ingredient: "Jaggery", planned: "200 kg", actual: "195 kg", variance: "-2.5%", cost: "₹11,700" },
];

const costPerUnit = [
  { month: "Jul", laddu: 22, pulihora: 15, pongal: 18 },
  { month: "Aug", laddu: 23, pulihora: 14, pongal: 19 },
  { month: "Sep", laddu: 21, pulihora: 16, pongal: 17 },
  { month: "Oct", laddu: 24, pulihora: 15, pongal: 20 },
  { month: "Nov", laddu: 25, pulihora: 16, pongal: 19 },
  { month: "Dec", laddu: 23, pulihora: 15, pongal: 18 },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prasadam Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">Production, distribution, and cost analytics</p>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      <Tabs defaultValue="production">
        <TabsList className="flex-wrap">
          <TabsTrigger value="production">Daily Production</TabsTrigger>
          <TabsTrigger value="counter">Counter Sales</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Split</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredient Consumption</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Weekly Production vs Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="produced" fill="hsl(var(--primary))" name="Produced" />
                  <Bar dataKey="distributed" fill="hsl(142, 76%, 36%)" name="Distributed" />
                  <Bar dataKey="wasted" fill="hsl(0, 84%, 60%)" name="Wasted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counter" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Counter-wise Performance (This Week)</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Counter</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Free</TableHead>
                    <TableHead className="text-right">Wastage</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counterReport.map(c => (
                    <TableRow key={c.counter}>
                      <TableCell className="font-medium">{c.counter}</TableCell>
                      <TableCell className="text-right font-mono">{c.allocated.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{c.sold.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{c.free.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-red-600">{c.wastage.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">{c.collection}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{c.utilization}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Prasadam Distribution by Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categorySpend} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {categorySpend.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Online vs Counter vs Sponsorship</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={[{ name: "Counter Sale", value: 55, color: "#3b82f6" }, { name: "Online Booking", value: 25, color: "#22c55e" }, { name: "Sponsorship", value: 20, color: "#f43f5e" }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      <Cell fill="#3b82f6" />
                      <Cell fill="#22c55e" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Ingredient Consumption Summary (This Week)</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead className="text-right">Planned</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredientConsumption.map(i => (
                    <TableRow key={i.ingredient}>
                      <TableCell className="font-medium">{i.ingredient}</TableCell>
                      <TableCell className="text-right">{i.planned}</TableCell>
                      <TableCell className="text-right">{i.actual}</TableCell>
                      <TableCell className="text-right">
                        <span className={i.variance.startsWith("+") ? "text-red-600" : "text-green-600"}>{i.variance}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{i.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Cost per Unit Trend (₹)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costPerUnit}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="laddu" stroke="#f97316" name="Laddu" strokeWidth={2} />
                  <Line type="monotone" dataKey="pulihora" stroke="#eab308" name="Pulihora" strokeWidth={2} />
                  <Line type="monotone" dataKey="pongal" stroke="#22c55e" name="Sweet Pongal" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
