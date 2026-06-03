import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Building2, MapPin, Calendar, Info, Clock, Users, History, Map } from 'lucide-react';
import { Temple } from '@/types/temple-structure';
import { TempleModal } from '@/components/structure/TempleModal';
import { dummyTemples } from '@/data/temple-structure-data';
import { format } from 'date-fns';

export default function Temples() {
  const [temples, setTemples] = useState<Temple[]>(() => {
    // Auto-fill main temple from registration data if available
    const regDataStr = localStorage.getItem('registrationData');
    if (regDataStr) {
      try {
        const reg = JSON.parse(regDataStr);
        const autoFilledTemple: Temple = {
          ...dummyTemples[0],
          id: 'temple-1',
          name: reg.templeName || dummyTemples[0].name,
          location: [reg.city, reg.state].filter(Boolean).join(', ') || dummyTemples[0].location,
          deity: reg.primaryDeity || dummyTemples[0].deity,
          contactEmail: reg.email || dummyTemples[0].contactEmail,
          contactPhone: reg.mobile ? `+91 ${reg.mobile}` : dummyTemples[0].contactPhone,
          contactAddress: reg.fullAddress || dummyTemples[0].contactAddress,
          isPrimary: true,
          status: 'active',
        };
        return [autoFilledTemple, ...dummyTemples.slice(1)];
      } catch {
        return dummyTemples;
      }
    }
    return dummyTemples;
  });
  const [templeModalOpen, setTempleModalOpen] = useState(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);

  const handleSaveTemple = (data: Partial<Temple>) => {
    if (editingTemple) {
      setTemples(temples.map(t => t.id === editingTemple.id ? { ...t, ...data } : t));
    } else {
      setTemples([...temples, { ...data, id: `temple-${Date.now()}`, createdAt: new Date().toISOString() } as Temple]);
    }
    setEditingTemple(null);
    setTempleModalOpen(false);
  };

  const toggleTempleStatus = (id: string) => {
    const temple = temples.find(t => t.id === id);
    if (temple) {
      const newStatus = temple.status === 'active' ? 'inactive' : 'active';
      const statusHistory = temple.statusHistory || [];
      setTemples(temples.map(t => t.id === id ? {
        ...t,
        status: newStatus,
        statusHistory: [...statusHistory, {
          date: new Date().toISOString(),
          status: newStatus,
          changedBy: 'Admin',
        }]
      } : t));
    }
  };

  const updateOperationalStatus = (id: string, status: 'open' | 'closed' | 'maintenance', reason?: string) => {
    const temple = temples.find(t => t.id === id);
    if (temple) {
      const statusHistory = temple.statusHistory || [];
      setTemples(temples.map(t => t.id === id ? {
        ...t,
        operationalStatus: status,
        statusHistory: [...statusHistory, {
          date: new Date().toISOString(),
          status: `operational:${status}`,
          changedBy: 'Admin',
          reason,
        }]
      } : t));
    }
  };

  const hasPrimaryTemple = temples.some(t => t.isPrimary && t.id !== editingTemple?.id);
  const mainTemple = temples.find(t => t.isPrimary) || temples[0];

  if (!mainTemple) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Temples</h1>
            <p className="text-muted-foreground">Manage temple information</p>
          </div>
          <Button onClick={() => { setEditingTemple(null); setTempleModalOpen(true); }}>
            <Building2 className="h-4 w-4 mr-2" />
            Add Temple
          </Button>
        </div>
        <div className="mt-6">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No temple information available. Please add a temple.
            </CardContent>
          </Card>
        </div>
        <TempleModal
          open={templeModalOpen}
          onOpenChange={setTempleModalOpen}
          temple={editingTemple}
          onSave={handleSaveTemple}
          hasPrimaryTemple={hasPrimaryTemple}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Temples</h1>
        <Button onClick={() => { setEditingTemple(mainTemple); setTempleModalOpen(true); }}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Temple
        </Button>
      </div>

      <div className="mt-4">
        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 flex-wrap">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="details" className="text-base">Details</TabsTrigger>
            <TabsTrigger value="facilities" className="text-base">Facilities</TabsTrigger>
            <TabsTrigger value="dress" className="text-base">Dress Code</TabsTrigger>
            <TabsTrigger value="timings" className="text-base">Timings</TabsTrigger>
            <TabsTrigger value="additional" className="text-base">Additional</TabsTrigger>
            <TabsTrigger value="gallery" className="text-base">Gallery</TabsTrigger>
            <TabsTrigger value="history" className="text-base">History</TabsTrigger>
            <TabsTrigger value="map" className="text-base">Location</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Hero Image */}
            {mainTemple.image && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <img
                    src={mainTemple.image}
                    alt={mainTemple.name}
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
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{mainTemple.name}</h1>
                  {mainTemple.isPrimary && (
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Primary Temple
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-base">{mainTemple.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge variant={mainTemple.status === 'active' ? 'success' : 'neutral'} className="px-3 py-1.5 h-auto text-sm">
                  {mainTemple.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>
            </div>

            {/* Description */}
            {mainTemple.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {mainTemple.description}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-0">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Temple Information</h2>
              <dl className="space-y-0 divide-y divide-border/50">
                {mainTemple.deity && (
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Deity</dt>
                    <dd className="text-base font-semibold text-foreground">{mainTemple.deity}</dd>
                  </div>
                )}
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Contact Phone</dt>
                  <dd className="text-base font-semibold text-foreground">{mainTemple.contactPhone || '—'}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Email</dt>
                  <dd className="text-base font-semibold text-foreground">{mainTemple.contactEmail || '—'}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Established</dt>
                  <dd className="text-base font-semibold text-foreground">{format(new Date(mainTemple.createdAt), 'MMMM dd, yyyy')}</dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="mt-0">
            {mainTemple.facilities && mainTemple.facilities.length > 0 ? (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Temple Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mainTemple.facilities.map((facility, index) => (
                    <div key={index} className="px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg text-sm font-medium text-foreground">
                      {facility}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No facilities information available.</p>
            )}
          </TabsContent>

          {/* Dress Code Tab */}
          <TabsContent value="dress" className="mt-0">
            {mainTemple.dressCode ? (
              <div className="max-w-4xl space-y-6">
                <h2 className="text-2xl font-bold">Dress Code Guidelines</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const text = mainTemple.dressCode;
                    const menMatch = text.match(/Men[:\s]*([^.]+)/i);
                    const womenMatch = text.match(/Women[:\s]*([^.]+)/i);
                    const childrenMatch = text.match(/Children[:\s]*([^.]+)/i);
                    const generalParts = text.split('.').map(s => s.trim()).filter(s =>
                      s && !s.match(/^Men/i) && !s.match(/^Women/i) && !s.match(/^Children/i)
                    );

                    const cards = [];

                    if (generalParts.length > 0) {
                      cards.push(
                        <div key="general" className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-lg">🏛️</span>
                            </div>
                            <h3 className="font-semibold text-foreground">General</h3>
                          </div>
                          <ul className="space-y-1.5">
                            {generalParts.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-primary mt-0.5">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (menMatch) {
                      cards.push(
                        <div key="men" className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <span className="text-lg">👔</span>
                            </div>
                            <h3 className="font-semibold text-foreground">Men</h3>
                          </div>
                          <ul className="space-y-1.5">
                            {menMatch[1].split(/[,/]/).map(s => s.trim()).filter(Boolean).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-blue-500 mt-0.5">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (womenMatch) {
                      cards.push(
                        <div key="women" className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
                              <span className="text-lg">👗</span>
                            </div>
                            <h3 className="font-semibold text-foreground">Women</h3>
                          </div>
                          <ul className="space-y-1.5">
                            {womenMatch[1].split(/[,/]/).map(s => s.trim()).filter(Boolean).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-pink-500 mt-0.5">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (childrenMatch) {
                      cards.push(
                        <div key="children" className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <span className="text-lg">👶</span>
                            </div>
                            <h3 className="font-semibold text-foreground">Children</h3>
                          </div>
                          <ul className="space-y-1.5">
                            {childrenMatch[1].split(/[,/]/).map(s => s.trim()).filter(Boolean).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-green-500 mt-0.5">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    return cards.length > 0 ? cards : (
                      <div className="col-span-full rounded-xl border border-border bg-muted/30 p-5">
                        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No dress code information available.</p>
            )}
          </TabsContent>

          {/* Timings Tab - Redesigned without card */}
          <TabsContent value="timings" className="mt-0">
            {mainTemple.darshanTimings ? (
              <div className="max-w-2xl space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Clock className="h-7 w-7 text-primary" />
                  Darshan Timings
                </h2>

                <dl className="space-y-5">
                  <div className="flex justify-between items-center py-4 border-b-2">
                    <dt className="text-lg text-muted-foreground font-medium">Temple Opens</dt>
                    <dd className="text-2xl font-bold text-foreground">{mainTemple.darshanTimings.open}</dd>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-2">
                    <dt className="text-lg text-muted-foreground font-medium">Temple Closes</dt>
                    <dd className="text-2xl font-bold text-foreground">{mainTemple.darshanTimings.close}</dd>
                  </div>
                  <div>
                    <dt className="text-lg text-muted-foreground font-medium mb-3">Open Days</dt>
                    <dd className="flex flex-wrap gap-2">
                      {mainTemple.darshanTimings.days.map(day => (
                        <span key={day} className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold border border-primary/20">
                          {day}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-muted-foreground">Timings not configured</p>
            )}
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="mt-0">
            {mainTemple.customFields && Object.keys(mainTemple.customFields).length > 0 ? (
              <div className="max-w-4xl space-y-4">
                <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mainTemple.customFields).map(([key, value]) => (
                    <div key={key} className="space-y-2 pb-4 border-b">
                      <dt className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{key}</dt>
                      <dd className="text-base font-semibold text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="text-muted-foreground">No additional information available.</p>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Temple Gallery</h2>
              {mainTemple.image ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                      src={mainTemple.image}
                      alt={`${mainTemple.name} - Main`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">Main Temple View</p>
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

          {/* History Tab */}
          <TabsContent value="history" className="mt-0">
            {mainTemple.templeHistory ? (
              <div className="space-y-4 prose prose-slate dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">Temple History</h2>
                {mainTemple.templeHistory.split('\n\n').map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Check if it's a heading (starts with **)
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    const heading = trimmed.slice(2, -2);
                    return (
                      <h3 key={idx} className="text-xl font-semibold mt-6 mb-3 text-foreground">
                        {heading}
                      </h3>
                    );
                  }

                  return (
                    <p key={idx} className="text-base text-muted-foreground leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base">No temple history available.</p>
              </div>
            )}
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="map" className="mt-0 space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </h2>
              <p className="text-base text-muted-foreground">{mainTemple.contactAddress || mainTemple.location || 'Address not available'}</p>
            </div>

            {/* Embedded Map */}
            {mainTemple.gpsCoordinates && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Location Map</h2>
                  <div className="w-full rounded-lg overflow-hidden border shadow-sm" style={{ height: '450px' }}>
                    <iframe
                      title="Temple Location Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${mainTemple.gpsCoordinates.latitude},${mainTemple.gpsCoordinates.longitude}&hl=en&z=15&output=embed`}
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-muted-foreground">GPS Coordinates</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-md font-mono text-sm">
                      <dt className="text-muted-foreground">Latitude</dt>
                      <dd className="font-semibold">{mainTemple.gpsCoordinates.latitude.toFixed(6)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-muted/30 rounded-md font-mono text-sm">
                      <dt className="text-muted-foreground">Longitude</dt>
                      <dd className="font-semibold">{mainTemple.gpsCoordinates.longitude.toFixed(6)}</dd>
                    </div>
                  </dl>
                </div>

                {mainTemple.geoFencingRadius && (
                  <p className="text-sm text-muted-foreground">
                    Geo-fencing Radius: <span className="font-medium text-foreground">{mainTemple.geoFencingRadius} meters</span>
                  </p>
                )}

                <div className="flex gap-3">
                  <a
                    href={`https://www.google.com/maps?q=${mainTemple.gpsCoordinates.latitude},${mainTemple.gpsCoordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <Map className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mainTemple.gpsCoordinates.latitude},${mainTemple.gpsCoordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <MapPin className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TempleModal
        open={templeModalOpen}
        onOpenChange={setTempleModalOpen}
        temple={editingTemple}
        onSave={handleSaveTemple}
        hasPrimaryTemple={hasPrimaryTemple}
      />
    </div>
  );
}
