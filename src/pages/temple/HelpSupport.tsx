import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
};

const CATEGORIES = ["General", "Bookings", "Donations", "Sevas", "Account", "Payments"];

const seed: Faq[] = [
  {
    id: "1",
    question: "How do I book a seva online?",
    answer:
      "Go to the Sevas section, choose your preferred seva, select a date and slot, then complete the payment. A receipt will be emailed to you.",
    category: "Sevas",
    published: true,
  },
  {
    id: "2",
    question: "Can I get an 80G receipt for my donation?",
    answer:
      "Yes. All donations marked as eligible automatically generate an 80G compliant receipt that you can download from your devotee profile.",
    category: "Donations",
    published: true,
  },
  {
    id: "3",
    question: "What is the temple darshan timing?",
    answer:
      "Morning darshan: 6:00 AM – 12:30 PM. Evening darshan: 4:00 PM – 8:30 PM. Timings may vary on festival days.",
    category: "General",
    published: true,
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Faq[]>(seed);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(seed[0]?.id ?? null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<Omit<Faq, "id">>({
    question: "",
    answer: "",
    category: "General",
    published: true,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "General", published: true });
    setDialogOpen(true);
  };

  const openEdit = (f: Faq) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, published: f.published });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Please enter both question and answer");
      return;
    }
    if (editing) {
      setFaqs((arr) => arr.map((f) => (f.id === editing.id ? { ...editing, ...form } : f)));
      toast.success("FAQ updated");
    } else {
      const newFaq: Faq = { id: crypto.randomUUID(), ...form };
      setFaqs((arr) => [newFaq, ...arr]);
      toast.success("FAQ added");
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => {
    setFaqs((arr) => arr.filter((f) => f.id !== id));
    toast.success("FAQ deleted");
  };

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filter === "all" || f.category === filter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-background to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/temple-hub")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hub
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">Help & Support</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground">
            Browse frequently asked questions or reach out to our team.
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card className="p-10 text-center text-muted-foreground">
              No FAQs found. Click "Add FAQ" to create one.
            </Card>
          )}
          <AnimatePresence initial={false}>
            {filtered.map((f) => {
              const isOpen = openId === f.id;
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex items-start gap-2 p-4">
                      <button
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                        className="flex-1 text-left flex items-start gap-3"
                      >
                        <ChevronDown
                          className={`h-4 w-4 mt-1 text-muted-foreground transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{f.question}</span>
                            <Badge variant="secondary" className="text-xs">
                              {f.category}
                            </Badge>
                            {!f.published && (
                              <Badge variant="outline" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(f)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(f.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pl-11 text-sm text-muted-foreground whitespace-pre-wrap">
                            {f.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Contact strip */}
        <div className="grid sm:grid-cols-3 gap-3 mt-10">
          <Card className="p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium">support@devalaya.app</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="text-sm font-medium">+91 80000 12345</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">WhatsApp</div>
              <div className="text-sm font-medium">Chat with us</div>
            </div>
          </Card>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question</label>
              <Input
                placeholder="e.g. How can I cancel a booking?"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                rows={5}
                placeholder="Write a clear, helpful answer..."
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.published ? "pub" : "draft"}
                  onValueChange={(v) => setForm({ ...form, published: v === "pub" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pub">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add FAQ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpSupport;