import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildTemple, Temple } from '@/types/temple-structure';
import { ChildTempleModal } from '@/components/structure/ChildTempleModal';
import { dummyTemples, dummyChildTemples } from '@/data/temple-structure-data';
import { format } from 'date-fns';

export default function ChildTempleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples, setChildTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [childTempleModalOpen, setChildTempleModalOpen] = useState(false);

  const childTemple = childTemples.find(t => t.id === id);
  const parentTemple = temples.find(t => t.id === childTemple?.parentTempleId);

  const handleSaveChildTemple = (data: Partial<ChildTemple>) => {
    if (childTemple) {
      setChildTemples(childTemples.map(t => t.id === childTemple.id ? { ...t, ...data } : t));
    }
    setChildTempleModalOpen(false);
  };

  const toggleChildTempleStatus = () => {
    if (childTemple) {
      setChildTemples(childTemples.map(t =>
        t.id === childTemple.id
          ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
          : t
      ));
    }
  };

  if (!childTemple) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Child Temple Not Found</h1></div>
        <div className="mt-6 text-center py-16 text-muted-foreground">
          <p className="text-base">Child temple not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Child Temples"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/temple/structure/child-temples')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setChildTempleModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="mt-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 flex-wrap">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="details" className="text-base">Details</TabsTrigger>
            <TabsTrigger value="facilities" className="text-base">Facilities</TabsTrigger>
            <TabsTrigger value="gallery" className="text-base">Gallery</TabsTrigger>
            <TabsTrigger value="custom" className="text-base">Additional Info</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Hero Image */}
            {childTemple.image && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <img
                    src={childTemple.image}
                    alt={childTemple.name}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '500px' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Temple Name & Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{childTemple.name}</h1>
                {parentTemple && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="text-base">Parent: {parentTemple.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge variant={childTemple.status === 'active' ? 'success' : 'neutral'} className="px-3 py-1.5 h-auto text-sm">
                  {childTemple.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
                <Switch
                  checked={childTemple.status === 'active'}
                  onCheckedChange={toggleChildTempleStatus}
                />
              </div>
            </div>

            {/* Description */}
            {childTemple.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {childTemple.description}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-0">
            <div className="max-w-3xl space-y-8">
              {/* Parent Temple Info */}
              {parentTemple && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Parent Temple</h2>
                  <dl className="space-y-0 divide-y divide-border/50">
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Temple Name</dt>
                      <dd className="text-base font-semibold text-foreground">{parentTemple.name}</dd>
                    </div>
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Temple ID</dt>
                      <dd className="text-base font-semibold text-foreground font-mono text-sm">{childTemple.parentTempleId}</dd>
                    </div>
                    {parentTemple.location && (
                      <div className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">Location</dt>
                        <dd className="text-base font-semibold text-foreground">{parentTemple.location}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Temple Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Temple Information</h2>
                <dl className="space-y-0 divide-y divide-border/50">
                  {childTemple.distanceFromMain !== undefined && (
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Distance from Main</dt>
                      <dd className="text-base font-semibold text-foreground">{childTemple.distanceFromMain.toFixed(2)} km</dd>
                    </div>
                  )}
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Created On</dt>
                    <dd className="text-base font-semibold text-foreground">{format(new Date(childTemple.createdAt), 'MMMM dd, yyyy')}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Temple ID</dt>
                    <dd className="text-base font-semibold text-foreground font-mono text-sm">{childTemple.id}</dd>
                  </div>
                </dl>
              </div>

              {/* Operational Settings */}
              {childTemple.operationalSettings && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Operational Settings</h2>
                  <dl className="space-y-0 divide-y divide-border/50">
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Independent Operation</dt>
                      <dd className="text-base font-semibold text-foreground">{childTemple.operationalSettings.independent ? 'Yes' : 'No'}</dd>
                    </div>
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Follow Parent</dt>
                      <dd className="text-base font-semibold text-foreground">{childTemple.operationalSettings.followParent ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="mt-0">
            {childTemple.sharedFacilities && childTemple.sharedFacilities.length > 0 ? (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Shared Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {childTemple.sharedFacilities.map((facility, index) => (
                    <div key={index} className="px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm font-medium text-foreground">{facility.facilityType}</p>
                      <p className="text-xs text-muted-foreground mt-1">Access: {facility.accessLevel}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No shared facilities information available.</p>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Temple Gallery</h2>
              {childTemple.image ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                      src={childTemple.image}
                      alt={childTemple.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">Main View</p>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted/30 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">More images coming soon</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-base">No images available</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Additional Info Tab */}
          <TabsContent value="custom" className="mt-0">
            {childTemple.customFields && Object.keys(childTemple.customFields).length > 0 ? (
              <div className="max-w-4xl space-y-4">
                <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
                <dl className="space-y-0 divide-y divide-border/50">
                  {Object.entries(childTemple.customFields).map(([compositeKey, value]) => {
                    const [label, type] = compositeKey.includes("|") ? compositeKey.split("|") : [compositeKey, "text"];
                    let displayValue = String(value);
                    if ((type === "dropdown" || type === "radio") && displayValue.includes("::")) {
                      displayValue = displayValue.split("::")[1] || "—";
                    }
                    return (
                      <div key={compositeKey} className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">{label}</dt>
                        <dd className="text-base font-semibold text-foreground">{displayValue || "—"}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ) : (
              <p className="text-muted-foreground">No additional information available.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ChildTempleModal
        open={childTempleModalOpen}
        onOpenChange={setChildTempleModalOpen}
        childTemple={childTemple}
        temples={temples}
        onSave={handleSaveChildTemple}
      />
    </div>
  );
}
