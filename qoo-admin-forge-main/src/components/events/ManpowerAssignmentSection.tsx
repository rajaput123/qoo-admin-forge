import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, Briefcase, UserCog, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in real app, fetch from API
const MOCK_DEVOTEES = [
    { id: "D001", name: "Ramesh Kumar", phone: "9876543210" },
    { id: "D002", name: "Lakshmi Devi", phone: "9876543211" },
    { id: "D003", name: "Suresh Reddy", phone: "9876543212" },
];

const MOCK_VOLUNTEERS = [
    { id: "V001", name: "Anitha Rao", phone: "9876543220" },
    { id: "V002", name: "Venkat Kumar", phone: "9876543221" },
    { id: "V003", name: "Priya Singh", phone: "9876543222" },
];

const MOCK_FREELANCERS = [
    { id: "F001", name: "Photographer - Pixel Studio", phone: "9876543230" },
    { id: "F002", name: "Decorator - Decor Dreams", phone: "9876543231" },
    { id: "F003", name: "Sound Engineer - Audio Pro", phone: "9876543232" },
];

const MOCK_EMPLOYEES = [
    { id: "E001", name: "Gopala Sharma (Priest)", phone: "9876543240" },
    { id: "E002", name: "Ramachandra Dikshitar (Priest)", phone: "9876543241" },
    { id: "E003", name: "Security - Ravi Kumar", phone: "9876543242" },
];

interface Person {
    id: string;
    name: string;
    phone: string;
}

interface ManpowerAssignmentSectionProps {
    onManpowerChange?: (selected: { [category: string]: string[] }) => void;
}

const ManpowerAssignmentSection = ({ onManpowerChange }: ManpowerAssignmentSectionProps) => {
    const [selectedDevotees, setSelectedDevotees] = useState<string[]>([]);
    const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
    const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const [searchDevotees, setSearchDevotees] = useState("");
    const [searchVolunteers, setSearchVolunteers] = useState("");
    const [searchFreelancers, setSearchFreelancers] = useState("");
    const [searchEmployees, setSearchEmployees] = useState("");

    const toggleSelection = (category: string, id: string) => {
        let updated: string[] = [];
        switch (category) {
            case "devotees":
                updated = selectedDevotees.includes(id)
                    ? selectedDevotees.filter((i) => i !== id)
                    : [...selectedDevotees, id];
                setSelectedDevotees(updated);
                break;
            case "volunteers":
                updated = selectedVolunteers.includes(id)
                    ? selectedVolunteers.filter((i) => i !== id)
                    : [...selectedVolunteers, id];
                setSelectedVolunteers(updated);
                break;
            case "freelancers":
                updated = selectedFreelancers.includes(id)
                    ? selectedFreelancers.filter((i) => i !== id)
                    : [...selectedFreelancers, id];
                setSelectedFreelancers(updated);
                break;
            case "employees":
                updated = selectedEmployees.includes(id)
                    ? selectedEmployees.filter((i) => i !== id)
                    : [...selectedEmployees, id];
                setSelectedEmployees(updated);
                break;
        }

        onManpowerChange?.({
            devotees: category === "devotees" ? updated : selectedDevotees,
            volunteers: category === "volunteers" ? updated : selectedVolunteers,
            freelancers: category === "freelancers" ? updated : selectedFreelancers,
            employees: category === "employees" ? updated : selectedEmployees,
        });
    };

    const filterPeople = (people: Person[], search: string) => {
        return people.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
        );
    };

    const totalSelected =
        selectedDevotees.length +
        selectedVolunteers.length +
        selectedFreelancers.length +
        selectedEmployees.length;

    const renderPeopleList = (
        people: Person[],
        selected: string[],
        category: string,
        search: string,
        icon: any,
        color: string
    ) => {
        const filtered = filterPeople(people, search);
        const Icon = icon;

        return (
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
                ) : (
                    filtered.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleSelection(category, person.id)}
                        >
                            <Checkbox checked={selected.includes(person.id)} />
                            <div className={`p-2 rounded-lg ${color}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{person.name}</p>
                                <p className="text-xs text-muted-foreground">{person.phone}</p>
                            </div>
                            {selected.includes(person.id) && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                                    Selected
                                </Badge>
                            )}
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium">Select Manpower</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Choose people from each category for this event
                        </p>
                    </div>
                    {totalSelected > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {totalSelected} selected
                        </Badge>
                    )}
                </div>

                <Tabs defaultValue="devotees" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="devotees" className="gap-2 text-xs">
                            <Users className="h-3 w-3" />
                            Devotees
                            {selectedDevotees.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                    {selectedDevotees.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="volunteers" className="gap-2 text-xs">
                            <UserCheck className="h-3 w-3" />
                            Volunteers
                            {selectedVolunteers.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                    {selectedVolunteers.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="freelancers" className="gap-2 text-xs">
                            <Briefcase className="h-3 w-3" />
                            Freelancers
                            {selectedFreelancers.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                    {selectedFreelancers.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="employees" className="gap-2 text-xs">
                            <UserCog className="h-3 w-3" />
                            Employees
                            {selectedEmployees.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                    {selectedEmployees.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="devotees" className="space-y-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search devotees..."
                                value={searchDevotees}
                                onChange={(e) => setSearchDevotees(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto pr-2">
                            {renderPeopleList(
                                MOCK_DEVOTEES,
                                selectedDevotees,
                                "devotees",
                                searchDevotees,
                                Users,
                                "bg-blue-100 text-blue-700"
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="volunteers" className="space-y-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search volunteers..."
                                value={searchVolunteers}
                                onChange={(e) => setSearchVolunteers(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto pr-2">
                            {renderPeopleList(
                                MOCK_VOLUNTEERS,
                                selectedVolunteers,
                                "volunteers",
                                searchVolunteers,
                                UserCheck,
                                "bg-green-100 text-green-700"
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="freelancers" className="space-y-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search freelancers..."
                                value={searchFreelancers}
                                onChange={(e) => setSearchFreelancers(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto pr-2">
                            {renderPeopleList(
                                MOCK_FREELANCERS,
                                selectedFreelancers,
                                "freelancers",
                                searchFreelancers,
                                Briefcase,
                                "bg-purple-100 text-purple-700"
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="employees" className="space-y-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                value={searchEmployees}
                                onChange={(e) => setSearchEmployees(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto pr-2">
                            {renderPeopleList(
                                MOCK_EMPLOYEES,
                                selectedEmployees,
                                "employees",
                                searchEmployees,
                                UserCog,
                                "bg-amber-100 text-amber-700"
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Selected people will be notified. You can manage duties and shifts in the event detail page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManpowerAssignmentSection;
