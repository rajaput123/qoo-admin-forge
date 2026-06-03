import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { Counter, HallRoom, Temple, ChildTemple, counterTypeLabels } from '@/types/temple-structure';
import { CounterModal } from '@/components/structure/CounterModal';
import { dummyHallRooms, dummyCounters, dummyTemples, dummyChildTemples } from '@/data/temple-structure-data';
import { usePermissions } from '@/hooks/usePermissions';

export default function Counters() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [hallRooms] = useState<HallRoom[]>(dummyHallRooms);
  const [counters, setCounters] = useState<Counter[]>(dummyCounters);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);

  if (!checkModuleAccess('structure')) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Access Denied</h1></div>
      </div>
    );
  }

  const getHallRoomName = (id: string) => hallRooms.find(h => h.id === id)?.name || '-';

  const handleSaveCounter = (data: Partial<Counter>) => {
    if (editingCounter) {
      setCounters(counters.map(c => c.id === editingCounter.id ? { ...c, ...data } : c));
    } else {
      setCounters([...counters, { ...data, id: `counter-${Date.now()}`, createdAt: new Date().toISOString() } as Counter]);
    }
    setEditingCounter(null);
    setCounterModalOpen(false);
  };

  const toggleCounterStatus = (id: string) => {
    setCounters(counters.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  const counterColumns = [
    { key: 'name', label: 'Counter Name', sortable: true },
    {
      key: 'counterType',
      label: 'Type',
      render: (value: unknown) => counterTypeLabels[value as keyof typeof counterTypeLabels] || String(value)
    },
    {
      key: 'hallRoomId',
      label: 'Hall / Room',
      render: (value: unknown) => getHallRoomName(value as string)
    },
    {
      key: 'servicePricing',
      label: 'Base Rate',
      render: (_: unknown, row: Counter) =>
        row.servicePricing ? `₹${row.servicePricing.baseRate.toLocaleString('en-IN')}` : '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: Counter) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => toggleCounterStatus(row.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Counters"
        description="Manage seva and service counters"
        actions={
          <Button onClick={() => { setEditingCounter(null); setCounterModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Counter
          </Button>
        }
      />

      <div className="mt-6">
        <DataTable
          data={counters}
          columns={counterColumns}
          searchPlaceholder="Search counters..."
          defaultViewMode="grid"
          imageKey="image"
          onRowClick={(row) => navigate(`/temple/structure/counters/${row.id}`)}
          actions={(row) => (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setEditingCounter(row);
              setCounterModalOpen(true);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </div>

      <CounterModal
        open={counterModalOpen}
        onOpenChange={setCounterModalOpen}
        counter={editingCounter}
        hallRooms={hallRooms}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveCounter}
      />
    </div>
  );
}
