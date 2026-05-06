
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Settings2, Calendar, DollarSign, CheckSquare, Ticket } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ModulePoliciesSettings = () => {
    const [bookingOpen, setBookingOpen] = useState(true);
    const [donationOpen, setDonationOpen] = useState(true);
    const [taskOpen, setTaskOpen] = useState(true);
    const [eventOpen, setEventOpen] = useState(true);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">Module Policies</h2>
                <p className="text-muted-foreground">Configure behavior and rules for different modules.</p>
            </div>

            {/* Section A: Booking Policies */}
            <Collapsible open={bookingOpen} onOpenChange={setBookingOpen}>
                <Card className="border-primary/20 shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <CardTitle className="text-base text-primary">Booking Policies</CardTitle>
                                        <CardDescription>Configure booking approval and cancellation rules</CardDescription>
                                    </div>
                                </div>
                                {bookingOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Booking Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Bookings require manual approval before confirmation</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label className="text-base">Cancellation Window (hours)</Label>
                                    <p className="text-sm text-muted-foreground">Minimum hours before booking time to allow cancellation</p>
                                </div>
                                <Input type="number" defaultValue="24" className="w-24 border-primary/20 focus-visible:ring-primary" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Confirmation</Label>
                                    <p className="text-sm text-muted-foreground">Automatically confirm bookings without approval</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Waitlist Enabled</Label>
                                    <p className="text-sm text-muted-foreground">Allow users to join waitlist when slots are full</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Section B: Donation Policies */}
            <Collapsible open={donationOpen} onOpenChange={setDonationOpen}>
                <Card className="border-primary/20 shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <CardTitle className="text-base text-primary">Donation Policies</CardTitle>
                                        <CardDescription>Manage donation acceptance and receipt settings</CardDescription>
                                    </div>
                                </div>
                                {donationOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Anonymous Donation Allowed</Label>
                                    <p className="text-sm text-muted-foreground">Donors can choose to remain anonymous</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Receipt Generation</Label>
                                    <p className="text-sm text-muted-foreground">Automatically generate and email receipts</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Refund Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Donation refunds require manual approval</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label className="text-base">Minimum Donation Amount</Label>
                                    <p className="text-sm text-muted-foreground">Minimum amount required for donations (₹)</p>
                                </div>
                                <Input type="number" defaultValue="100" className="w-32 border-primary/20 focus-visible:ring-primary" />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Section C: Task Policies */}
            <Collapsible open={taskOpen} onOpenChange={setTaskOpen}>
                <Card className="border-primary/20 shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <CheckSquare className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <CardTitle className="text-base text-primary">Task Policies</CardTitle>
                                        <CardDescription>Configure task assignment and completion rules</CardDescription>
                                    </div>
                                </div>
                                {taskOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Assign Enabled</Label>
                                    <p className="text-sm text-muted-foreground">Automatically assign tasks to available staff</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Completion Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Task completion requires supervisor approval</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label className="text-base">Escalation Time (hours)</Label>
                                    <p className="text-sm text-muted-foreground">Hours before escalating overdue tasks</p>
                                </div>
                                <Input type="number" defaultValue="48" className="w-24 border-primary/20 focus-visible:ring-primary" />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Section D: Event Policies */}
            <Collapsible open={eventOpen} onOpenChange={setEventOpen}>
                <Card className="border-primary/20 shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Ticket className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <CardTitle className="text-base text-primary">Event Policies</CardTitle>
                                        <CardDescription>Configure event publishing and ticketing settings</CardDescription>
                                    </div>
                                </div>
                                {eventOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Event Publish Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Events must be approved before being published</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Ticketing Enabled</Label>
                                    <p className="text-sm text-muted-foreground">Enable ticket sales for events</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5 flex-1">
                                    <Label className="text-base">Capacity Auto Close %</Label>
                                    <p className="text-sm text-muted-foreground">Auto-close registration when capacity reaches %</p>
                                </div>
                                <Input type="number" defaultValue="95" min="1" max="100" className="w-24 border-primary/20 focus-visible:ring-primary" />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            <div className="fixed bottom-6 right-6 z-50">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl rounded-full px-8 h-12 text-base">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default ModulePoliciesSettings;
