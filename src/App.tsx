import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTaskEngineBootstrap } from "@/modules/tasks/hooks";
import Login from "./pages/Login";
import ForgotMpin from "./pages/ForgotMpin";
import TempleRegister from "./pages/TempleRegister";
import Pricing from "./pages/Pricing";
import TempleHub from "./pages/TempleHub";
import ApplicationStatus from "./pages/ApplicationStatus";
import FirstLoginSetup from "./pages/FirstLoginSetup";
import Welcome from "./pages/Welcome";
import OnboardingSubscription from "./pages/OnboardingSubscription";
import OutOfCreditScreen from "./pages/OutOfCreditScreen";
import UpcomingModule from "./pages/temple/UpcomingModule";
import Profile from "./pages/Profile";
// Temple Admin Module Layouts
import TempleInfoLayout from "./pages/temple/TempleInfoLayout";
import BasicInfo from "./pages/temple/info/BasicInfo";
import OfferingsLayout from "./pages/temple/OfferingsLayout";
import OfferingsToday from "./pages/temple/offerings/Today";
import OfferingsList from "./pages/temple/offerings/OfferingsList";
import SlotManagement from "./pages/temple/offerings/SlotManagement";
import BookingManagement from "./pages/temple/offerings/BookingManagement";
import PricingRules from "./pages/temple/offerings/PricingRules";
import PriestAssignment from "./pages/temple/offerings/PriestAssignment";
import OfferingsReports from "./pages/temple/offerings/Reports";
import BookingsLayout from "./pages/temple/BookingsLayout";
import BookingsToday from "./pages/temple/bookings/BookingsToday";
import AllBookings from "./pages/temple/bookings/AllBookings";
import CounterBooking from "./pages/temple/bookings/CounterBooking";
import PrasadCounter from "./pages/temple/bookings/PrasadCounter";
import Attendance from "./pages/temple/bookings/Attendance";
import BookingReports from "./pages/temple/bookings/BookingReports";
import SettingsLayout from "./pages/temple/SettingsLayout";
import ProfileSettings from "./pages/temple/settings/ProfileSettings";
import FinanceSettings from "./pages/temple/settings/FinanceSettings";
import SubscriptionBilling from "./pages/temple/settings/SubscriptionBilling";
import SubscriptionUpgrade from "./pages/temple/settings/SubscriptionUpgrade";
import InvoiceManagement from "./pages/temple/settings/InvoiceManagement";
import UserAccessManagement from "./pages/temple/settings/UserAccessManagement";
import ModuleAccessControl from "./pages/temple/settings/ModuleAccessControl";
import SystemSettings from "./pages/temple/settings/SystemSettings";
import ReceiptTemplates from "./pages/temple/settings/ReceiptTemplates";
import ReceiptTemplateBuilder from "./pages/temple/settings/ReceiptTemplateBuilder";
// Temple Structure Module
import TempleStructureLayout from "./pages/temple/structure/TempleStructureLayout";
// Supplier Management Module
import SupplierLayout from "./pages/temple/SupplierLayout";
// Stock & Inventory Module
import InventoryLayout from "./pages/temple/InventoryLayout";
import InventoryDashboard from "./pages/temple/inventory/Dashboard";
import InventoryItems from "./pages/temple/inventory/Items";
import InventoryTransactions from "./pages/temple/inventory/Transactions";
import InventoryRequests from "./pages/temple/inventory/Requests";
import InventoryAdjustments from "./pages/temple/inventory/Adjustments";
import InventoryReports from "./pages/temple/inventory/Reports";
import InventoryPurchases from "./pages/temple/inventory/Purchases";
import TransactionDetail from "./pages/temple/inventory/TransactionDetail";
import ItemDetail from "./pages/temple/inventory/ItemDetail";
import PurchaseOrderDetail from "./pages/temple/inventory/purchases/PurchaseOrderDetail";
import DeliveryDetail from "./pages/temple/inventory/purchases/DeliveryDetail";
import SupplierDashboard from "./pages/temple/suppliers/Dashboard";
import SupplierRegistry from "./pages/temple/suppliers/Registry";
import SupplierOnboarding from "./pages/temple/suppliers/Onboarding";
import SupplierCategories from "./pages/temple/suppliers/Categories";
import SupplierPurchaseOrders from "./pages/temple/suppliers/PurchaseOrders";
import SupplierDeliveries from "./pages/temple/suppliers/Deliveries";
import SupplierPayments from "./pages/temple/suppliers/Payments";
import SupplierPerformance from "./pages/temple/suppliers/Performance";
import SupplierReports from "./pages/temple/suppliers/Reports";
// Devotee CRM Module
import DevoteesLayout from "./pages/temple/DevoteesLayout";
import DevoteeDashboard from "./pages/temple/devotees/Dashboard";
import DevoteesList from "./pages/temple/devotees/DevoteesList";
import DevoteeGroups from "./pages/temple/devotees/Groups";
import DevoteeVolunteers from "./pages/temple/devotees/Volunteers";
import Temples from "./pages/temple/structure/Temples";
import ChildTemples from "./pages/temple/structure/ChildTemples";
import Sacred from "./pages/temple/structure/Sacred";
import HallsRooms from "./pages/temple/structure/HallsRooms";
import Counters from "./pages/temple/structure/Counters";
import StructureHierarchy from "./pages/temple/structure/StructureHierarchy";
import Zones from "./pages/temple/structure/Zones";
import ChildTempleDetail from "./pages/temple/structure/ChildTempleDetail";
import SacredDetail from "./pages/temple/structure/SacredDetail";
import HallRoomDetail from "./pages/temple/structure/HallRoomDetail";
import CounterDetail from "./pages/temple/structure/CounterDetail";
import ZoneDetail from "./pages/temple/structure/ZoneDetail";
// Event Management Module
import EventsLayout from "./pages/temple/EventsLayout";
import AllEvents from "./pages/temple/events/AllEvents";
import CreateEvent from "./pages/temple/events/CreateEvent";
import CalendarView from "./pages/temple/events/CalendarView";
import EventTemplates from "./pages/temple/events/EventTemplates";
import EventResources from "./pages/temple/events/EventResources";
import EventDetails from "./pages/temple/events/EventDetails";
import EventExpenses from "./pages/temple/events/EventExpenses";
import EventReports from "./pages/temple/events/EventReports";
import EventArchive from "./pages/temple/events/EventArchive";
// Task Management Module
import TasksLayout from "./pages/temple/TasksLayout";
import TaskDashboard from "./pages/temple/tasks/TaskDashboard";
import AllTasks from "./pages/temple/tasks/AllTasks";
import MyTasks from "./pages/temple/tasks/MyTasks";
import OverdueTasks from "./pages/temple/tasks/OverdueTasks";
import CompletedTasks from "./pages/temple/tasks/CompletedTasks";
import ScheduledTemplates from "./pages/temple/tasks/ScheduledTemplates";
// Branch Management Module
import BranchLayout from "./pages/temple/BranchLayout";
import BranchDashboard from "./pages/temple/branches/Dashboard";
import AllBranches from "./pages/temple/branches/AllBranches";
import BranchDetails from "./pages/temple/branches/BranchDetails";
import BranchReports from "./pages/temple/branches/BranchReports";
// People & HR Module
import PeopleLayout from "./pages/temple/PeopleLayout";
import Employees from "./pages/temple/hr/Employees";
import HRAttendance from "./pages/temple/hr/Attendance";
import Shifts from "./pages/temple/hr/Shifts";
import Leave from "./pages/temple/hr/Leave";
import Organization from "./pages/temple/hr/Organization";
import OrgTree from "./pages/temple/hr/OrgTree";
import Expenses from "./pages/temple/hr/Expenses";
import Payroll from "./pages/temple/hr/Payroll";
import Panchang from "./pages/temple/hr/Panchang";
import EmployeeOnboarding from "./pages/temple/hr/EmployeeOnboarding";
import SalaryCompensation from "./pages/temple/hr/SalaryCompensation";
// Institution Management Module
import InstitutionLayout from "./pages/temple/InstitutionLayout";
import InstitutionDashboard from "./pages/temple/institutions/Dashboard";
import AllInstitutions from "./pages/temple/institutions/AllInstitutions";
import InstitutionDetails from "./pages/temple/institutions/InstitutionDetails";
import InstitutionReports from "./pages/temple/institutions/InstitutionReports";
// Crowd & Capacity Management Module (Upcoming - commented out)
// import CrowdLayout from "./pages/temple/CrowdLayout";
// import CrowdDashboard from "./pages/temple/crowd/CrowdDashboard";
// import ZoneDetail from "./pages/temple/crowd/ZoneDetail";
// import HeatmapView from "./pages/temple/crowd/HeatmapView";
// import QueueManagement from "./pages/temple/crowd/QueueManagement";
// import AlertsAutomation from "./pages/temple/crowd/AlertsAutomation";
// import PredictionForecast from "./pages/temple/crowd/PredictionForecast";
// import CrowdControlPanel from "./pages/temple/crowd/CrowdControlPanel";
// import DataCollectionWorkflow from "./pages/temple/crowd/DataCollectionWorkflow";
// import ImplementationStatus from "./pages/temple/crowd/ImplementationStatus";
// import PracticalOperations from "./pages/temple/crowd/PracticalOperations";
// PR & Communication Module
import CommunicationLayout from "./pages/temple/CommunicationLayout";
import ControlCenter from "./pages/temple/communication/ControlCenter";
import CommAnnouncements from "./pages/temple/communication/Announcements";
import MediaCommunication from "./pages/temple/communication/MediaCommunication";
import LiveBroadcast from "./pages/temple/communication/LiveBroadcast";
import DevoteeExperience from "./pages/temple/communication/DevoteeExperience";
import PublicMeetings from "./pages/temple/communication/PublicMeetings";
import CommLogsReports from "./pages/temple/communication/LogsReports";
import TempleWebsite from "./pages/temple/communication/TempleWebsite";
// Donation Management Module
import DonationsLayout from "./pages/temple/DonationsLayout";
import DonationDashboard from "./pages/temple/donations/Dashboard";
import DonationsList from "./pages/temple/donations/DonationsList";
import AddDonation from "./pages/temple/donations/AddDonation";
import DonorRegistry from "./pages/temple/donations/DonorRegistry";
import Funds from "./pages/temple/donations/Funds";
import FundDetails from "./pages/temple/donations/FundDetails";
import Reports from "./pages/temple/donations/Reports";
import Section80G from "./pages/temple/donations/Section80G";
import Form10BD from "./pages/temple/donations/Form10BD";
import SettlementsPage from "./pages/temple/donations/Settlements";
import DonationConfiguration from "./pages/temple/donations/DonationConfiguration";
// Feedback & Analytics Module
import FeedbackLayout from "./pages/temple/FeedbackLayout";
import FeedbackDashboard from "./pages/temple/feedback/Dashboard";
import FeedbackCollection from "./pages/temple/feedback/Collection";
import FeedbackSentiment from "./pages/temple/feedback/Sentiment";
import FeedbackAnalytics from "./pages/temple/feedback/Analytics";
// Freelancer Management Module
import FreelancerLayout from "./pages/temple/FreelancerLayout";
import FreelancersList from "./pages/temple/freelancers/FreelancersList";
import FreelancerAssignments from "./pages/temple/freelancers/Assignments";
import FreelancerPayments from "./pages/temple/freelancers/Payments";
import FreelancerPerformance from "./pages/temple/freelancers/Performance";
import FreelancerInsights from "./pages/temple/freelancers/Insights";
import VipLayout from "./pages/temple/VipLayout";
import VipDashboard from "./pages/temple/vip/Dashboard";
import VipDevotees from "./pages/temple/vip/Devotees";
import VipLevels from "./pages/temple/vip/Levels";
import VipActivity from "./pages/temple/vip/Activity";
import VipReports from "./pages/temple/vip/Reports";
import VipEligibility from "./pages/temple/vip/Eligibility";
// Finance Module
import FinanceLayout from "./pages/temple/FinanceLayout";
import FinanceDashboard from "./pages/temple/finance/FinanceDashboard";
import CashNonCashPage from "./pages/temple/finance/CashNonCashPage";
import PaymentsExpensesPage from "./pages/temple/finance/PaymentsExpensesPage";
import CashFundFlowPage from "./pages/temple/finance/CashFundFlowPage";
import ChartOfAccounts from "./pages/temple/finance/ChartOfAccounts";
import BankManagement from "./pages/temple/finance/BankManagement";

import FinanceLedgerPage from "./pages/temple/finance/FinanceLedgerPage";
import JournalVoucherPage from "./pages/temple/finance/JournalVoucherPage";
import TransactionsReconciliationPage from "./pages/temple/finance/TransactionsReconciliationPage";
import BankReconciliationPage from "./pages/temple/finance/BankReconciliationPage";
import FinancePayroll from "./pages/temple/finance/FinancePayroll";
import FinanceReportsPage from "./pages/temple/finance/FinanceReportsPage";
import FinancialReports from "./pages/temple/finance/FinancialReports";
import FinanceCategories from "./pages/temple/finance/FinanceCategories";
import PaymentMethods from "./pages/temple/finance/PaymentMethods";
import FinancePurchaseOrders from "./pages/temple/finance/PurchaseOrders";
import CreatePurchaseOrderPage from "./pages/temple/finance/CreatePurchaseOrderPage";
import ProcurementInvoicePage from "./pages/temple/finance/ProcurementInvoice";
import ProcurementPaymentPage from "./pages/temple/finance/ProcurementPayment";
import PaymentGatewayReceiptsPage from "./pages/temple/finance/PaymentGatewayReceiptsPage";
// Projects & Initiatives Module
import ProjectsLayout from "./pages/temple/ProjectsLayout";
import ProjectsDashboard from "./pages/temple/projects/Dashboard";
import AllProjects from "./pages/temple/projects/AllProjects";
import CreateProject from "./pages/temple/projects/CreateProject";
import ProjectDetail from "./pages/temple/projects/ProjectDetail";
import ProjectsTimeline from "./pages/temple/projects/Timeline";
import ProjectsReports from "./pages/temple/projects/Reports";
import ProjectsArchive from "./pages/temple/projects/Archive";
// Reports Center Module
import ReportsLayout from "./pages/temple/ReportsLayout";
import ReportsDashboard from "./pages/temple/reports/ReportsDashboard";
import ReportOverview from "./pages/temple/reports/ReportOverview";
import DonationTables from "./pages/temple/reports/tables/DonationTables";
import BookingTables from "./pages/temple/reports/tables/BookingTables";
import EventTables from "./pages/temple/reports/tables/EventTables";
import FinanceTables from "./pages/temple/reports/tables/FinanceTables";
import InventoryTables from "./pages/temple/reports/tables/InventoryTables";
import SupplierTables from "./pages/temple/reports/tables/SupplierTables";
import OfferingTables from "./pages/temple/reports/tables/OfferingTables";
import ProjectTables from "./pages/temple/reports/tables/ProjectTables";
import HRTables from "./pages/temple/reports/tables/HRTables";
import VipTables from "./pages/temple/reports/tables/VipTables";
import FreelancerTables from "./pages/temple/reports/tables/FreelancerTables";
import FeedbackTables from "./pages/temple/reports/tables/FeedbackTables";
import RptDonations from "./pages/temple/reports/DonationReports";
import RptEvents from "./pages/temple/reports/EventReports";
import RptFinance from "./pages/temple/reports/FinanceReports";
import RptInventory from "./pages/temple/reports/InventoryReports";
import RptSuppliers from "./pages/temple/reports/SupplierReports";
import RptBookings from "./pages/temple/reports/BookingReports";
import RptOfferings from "./pages/temple/reports/OfferingReports";
import RptProjects from "./pages/temple/reports/ProjectReports";
import RptHR from "./pages/temple/reports/HRReports";
import RptVip from "./pages/temple/reports/VipReports";
import RptFreelancers from "./pages/temple/reports/FreelancerReports";
import RptFeedback from "./pages/temple/reports/FeedbackReports";
import RptDevotees from "./pages/temple/reports/DevoteeReports";
import RptCommunication from "./pages/temple/reports/CommunicationReports";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import UIKit from "./pages/temple/UIKit";
// Knowledge Management Module
import KnowledgeLayout from "./pages/temple/KnowledgeLayout";
import KnowledgeDashboard from "./pages/temple/knowledge/Dashboard";
import KnowledgeCategories from "./pages/temple/knowledge/Categories";
import KnowledgeOnboarding from "./pages/temple/knowledge/Onboarding";
import KnowledgeLibrary from "./pages/temple/knowledge/Library";
import KnowledgeChatAssist from "./pages/temple/knowledge/ChatAssist";
import HelpSupport from "./pages/temple/HelpSupport";

const queryClient = new QueryClient();

const App = () => {
  useTaskEngineBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-mpin" element={<ForgotMpin />} />
            <Route path="/temple-register" element={<TempleRegister />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/application-status" element={<ApplicationStatus />} />
            <Route path="/temple-welcome" element={<FirstLoginSetup />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding/subscription" element={<OnboardingSubscription />} />
            <Route path="/out-of-credits" element={<OutOfCreditScreen />} />

            {/* Temple Admin Routes */}
            <Route path="/temple-hub" element={<TempleHub />} />
            <Route path="/temple/ui-kit" element={<UIKit />} />

            {/* Temple Info Module */}
            <Route path="/temple/info" element={<TempleInfoLayout />}>
              <Route index element={<BasicInfo />} />
              <Route path="layout" element={<BasicInfo />} />
              <Route path="facilities" element={<BasicInfo />} />
              <Route path="branches" element={<BasicInfo />} />
              <Route path="media" element={<BasicInfo />} />
            </Route>

            {/* Temple Structure Module */}
            <Route path="/temple/structure" element={<TempleStructureLayout />}>
              <Route index element={<Temples />} />
              <Route path="child-temples" element={<ChildTemples />} />
              <Route path="child-temples/:id" element={<ChildTempleDetail />} />
              <Route path="sacred" element={<Sacred />} />
              <Route path="sacred/:id" element={<SacredDetail />} />
              <Route path="halls" element={<HallsRooms />} />
              <Route path="halls/:id" element={<HallRoomDetail />} />
              <Route path="counters" element={<Counters />} />
              <Route path="counters/:id" element={<CounterDetail />} />
              <Route path="hierarchy" element={<StructureHierarchy />} />
              <Route path="zones" element={<Zones />} />
              <Route path="zones/:id" element={<ZoneDetail />} />
            </Route>

            {/* Supplier Management Module */}
            <Route path="/temple/suppliers" element={<SupplierLayout />}>
              <Route index element={<SupplierDashboard />} />
              <Route path="registry" element={<SupplierRegistry />} />
              <Route path="onboarding" element={<SupplierOnboarding />} />
              <Route path="categories" element={<SupplierCategories />} />
              <Route path="purchase-orders" element={<SupplierPurchaseOrders />} />
              <Route path="deliveries" element={<SupplierDeliveries />} />
              <Route path="payments" element={<SupplierPayments />} />
              <Route path="performance" element={<SupplierPerformance />} />
              <Route path="reports" element={<SupplierReports />} />
            </Route>

            {/* Stock & Inventory Module */}
            <Route path="/temple/inventory" element={<InventoryLayout />}>
              <Route index element={<InventoryDashboard />} />
              <Route path="items" element={<InventoryItems />} />
              <Route path="items/:id" element={<ItemDetail />} />
              <Route path="transactions" element={<InventoryTransactions />} />
              <Route path="transactions/:id" element={<TransactionDetail />} />
              <Route path="purchases" element={<InventoryPurchases />} />
              <Route path="purchases/:id" element={<PurchaseOrderDetail />} />
              <Route path="purchases/deliveries/:id" element={<DeliveryDetail />} />
              <Route path="requests" element={<InventoryRequests />} />
              <Route path="adjustments" element={<InventoryAdjustments />} />
              <Route path="reports" element={<InventoryReports />} />
            </Route>

            {/* Offerings Module */}
            <Route path="/temple/offerings" element={<OfferingsLayout />}>
              <Route index element={<OfferingsToday />} />
              <Route path="list" element={<OfferingsList />} />
              <Route path="slots" element={<SlotManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="pricing" element={<PricingRules />} />
              <Route path="priests" element={<PriestAssignment />} />
              <Route path="reports" element={<OfferingsReports />} />
              <Route path="panchang" element={<Panchang />} />
            </Route>

            {/* Bookings Module */}
            <Route path="/temple/bookings" element={<BookingsLayout />}>
              <Route index element={<BookingsToday />} />
              <Route path="all" element={<AllBookings />} />
              <Route path="counter" element={<CounterBooking />} />
              <Route path="prasad" element={<PrasadCounter />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reports" element={<BookingReports />} />
            </Route>

            {/* Settings Module */}
            <Route path="/temple/settings" element={<SettingsLayout />}>
              <Route index element={<ProfileSettings />} />
              <Route path="finance" element={<FinanceSettings />} />
              <Route path="subscription" element={<Pricing embedded />} />
              <Route path="upgrade" element={<SubscriptionUpgrade />} />
              <Route path="invoice" element={<InvoiceManagement />} />
              <Route path="templates" element={<ReceiptTemplates />} />
              <Route path="templates/builder" element={<ReceiptTemplateBuilder />} />
              <Route path="users" element={<UserAccessManagement />} />
              <Route path="roles" element={<Navigate to="/temple/settings/users" replace />} />
              <Route path="modules" element={<ModuleAccessControl />} />
              <Route path="system" element={<SystemSettings />} />
            </Route>

            {/* Knowledge Management Module */}
            <Route path="/temple/knowledge" element={<KnowledgeLayout />}>
              <Route index element={<KnowledgeDashboard />} />
              <Route path="categories" element={<KnowledgeCategories />} />
              <Route path="onboarding" element={<KnowledgeOnboarding />} />
              <Route path="library" element={<KnowledgeLibrary />} />
              <Route path="chat" element={<KnowledgeChatAssist />} />
            </Route>

            {/* Prasadam & Kitchen (Upcoming) */}
            <Route
              path="/temple/prasadam/*"
              element={<UpcomingModule moduleTitle="Prasadam & Kitchen" />}
            />

            {/* Placeholder routes for other Temple modules */}
            {/* Donation Management Module */}
            <Route path="/temple/donations" element={
              <ErrorBoundary>
                <DonationsLayout />
              </ErrorBoundary>
            }>
              <Route index element={<ErrorBoundary><DonationDashboard /></ErrorBoundary>} />
              <Route path="list" element={<ErrorBoundary><DonationsList /></ErrorBoundary>} />
              <Route path="add" element={<ErrorBoundary><AddDonation /></ErrorBoundary>} />
              <Route path="donors" element={<ErrorBoundary><DonorRegistry /></ErrorBoundary>} />
              <Route path="config" element={<ErrorBoundary><DonationConfiguration /></ErrorBoundary>} />
              <Route path="funds" element={<ErrorBoundary><Funds /></ErrorBoundary>} />
              <Route path="funds/:fundId" element={<ErrorBoundary><FundDetails /></ErrorBoundary>} />
              <Route path="reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
              <Route path="80g" element={<ErrorBoundary><Section80G /></ErrorBoundary>} />
              <Route path="receipts" element={<ErrorBoundary><Section80G /></ErrorBoundary>} />
              <Route path="form-10bd" element={<ErrorBoundary><Form10BD /></ErrorBoundary>} />
              <Route path="settlements" element={<ErrorBoundary><SettlementsPage /></ErrorBoundary>} />
            </Route>
            {/* Finance & Accounts Module */}
            <Route path="/temple/finance" element={<FinanceLayout />}>
              <Route index element={<FinanceDashboard />} />
              <Route path="accounts" element={<CashNonCashPage />} />
              <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="bank" element={<BankManagement />} />
              <Route path="transactions" element={<PaymentsExpensesPage />} />
              <Route path="gateway-receipts" element={<PaymentGatewayReceiptsPage />} />
              <Route path="funds" element={<CashFundFlowPage />} />
              <Route path="create-po" element={<CreatePurchaseOrderPage />} />
              <Route path="purchase-orders" element={<FinancePurchaseOrders />} />
              <Route path="invoices" element={<ProcurementInvoicePage />} />
              <Route path="payments" element={<ProcurementPaymentPage />} />
              
              <Route path="ledger" element={<FinanceLedgerPage />} />
              <Route path="vouchers" element={<JournalVoucherPage />} />
              <Route path="reconciliation" element={<TransactionsReconciliationPage />} />
              <Route path="reconciliation/bank" element={<BankReconciliationPage />} />
              <Route path="payroll" element={<FinancePayroll />} />
              <Route path="reports" element={<FinanceReportsPage />} />
              <Route path="statements" element={<FinancialReports />} />
              <Route path="categories" element={<FinanceCategories />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
            </Route>
            <Route
              path="/temple/planner"
              element={<UpcomingModule moduleTitle="Planner" />}
            />
            <Route
              path="/temple/knowledge"
              element={<UpcomingModule moduleTitle="Knowledge Management" />}
            />

            {/* Freelancer Management Module */}
            <Route path="/temple/freelancer" element={<Navigate to="/temple/freelancers" replace />} />
            <Route path="/temple/freelancers" element={<FreelancerLayout />}>
              <Route index element={<FreelancersList />} />
              <Route path="assignments" element={<FreelancerAssignments />} />
              <Route path="payments" element={<FreelancerPayments />} />
              <Route path="performance" element={<FreelancerPerformance />} />
              <Route path="insights" element={<FreelancerInsights />} />
            </Route>

            {/* VIP Devotee Management Module */}
            <Route path="/temple/vip" element={<VipLayout />}>
              <Route index element={<VipDashboard />} />
              <Route path="devotees" element={<VipDevotees />} />
              <Route path="levels" element={<VipLevels />} />
              <Route path="activity" element={<VipActivity />} />
              <Route path="reports" element={<VipReports />} />
              <Route path="eligibility" element={<VipEligibility />} />
            </Route>

            {/* Devotee CRM Module */}
            <Route path="/temple/devotees" element={<DevoteesLayout />}>
              <Route index element={<DevoteesList />} />
              <Route path="segments" element={<DevoteeGroups />} />
              <Route path="volunteers" element={<DevoteeVolunteers />} />
              <Route path="insights" element={<DevoteeDashboard />} />
            </Route>
            {/* Event Management Module */}
            <Route path="/temple/events" element={<EventsLayout />}>
              <Route index element={<AllEvents />} />
              <Route path="create" element={<CreateEvent />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="templates" element={<EventTemplates />} />
              <Route path="resources" element={<EventResources />} />
              <Route path="expenses" element={<EventExpenses />} />
              <Route path="reports" element={<EventReports />} />
              <Route path="archive" element={<EventArchive />} />
              <Route path=":eventId" element={<EventDetails />} />
            </Route>
            {/* PR & Communication Module */}
            <Route path="/temple/communication" element={<CommunicationLayout />}>
              <Route index element={<ControlCenter />} />
              <Route path="announcements" element={<CommAnnouncements />} />
              <Route path="media" element={<MediaCommunication />} />
              <Route path="broadcast" element={<LiveBroadcast />} />
              <Route path="experience" element={<DevoteeExperience />} />
              <Route path="meetings" element={<PublicMeetings />} />
              <Route path="logs" element={<CommLogsReports />} />
              <Route path="website" element={<TempleWebsite />} />
            </Route>
            <Route path="/temple/live" element={<TempleHub />} />
            <Route path="/temple/help" element={<HelpSupport />} />
            {/* Crowd & Capacity Management Module (Upcoming) */}
            <Route
              path="/temple/crowd/*"
              element={<UpcomingModule moduleTitle="Crowd & Capacity Management" />}
            />
            {/* People & HR Module */}
            <Route path="/temple/people" element={<PeopleLayout />}>
              <Route index element={<Employees />} />
              <Route path="attendance" element={<HRAttendance />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="leave" element={<Leave />} />
              <Route path="organization" element={<Organization />} />
              <Route path="org-tree" element={<OrgTree />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="salary" element={<SalaryCompensation />} />
              <Route path="onboarding" element={<EmployeeOnboarding />} />
            </Route>
            <Route
              path="/temple/assets"
              element={<UpcomingModule moduleTitle="Asset Management" />}
            />

            {/* Task Management Module */}
            <Route path="/temple/tasks" element={<TasksLayout />}>
              <Route index element={<TaskDashboard />} />
              <Route path="all" element={<AllTasks />} />
              <Route path="my" element={<MyTasks />} />
              <Route path="overdue" element={<OverdueTasks />} />
              <Route path="completed" element={<CompletedTasks />} />
              <Route path="templates" element={<ScheduledTemplates />} />
            </Route>
            {/* Reports Center Module */}
            <Route path="/temple/reports" element={<ReportsDashboard />} />
            <Route path="/temple/reports/*" element={<ReportsLayout />}>
              <Route path="donations" element={<RptDonations />} />
              <Route path="donations/tables" element={<DonationTables />} />
              <Route path="events" element={<RptEvents />} />
              <Route path="events/tables" element={<EventTables />} />
              <Route path="finance" element={<RptFinance />} />
              <Route path="finance/tables" element={<FinanceTables />} />
              <Route path="inventory" element={<RptInventory />} />
              <Route path="inventory/tables" element={<InventoryTables />} />
              <Route path="suppliers" element={<RptSuppliers />} />
              <Route path="suppliers/tables" element={<SupplierTables />} />
              <Route path="bookings" element={<RptBookings />} />
              <Route path="bookings/tables" element={<BookingTables />} />
              <Route path="offerings" element={<RptOfferings />} />
              <Route path="offerings/tables" element={<OfferingTables />} />
              <Route path="projects" element={<RptProjects />} />
              <Route path="projects/tables" element={<ProjectTables />} />
              <Route path="hr" element={<RptHR />} />
              <Route path="hr/tables" element={<HRTables />} />
              <Route path="vip" element={<RptVip />} />
              <Route path="vip/tables" element={<VipTables />} />
              <Route path="freelancers" element={<RptFreelancers />} />
              <Route path="freelancers/tables" element={<FreelancerTables />} />
              <Route path="feedback" element={<RptFeedback />} />
              <Route path="feedback/tables" element={<FeedbackTables />} />
              <Route path="devotees" element={<RptDevotees />} />
              <Route path="communication" element={<RptCommunication />} />
            </Route>

            {/* Branch Management Module */}
            <Route path="/temple/branches" element={<BranchLayout />}>
              <Route index element={<BranchDashboard />} />
              <Route path="dashboard" element={<BranchDashboard />} />
              <Route path="all" element={<AllBranches />} />
              <Route path="reports" element={<BranchReports />} />
            </Route>
            <Route path="/temple/branches/:branchId" element={<BranchDetails />} />

            {/* Institution Management Module */}
            <Route path="/temple/institutions" element={<InstitutionLayout />}>
              <Route index element={<InstitutionDashboard />} />
              <Route path="dashboard" element={<InstitutionDashboard />} />
              <Route path="all" element={<AllInstitutions />} />
              <Route path="reports" element={<InstitutionReports />} />
            </Route>
            <Route path="/temple/institutions/:institutionId" element={<InstitutionDetails />} />

            {/* Feedback & Analytics Module */}
            <Route path="/temple/feedback" element={<FeedbackLayout />}>
              <Route index element={<FeedbackDashboard />} />
              <Route path="collection" element={<FeedbackCollection />} />
              <Route path="sentiment" element={<FeedbackSentiment />} />
              <Route path="analytics" element={<FeedbackAnalytics />} />
            </Route>

            {/* Projects & Initiatives */}
            <Route path="/temple/projects" element={<ProjectsLayout />}>
              <Route index element={<ProjectsDashboard />} />
              <Route path="all" element={<AllProjects />} />
              <Route path="create" element={<CreateProject />} />
              <Route path=":id" element={<ProjectDetail />} />
              <Route path="timeline" element={<ProjectsTimeline />} />
              <Route path="reports" element={<ProjectsReports />} />
              <Route path="archive" element={<ProjectsArchive />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
