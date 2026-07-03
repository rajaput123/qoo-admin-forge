import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, Briefcase, UserCog, Search } from "lucide-react";

interface Person {
  id: string;
  name: string;
  phone: string;
}

const MOCK_DATA: Record<string, Person[]> = {
  devotees: [
    { id: "D001", name: "Ramesh Kumar", phone: "9876543210" },
    { id: "D002", name: "Lakshmi Devi", phone: "9876543211" },
    { id: "D003", name: "Suresh Reddy", phone: "9876543212" },
  ],
  volunteers: [
    { id: "V001", name: "Anitha Rao", phone: "9876543220" },
    { id: "V002", name: "Venkat Kumar", phone: "9876543221" },
    { id: "V003", name: "Priya Singh", phone: "9876543222" },
  ],
  freelancers: [
    { id: "F001", name: "Photographer - Pixel Studio", phone: "9876543230" },
    { id: "F002", name: "Decorator - Decor Dreams", phone: "9876543231" },
    { id: "F003", name: "Sound Engineer - Audio Pro", phone: "9876543232" },
  ],
  employees: [
    { id: "E001", name: "Gopala Sharma (Priest)", phone: "9876543240" },
    { id: "E002", name: "Ramachandra Dikshitar (Priest)", phone: "9876543241" },
    { id: "E003", name: "Security - Ravi Kumar", phone: "9876543242" },
  ],
};

const CATEGORY_META = [
  { key: "devotees", label: "Devotees", icon: Users, color: "bg-blue-100 text-blue-700" },
  { key: "volunteers", label: "Volunteers", icon: UserCheck, color: "bg-green-100 text-green-700" },
  { key: "freelancers", label: "Freelancers", icon: Briefcase, color: "bg-purple-100 text-purple-700" },
  { key: "employees", label: "Employees", icon: UserCog, color: "bg-amber-100 text-amber-700" },
];

const ManpowerStep = () => {
  const [selected, setSelected] = useState<Record<string, Set<string>>>({
    devotees: new Set(), volunteers: new Set(), freelancers: new Set(), employees: new Set(),
  });
  const [searches, setSearches] = useState<Record<string, string>>({
    devotees: "", volunteers: "", freelancers: "", employees: "",
  });

  const togglePerson = (category: string, id: string) => {
    setSelected((prev) => {
      const s = new Set(prev[category]);
      if (s.has(id)) s.delete(id); else s.add(id);
      return { ...prev, [category]: s };
    });
  };

  const totalSelected = Object.values(selected).reduce((sum, s) => sum + s.size, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Manpower Assignment</h3>
          <p className="text-sm text-muted-foreground mt-1">Select people for event execution</p>
        </div>
        {totalSelected > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">{totalSelected} assigned</Badge>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Tabs defaultValue="devotees">
          <TabsList className="w-full border-b bg-muted/30 rounded-none justify-start gap-0 p-0 h-auto">
            {CATEGORY_META.map((cat) => (
              <TabsTrigger key={cat.key} value={cat.key} className="gap-1.5 text-xs rounded-none py-2.5 px-4">
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
                {selected[cat.key].size > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{selected[cat.key].size}</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORY_META.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="p-4 space-y-3 mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${cat.label.toLowerCase()}...`}
                  value={searches[cat.key]}
                  onChange={(e) => setSearches((p) => ({ ...p, [cat.key]: e.target.value }))}
                  className="pl-9"
                />
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {MOCK_DATA[cat.key]
                  .filter((p) => p.name.toLowerCase().includes(searches[cat.key].toLowerCase()))
                  .map((person) => {
                    const isSelected = selected[cat.key].has(person.id);
                    return (
                      <div
                        key={person.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-primary/5 border-primary/30" : "hover:bg-muted/50"}`}
                        onClick={() => togglePerson(cat.key, person.id)}
                      >
                        <Checkbox checked={isSelected} />
                        <div className={`p-2 rounded-lg ${cat.color}`}>
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.phone}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ManpowerStep;