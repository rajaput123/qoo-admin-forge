import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';

import { ArrowLeft, Edit, Monitor, MapPin, DoorOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Counter, HallRoom, Temple, ChildTemple, counterTypeLabels } from '@/types/temple-structure';
import { CounterModal } from '@/components/structure/CounterModal';
import { dummyHallRooms, dummyCounters, dummyTemples, dummyChildTemples } from '@/data/temple-structure-data';
import { format } from 'date-fns';

export default function CounterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [hallRooms] = useState<HallRoom[]>(dummyHallRooms);
  const [counters, setCounters] = useState<Counter[]>(dummyCounters);
  const [counterModalOpen, setCounterModalOpen] = useState(false);

  const counter = counters.find(c => c.id === id);
  const hallRoom = hallRooms.find(h => h.id === counter?.hallRoomId);
  const parentTemple = counter?.associatedTempleType === 'child_temple'
    ? childTemples.find(t => t.id === counter?.associatedTempleId)
    : temples.find(t => t.id === counter?.associatedTempleId);

  const handleSaveCounter = (data: Partial<Counter>) => {
    if (counter) {
      setCounters(counters.map(c => c.id === counter.id ? { ...c, ...data } : c));
    }
    setCounterModalOpen(false);
  };

  const toggleCounterStatus = () => {
    if (counter) {
      setCounters(counters.map(c =>
        c.id === counter.id
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      ));
    }
  };

  if (!counter) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Counter Not Found</h1></div>
        <div className="mt-6 text-center py-16 text-muted-foreground">
          <p className="text-base">Counter not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Counters"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/temple/structure/counters')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setCounterModalOpen(true)}>
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
            <TabsTrigger value="media" className="text-base">Media</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {counter.image && counter.image !== '/placeholder.svg' && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <img
                    src={counter.image}
                    alt={counter.name}
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
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{counter.name}</h1>
                  <StatusBadge variant="primary" className="px-3 py-1.5 h-auto text-sm">
                    {counterTypeLabels[counter.counterType] || counter.counterType}
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
                <StatusBadge variant={counter.status === 'active' ? 'success' : 'neutral'} className="px-3 py-1.5 h-auto text-sm">
                  {counter.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
                <Switch checked={counter.status === 'active'} onCheckedChange={toggleCounterStatus} />
              </div>
            </div>

            {counter.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="text-base text-muted-foreground leading-relaxed">{counter.description}</p>
              </div>
            )}

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Counter Type</span>
                </div>
                <p className="text-base font-semibold text-foreground">{counterTypeLabels[counter.counterType]}</p>
              </div>
              {hallRoom && (
                <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DoorOpen className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Hall / Room</span>
                  </div>
                  <p className="text-base font-semibold text-foreground">{hallRoom.name}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">Details</h2>
              <dl className="space-y-0 divide-y divide-border/50">
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Type</dt>
                  <dd className="text-base font-semibold text-foreground">{counterTypeLabels[counter.counterType]}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">ID</dt>
                  <dd className="text-base font-semibold text-foreground font-mono text-sm">{counter.id}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Created On</dt>
                  <dd className="text-base font-semibold text-foreground">{format(new Date(counter.createdAt), 'MMMM dd, yyyy')}</dd>
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
                    <dd className="text-base font-semibold text-foreground">{parentTemple?.name || 'Not assigned'}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Structure Type</dt>
                    <dd className="text-base font-semibold text-foreground">{counter.associatedTempleType === 'child_temple' ? 'Child Temple' : 'Main Temple'}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Hall / Room</dt>
                    <dd className="text-base font-semibold text-foreground">{hallRoom?.name || 'Not assigned'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>



          {/* ── Media Tab ── */}
          <TabsContent value="media" className="mt-0">
            <div className="max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Photos</h2>
              {(counter.images && counter.images.length > 0) || (counter.image && counter.image !== '/placeholder.svg') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(counter.images && counter.images.length > 0 ? counter.images : [counter.image].filter(Boolean)).map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={img!} alt={`${counter.name} - ${i + 1}`} className="w-full h-full object-cover" />
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

      <CounterModal
        open={counterModalOpen}
        onOpenChange={setCounterModalOpen}
        counter={counter}
        hallRooms={hallRooms}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveCounter}
      />
    </div>
  );
}
