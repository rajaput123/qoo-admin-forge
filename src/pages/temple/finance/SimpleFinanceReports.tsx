import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Filter, Download, FileText, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

// Mock report data
const reportData = {
  financialSummary: [
    { category: "Total Income", actual: 4000000, budget: 3500000, lastYear: 3200000, variance: 500000 },
    { category: "Total Expenses", actual: 3900000, budget: 4000000, lastYear: 3800000, variance: -100000 },
    { category: "Net Balance", actual: 100000, budget: -500000, lastYear: -600000, variance: 600000 },
  ],
  donation: [
    { category: "General Donations", actual: 1800000, budget: 1500000, lastYear: 1400000, variance: 300000 },
    { category: "Special Donations", actual: 600000, budget: 500000, lastYear: 450000, variance: 100000 },
    { category: "Monthly Donations", actual: 400000, budget: 500000, lastYear: 350000, variance: -100000 },
  ],
  seva: [
    { category: "Darshan Bookings", actual: 800000, budget: 700000, lastYear: 600000, variance: 100000 },
    { category: "Special Seva", actual: 300000, budget: 250000, lastYear: 200000, variance: 50000 },
    { category: "Prasadam Seva", actual: 100000, budget: 50000, lastYear: 40000, variance: 50000 },
  ],
  expense: [
    { category: "Daily Operations", actual: 2100000, budget: 2400000, lastYear: 2200000, variance: -300000 },
    { category: "Event Expenses", actual: 1800000, budget: 2000000, lastYear: 1600000, variance: -200000 },
  ],
  budgetVariance: [
    { category: "Donations", actual: 2800000, budget: 2500000, lastYear: 2200000, variance: 300000 },
    { category: "Seva Income", actual: 1200000, budget: 1000000, lastYear: 840000, variance: 200000 },
    { category: "Daily Operations", actual: 2100000, budget: 2400000, lastYear: 2200000, variance: -300000 },
    { category: "Event Expenses", actual: 1800000, budget: 2000000, lastYear: 1600000, variance: -200000 },
  ],
  yearComparison: [
    { category: "Total Income", current: 4000000, lastYear: 3200000, change: 800000, changePercent: 25 },
    { category: "Total Expenses", current: 3900000, lastYear: 3800000, change: 100000, changePercent: 2.6 },
    { category: "Net Balance", current: 100000, lastYear: -600000, change: 700000, changePercent: 116.7 },
  ],
};

const SimpleFinanceReports = () => {
  const [reportType, setReportType] = useState("financialSummary");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTemple, setSelectedTemple] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const currentReportData = reportData[reportType as keyof typeof reportData] || reportData.financialSummary;
  const isYearComparison = reportType === "yearComparison";

  const handleExport = (format: "pdf" | "excel") => {
    // Placeholder for export functionality
    alert(`Exporting ${reportType} report to ${format.toUpperCase()}...`);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and export financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")} className="gap-2">
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" /> Report Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financialSummary">Financial Summary</SelectItem>
              <SelectItem value="donation">Donation Report</SelectItem>
              <SelectItem value="seva">Seva Income Report</SelectItem>
              <SelectItem value="expense">Expense Report</SelectItem>
              <SelectItem value="budgetVariance">Budget Variance Report</SelectItem>
              <SelectItem value="yearComparison">Year Comparison Report</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <Label className="text-xs">Temple/Location</Label>
              <Select value={selectedTemple} onValueChange={setSelectedTemple}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Temples</SelectItem>
                  <SelectItem value="main">Main Temple</SelectItem>
                  <SelectItem value="branch1">Branch 1</SelectItem>
                  <SelectItem value="branch2">Branch 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Event</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="evt1">Maha Shivaratri</SelectItem>
                  <SelectItem value="evt2">Krishna Janmashtami</SelectItem>
                  <SelectItem value="evt3">Diwali Celebration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="donations">Donations</SelectItem>
                  <SelectItem value="seva">Seva</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {reportType === "financialSummary" && "Financial Summary Report"}
            {reportType === "donation" && "Donation Report"}
            {reportType === "seva" && "Seva Income Report"}
            {reportType === "expense" && "Expense Report"}
            {reportType === "budgetVariance" && "Budget Variance Report"}
            {reportType === "yearComparison" && "Year Comparison Report"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                {!isYearComparison && <TableHead className="text-right">Actual Amount</TableHead>}
                {!isYearComparison && <TableHead className="text-right">Budget Amount</TableHead>}
                {!isYearComparison && <TableHead className="text-right">Last Year Amount</TableHead>}
                {!isYearComparison && <TableHead className="text-right">Variance</TableHead>}
                {isYearComparison && <TableHead className="text-right">Current Year</TableHead>}
                {isYearComparison && <TableHead className="text-right">Last Year</TableHead>}
                {isYearComparison && <TableHead className="text-right">Change</TableHead>}
                {isYearComparison && <TableHead className="text-right">Change %</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReportData.map((row: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  {!isYearComparison && (
                    <>
                      <TableCell className="text-right">{formatCurrency(row.actual)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.budget)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.lastYear)}</TableCell>
                      <TableCell className={`text-right ${getVarianceColor(row.variance)}`}>
                        {row.variance >= 0 ? "+" : ""}{formatCurrency(row.variance)}
                      </TableCell>
                    </>
                  )}
                  {isYearComparison && (
                    <>
                      <TableCell className="text-right">{formatCurrency(row.current)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.lastYear)}</TableCell>
                      <TableCell className={`text-right ${getVarianceColor(row.change)}`}>
                        {row.change >= 0 ? "+" : ""}{formatCurrency(row.change)}
                      </TableCell>
                      <TableCell className={`text-right ${getVarianceColor(row.change)}`}>
                        {row.changePercent >= 0 ? "+" : ""}{row.changePercent.toFixed(1)}%
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleFinanceReports;
