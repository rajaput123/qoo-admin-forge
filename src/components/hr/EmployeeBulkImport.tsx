import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Clipboard, Download, CheckCircle, AlertTriangle, ArrowRight, Trash2, HelpCircle, Info } from "lucide-react";
import type { Employee } from "@/types/hr";
import * as XLSX from "xlsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (importedEmployees: Partial<Employee>[]) => void;
}

interface ParsedRow {
  index: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mpin: string;
  department: string;
  designation: string;
  joiningDate: string;
  basicSalary: number;
  status: "active" | "inactive" | "on_leave";
  // Extra fields
  employeeCode?: string;
  employmentType?: string;
  jobDescription?: string;
  probationEndDate?: string;
  confirmationDate?: string;
  noticePeriod?: number;
  currentAddress?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  shift?: string;
  workLocation?: string;
  leavePolicy?: string;
  casualLeave?: number;
  sickLeave?: number;
  earnedLeave?: number;
  paymentMode?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  nationality?: string;
  religion?: string;
  aadharNumber?: string;
  panNumber?: string;
  errors: string[];
}

// Case-insensitive dictionary configurations to map headers to employee fields dynamically
const HEADER_DICTIONARY: Record<keyof Omit<ParsedRow, "index" | "errors">, string[]> = {
  firstName: ["first name", "firstname", "first_name", "first name*"],
  lastName: ["last name", "lastname", "last_name", "last name*"],
  email: ["email", "mail", "email address", "email id", "email*"],
  phone: ["phone", "mobile", "contact", "phone number", "mobile number", "phone*"],
  mpin: ["mpin", "pin", "mpin*", "security pin"],
  department: ["department", "dept", "dept name", "department*"],
  designation: ["designation", "role", "job", "position", "designation*"],
  joiningDate: ["join date", "joining date", "date of join", "date of joining", "joining date*"],
  basicSalary: ["basic salary", "salary", "monthly salary", "pay", "monthly salary*", "basic salary*"],
  status: ["status", "state", "employee status"],
  employeeCode: ["employee code", "employee id", "emp code", "emp id", "code"],
  employmentType: ["employment type", "type", "emp type", "status type"],
  jobDescription: ["job description", "job desc", "jd", "description"],
  probationEndDate: ["probation end date", "probation date", "probation end"],
  confirmationDate: ["confirmation date", "confirm date", "confirmation"],
  noticePeriod: ["notice period", "notice"],
  currentAddress: ["current address", "address", "present address"],
  permanentAddress: ["permanent address", "perm address"],
  city: ["city"],
  state: ["state"],
  pincode: ["pincode", "zip", "zipcode", "pin code"],
  emergencyContact: ["emergency contact", "emergency contact name", "emergency name"],
  emergencyPhone: ["emergency phone", "emergency contact phone", "emergency mobile"],
  emergencyRelation: ["emergency relation", "relation"],
  shift: ["shift", "shift id", "shift name"],
  workLocation: ["work location", "location", "office location"],
  leavePolicy: ["leave policy", "leave policy name", "policy"],
  casualLeave: ["casual leave", "casual leaves", "cl"],
  sickLeave: ["sick leave", "sick leaves", "sl"],
  earnedLeave: ["earned leave", "earned leaves", "el"],
  paymentMode: ["payment mode", "pay mode", "salary payment mode"],
  bankName: ["bank name", "bank"],
  accountNumber: ["account number", "account no", "acc no", "bank account number"],
  ifscCode: ["ifsc code", "ifsc"],
  dateOfBirth: ["date of birth", "dob", "birth date"],
  gender: ["gender", "sex"],
  bloodGroup: ["blood group", "blood"],
  maritalStatus: ["marital status", "marital"],
  nationality: ["nationality"],
  religion: ["religion"],
  aadharNumber: ["aadhar number", "aadhar", "adhar number", "adhar"],
  panNumber: ["pan number", "pan", "pan card"]
};

export function EmployeeBulkImport({ open, onOpenChange, onImport }: Props) {
  const [inputText, setInputText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download complete template as Excel (.xlsx) file containing all 38 columns
  const handleDownloadTemplate = () => {
    try {
      const headers = [
        "First Name*",
        "Last Name*",
        "Email*",
        "Phone*",
        "MPIN*",
        "Department*",
        "Designation*",
        "Joining Date*",
        "Monthly Salary*",
        "Employee Code",
        "Employment Type",
        "Job Description",
        "Probation End Date",
        "Confirmation Date",
        "Notice Period (Days)",
        "Current Address",
        "Permanent Address",
        "City",
        "State",
        "Pincode",
        "Emergency Contact",
        "Emergency Phone",
        "Emergency Relation",
        "Shift",
        "Work Location",
        "Leave Policy",
        "Casual Leave",
        "Sick Leave",
        "Earned Leave",
        "Payment Mode",
        "Bank Name",
        "Account Number",
        "IFSC Code",
        "Date of Birth",
        "Gender",
        "Blood Group",
        "Marital Status",
        "Nationality",
        "Religion",
        "Aadhar Number",
        "PAN Number",
        "Status"
      ];

      const data = [
        [
          "Rahul",
          "Sharma",
          "rahul@temple.org",
          "+91 9876543210",
          "1234",
          "Finance",
          "Accountant",
          "2026-06-01",
          "25000",
          "EMP-0041",
          "full_time",
          "Handles daily financial statements",
          "2026-09-01",
          "2026-09-01",
          "30",
          "123, Temple Road",
          "123, Temple Road",
          "Delhi",
          "Delhi",
          "110001",
          "Sanjay Sharma",
          "+91 9988776655",
          "Father",
          "General Shift",
          "Main Temple",
          "standard",
          "12",
          "10",
          "15",
          "bank",
          "State Bank of India",
          "100020003000",
          "SBIN0000001",
          "1990-05-15",
          "male",
          "O+",
          "married",
          "Indian",
          "Hindu",
          "1234 5678 9012",
          "ABCDE1234F",
          "active"
        ],
        [
          "Priya",
          "Patel",
          "priya@temple.org",
          "+91 8877665544",
          "4321",
          "Operations",
          "Administrator",
          "2026-05-15",
          "22000",
          "EMP-0042",
          "full_time",
          "Manages counter queues and seva schedules",
          "2026-08-15",
          "2026-08-15",
          "30",
          "456, Gauri Lane",
          "456, Gauri Lane",
          "Mumbai",
          "Maharashtra",
          "400001",
          "Ramesh Patel",
          "+91 9898989898",
          "Spouse",
          "Morning Shift",
          "Main Temple",
          "standard",
          "12",
          "10",
          "15",
          "bank",
          "HDFC Bank",
          "987654321",
          "HDFC0000001",
          "1993-10-20",
          "female",
          "A+",
          "married",
          "Indian",
          "Hindu",
          "9876 5432 1098",
          "XYZWR9876Z",
          "on_leave"
        ]
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

      // Apply standard column widths
      ws["!cols"] = headers.map(() => ({ wch: 18 }));

      XLSX.utils.book_append_sheet(wb, ws, "Employees Onboarding");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee_comprehensive_template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel Template workbook downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate comprehensive template.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    const reader = new FileReader();
    if (isExcel) {
      reader.onload = (event) => {
        try {
          const ab = event.target?.result as ArrayBuffer;
          const wb = XLSX.read(ab, { type: "array" });
          const firstSheetName = wb.SheetNames[0];
          const worksheet = wb.Sheets[firstSheetName];
          const data = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: "" });
          processRawDataGrid(data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to parse Excel file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setInputText(text);
          processRawText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const processRawText = (text: string) => {
    if (!text.trim()) {
      toast.error("Please enter or upload some data first");
      return;
    }

    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return;

    const firstLine = lines[0];
    const isTab = firstLine.includes("\t");
    const separator = isTab ? "\t" : ",";

    const dataGrid: string[][] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      let parts: string[] = [];
      if (separator === ",") {
        const matches = trimmed.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || trimmed.split(",");
        parts = matches.map(p => p.replace(/^"|"$/g, "").trim());
      } else {
        parts = trimmed.split(separator).map(p => p.trim());
      }
      dataGrid.push(parts);
    }

    processRawDataGrid(dataGrid);
  };

  const processRawDataGrid = (grid: string[][]) => {
    if (grid.length === 0) {
      toast.error("The file is empty or could not be parsed.");
      return;
    }

    // Find header row
    let headerIndex = -1;
    for (let r = 0; r < grid.length; r++) {
      if (grid[r].some(cell => String(cell).trim() !== "")) {
        headerIndex = r;
        break;
      }
    }

    if (headerIndex === -1) {
      toast.error("No data rows found in sheet.");
      return;
    }

    const headers = grid[headerIndex].map(h => String(h).trim().toLowerCase());

    // Build mapping indices dynamically
    const mappings: Record<string, number> = {};
    
    Object.entries(HEADER_DICTIONARY).forEach(([fieldKey, aliases]) => {
      let foundIndex = -1;
      for (let c = 0; c < headers.length; c++) {
        const h = headers[c];
        // Clean header labels from stars (like Last Name* -> last name)
        const cleanH = h.replace(/\*/g, "").trim();
        if (aliases.includes(cleanH) || aliases.some(alias => cleanH.includes(alias))) {
          foundIndex = c;
          break;
        }
      }
      mappings[fieldKey] = foundIndex;
    });

    // Check required columns
    const missingHeaders: string[] = [];
    const requiredKeys: (keyof Omit<ParsedRow, "index" | "errors">)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "mpin",
      "department",
      "designation",
      "joiningDate",
      "basicSalary"
    ];

    const labelMap: Record<string, string> = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      mpin: "MPIN",
      department: "Department",
      designation: "Designation",
      joiningDate: "Joining Date",
      basicSalary: "Monthly Salary"
    };

    requiredKeys.forEach(k => {
      if (mappings[k] === -1) {
        missingHeaders.push(labelMap[k]);
      }
    });

    if (missingHeaders.length > 0) {
      toast.error(`Missing required column headers: ${missingHeaders.join(", ")}. Please align your Excel file headers.`, {
        duration: 6000
      });
      return;
    }

    const rows: ParsedRow[] = [];
    for (let r = headerIndex + 1; r < grid.length; r++) {
      const cells = grid[r];
      if (cells.length === 0 || cells.every(c => String(c).trim() === "")) {
        continue;
      }

      // Helper to fetch cell safely
      const getVal = (key: keyof Omit<ParsedRow, "index" | "errors">) => {
        const idx = mappings[key];
        if (idx === undefined || idx === -1 || idx >= cells.length) return "";
        return String(cells[idx]).trim();
      };

      const firstName = getVal("firstName");
      const lastName = getVal("lastName");
      const email = getVal("email");
      const phone = getVal("phone");
      const mpin = getVal("mpin");
      const department = getVal("department");
      const designation = getVal("designation");
      const joiningDateRaw = getVal("joiningDate");
      const basicSalaryRaw = getVal("basicSalary");
      const statusRaw = getVal("status").toLowerCase();

      // Optional helper extra details
      const employeeCode = getVal("employeeCode");
      const employmentType = getVal("employmentType") || "full_time";
      const jobDescription = getVal("jobDescription");
      const probationEndDate = getVal("probationEndDate");
      const confirmationDate = getVal("confirmationDate");
      const noticePeriod = parseInt(getVal("noticePeriod")) || 30;
      const currentAddress = getVal("currentAddress");
      const permanentAddress = getVal("permanentAddress");
      const city = getVal("city");
      const state = getVal("state");
      const pincode = getVal("pincode");
      const emergencyContact = getVal("emergencyContact");
      const emergencyPhone = getVal("emergencyPhone");
      const emergencyRelation = getVal("emergencyRelation");
      const shift = getVal("shift");
      const workLocation = getVal("workLocation") || "Main Temple";
      const leavePolicy = getVal("leavePolicy") || "standard";
      const casualLeave = parseInt(getVal("casualLeave")) || 12;
      const sickLeave = parseInt(getVal("sickLeave")) || 10;
      const earnedLeave = parseInt(getVal("earnedLeave")) || 15;
      const paymentMode = getVal("paymentMode") || "bank";
      const bankName = getVal("bankName");
      const accountNumber = getVal("accountNumber");
      const ifscCode = getVal("ifscCode");
      const dateOfBirth = getVal("dateOfBirth");
      const gender = getVal("gender") || "male";
      const bloodGroup = getVal("bloodGroup");
      const maritalStatus = getVal("maritalStatus") || "single";
      const nationality = getVal("nationality") || "Indian";
      const religion = getVal("religion");
      const aadharNumber = getVal("aadharNumber");
      const panNumber = getVal("panNumber");

      const errors: string[] = [];

      // Validations
      if (!firstName) errors.push("First Name is required.");
      if (!lastName) errors.push("Last Name is required.");
      
      if (!email) {
        errors.push("Email is required.");
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push("Invalid email format.");
        }
      }

      if (!phone) {
        errors.push("Phone number is required.");
      }

      if (!mpin) {
        errors.push("MPIN security pin is required.");
      } else if (!/^\d{4}$/.test(mpin)) {
        errors.push("MPIN must be exactly 4 numeric digits.");
      }

      if (!department) errors.push("Department is required.");
      if (!designation) errors.push("Designation is required.");

      const basicSalary = parseFloat(basicSalaryRaw.replace(/[^0-9.]/g, ""));
      if (isNaN(basicSalary) || basicSalary <= 0) {
        errors.push("Monthly Salary must be a positive number.");
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let joiningDate = joiningDateRaw;
      if (!joiningDate) {
        errors.push("Joining Date is required.");
      } else {
        const parsedDate = new Date(joiningDateRaw);
        if (!isNaN(parsedDate.getTime())) {
          joiningDate = parsedDate.toISOString().split("T")[0];
        } else if (!dateRegex.test(joiningDateRaw)) {
          errors.push("Joining Date format must be YYYY-MM-DD.");
        }
      }

      let status: "active" | "inactive" | "on_leave" = "active";
      if (statusRaw === "active" || statusRaw === "success" || statusRaw === "") {
        status = "active";
      } else if (statusRaw === "inactive" || statusRaw === "neutral" || statusRaw === "terminated") {
        status = "inactive";
      } else if (statusRaw === "on_leave" || statusRaw === "warning" || statusRaw === "leave") {
        status = "on_leave";
      } else {
        errors.push("Status must be active, inactive, or on_leave.");
      }

      rows.push({
        index: r - headerIndex,
        firstName,
        lastName,
        email,
        phone,
        mpin,
        department,
        designation,
        joiningDate,
        basicSalary: isNaN(basicSalary) ? 0 : basicSalary,
        status,
        // Extras
        employeeCode,
        employmentType,
        jobDescription,
        probationEndDate,
        confirmationDate,
        noticePeriod,
        currentAddress,
        permanentAddress,
        city,
        state,
        pincode,
        emergencyContact,
        emergencyPhone,
        emergencyRelation,
        shift,
        workLocation,
        leavePolicy,
        casualLeave,
        sickLeave,
        earnedLeave,
        paymentMode,
        bankName,
        accountNumber,
        ifscCode,
        dateOfBirth,
        gender,
        bloodGroup,
        maritalStatus,
        nationality,
        religion,
        aadharNumber,
        panNumber,
        errors
      });
    }

    setParsedRows(rows);
    setStep(2);
  };

  const handleImport = () => {
    const validRows = parsedRows.filter(r => r.errors.length === 0);
    if (validRows.length === 0) {
      toast.error("No valid records to import. Please correct errors and try again.");
      return;
    }

    onImport(validRows);
    toast.success(`Successfully imported ${validRows.length} employees into system database!`);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setInputText("");
    setParsedRows([]);
    setStep(1);
  };

  const errorCount = parsedRows.filter(r => r.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetState(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>Bulk Import Employees</span>
          </DialogTitle>
          <DialogDescription>
            Import comprehensive employee records from Excel matching the onboarding profile system.
          </DialogDescription>
        </DialogHeader>

        {/* Step Navigation Bar */}
        <div className="flex items-center gap-2 mb-4 shrink-0 bg-muted/40 p-1 rounded-lg border text-sm w-fit">
          <button onClick={() => setStep(1)} className={`px-3 py-1.5 rounded-md transition-all ${step === 1 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}>
            1. Enter Data
          </button>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <button disabled={parsedRows.length === 0} onClick={() => setStep(2)} className={`px-3 py-1.5 rounded-md transition-all ${step === 2 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"} disabled:opacity-50`}>
            2. Validate & Preview ({parsedRows.length} rows)
          </button>
        </div>

        {/* Step Contents */}
        <div className="flex-1 overflow-y-auto min-h-0 py-1">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                {/* Info Alert detailing required fields */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex gap-2.5 text-xs text-slate-600">
                  <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">Required Onboarding Column Headers:</p>
                    <p>
                      Excel files must contain headers matching these 9 fields (any order):
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {["First Name", "Last Name", "Email", "Phone", "MPIN", "Department", "Designation", "Joining Date", "Monthly Salary"].map(f => (
                        <span key={f} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium text-[10px]">
                          {f}*
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      * Supports optional columns for shifts, leaves, bank routing codes, emergency contacts, addresses, Aadhar, and PAN.
                    </p>
                  </div>
                </div>

                {/* Upload Area */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center bg-card hover:bg-muted/10 transition-colors">
                    <Upload className="h-8 w-8 text-primary mb-2 opacity-80" />
                    <p className="font-semibold text-sm">Upload Excel Spreadsheet</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Drag and drop your file or browse local files (.xlsx, .xls, .csv)</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" />
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>

                  <div className="border rounded-xl p-5 flex flex-col justify-between bg-card">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2"><Clipboard className="h-4 w-4 text-primary" />Copy Paste Instructions</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Copy grid rows directly from Microsoft Excel or Google Sheets, including headings, and paste them in the text area below.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-fit gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 mt-4 font-semibold" onClick={handleDownloadTemplate}>
                      <Download className="h-3.5 w-3.5" /> Download Comprehensive Excel Template
                    </Button>
                  </div>
                </div>

                {/* Text Area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paste Raw Clipboard Rows</label>
                  <Textarea
                    placeholder="First Name	Last Name	Email	Phone	MPIN	Department	Designation	Joining Date	Monthly Salary"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="font-mono text-xs h-56 resize-none bg-muted/20 focus-visible:ring-primary focus-visible:bg-background transition-all"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    {errorCount > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        Parsed {parsedRows.length} employee records.
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {parsedRows.length - errorCount} records are ready to import. {errorCount > 0 && `${errorCount} records have errors and will be skipped.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs">
                      Back to Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10" onClick={resetState}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="border rounded-xl overflow-hidden bg-card">
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-muted/40 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-12 text-center">Row</TableHead>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Contact & PIN</TableHead>
                          <TableHead>Role & Dept</TableHead>
                          <TableHead className="text-right">Salary</TableHead>
                          <TableHead>Joining</TableHead>
                          <TableHead className="text-center">Extra Info</TableHead>
                          <TableHead>Validation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow key={row.index} className={row.errors.length > 0 ? "bg-red-50/40 hover:bg-red-50/60 dark:bg-red-950/10" : ""}>
                            <TableCell className="text-center font-mono text-[10px] text-muted-foreground">{row.index}</TableCell>
                            <TableCell className="font-medium">
                              <p className="text-xs leading-none">{`${row.firstName} ${row.lastName}`.trim() || <span className="text-destructive font-semibold">Missing Name</span>}</p>
                              {row.employeeCode && <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">{row.employeeCode}</span>}
                            </TableCell>
                            <TableCell>
                              <p className="text-xs leading-none">{row.email || <span className="text-destructive font-semibold">Missing</span>}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {row.phone && <span className="text-[10px] text-muted-foreground">{row.phone}</span>}
                                {row.mpin && <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-1 rounded">PIN: {row.mpin}</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs leading-none font-semibold">{row.designation || <span className="text-destructive font-semibold">Missing</span>}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{row.department || <span className="text-destructive font-semibold">Missing</span>}</p>
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs font-mono">
                              ₹{row.basicSalary.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {row.joiningDate}
                            </TableCell>
                            <TableCell className="text-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs p-3 space-y-1.5 text-xs">
                                    <p className="font-bold text-slate-800 border-b pb-1">Additional Profile Details</p>
                                    <div><strong className="text-slate-600">Gender/Marital:</strong> {row.gender} ({row.maritalStatus})</div>
                                    <div><strong className="text-slate-600">Location/Shift:</strong> {row.workLocation} ({row.shift || "None"})</div>
                                    <div><strong className="text-slate-600">Leaves:</strong> Policy: {row.leavePolicy} (CL: {row.casualLeave}, SL: {row.sickLeave}, EL: {row.earnedLeave})</div>
                                    {row.bankName && (
                                      <div><strong className="text-slate-600">Bank:</strong> {row.bankName} - A/C: {row.accountNumber} ({row.ifscCode})</div>
                                    )}
                                    {(row.aadharNumber || row.panNumber) && (
                                      <div><strong className="text-slate-600">Govt IDs:</strong> Aadhar: {row.aadharNumber || "-"} | PAN: {row.panNumber || "-"}</div>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {row.errors.length > 0 ? (
                                <div className="space-y-0.5">
                                  {row.errors.map((err, idx) => (
                                    <p key={idx} className="text-[10px] text-destructive leading-tight font-medium flex items-center gap-1">
                                      ❌ {err}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-green-700 font-medium flex items-center gap-1">
                                  ✅ Valid
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="shrink-0 border-t pt-4 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={() => processRawText(inputText)} disabled={!inputText.trim()} className="gap-1.5">
              Validate Data <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={parsedRows.length - errorCount === 0} className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
              Import {parsedRows.length - errorCount} Employees
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
