import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, Building2, Sparkles, User, Calendar, BookOpen, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Sacred, Temple, ChildTemple } from '@/types/temple-structure';
import { sacredTypeLabels } from '@/types/temple-structure';
import { SacredModal } from '@/components/structure/SacredModal';
import { dummyTemples, dummyChildTemples, dummySacreds } from '@/data/temple-structure-data';
import { format } from 'date-fns';

export default function SacredDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [sacreds, setSacreds] = useState<Sacred[]>(dummySacreds);
  const [sacredModalOpen, setSacredModalOpen] = useState(false);

  const sacred = sacreds.find(s => s.id === id);

  const getTempleName = (id: string) => temples.find(t => t.id === id)?.name || 'Unknown';
  const getChildTempleName = (id: string) => childTemples.find(t => t.id === id)?.name || 'Unknown';
  const getAssociatedTempleName = (templeId: string, templeType: 'temple' | 'child_temple') => {
    if (templeType === 'temple') return getTempleName(templeId);
    return getChildTempleName(templeId);
  };

  const handleSaveSacred = (data: Partial<Sacred>) => {
    if (sacred) {
      setSacreds(sacreds.map(s => s.id === sacred.id ? { ...s, ...data } : s));
    }
    setSacredModalOpen(false);
  };

  const toggleSacredStatus = () => {
    if (sacred) {
      setSacreds(sacreds.map(s =>
        s.id === sacred.id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      ));
    }
  };

  const isShrineType = sacred && ['samadhi', 'brindavana', 'adhisthana', 'memorial'].includes(sacred.sacredType);

  if (!sacred) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Sacred Shrine Not Found</h1></div>
        <div className="mt-6 text-center py-16 text-muted-foreground">
          <p className="text-base">Sacred shrine not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Sacred Shrines"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/temple/structure/sacred')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setSacredModalOpen(true)}>
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
            {isShrineType && <TabsTrigger value="saint" className="text-base">Saint Information</TabsTrigger>}
            <TabsTrigger value="location" className="text-base">Location</TabsTrigger>
            <TabsTrigger value="media" className="text-base">Media</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Hero Image */}
            {sacred.image && (
              <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <img
                    src={sacred.image}
                    alt={sacred.name}
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '500px' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* Name, Type Badge & Status */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{sacred.name}</h1>
                  <StatusBadge variant={sacred.sacredType === 'deity' ? 'primary' : 'warning'} className="px-3 py-1.5 h-auto text-sm">
                    {sacredTypeLabels[sacred.sacredType]}
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-base">{getAssociatedTempleName(sacred.associatedTempleId, sacred.associatedTempleType)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge variant={sacred.status === 'active' ? 'success' : 'neutral'} className="px-3 py-1.5 h-auto text-sm">
                  {sacred.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
                <Switch checked={sacred.status === 'active'} onCheckedChange={toggleSacredStatus} />
              </div>
            </div>

            {/* Description */}
            {sacred.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">About</h2>
                <p className="text-base text-muted-foreground leading-relaxed">{sacred.description}</p>
              </div>
            )}

            {/* Summary Cards for Shrine Types */}
            {isShrineType && (sacred.saintName || sacred.samadhiDate || sacred.mathAffiliation) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sacred.saintName && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Saint / Jagadguru</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">{sacred.saintName}</p>
                    {sacred.saintTitle && <p className="text-sm text-muted-foreground">{sacred.saintTitle}</p>}
                  </div>
                )}
                {sacred.samadhiDate && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Samadhi Date</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">{format(new Date(sacred.samadhiDate), 'MMMM dd, yyyy')}</p>
                  </div>
                )}
                {sacred.mathAffiliation && (
                  <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Math / Peetha</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">{sacred.mathAffiliation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Shrine Details */}
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">Shrine Details</h2>
              <dl className="space-y-0 divide-y divide-border/50">
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Shrine Type</dt>
                  <dd className="text-base font-semibold text-foreground">{sacredTypeLabels[sacred.sacredType]}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Shrine ID</dt>
                  <dd className="text-base font-semibold text-foreground font-mono text-sm">{sacred.id}</dd>
                </div>
                <div className="py-4 flex justify-between items-start">
                  <dt className="text-base text-muted-foreground font-medium">Created On</dt>
                  <dd className="text-base font-semibold text-foreground">{format(new Date(sacred.createdAt), 'MMMM dd, yyyy')}</dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          {/* ── Saint Information Tab ── */}
          {isShrineType && (
            <TabsContent value="saint" className="mt-0">
              <div className="max-w-3xl space-y-8">
                {/* Saint Photo + Name Header */}
                <div className="flex items-start gap-6">
                  {sacred.saintImage && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border flex-shrink-0">
                      <img src={sacred.saintImage} alt={sacred.saintName || 'Saint'} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1 pt-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {sacred.saintTitle ? `${sacred.saintTitle} ` : ''}{sacred.saintName || 'Unknown'}
                    </h2>
                    {sacred.mathAffiliation && (
                      <p className="text-base text-muted-foreground">{sacred.mathAffiliation}</p>
                    )}
                  </div>
                </div>

                {/* Saint Details List */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Saint Details
                  </h2>
                  <dl className="space-y-0 divide-y divide-border/50">
                    {sacred.saintName && (
                      <div className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">Saint / Jagadguru Name</dt>
                        <dd className="text-base font-semibold text-foreground">{sacred.saintName}</dd>
                      </div>
                    )}
                    {sacred.saintTitle && (
                      <div className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">Title / Honorific</dt>
                        <dd className="text-base font-semibold text-foreground">{sacred.saintTitle}</dd>
                      </div>
                    )}
                    {sacred.samadhiDate && (
                      <div className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">Date / Year of Samadhi</dt>
                        <dd className="text-base font-semibold text-foreground">{format(new Date(sacred.samadhiDate), 'MMMM dd, yyyy')}</dd>
                      </div>
                    )}
                    {sacred.mathAffiliation && (
                      <div className="py-4 flex justify-between items-start">
                        <dt className="text-base text-muted-foreground font-medium">Math / Peetha Affiliation</dt>
                        <dd className="text-base font-semibold text-foreground">{sacred.mathAffiliation}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Historical Notes */}
                {sacred.historicalNotes && (
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">Historical Notes</h2>
                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">{sacred.historicalNotes}</p>
                  </div>
                )}

                {/* Empty state */}
                {!sacred.saintName && !sacred.samadhiDate && !sacred.historicalNotes && (
                  <div className="text-center py-16 text-muted-foreground">
                    <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-base">No saint information recorded yet.</p>
                    <p className="text-sm mt-1">Edit this shrine to add saint details.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* ── Location Tab ── */}
          <TabsContent value="location" className="mt-0">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Parent Location
                </h2>
                <dl className="space-y-0 divide-y divide-border/50">
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Temple Name</dt>
                    <dd className="text-base font-semibold text-foreground">{getAssociatedTempleName(sacred.associatedTempleId, sacred.associatedTempleType)}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Structure Type</dt>
                    <dd className="text-base font-semibold text-foreground">{sacred.associatedTempleType === 'temple' ? 'Main Temple' : 'Child Temple'}</dd>
                  </div>
                  <div className="py-4 flex justify-between items-start">
                    <dt className="text-base text-muted-foreground font-medium">Temple ID</dt>
                    <dd className="text-base font-semibold text-foreground font-mono text-sm">{sacred.associatedTempleId}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          {/* ── Media Tab ── */}
          <TabsContent value="media" className="mt-0">
            <div className="max-w-6xl space-y-8">
              {/* Shrine Photos */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Shrine Photos</h2>
                {(sacred.images && sacred.images.length > 0) || sacred.image ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(sacred.images && sacred.images.length > 0 ? sacred.images : [sacred.image].filter(Boolean)).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                        <img src={img!} alt={`${sacred.name} - ${i + 1}`} className="w-full h-full object-cover" />
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
                    <p className="text-base">No shrine photos available</p>
                  </div>
                )}
              </div>

              {/* Saint Photo */}
              {isShrineType && sacred.saintImage && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Saint Photo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                      <img src={sacred.saintImage} alt={sacred.saintName || 'Saint'} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-sm font-medium">{sacred.saintName || 'Saint'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SacredModal
        open={sacredModalOpen}
        onOpenChange={setSacredModalOpen}
        sacred={sacred}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveSacred}
      />
    </div>
  );
}
