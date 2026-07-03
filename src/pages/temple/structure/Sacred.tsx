import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';


import { Plus, Edit } from 'lucide-react';
import type { Sacred, Temple, ChildTemple } from '@/types/temple-structure';
import { sacredTypeLabels } from '@/types/temple-structure';
import { SacredModal } from '@/components/structure/SacredModal';
import { dummyTemples, dummyChildTemples, dummySacreds } from '@/data/temple-structure-data';
import { usePermissions } from '@/hooks/usePermissions';

export default function Sacred() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [sacreds, setSacreds] = useState<Sacred[]>(dummySacreds);
  const [sacredModalOpen, setSacredModalOpen] = useState(false);
  const [editingSacred, setEditingSacred] = useState<Sacred | null>(null);
  const [selectedSacred, setSelectedSacred] = useState<Sacred | null>(null);

  // Permission check removed - always allow for now

  const getTempleName = (id: string) => temples.find(t => t.id === id)?.name || 'Unknown';
  const getChildTempleName = (id: string) => childTemples.find(t => t.id === id)?.name || 'Unknown';

  const getAssociatedTempleName = (templeId: string, templeType: 'temple' | 'child_temple') => {
    if (templeType === 'temple') return getTempleName(templeId);
    return getChildTempleName(templeId);
  };

  const handleSaveSacred = (data: Partial<Sacred>) => {
    if (editingSacred) {
      setSacreds(sacreds.map(s => s.id === editingSacred.id ? { ...s, ...data } : s));
    } else {
      setSacreds([...sacreds, { ...data, id: `sacred-${Date.now()}`, createdAt: new Date().toISOString() } as Sacred]);
    }
    setEditingSacred(null);
    setSacredModalOpen(false);
  };

  const toggleSacredStatus = (id: string) => {
    setSacreds(sacreds.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const sacredColumns = [
    { key: 'name', label: 'Sacred Name', sortable: true },
    {
      key: 'sacredType',
      label: 'Type',
      render: (value: unknown) => (
        <StatusBadge variant={value === 'deity' ? 'primary' : 'warning'}>
          {sacredTypeLabels[value as keyof typeof sacredTypeLabels]}
        </StatusBadge>
      )
    },
    {
      key: 'associatedTempleId',
      label: 'Associated Temple',
      render: (_: unknown, row: Sacred) => getAssociatedTempleName(row.associatedTempleId, row.associatedTempleType)
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: Sacred) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => toggleSacredStatus(row.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sacred Shrines</h1>
          <p className="text-muted-foreground">Manage deities, samadhi & brindavana shrines</p>
        </div>
        <Button onClick={() => { setEditingSacred(null); setSacredModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shrine
        </Button>
      </div>

      <div className="mt-6">
        <DataTable
          data={sacreds}
          columns={sacredColumns}
          searchPlaceholder="Search sacred shrines..."
          defaultViewMode="grid"
          imageKey="image"
          onRowClick={(row) => {
            setSelectedSacred(row);
            navigate(`/temple/structure/sacred/${row.id}`);
          }}
          actions={(row) => (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setEditingSacred(row);
              setSacredModalOpen(true);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </div>

      <SacredModal
        open={sacredModalOpen}
        onOpenChange={setSacredModalOpen}
        sacred={editingSacred}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveSacred}
      />
    </div>
  );
}
