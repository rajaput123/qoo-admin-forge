import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, UserPlus, X, Upload, FileText, Trash2, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmployeeDocuments } from '@/components/hr/EmployeeDocuments';
import { EmployeeDocument } from '@/types/hr';
import { useAuth } from '@/contexts/AuthContext';
import { CustomFieldsRenderer } from '@/components/hr/CustomFieldsRenderer';
import { addEmployee } from '@/lib/hr-employee-store';
import type { Employee } from '@/types/erp';

import { departments, designations, shifts, gradePays, leaveTypes } from '@/data/hr-dummy-data';

const baseDepartmentOptions = departments.map(d => ({ value: d.id, label: d.name }));
const baseDesignationOptions = designations.map(d => ({ value: d.id, label: d.name }));
const baseShiftOptions = shifts.map(s => ({ value: s.id, label: s.name }));
const baseGradePayOptions = gradePays.map(g => ({ value: g.id, label: g.name }));

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'pending_documents' | 'pending_contract' | 'active'>('draft');
  const [employeeDocuments, setEmployeeDocuments] = useState<EmployeeDocument[]>([]);
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: false,
    credentials: false,
    contract: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    // Overview
    employeeCode: 'EMP-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mpin: '',
    confirmMpin: '',
    department: '',
    designation: '',
    employmentType: 'full_time',
    jobDescription: '',

    // Joining
    joiningDate: '',
    probationEndDate: '',
    confirmationDate: '',
    noticePeriod: 30,

    // Address
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',

    // Shift
    shift: '',
    workLocation: 'Main Temple',

    // Leave
    leavePolicy: 'standard',
    casualLeave: 12,
    sickLeave: 10,
    earnedLeave: 15,

    // Salary
    basicSalary: 0,
    paymentMode: 'bank',
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    // Personal
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: '',
    maritalStatus: 'single',
    nationality: 'Indian',
    religion: '',
    aadharNumber: '',
    panNumber: '',

    // Documents
    documents: [] as { type: string; name: string; uploadedOn: string }[],

    // Custom fields (dynamic)
    customFieldValues: {} as Record<string, string>,
  });

  // Dropdown options (support +Add)
  const [departmentOptions, setDepartmentOptions] = useState(baseDepartmentOptions);
  const [designationOptions, setDesignationOptions] = useState(baseDesignationOptions);
  const [shiftOptions, setShiftOptions] = useState(baseShiftOptions);
  const [gradePayOptions, setGradePayOptions] = useState(baseGradePayOptions);

  const addOption = (
    kind: 'department' | 'designation' | 'shift' | 'gradePay',
    name: string
  ) => {
    const id = `${kind}-${Date.now()}`;
    const option = { value: id, label: name };
    if (kind === 'department') setDepartmentOptions((prev) => [...prev, option]);
    if (kind === 'designation') setDesignationOptions((prev) => [...prev, option]);
    if (kind === 'shift') setShiftOptions((prev) => [...prev, option]);
    if (kind === 'gradePay') setGradePayOptions((prev) => [...prev, option]);
    return option;
  };

  const promptAndAdd = (kind: 'department' | 'designation' | 'shift' | 'gradePay') => {
    const labelMap: Record<typeof kind, string> = {
      department: 'Department',
      designation: 'Designation',
      shift: 'Shift',
      gradePay: 'Grade Pay',
    };
    const name = window.prompt(`Enter new ${labelMap[kind]} name:`);
    if (!name || !name.trim()) return;
    const option = addOption(kind, name.trim());
    if (kind === 'department') updateForm('department', option.value);
    if (kind === 'designation') updateForm('designation', option.value);
    if (kind === 'shift') updateForm('shift', option.value);
    if (kind === 'gradePay') updateForm('gradePay', option.value);
  };

  const updateForm = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Draft Saved',
        description: 'Employee data has been saved as draft.',
      });
    }, 500);
  };

  const handleCreate = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);

      const deptLabel = departments.find(d => d.id === formData.department)?.name || '';
      const desgLabel = designations.find(d => d.id === formData.designation)?.name || '';

      const newEmployee: Employee = {
        id: String(Date.now()),
        employeeId: formData.employeeCode,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        department: deptLabel,
        designation: desgLabel,
        status: 'active',
        joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      };

      // Persist with salary and onboarding data
      addEmployee({
        ...newEmployee,
        mpin: formData.mpin,
        customFieldValues: formData.customFieldValues,
        // Salary
        basicSalary: formData.basicSalary,
        paymentMode: formData.paymentMode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        // Leave
        leavePolicy: formData.leavePolicy,
        casualLeave: formData.casualLeave,
        sickLeave: formData.sickLeave,
        earnedLeave: formData.earnedLeave,
        // Shift
        shiftId: formData.shift,
      } as any);

      toast({
        title: 'Employee Created',
        description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
      });
      navigate('/temple/people');
    }, 1000);
  };

  const handleDocumentUpload = (document: any) => {
    const newDocument: EmployeeDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      employeeId: formData.employeeCode,
      name: document.name || 'Document',
      type: document.type || 'other',
      uploadedOn: new Date().toISOString(),
      uploadedBy: user?.id || 'system',
    };
    setEmployeeDocuments(prev => [...prev, newDocument]);
    toast({
      title: 'Document uploaded',
      description: 'Document has been uploaded successfully.',
    });
  };

  const handleDocumentDelete = (documentId: string) => {
    setEmployeeDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: 'Document deleted',
      description: 'Document has been deleted successfully.',
    });
  };

  const generateEmail = (type: 'welcome' | 'credentials' | 'contract') => {
    setEmailTemplates(prev => ({ ...prev, [type]: true }));
    toast({
      title: `${type === 'welcome' ? 'Welcome' : type === 'credentials' ? 'Credentials' : 'Contract'} email sent`,
      description: `Email has been sent to ${formData.email || 'employee'}.`,
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'joining', label: 'Joining' },
    { id: 'address', label: 'Address & Contact' },
    { id: 'shift', label: 'Shift & Attendance' },
    { id: 'leave', label: 'Leave' },
    { id: 'salary', label: 'Salary' },
    { id: 'personal', label: 'Personal' },
    { id: 'custom', label: 'Custom Fields' },
    { id: 'documents', label: 'Documents' },
  ];

  const customFieldDefinitions = useMemo(() => {
    const dept = departments.find(d => d.id === formData.department);
    const desg = designations.find(d => d.id === formData.designation);
    const defs = [...(dept?.customFields ?? []), ...(desg?.customFields ?? [])];
    const byId = new Map(defs.map(d => [d.id, d]));
    return Array.from(byId.values());
  }, [formData.department, formData.designation]);

  return (
    <div>
      <PageHeader
        title="Employee Onboarding"
        description="Add a new employee to the system"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Employees', href: '/hr/employees' },
          { label: 'New Employee' },
        ]}
      />

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 py-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="form-field">
                  <Label className="form-label">Employee Code</Label>
                  <Input value={formData.employeeCode} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    First Name <span className="form-required">*</span>
                  </Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">
                    Last Name <span className="form-required">*</span>
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    Email <span className="form-required">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="employee@temple.org"
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">
                    Phone <span className="form-required">*</span>
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    MPIN <span className="form-required">*</span>
                  </Label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    value={formData.mpin}
                    onChange={(e) => updateForm('mpin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit MPIN"
                  />
                  <p className="text-xs text-muted-foreground mt-1">4-digit numeric PIN for employee access</p>
                </div>
                <div className="form-field">
                  <Label className="form-label">
                    Confirm MPIN <span className="form-required">*</span>
                  </Label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    value={formData.confirmMpin}
                    onChange={(e) => updateForm('confirmMpin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Re-enter MPIN"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    Department <span className="form-required">*</span>
                  </Label>
                  <SearchableSelect
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(value) => updateForm('department', value)}
                    placeholder="Select department"
                    addNewLabel="+ Add Department"
                    onAddNew={() => promptAndAdd('department')}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">
                    Designation <span className="form-required">*</span>
                  </Label>
                  <SearchableSelect
                    options={designationOptions}
                    value={formData.designation}
                    onChange={(value) => updateForm('designation', value)}
                    placeholder="Select designation"
                    addNewLabel="+ Add Designation"
                    onAddNew={() => promptAndAdd('designation')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) => updateForm('employmentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-field">
                  <Label className="form-label">Job Description (JD)</Label>
                  <Textarea
                    value={formData.jobDescription}
                    onChange={(e) => updateForm('jobDescription', e.target.value)}
                    placeholder="Enter job description / responsibilities"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Joining Tab */}
            <TabsContent value="joining" className="m-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    Joining Date <span className="form-required">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => updateForm('joiningDate', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Probation End Date</Label>
                  <Input
                    type="date"
                    value={formData.probationEndDate}
                    onChange={(e) => updateForm('probationEndDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">Confirmation Date</Label>
                  <Input
                    type="date"
                    value={formData.confirmationDate}
                    onChange={(e) => updateForm('confirmationDate', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Notice Period (days)</Label>
                  <Input
                    type="number"
                    value={formData.noticePeriod}
                    onChange={(e) => updateForm('noticePeriod', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="m-0 space-y-6">
              <div className="form-field">
                <Label className="form-label">Current Address</Label>
                <Textarea
                  value={formData.currentAddress}
                  onChange={(e) => updateForm('currentAddress', e.target.value)}
                  placeholder="Enter current address"
                  rows={2}
                />
              </div>

              <div className="form-field">
                <Label className="form-label">Permanent Address</Label>
                <Textarea
                  value={formData.permanentAddress}
                  onChange={(e) => updateForm('permanentAddress', e.target.value)}
                  placeholder="Enter permanent address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="form-field">
                  <Label className="form-label">City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => updateForm('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Pincode</Label>
                  <Input
                    value={formData.pincode}
                    onChange={(e) => updateForm('pincode', e.target.value)}
                    placeholder="000000"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="section-header mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="form-field">
                    <Label className="form-label">Contact Name</Label>
                    <Input
                      value={formData.emergencyContact}
                      onChange={(e) => updateForm('emergencyContact', e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Phone</Label>
                    <Input
                      value={formData.emergencyPhone}
                      onChange={(e) => updateForm('emergencyPhone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Relation</Label>
                    <Input
                      value={formData.emergencyRelation}
                      onChange={(e) => updateForm('emergencyRelation', e.target.value)}
                      placeholder="e.g., Spouse, Parent"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shift Tab */}
            <TabsContent value="shift" className="m-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">Shift</Label>
                  <SearchableSelect
                    options={shiftOptions}
                    value={formData.shift}
                    onChange={(value) => updateForm('shift', value)}
                    placeholder="Select shift"
                    addNewLabel="+ Add Shift"
                    onAddNew={() => promptAndAdd('shift')}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Work Location</Label>
                  <Input
                    value={formData.workLocation}
                    onChange={(e) => updateForm('workLocation', e.target.value)}
                    placeholder="Location"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Leave Tab */}
            <TabsContent value="leave" className="m-0 space-y-6">
              <div className="form-field">
                <Label className="form-label">Leave Policy</Label>
                <Select
                  value={formData.leavePolicy}
                  onValueChange={(value) => updateForm('leavePolicy', value)}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Policy</SelectItem>
                    <SelectItem value="probation">Probation Policy</SelectItem>
                    <SelectItem value="contract">Contract Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="form-field">
                  <Label className="form-label">Casual Leave</Label>
                  <Input
                    type="number"
                    value={formData.casualLeave}
                    onChange={(e) => updateForm('casualLeave', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Sick Leave</Label>
                  <Input
                    type="number"
                    value={formData.sickLeave}
                    onChange={(e) => updateForm('sickLeave', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Earned Leave</Label>
                  <Input
                    type="number"
                    value={formData.earnedLeave}
                    onChange={(e) => updateForm('earnedLeave', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Salary Tab */}
            <TabsContent value="salary" className="m-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">
                    Monthly Salary (₹) <span className="form-required">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => updateForm('basicSalary', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 15000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Fixed monthly salary amount</p>
                </div>
                <div className="form-field">
                  <Label className="form-label">Payment Mode</Label>
                  <Select
                    value={formData.paymentMode || 'bank'}
                    onValueChange={(value) => updateForm('paymentMode', value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="section-header mb-4">Bank Details (optional)</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="form-field">
                    <Label className="form-label">Bank Name</Label>
                    <Input
                      value={formData.bankName}
                      onChange={(e) => updateForm('bankName', e.target.value)}
                      placeholder="Bank name"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Account Number</Label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) => updateForm('accountNumber', e.target.value)}
                      placeholder="Account number"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">IFSC Code</Label>
                    <Input
                      value={formData.ifscCode}
                      onChange={(e) => updateForm('ifscCode', e.target.value.toUpperCase())}
                      placeholder="IFSC code"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Personal Tab */}
            <TabsContent value="personal" className="m-0 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="form-field">
                  <Label className="form-label">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateForm('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-field">
                  <Label className="form-label">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => updateForm('bloodGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="form-field">
                  <Label className="form-label">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => updateForm('maritalStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-field">
                  <Label className="form-label">Nationality</Label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) => updateForm('nationality', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">Religion</Label>
                  <Input
                    value={formData.religion}
                    onChange={(e) => updateForm('religion', e.target.value)}
                    placeholder="Religion"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-field">
                  <Label className="form-label">Aadhar Number</Label>
                  <Input
                    value={formData.aadharNumber}
                    onChange={(e) => updateForm('aadharNumber', e.target.value)}
                    placeholder="0000 0000 0000"
                  />
                </div>
                <div className="form-field">
                  <Label className="form-label">PAN Number</Label>
                  <Input
                    value={formData.panNumber}
                    onChange={(e) => updateForm('panNumber', e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Custom Fields Tab */}
            <TabsContent value="custom" className="m-0 space-y-6">
              <div className="space-y-2">
                <h3 className="section-header">Custom Fields</h3>
                <p className="text-xs text-muted-foreground">
                  Additional fields based on selected Department/Designation
                </p>
              </div>

              {customFieldDefinitions.length === 0 ? (
                <div className="p-6 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                  No custom fields configured for the selected Department/Designation.
                </div>
              ) : (
                <CustomFieldsRenderer
                  definitions={customFieldDefinitions}
                  values={formData.customFieldValues}
                  onChange={(nextValues) => updateForm('customFieldValues', nextValues)}
                />
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="m-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Workflow Status</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: <span className="font-medium capitalize">{workflowStatus.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateEmail('welcome')}
                      disabled={emailTemplates.welcome}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {emailTemplates.welcome ? 'Welcome Sent' : 'Send Welcome Email'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateEmail('credentials')}
                      disabled={emailTemplates.credentials}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {emailTemplates.credentials ? 'Credentials Sent' : 'Send Credentials'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateEmail('contract')}
                      disabled={emailTemplates.contract}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {emailTemplates.contract ? 'Contract Sent' : 'Send Contract'}
                    </Button>
                  </div>
                </div>

                <EmployeeDocuments
                  employeeId={formData.employeeCode || 'new'}
                  documents={employeeDocuments}
                  onUpload={handleDocumentUpload}
                  onDelete={handleDocumentDelete}
                  currentUserId={user?.id || ''}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between py-4 border-t border-border mt-auto">
          <Button variant="outline" onClick={() => navigate('/hr/employees')}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSaving}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Employee
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
