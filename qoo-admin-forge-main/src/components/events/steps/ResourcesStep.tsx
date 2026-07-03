import ResourceAllocationSection from "@/components/events/ResourceAllocationSection";

const ResourcesStep = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Resource Allocation</h3>
        <p className="text-sm text-muted-foreground mt-1">Allocate venues, materials and equipment for this event</p>
      </div>
      <div className="max-w-5xl">
        <ResourceAllocationSection />
      </div>
    </div>
  );
};

export default ResourcesStep;
