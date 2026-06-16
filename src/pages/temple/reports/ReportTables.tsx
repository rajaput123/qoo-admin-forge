import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const moduleTables: Record<string, {
  title: string;
  tabs: { key: string; label: string; columns: string[]; rows: string[][] }[];
}> = {
  donations: {
    title: "Donation Tables",
    tabs: [
      { key: "records", label: "Donation Records", columns: ["Date", "Donor Name", "Amount", "Purpose", "Mode", "Receipt", "Status"], rows: [
        ["2024-03-15", "Ramesh Kumar", "₹25,000", "Temple Renovation", "Online", "RCT-001", "Completed"],
        ["2024-03-14", "Lakshmi Devi", "₹10,000", "Annadanam", "Cash", "RCT-002", "Completed"],
        ["2024-03-14", "Suresh Patel", "₹50,000", "General Fund", "Bank Transfer", "RCT-003", "Completed"],
        ["2024-03-13", "Anita Sharma", "₹5,000", "Festival Fund", "UPI", "RCT-004", "Completed"],
        ["2024-03-12", "Vijay Reddy", "₹1,00,000", "Temple Renovation", "Cheque", "RCT-005", "Pending"],
        ["2024-03-11", "Meena Iyer", "₹15,000", "Education Fund", "Online", "RCT-006", "Completed"],
        ["2024-03-10", "Ganesh Rao", "₹8,000", "Annadanam", "Cash", "RCT-007", "Completed"],
        ["2024-03-09", "Priya Nair", "₹20,000", "General Fund", "UPI", "RCT-008", "Completed"],
      ]},
      { key: "donors", label: "Donor Registry", columns: ["Donor", "Total Donated", "Count", "Last Donation", "Preferred Mode", "Status"], rows: [
        ["Ramesh Kumar", "₹2,50,000", "12", "2024-03-15", "Online", "Active"],
        ["Suresh Patel", "₹1,80,000", "8", "2024-03-14", "Bank Transfer", "Active"],
        ["Vijay Reddy", "₹1,50,000", "5", "2024-03-12", "Cheque", "Active"],
        ["Lakshmi Devi", "₹85,000", "10", "2024-03-14", "Cash", "Active"],
        ["Priya Nair", "₹60,000", "6", "2024-03-09", "UPI", "Active"],
      ]},
    ],
  },
  events: {
    title: "Event Tables",
    tabs: [
      { key: "events", label: "Event Records", columns: ["Event Name", "Date", "Type", "Registrations", "Revenue", "Budget", "Status"], rows: [
        ["Maha Shivaratri", "2024-03-08", "Festival", "1,200", "₹4,50,000", "₹5,00,000", "Completed"],
        ["Ram Navami", "2024-04-17", "Festival", "800", "₹2,80,000", "₹3,50,000", "Upcoming"],
        ["Vedic Workshop", "2024-03-20", "Workshop", "150", "₹75,000", "₹1,00,000", "Ongoing"],
        ["Annual Day", "2024-02-15", "Cultural", "2,000", "₹8,00,000", "₹7,50,000", "Completed"],
        ["Bhajan Sandhya", "2024-03-25", "Spiritual", "300", "₹45,000", "₹50,000", "Upcoming"],
        ["Yoga Camp", "2024-03-18", "Health", "200", "₹1,20,000", "₹1,50,000", "Ongoing"],
      ]},
      { key: "expenses", label: "Event Expenses", columns: ["Event", "Category", "Vendor", "Amount", "Date", "Status"], rows: [
        ["Maha Shivaratri", "Decoration", "Devi Decorations", "₹45,000", "2024-03-06", "Paid"],
        ["Maha Shivaratri", "Catering", "Annapurna Foods", "₹1,20,000", "2024-03-07", "Paid"],
        ["Ram Navami", "Flowers", "Sri Lakshmi Flowers", "₹25,000", "2024-04-15", "Pending"],
        ["Annual Day", "Sound & Lighting", "AV Solutions", "₹80,000", "2024-02-14", "Paid"],
      ]},
    ],
  },
  finance: {
    title: "Finance Tables",
    tabs: [
      { key: "transactions", label: "Transactions", columns: ["Date", "Description", "Category", "Type", "Amount", "Account", "Status"], rows: [
        ["2024-03-15", "Electricity Bill", "Utilities", "Expense", "₹45,000", "HDFC Bank", "Paid"],
        ["2024-03-14", "Pooja Income", "Seva Revenue", "Income", "₹1,25,000", "SBI", "Received"],
        ["2024-03-13", "Staff Salary", "Payroll", "Expense", "₹3,50,000", "HDFC Bank", "Paid"],
        ["2024-03-12", "Donation Income", "Donations", "Income", "₹2,80,000", "SBI", "Received"],
        ["2024-03-11", "Maintenance", "Repairs", "Expense", "₹28,000", "Cash", "Paid"],
        ["2024-03-10", "Prasadam Sales", "Revenue", "Income", "₹65,000", "SBI", "Received"],
      ]},
      { key: "ledger", label: "Ledger", columns: ["Account", "Opening Balance", "Debit", "Credit", "Closing Balance", "Status"], rows: [
        ["SBI Main", "₹12,50,000", "₹4,70,000", "₹8,20,000", "₹16,00,000", "Active"],
        ["HDFC Operations", "₹5,80,000", "₹4,23,000", "₹2,10,000", "₹3,67,000", "Active"],
        ["Cash Account", "₹1,20,000", "₹28,000", "₹85,000", "₹1,77,000", "Active"],
      ]},
    ],
  },
  bookings: {
    title: "Booking Tables",
    tabs: [
      { key: "bookings", label: "Booking Records", columns: ["Booking ID", "Date", "Devotee", "Service", "Amount", "Slot", "Status"], rows: [
        ["BK-1001", "2024-03-15", "Ramesh K.", "Archana", "₹500", "9:00 AM", "Confirmed"],
        ["BK-1002", "2024-03-15", "Sita D.", "Abhishekam", "₹2,500", "10:00 AM", "Confirmed"],
        ["BK-1003", "2024-03-15", "Mohan L.", "Special Darshan", "₹1,000", "11:00 AM", "Completed"],
        ["BK-1004", "2024-03-15", "Priya R.", "Homam", "₹5,000", "6:00 AM", "Confirmed"],
        ["BK-1005", "2024-03-14", "Vijay S.", "Archana", "₹500", "9:30 AM", "Cancelled"],
        ["BK-1006", "2024-03-14", "Geetha M.", "Abhishekam", "₹2,500", "10:30 AM", "Completed"],
      ]},
      { key: "cancellations", label: "Cancellations", columns: ["Booking ID", "Devotee", "Service", "Amount", "Cancel Date", "Refund", "Status"], rows: [
        ["BK-1005", "Vijay S.", "Archana", "₹500", "2024-03-14", "₹500", "Refunded"],
        ["BK-0998", "Mohan R.", "Abhishekam", "₹2,500", "2024-03-12", "₹2,000", "Partial Refund"],
        ["BK-0985", "Sita M.", "Homam", "₹5,000", "2024-03-10", "₹0", "No Refund"],
      ]},
    ],
  },
  offerings: {
    title: "Offering Tables",
    tabs: [
      { key: "offerings", label: "Offering Records", columns: ["Seva Name", "Date", "Devotee", "Deity", "Amount", "Priest", "Status"], rows: [
        ["Ganapathi Homam", "2024-03-15", "Ramesh K.", "Lord Ganesha", "₹5,000", "Pandit Sharma", "Completed"],
        ["Sahasranama", "2024-03-15", "Lakshmi D.", "Sri Vishnu", "₹1,500", "Pandit Iyer", "Scheduled"],
        ["Rudrabhishekam", "2024-03-14", "Suresh P.", "Lord Shiva", "₹3,000", "Pandit Rao", "Completed"],
        ["Lakshmi Pooja", "2024-03-14", "Anita S.", "Goddess Lakshmi", "₹2,000", "Pandit Sharma", "Completed"],
        ["Navagraha Pooja", "2024-03-13", "Vijay R.", "Navagraha", "₹2,500", "Pandit Iyer", "Completed"],
      ]},
    ],
  },
  projects: {
    title: "Project Tables",
    tabs: [
      { key: "projects", label: "Project Records", columns: ["Project Name", "Start Date", "End Date", "Budget", "Spent", "Progress", "Status"], rows: [
        ["Temple Gopuram Renovation", "2024-01-15", "2024-06-30", "₹25,00,000", "₹12,50,000", "50%", "On Track"],
        ["Garden Landscaping", "2024-02-01", "2024-04-30", "₹5,00,000", "₹3,80,000", "76%", "On Track"],
        ["CCTV Installation", "2024-03-01", "2024-03-31", "₹2,50,000", "₹2,20,000", "88%", "On Track"],
        ["Kitchen Expansion", "2024-01-01", "2024-12-31", "₹15,00,000", "₹4,50,000", "30%", "Delayed"],
      ]},
      { key: "milestones", label: "Milestones", columns: ["Project", "Milestone", "Due Date", "Completion", "Status"], rows: [
        ["Gopuram Renovation", "Foundation Work", "2024-02-28", "100%", "Completed"],
        ["Gopuram Renovation", "Structural Work", "2024-04-15", "60%", "On Track"],
        ["Garden Landscaping", "Design Approval", "2024-02-15", "100%", "Completed"],
        ["Kitchen Expansion", "Vendor Selection", "2024-02-01", "100%", "Completed"],
        ["Kitchen Expansion", "Civil Work", "2024-06-30", "15%", "Delayed"],
      ]},
    ],
  },
  branches: {
    title: "Branch Tables",
    tabs: [
      { key: "branches", label: "Branch Performance", columns: ["Branch Name", "Location", "Revenue", "Devotees", "Staff", "Rating", "Status"], rows: [
        ["Main Temple", "Bangalore", "₹18,50,000", "5,200", "45", "4.8", "Active"],
        ["North Branch", "Mysore", "₹8,20,000", "2,100", "18", "4.5", "Active"],
        ["East Branch", "Mandya", "₹5,60,000", "1,400", "12", "4.3", "Active"],
        ["West Branch", "Hassan", "₹4,80,000", "1,100", "10", "4.6", "Active"],
      ]},
    ],
  },
  institutions: {
    title: "Institution Tables",
    tabs: [
      { key: "institutions", label: "Institution Records", columns: ["Institution", "Type", "Students/Patients", "Revenue", "Expenses", "Compliance", "Status"], rows: [
        ["Vedic School", "Education", "120", "₹8,50,000", "₹6,20,000", "95%", "Active"],
        ["Temple Hospital", "Healthcare", "450", "₹12,00,000", "₹10,80,000", "92%", "Active"],
        ["Goshala", "Cow Shelter", "85 cows", "₹3,50,000", "₹4,20,000", "88%", "Active"],
        ["Annadanam Center", "Food Service", "500/day", "₹5,00,000", "₹4,80,000", "96%", "Active"],
      ]},
    ],
  },
  hr: {
    title: "HR Tables",
    tabs: [
      { key: "employees", label: "Employees", columns: ["Employee", "Department", "Role", "Attendance", "Leave Used", "Salary", "Status"], rows: [
        ["Ramesh Kumar", "Administration", "Manager", "96%", "4/12", "₹45,000", "Active"],
        ["Lakshmi Devi", "Finance", "Accountant", "94%", "6/12", "₹35,000", "Active"],
        ["Suresh Patel", "Security", "Head Guard", "98%", "2/12", "₹28,000", "Active"],
        ["Anita Sharma", "Kitchen", "Head Cook", "92%", "5/12", "₹30,000", "Active"],
        ["Vijay Reddy", "Maintenance", "Supervisor", "95%", "3/12", "₹32,000", "Active"],
        ["Meena Iyer", "Pooja", "Sr. Priest", "97%", "4/12", "₹40,000", "Active"],
      ]},
      { key: "attendance", label: "Attendance Log", columns: ["Employee", "Date", "Check In", "Check Out", "Hours", "Status"], rows: [
        ["Ramesh Kumar", "2024-03-15", "8:55 AM", "5:30 PM", "8.5", "Present"],
        ["Lakshmi Devi", "2024-03-15", "9:10 AM", "6:00 PM", "8.8", "Present"],
        ["Suresh Patel", "2024-03-15", "6:00 AM", "2:00 PM", "8.0", "Present"],
        ["Anita Sharma", "2024-03-15", "—", "—", "0", "On Leave"],
      ]},
      { key: "leaves", label: "Leave Records", columns: ["Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"], rows: [
        ["Anita Sharma", "Casual Leave", "2024-03-15", "2024-03-16", "2", "Family function", "Approved"],
        ["Vijay Reddy", "Sick Leave", "2024-03-10", "2024-03-10", "1", "Fever", "Approved"],
        ["Meena Iyer", "Earned Leave", "2024-03-20", "2024-03-25", "5", "Travel", "Pending"],
      ]},
    ],
  },
  vip: {
    title: "VIP Tables",
    tabs: [
      { key: "vips", label: "VIP Devotees", columns: ["Name", "VIP Level", "Total Contribution", "Last Visit", "Events Attended", "Services Used", "Status"], rows: [
        ["Dr. Rajesh Gupta", "Platinum", "₹15,00,000", "2024-03-14", "24", "Premium Darshan", "Active"],
        ["Mrs. Kamala Reddy", "Gold", "₹8,50,000", "2024-03-12", "18", "VIP Pooja", "Active"],
        ["Mr. Suresh Rao", "Platinum", "₹12,00,000", "2024-03-10", "22", "All Services", "Active"],
        ["Mrs. Anita Devi", "Silver", "₹3,20,000", "2024-03-08", "12", "Special Darshan", "Active"],
      ]},
    ],
  },
  freelancers: {
    title: "Freelancer Tables",
    tabs: [
      { key: "freelancers", label: "Freelancer Records", columns: ["Name", "Skill", "Assignments", "Completed", "Payments", "Rating", "Status"], rows: [
        ["Ravi Kumar", "Electrician", "12", "10", "₹1,80,000", "4.5", "Active"],
        ["Sunil Rao", "Carpenter", "8", "7", "₹1,40,000", "4.3", "Active"],
        ["Priya Nair", "Painter", "6", "6", "₹90,000", "4.7", "Active"],
        ["Mohan Das", "Plumber", "10", "9", "₹1,20,000", "4.1", "Active"],
        ["Geetha M.", "Decorator", "15", "14", "₹2,50,000", "4.8", "Active"],
      ]},
      { key: "payments", label: "Payment History", columns: ["Freelancer", "Assignment", "Amount", "Date", "Mode", "Status"], rows: [
        ["Ravi Kumar", "Wiring Work", "₹18,000", "2024-03-10", "Bank Transfer", "Paid"],
        ["Geetha M.", "Festival Decoration", "₹25,000", "2024-03-08", "UPI", "Paid"],
        ["Sunil Rao", "Door Repair", "₹12,000", "2024-03-05", "Cash", "Paid"],
        ["Priya Nair", "Wall Painting", "₹15,000", "2024-03-12", "Bank Transfer", "Pending"],
      ]},
    ],
  },
  feedback: {
    title: "Feedback Tables",
    tabs: [
      { key: "feedback", label: "Feedback Records", columns: ["Date", "Devotee", "Category", "Rating", "Sentiment", "Comment", "Status"], rows: [
        ["2024-03-15", "Ramesh K.", "Cleanliness", "5/5", "Positive", "Very well maintained", "Reviewed"],
        ["2024-03-14", "Lakshmi D.", "Service", "4/5", "Positive", "Good pooja arrangements", "Reviewed"],
        ["2024-03-13", "Suresh P.", "Queue", "2/5", "Negative", "Long waiting time", "Action Taken"],
        ["2024-03-12", "Anita S.", "Prasadam", "5/5", "Positive", "Excellent quality", "Reviewed"],
        ["2024-03-11", "Vijay R.", "Parking", "3/5", "Neutral", "Needs improvement", "Pending"],
      ]},
      { key: "escalations", label: "Escalations", columns: ["Date", "Devotee", "Category", "Issue", "Assigned To", "Resolution", "Status"], rows: [
        ["2024-03-13", "Suresh P.", "Queue", "2hr wait in VIP line", "Queue Manager", "Added more counters", "Resolved"],
        ["2024-03-10", "Mohan L.", "Safety", "Slippery floor near shrine", "Maintenance", "Anti-slip mats installed", "Resolved"],
        ["2024-03-08", "Anita D.", "Staff", "Rude behavior at counter", "HR Manager", "Under review", "Pending"],
      ]},
    ],
  },
  inventory: {
    title: "Inventory Tables",
    tabs: [
      { key: "stock", label: "Stock Register", columns: ["Item", "Category", "Stock", "Unit", "Last Purchase", "Value", "Status"], rows: [
        ["Ghee", "Pooja Items", "120", "Kg", "2024-03-10", "₹48,000", "Sufficient"],
        ["Flowers", "Daily", "50", "Kg", "2024-03-15", "₹15,000", "Low"],
        ["Incense Sticks", "Pooja Items", "500", "Packets", "2024-03-08", "₹25,000", "Sufficient"],
        ["Rice", "Kitchen", "200", "Kg", "2024-03-12", "₹12,000", "Sufficient"],
        ["Coconuts", "Pooja Items", "300", "Nos", "2024-03-14", "₹9,000", "Sufficient"],
      ]},
      { key: "purchases", label: "Purchase Orders", columns: ["PO #", "Supplier", "Items", "Amount", "Order Date", "Delivery", "Status"], rows: [
        ["PO-0145", "Sri Lakshmi Stores", "Flowers, Garlands", "₹12,000", "2024-03-14", "2024-03-15", "Delivered"],
        ["PO-0144", "Annapurna Foods", "Rice, Dal, Spices", "₹28,000", "2024-03-12", "2024-03-13", "Delivered"],
        ["PO-0143", "Ganesh Electricals", "Bulbs, Wiring", "₹8,500", "2024-03-10", "2024-03-12", "Delivered"],
        ["PO-0146", "Fresh Farms", "Flowers", "₹6,000", "2024-03-15", "2024-03-16", "Pending"],
      ]},
    ],
  },
  suppliers: {
    title: "Supplier Tables",
    tabs: [
      { key: "suppliers", label: "Supplier Registry", columns: ["Supplier", "Category", "Orders", "Delivered", "Pending Amount", "Rating", "Status"], rows: [
        ["Sri Lakshmi Stores", "Pooja Items", "24", "22", "₹45,000", "4.5", "Active"],
        ["Fresh Farms", "Flowers", "48", "46", "₹12,000", "4.3", "Active"],
        ["Ganesh Electricals", "Maintenance", "8", "7", "₹28,000", "4.0", "Active"],
        ["Annapurna Foods", "Kitchen", "36", "35", "₹1,20,000", "4.6", "Active"],
      ]},
      { key: "invoices", label: "Invoices", columns: ["Invoice #", "Supplier", "Amount", "Date", "Due Date", "Payment", "Status"], rows: [
        ["INV-2026-020", "Sri Lakshmi Flowers", "₹9,000", "2024-03-10", "2024-03-25", "—", "Pending"],
        ["INV-2026-019", "Annapurna Grocery", "₹3,500", "2024-03-08", "2024-03-22", "₹2,000", "Partially Paid"],
        ["INV-2026-021", "Surya Milk Dairy", "₹3,000", "2024-03-05", "2024-03-12", "—", "Overdue"],
      ]},
    ],
  },
};

moduleTables.devotees = {
  title: "Devotee Tables",
  tabs: [
    { key: "top-engaged", label: "Top Engaged Devotees", columns: ["Rank", "Devotee", "City", "Bookings", "Donations (₹)", "Events Attended", "Last Visit", "Status"], rows: [
      ["1", "Meena Iyer", "Bangalore", "45", "₹1,25,000", "20", "2024-03-15", "Highly Active"],
      ["2", "Lakshmi Devi", "Mysore", "42", "₹85,000", "18", "2024-03-14", "Highly Active"],
      ["3", "Vijay Nair", "Bangalore", "38", "₹72,000", "15", "2024-03-13", "Highly Active"],
      ["4", "Ramesh Kumar", "Chennai", "28", "₹2,50,000", "12", "2024-03-15", "Active"],
      ["5", "Kavita Rao", "Hyderabad", "31", "₹55,000", "14", "2024-03-12", "Active"],
      ["6", "Suresh Reddy", "Bangalore", "22", "₹65,000", "10", "2024-03-10", "Active"],
      ["7", "Priya Sharma", "Mumbai", "18", "₹52,000", "9", "2024-03-09", "Active"],
      ["8", "Anand Verma", "Delhi", "20", "₹48,000", "11", "2024-03-08", "Active"],
      ["9", "Deepa Murthy", "Bangalore", "24", "₹38,000", "20", "2024-03-11", "Active"],
      ["10", "Sunita Bai", "Pune", "15", "₹28,000", "6", "2024-03-07", "Occasional"],
    ]},
  ],
};

const ReportTables = ({ moduleKey }: { moduleKey: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const tableData = moduleTables[moduleKey];

  if (!tableData) {
    return <div className="p-6 text-muted-foreground">Table data not found.</div>;
  }

  const tabs = tableData.tabs;
  const defaultTab = tabs[0]?.key || "";

  const handleExport = (columns: string[], rows: string[][]) => {
    const csv = [columns.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${moduleKey}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (cell: string) => {
    if (["Completed", "Active", "Sufficient", "Confirmed", "Reviewed", "Paid", "Received", "On Track", "Positive", "Present", "Resolved", "Delivered", "Approved", "Refunded"].includes(cell)) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
    }
    if (["Pending", "Upcoming", "Scheduled", "Ongoing", "Neutral", "Completing", "Partial Refund", "Partially Paid"].includes(cell)) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
    }
    if (["Cancelled", "Delayed", "Negative", "Low", "Action Taken", "Overdue", "No Refund", "On Leave"].includes(cell)) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
    }
    return cell;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tableData.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed data tables with search & export</p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        {tabs.length > 1 && (
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        )}

        {tabs.map(tab => {
          const filteredRows = tab.rows.filter(row =>
            searchTerm === "" || row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()))
          );

          return (
            <TabsContent key={tab.key} value={tab.key} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Badge variant="outline">{filteredRows.length} of {tab.rows.length}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleExport(tab.columns, filteredRows)} className="gap-2">
                  <Download className="h-4 w-4" />Export CSV
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tab.columns.map((col) => (
                            <TableHead key={col} className="whitespace-nowrap font-semibold">{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row, i) => (
                          <TableRow key={i}>
                            {row.map((cell, j) => (
                              <TableCell key={j} className="whitespace-nowrap">
                                {renderStatusBadge(cell)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ReportTables;
