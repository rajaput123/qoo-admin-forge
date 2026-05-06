
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, AlertCircle, PlusCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FinancialSettings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">Financial Configuration</h2>
                <p className="text-muted-foreground">Configure payment methods and transactional settings.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1: Payment Gateway */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center gap-2 text-primary text-base">
                            <CreditCard className="h-4 w-4" /> Payment Gateway
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="gateway">Gateway Name</Label>
                            <Select defaultValue="razorpay">
                                <SelectTrigger id="gateway" className="border-primary/20 focus:ring-primary">
                                    <SelectValue placeholder="Select Gateway" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="razorpay">Razorpay</SelectItem>
                                    <SelectItem value="stripe">Stripe</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                    <SelectItem value="payu">PayU</SelectItem>
                                    <div className="border-t border-primary/10 my-1"></div>
                                    <SelectItem value="add_new" className="text-primary font-medium flex items-center gap-2 cursor-pointer bg-primary/5 hover:bg-primary/10">
                                        <PlusCircle className="h-4 w-4" /> Add Gateway
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input id="apiKey" type="password" placeholder="rzp_test_..." className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secretKey">Secret Key</Label>
                            <Input id="secretKey" type="password" placeholder="Keep this secret" className="border-primary/20 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="webhook">Webhook URL</Label>
                            <div className="flex">
                                <Input id="webhook" value="https://api.temple.com/webhooks/payment" readOnly className="border-primary/20 bg-muted/50 focus-visible:ring-primary rounded-r-none" />
                                <Button variant="outline" className="rounded-l-none border-l-0 border-primary/20 text-primary">Copy</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Tax & Charges */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center gap-2 text-primary text-base">
                            <Wallet className="h-4 w-4" /> Tax & Charges
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="tax">Tax % (GST/VAT)</Label>
                            <div className="relative">
                                <Input id="tax" type="number" placeholder="0" defaultValue="18" className="border-primary/20 focus-visible:ring-primary pr-8" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="platformFee">Platform Commission %</Label>
                            <div className="relative">
                                <Input id="platformFee" type="number" placeholder="0" defaultValue="2.5" className="border-primary/20 focus-visible:ring-primary pr-8" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="serviceCharge">Service Charge %</Label>
                            <div className="relative">
                                <Input id="serviceCharge" type="number" placeholder="0" defaultValue="0" className="border-primary/20 focus-visible:ring-primary pr-8" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Settlement */}
                <Card className="border-primary/20 shadow-sm relative overflow-hidden">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center gap-2 text-primary text-base">
                            <AlertCircle className="h-4 w-4" /> Settlement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="settlementCycle">Settlement Cycle</Label>
                            <Select defaultValue="t1">
                                <SelectTrigger id="settlementCycle" className="border-primary/20 focus:ring-primary">
                                    <SelectValue placeholder="Select Cycle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant Settlement</SelectItem>
                                    <SelectItem value="t1">T+1 Day</SelectItem>
                                    <SelectItem value="t2">T+2 Days</SelectItem>
                                    <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                                    <div className="border-t border-primary/10 my-1"></div>
                                    <SelectItem value="add_new" className="text-primary font-medium flex items-center gap-2 cursor-pointer bg-primary/5 hover:bg-primary/10">
                                        <PlusCircle className="h-4 w-4" /> Custom Cycle
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-2">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Manual Payout Approval</Label>
                                <p className="text-xs text-muted-foreground">Require admin approval for all payouts</p>
                            </div>
                            <Switch className="data-[state=checked]:bg-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="fixed bottom-6 right-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-8 h-12 text-base">
                    Save Configuration
                </Button>
            </div>
        </div>
    );
};

export default FinancialSettings;
