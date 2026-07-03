import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, TrendingDown, DollarSign, Filter, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock event data
const events = [
  { id: "EVT-001", name: "Maha Shivaratri", date: "2024-02-15", income: 450000, expense: 320000, budget: 400000 },
  { id: "EVT-002", name: "Krishna Janmashtami", date: "2024-08-26", income: 380000, expense: 280000, budget: 350000 },
  { id: "EVT-003", name: "Diwali Celebration", date: "2024-11-01", income: 520000, expense: 410000, budget: 450000 },
  { id: "EVT-004", name: "New Year Puja", date: "2024-01-01", income: 280000, expense: 180000, budget: 250000 },
];

const EventFinanceDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("EVT-001");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const currentEvent = events.find(e => e.id === selectedEvent) || events[0];
  const profitLoss = currentEvent.income - currentEvent.expense;
  const isProfit = profitLoss >= 0;
  const variance = currentEvent.income - currentEvent.budget;

  const eventChartData = [
    { name: "Income", income: currentEvent.income, expense: 0 },
    { name: "Expense", income: 0, expense: currentEvent.expense },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Financial overview for individual events</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Event Name</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({format(new Date(event.date), "MMM dd, yyyy")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge variant="outline" className="text-xs">Income</Badge>
            </div>
            <p className="text-2xl font-bold">₹{currentEvent.income.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Event Income</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <Badge variant="outline" className="text-xs">Expense</Badge>
            </div>
            <p className="text-2xl font-bold">₹{currentEvent.expense.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Event Expense</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <Badge variant="outline" className="text-xs">Budget</Badge>
            </div>
            <p className="text-2xl font-bold">₹{currentEvent.budget.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Budget Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {isProfit ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <Badge variant={isProfit ? "default" : "destructive"} className="text-xs">
                {isProfit ? "Profit" : "Loss"}
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
              ₹{Math.abs(profitLoss).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Net Result</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-xl font-bold">₹{currentEvent.budget.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Actual Income</p>
                <p className="text-xl font-bold">₹{currentEvent.income.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg border ${variance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs text-muted-foreground mb-1">Variance</p>
                <p className={`text-xl font-bold ${variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {variance >= 0 ? "+" : ""}₹{Math.abs(variance).toLocaleString()}
                </p>
              </div>
            </div>
            {variance < 0 && (
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-xs text-amber-700">
                  Actual income is below budget by ₹{Math.abs(variance).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{currentEvent.name} - Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* All Events Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Events Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {events.map(event => {
              const eventProfit = event.income - event.expense;
              const isEventProfit = eventProfit >= 0;
              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                    event.id === selectedEvent ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(event.date), "MMM dd, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">₹{event.income.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Income</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">₹{event.expense.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Expense</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isEventProfit ? "text-green-600" : "text-red-600"}`}>
                          {isEventProfit ? "+" : ""}₹{Math.abs(eventProfit).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Net</p>
                      </div>
                      <Badge variant={isEventProfit ? "default" : "destructive"}>
                        {isEventProfit ? "Profit" : "Loss"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventFinanceDashboard;
