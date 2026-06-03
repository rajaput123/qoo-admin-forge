import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, CalendarDays, IndianRupee, TrendingUp, Users, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useEvents } from "@/modules/events/hooks";
import { eventTypes as allEventTypes, eventStatuses } from "@/data/eventData";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Draft: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-gray-400" },
  Scheduled: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Published: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  Ongoing: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500 animate-pulse" },
  Completed: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Archived: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-gray-400" },
};

// Banner images mapped by event type
const typeBanners: Record<string, string> = {
  Festival: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400&h=200&fit=crop&q=80",
  "Special Ritual": "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&h=200&fit=crop&q=80",
  "Special Pooja": "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&h=200&fit=crop&q=80",
  Cultural: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=200&fit=crop&q=80",
  Annadanam: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=200&fit=crop&q=80",
  Fundraiser: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=200&fit=crop&q=80",
  Camp: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=200&fit=crop&q=80",
  VIP: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400&h=200&fit=crop&q=80",
  Public: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400&h=200&fit=crop&q=80",
  Other: "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400&h=200&fit=crop&q=80",
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const AllEvents = () => {
  const navigate = useNavigate();
  const events = useEvents();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = events.filter((e) => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  const totalEvents = events.length;
  const ongoingCount = events.filter((e) => e.status === "Ongoing").length;
  const publishedCount = events.filter((e) => e.status === "Published").length;
  const totalBudget = events.reduce((sum, e) => sum + e.estimatedBudget, 0);

  const kpis = [
    { label: "Total Events", value: totalEvents.toString(), icon: CalendarDays },
    { label: "Ongoing", value: ongoingCount.toString(), icon: TrendingUp },
    { label: "Published", value: publishedCount.toString(), icon: Users },
    { label: "Total Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, icon: IndianRupee },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">All Events</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{totalEvents} events</p>
        </div>
        <Button onClick={() => navigate("/temple/events/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <Card key={i} className="group hover:shadow-md transition-all duration-200 border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary transition-all duration-200 shrink-0">
                <kpi.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-9 bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Types</SelectItem>
            {allEventTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9 bg-background">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            {eventStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Events List — Modern Card Rows */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No events found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((event, i) => {
            const status = statusConfig[event.status] || statusConfig.Draft;
            const banner = typeBanners[event.type] || typeBanners.Other;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/temple/events/${event.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Banner Image */}
                      <div className="w-44 h-32 shrink-0 relative overflow-hidden">
                        <img
                          src={banner}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10" />
                        {/* Status overlay badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className={`${status.bg} ${status.text} border-0 text-[10px] font-medium shadow-sm gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {event.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {event.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] font-normal border-border/80">{event.type}</Badge>
                                <span className="text-[10px] text-muted-foreground">{event.id}</span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{event.description}</p>
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(event.startDate)}</span>
                            {event.startDate !== event.endDate && (
                              <span className="text-muted-foreground/60">→ {formatDate(event.endDate)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{event.structureName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{event.capacity.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground ml-auto">
                            <IndianRupee className="h-3 w-3" />
                            <span>₹{(event.estimatedBudget / 1000).toFixed(0)}K</span>
                            {event.actualSpend > 0 && (
                              <span className="text-muted-foreground font-normal">/ ₹{(event.actualSpend / 1000).toFixed(0)}K spent</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
        <span>Showing {filtered.length} of {totalEvents} events</span>
      </div>
    </motion.div>
  );
};

export default AllEvents;