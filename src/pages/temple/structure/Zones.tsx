import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { Zone, Temple, ChildTemple, zoneTypeLabels } from '@/types/temple-structure';
import { ZoneModal } from '@/components/structure/ZoneModal';
import { dummyTemples, dummyChildTemples, dummyZones } from '@/data/temple-structure-data';
import { usePermissions } from '@/hooks/usePermissions';

export default function Zones() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [zones, setZones] = useState<Zone[]>(dummyZones);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  if (!checkModuleAccess('structure')) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Access Denied</h1></div>
      </div>
    );
  }

  const getAssociatedTempleName = (templeId: string, templeType: 'temple' | 'child_temple') => {
    if (templeType === 'temple') return temples.find(t => t.id === templeId)?.name || 'Unknown';
    return childTemples.find(t => t.id === templeId)?.name || 'Unknown';
  };

  const handleSaveZone = (data: Partial<Zone>) => {
    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? { ...z, ...data } : z));
    } else {
      setZones([...zones, { ...data, id: `zone-${Date.now()}`, createdAt: new Date().toISOString() } as Zone]);
    }
    setEditingZone(null);
    setZoneModalOpen(false);
  };

  const toggleZoneStatus = (id: string) => {
    setZones(zones.map(z => z.id === id ? { ...z, status: z.status === 'active' ? 'inactive' : 'active' } : z));
  };

  const zoneColumns = [
    { key: 'name', label: 'Zone Name', sortable: true },
    {
      key: 'zoneType',
      label: 'Type',
      render: (value: unknown) => zoneTypeLabels[value as keyof typeof zoneTypeLabels]
    },
    {
      key: 'associatedTempleId',
      label: 'Temple',
      render: (_: unknown, row: Zone) => getAssociatedTempleName(row.associatedTempleId, row.associatedTempleType)
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (_: unknown, row: Zone) => row.capacity || '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: Zone) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => toggleZoneStatus(row.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Zones"
        description="Manage temple zones and areas"
        actions={
          <Button onClick={() => { setEditingZone(null); setZoneModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        }
      />

      <div className="mt-6">
        <DataTable
          data={zones}
          columns={zoneColumns}
          searchPlaceholder="Search zones..."
          defaultViewMode="grid"
          imageKey="image"
          onRowClick={(row) => navigate(`/temple/structure/zones/${row.id}`)}
          actions={(row) => (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setEditingZone(row);
              setZoneModalOpen(true);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </div>

      <ZoneModal
        open={zoneModalOpen}
        onOpenChange={setZoneModalOpen}
        zone={editingZone}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveZone}
      />
    </div>
  );
}
