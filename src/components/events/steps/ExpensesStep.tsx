import ExpenseManagementSection from "@/components/events/ExpenseManagementSection";

const ExpensesStep = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Budget & Expenses</h3>
        <p className="text-sm text-muted-foreground mt-1">Plan and estimate event budget with line-item expenses</p>
      </div>
      <div className="max-w-5xl">
        <ExpenseManagementSection />
      </div>
    </div>
  );
};

export default ExpensesStep;
