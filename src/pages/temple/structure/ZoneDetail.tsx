import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, MapPin, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zone, Temple, ChildTemple, zoneTypeLabels } from '@/types/temple-structure';
import { ZoneModal } from '@/components/structure/ZoneModal';
import { dummyTemples, dummyChildTemples, dummyZones } from '@/data/temple-structure-data';
import { format } from 'date-fns';

export default function ZoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [zones, setZones] = useState<Zone[]>(dummyZones);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);

  const zone = zones.find(z => z.id === id);
  const parentTemple = zone?.associatedTempleType === 'child_temple'
    ? childTemples.find(t => t.id === zone?.associatedTempleId)
    : temples.find(t => t.id === zone?.associatedTempleId);

  const handleSaveZone = (data: Partial<Zone>) => {
    if (zone) {
      setZones(zones.map(z => z.id === zone.id ? { ...z, ...data } : z));
    }
    setZoneModalOpen(false);
  };

  const toggleZoneStatus = () => {
    if (zone) {
      setZones(zones.map(z =>
        z.id === zone.id
          ? { ...z, status: z.status === 'active' ? 'inactive' : 'active' }
          : z
      ));
    }
  };

  if (!zone) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Zone Not Found</h1></div>
        <div className="mt-6 text-center py-16 text-muted-foreground">
          <p className="text-base">Zone not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Zones"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/temple/structure/zones')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setZoneModalOpen(true)}>
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
            <TabsTrigger value="location" className="text-base">Location</TabsTrigger>
            <TabsTrigger value="capacity" className="text-base">Capacity</TabsTrigger>
            <TabsTrigger value="media" className="text-base">Media</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {zone.image && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '500px' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{zone.name}</h1>
                  <StatusBadge variant="primary" className="px-3 py-1.5 h-auto text-sm">
                    {zoneTypeLabels[zone.zoneType] || zone.zoneType}
                  </StatusBadge>
                </div>
                {parentTemple && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-base">Temple: {parentTemple.name}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge variant={zone.status === 'active' ? 'success' : 'neutral'} className="px-3 py-1.5 h-auto text-sm">
                  {zone.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
                <Switch checked={zone.status === 'active'} onCheckedChange={toggleZoneStatus} />
              </div>
            </div>

            {zone.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="text-base text-muted-foreground leading-relaxed">{zone.description}</p>
              </div>
            )}

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {zone.capacity && (
                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Capacity</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">{zone.capacity} persons</p>
                </div>
              )}
              <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Zone Type</span>
                </div>
                <p className="text-base font-semibold text-foreground">{zoneTypeLabels[zone.zoneType] || zone.zoneType}</p>
              </div>
              {zone.mapReference && (
                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Map Reference</div>
                  <p className="text-base font-semibold text-foreground">{zone.mapReference}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">Details</h2>
              <dl className="space-y-0 divide-y divide-border/50">
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Type</dt>
                  <dd className="text-base font-semibold text-foreground">{zoneTypeLabels[zone.zoneType] || zone.zoneType}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">ID</dt>
                  <dd className="text-base font-semibold text-foreground font-mono text-sm">{zone.id}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Created On</dt>
                  <dd className="text-base font-semibold text-foreground">{format(new Date(zone.createdAt), 'MMMM dd, yyyy')}</dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          {/* ── Location Tab ── */}
          <TabsContent value="location" className="mt-0">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Parent Temple
                </h2>
                <dl className="space-y-0 divide-y divide-border/50">
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Temple Name</dt>
                    <dd className="text-base font-semibold text-foreground">{parentTemple?.name || 'Unknown'}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Structure Type</dt>
                    <dd className="text-base font-semibold text-foreground">{zone.associatedTempleType === 'child_temple' ? 'Child Temple' : 'Main Temple'}</dd>
                  </div>
                  {zone.mapReference && (
                    <div className="py-4 flex justify-between items-start">
                      <dt className="text-base text-muted-foreground font-medium">Map Reference</dt>
                      <dd className="text-base font-semibold text-foreground">{zone.mapReference}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </TabsContent>

          {/* ── Capacity Tab ── */}
          <TabsContent value="capacity" className="mt-0">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Capacity
                </h2>
                <dl className="space-y-0 divide-y divide-border/50">
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Maximum Capacity</dt>
                    <dd className="text-base font-semibold text-foreground">{zone.capacity ? `${zone.capacity} persons` : 'Not set'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          {/* ── Media Tab ── */}
          <TabsContent value="media" className="mt-0">
            <div className="max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Photos</h2>
              {(zone.images && zone.images.length > 0) || zone.image ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(zone.images && zone.images.length > 0 ? zone.images : [zone.image].filter(Boolean)).map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={img!} alt={`${zone.name} - ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-sm font-medium">Main View</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-base">No photos available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ZoneModal
        open={zoneModalOpen}
        onOpenChange={setZoneModalOpen}
        zone={zone}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveZone}
      />
    </div>
  );
}
