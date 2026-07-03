import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Save, Users, Building2, FileText } from "lucide-react";
import { toast } from "sonner";
import { NeftRtgsRemittanceForm } from "@/components/finance/NeftRtgsRemittanceForm";
import {
  defaultNeftRtgsTemplate,
  emptyNeftRtgsForm,
  payrollBeneficiaryPresets,
  vendorBeneficiaryPresets,
  type NeftRtgsFormData,
} from "@/data/neftRtgsTemplateData";

const NeftRtgsFormPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as NeftRtgsFormData["entryType"]) || "other";
  const [form, setForm] = useState<NeftRtgsFormData>(() => ({ ...emptyNeftRtgsForm(), entryType: initialType }));
  const [preset, setPreset] = useState("");

  const patch = (p: Partial<NeftRtgsFormData>) => setForm((prev) => ({ ...prev, ...p }));

  const applyPreset = (id: string) => {
    setPreset(id);
    const list = form.entryType === "payroll" ? payrollBeneficiaryPresets : vendorBeneficiaryPresets;
    const item = list.find((_, i) => String(i) === id);
    if (item) {
      patch({
        beneficiaryName: item.beneficiaryName,
        beneficiaryAccountNo: item.beneficiaryAccountNo,
        ifscCode: item.ifscCode,
        beneficiaryBankName: item.beneficiaryBankName,
        beneficiaryBranchName: item.beneficiaryBranchName,
        chequeAmount: item.chequeAmount,
        purpose: item.purpose,
        paymentHead: item.paymentHead,
        billNo: "billNo" in item ? String((item as { billNo?: unknown }).billNo ?? "") : "",
      });
    }
  };

  const handleSave = () => {
    if (!form.beneficiaryName || !form.beneficiaryAccountNo || !form.ifscCode) {
      toast.error("Beneficiary name, account no. and IFSC are required");
      return;
    }
    toast.success("NEFT/RTGS form saved (mock)");
  };

  const presets = form.entryType === "payroll" ? payrollBeneficiaryPresets : form.entryType === "vendor" ? vendorBeneficiaryPresets : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm max-w-xl">
          Dedicated NEFT/RTGS remittance form using the temple bank template — Customer Copy and Banker&apos;s Copy for payroll, vendor, and other payments.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1.5" /> Save
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" /> Print Form
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Entry type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={form.entryType}
            onValueChange={(v) => {
              patch({ entryType: v as NeftRtgsFormData["entryType"] });
              setPreset("");
            }}
          >
            <TabsList>
              <TabsTrigger value="payroll" className="gap-1.5">
                <Users className="h-3.5 w-3.5" /> Payroll
              </TabsTrigger>
              <TabsTrigger value="vendor" className="gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Vendor
              </TabsTrigger>
              <TabsTrigger value="other" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Other
              </TabsTrigger>
            </TabsList>
            <TabsContent value="payroll" className="mt-4 text-sm text-muted-foreground">
              Generate bank remittance for salary disbursement. Select an employee to pre-fill beneficiary details.
            </TabsContent>
            <TabsContent value="vendor" className="mt-4 text-sm text-muted-foreground">
              Vendor payment remittance linked to bills and invoices.
            </TabsContent>
            <TabsContent value="other" className="mt-4 text-sm text-muted-foreground">
              General NEFT/RTGS entry for donations refund, utilities, or other transfers.
            </TabsContent>
          </Tabs>

          {presets.length > 0 && (
            <div className="space-y-1.5 max-w-md">
              <Label>Load from {form.entryType === "payroll" ? "employee" : "vendor"}</Label>
              <Select value={preset} onValueChange={applyPreset}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={`Select ${form.entryType}…`} />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((p, i) => (
                    <SelectItem key={p.label} value={String(i)}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Temple template: {defaultNeftRtgsTemplate.bankName}, {defaultNeftRtgsTemplate.branchName} · Debit A/C {defaultNeftRtgsTemplate.debitAccountNo}
          </p>
        </CardContent>
      </Card>

      <Card className="print:border-0 print:shadow-none">
        <CardContent className="p-4 lg:p-6 print:p-0">
          <NeftRtgsRemittanceForm
            template={defaultNeftRtgsTemplate}
            data={form}
            onChange={patch}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NeftRtgsFormPage;
