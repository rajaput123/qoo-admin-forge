
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Bell, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommunicationSettings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">Communication Settings</h2>
                <p className="text-muted-foreground">Manage email, SMS, and push notification templates and triggers.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Email */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="smtpHost">SMTP Host</Label>
                            <Input id="smtpHost" placeholder="smtp.gmail.com" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="port">Port</Label>
                            <Input id="port" placeholder="587" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="senderEmail">Sender Email</Label>
                            <Input id="senderEmail" type="email" placeholder="notifications@temple.com" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailPassword">Password</Label>
                            <Input id="emailPassword" type="password" placeholder="••••••••" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: SMS */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> SMS
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="smsProvider">Provider</Label>
                            <Select defaultValue="twilio">
                                <SelectTrigger id="smsProvider" className="border-primary/20 focus:ring-primary">
                                    <SelectValue placeholder="Select Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="twilio">Twilio</SelectItem>
                                    <SelectItem value="msg91">MSG91</SelectItem>
                                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                                    <div className="border-t border-primary/10 my-1"></div>
                                    <SelectItem value="add_new" className="text-primary font-medium flex items-center gap-2 cursor-pointer bg-primary/5 hover:bg-primary/10">
                                        <PlusCircle className="h-4 w-4" /> Add Provider
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smsApiKey">SMS API Key</Label>
                            <Input id="smsApiKey" type="password" placeholder="Key_..." className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="senderId">Sender ID</Label>
                            <Input id="senderId" placeholder="TEMPLE" maxLength={6} className="border-primary/20 focus-visible:ring-primary font-mono uppercase" />
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: WhatsApp */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-green-600" /> WhatsApp
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="waApiKey">API Key</Label>
                            <Input id="waApiKey" type="password" placeholder="WA_Key_..." className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waNumber">Business Number</Label>
                            <Input id="waNumber" placeholder="+91 99999 99999" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="pt-2">
                            <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800">
                                Integrate with WhatsApp Business API to send automated updates.
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4: Notifications Trigger */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base text-primary flex items-center gap-2">
                            <Bell className="h-4 w-4" /> Triggers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="bookingConf" className="text-sm font-medium cursor-pointer">Booking Confirmation</Label>
                            <Switch id="bookingConf" className="data-[state=checked]:bg-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="donationReceipt" className="text-sm font-medium cursor-pointer">Donation Receipt</Label>
                            <Switch id="donationReceipt" className="data-[state=checked]:bg-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="taskNotif" className="text-sm font-medium cursor-pointer">Task Notification</Label>
                            <Switch id="taskNotif" className="data-[state=checked]:bg-primary" defaultChecked />
                        </div>
                        <div className="space-y-2 pt-2 border-t border-primary/10">
                            <Label htmlFor="eventReminder">Reminder Before Event</Label>
                            <div className="relative">
                                <Input id="eventReminder" type="number" defaultValue="24" className="border-primary/20 focus-visible:ring-primary pr-12" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Hours</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="fixed bottom-6 right-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-8">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default CommunicationSettings;
