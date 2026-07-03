
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Building2, Globe, Palette, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrganizationSettings = () => {
    const [logo, setLogo] = useState<string | null>(null);
    const [invoiceLogo, setInvoiceLogo] = useState<string | null>(null);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">Organization Settings</h2>
                <p className="text-muted-foreground">Manage your temple's identity, regional preferences, and branding.</p>
            </div>

            <Tabs defaultValue="basic" className="w-full space-y-6">
                <TabsList className="bg-primary/5 p-1 rounded-lg w-full justify-start h-auto">
                    <TabsTrigger
                        value="basic"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2"
                    >
                        Basic Information
                    </TabsTrigger>
                    <TabsTrigger
                        value="regional"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2"
                    >
                        Regional Settings
                    </TabsTrigger>

                </TabsList>

                {/* Tab 1: Basic Information */}
                <TabsContent value="basic">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Building2 className="h-5 w-5" /> Basic Information
                            </CardTitle>
                            <CardDescription>Enter the core details of your temple organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex flex-col items-center space-y-3">
                                    <Avatar className="h-32 w-32 border-2 border-dashed border-primary/30 bg-primary/5">
                                        <AvatarImage src={logo || ""} />
                                        <AvatarFallback className="text-primary bg-primary/5 text-lg">Logo</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/5 w-full" onClick={() => document.getElementById('logo-upload')?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                    <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => setLogo(e.target?.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                    <p className="text-[10px] text-muted-foreground text-center">
                                        Recommended: 500x500px<br />PGN or JPG
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="templeName">Temple Name</Label>
                                        <Input id="templeName" placeholder="e.g. Sri Venkateswara Temple" className="border-primary/20 focus-visible:ring-primary h-10" defaultValue="Sri Venkateswara Temple" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="regNumber">Registration Number</Label>
                                            <Input id="regNumber" placeholder="Reg. No." className="border-primary/20 focus-visible:ring-primary" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="gstNumber">GST Number</Label>
                                            <Input id="gstNumber" placeholder="GSTIN" className="border-primary/20 focus-visible:ring-primary" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Contact Email</Label>
                                            <Input id="email" type="email" placeholder="contact@temple.com" className="border-primary/20 focus-visible:ring-primary" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input id="phone" type="tel" placeholder="+91 99999 99999" className="border-primary/20 focus-visible:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Regional Settings */}
                <TabsContent value="regional">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Globe className="h-5 w-5" /> Regional Settings
                            </CardTitle>
                            <CardDescription>Configure localization preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label>Timezone</Label>
                                <Select defaultValue="ist">
                                    <SelectTrigger className="border-primary/20 focus:ring-primary">
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ist">(GMT+05:30) India Standard Time</SelectItem>
                                        <SelectItem value="utc">(GMT+00:00) UTC</SelectItem>
                                        <SelectItem value="est">(GMT-05:00) Eastern Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Default Currency</Label>
                                <Select defaultValue="inr">
                                    <SelectTrigger className="border-primary/20 focus:ring-primary">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inr">INR (₹)</SelectItem>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Date Format</Label>
                                <Select defaultValue="ddmmyyyy">
                                    <SelectTrigger className="border-primary/20 focus:ring-primary">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                                        <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                                        <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger className="border-primary/20 focus:ring-primary">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                        <SelectItem value="ta">Tamil</SelectItem>
                                        <SelectItem value="te">Telugu</SelectItem>
                                        <SelectItem value="kn">Kannada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>

            <div className="fixed bottom-6 right-6 z-50">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl rounded-full px-8 h-12 text-base animate-in fade-in zoom-in duration-300">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default OrganizationSettings;
