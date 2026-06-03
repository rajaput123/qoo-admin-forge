import { motion } from "framer-motion";
import { Search, Filter, Download, Calendar, Clock, User, IndianRupee, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const bookings = [
  { id: "BK-001234", devotee: "Ramesh Kumar", seva: "Abhishekam", date: "Today, 10:30 AM", amount: "₹1,100", status: "Confirmed", type: "Online" },
  { id: "BK-001235", devotee: "Sita Devi", seva: "Archana", date: "Today, 11:00 AM", amount: "₹251", status: "Confirmed", type: "Online" },
  { id: "BK-001236", devotee: "Krishna Murthy", seva: "VIP Darshan", date: "Today, 11:30 AM", amount: "₹500", status: "Pending", type: "Walk-in" },
  { id: "BK-001237", devotee: "Lakshmi N", seva: "Kalyanam", date: "Today, 12:00 PM", amount: "₹5,000", status: "Confirmed", type: "Online" },
  { id: "BK-001238", devotee: "Venkat Rao", seva: "Sahasranamam", date: "Today, 2:00 PM", amount: "₹2,500", status: "Confirmed", type: "Online" },
];

const stats = [
  { label: "Total Bookings", value: "45", icon: Calendar },
  { label: "Today's Bookings", value: "12", icon: Clock },
  { label: "Total Revenue", value: "₹48,500", icon: IndianRupee },
  { label: "Unique Devotees", value: "38", icon: User },
];

const AllBookings = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">All Bookings</h1>
            <p className="text-muted-foreground">Manage seva and darshan bookings</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
        </div>

        {/* Bookings Table */}
        <div className="glass-card rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Devotee</TableHead>
                <TableHead>Seva</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.devotee}</TableCell>
                  <TableCell>{booking.seva}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.date}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{booking.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {booking.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        booking.status === "Confirmed" 
                          ? "text-green-700 border-green-300 bg-green-50" 
                          : "text-amber-700 border-amber-300 bg-amber-50"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default AllBookings;
