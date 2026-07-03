import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DonationConfigSectionProps {
    onConfigChange?: (config: any) => void;
}

const DonationConfigSection = ({ onConfigChange }: DonationConfigSectionProps) => {
    const [donationGoal, setDonationGoal] = useState(100000);
    const [minDonation, setMinDonation] = useState(100);
    const [transparencyNote, setTransparencyNote] = useState("");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Donation Goal (₹)</Label>
                    <Input
                        type="number"
                        value={donationGoal}
                        onChange={(e) => setDonationGoal(parseInt(e.target.value) || 0)}
                        placeholder="100000"
                        className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Target amount for this campaign</p>
                </div>
                <div>
                    <Label>Minimum Donation (₹)</Label>
                    <Input
                        type="number"
                        value={minDonation}
                        onChange={(e) => setMinDonation(parseInt(e.target.value) || 0)}
                        placeholder="100"
                        className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minimum accepted amount</p>
                </div>
            </div>

            <div>
                <Label>Transparency Note</Label>
                <Textarea
                    value={transparencyNote}
                    onChange={(e) => setTransparencyNote(e.target.value)}
                    placeholder="Explain how donations will be used for this event..."
                    rows={3}
                    className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Clear explanation builds trust with donors
                </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Donation tracking, receipts, and donor management will be available in the event detail page.
                </p>
            </div>
        </div>
    );
};

export default DonationConfigSection;
