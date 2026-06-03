import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { HallRoom, Temple, ChildTemple, hallRoomTypeLabels } from '@/types/temple-structure';
import { HallRoomModal } from '@/components/structure/HallRoomModal';
import { dummyTemples, dummyChildTemples, dummyHallRooms } from '@/data/temple-structure-data';
import { usePermissions } from '@/hooks/usePermissions';

export default function HallsRooms() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [temples] = useState<Temple[]>(dummyTemples);
  const [childTemples] = useState<ChildTemple[]>(dummyChildTemples);
  const [hallRooms, setHallRooms] = useState<HallRoom[]>(dummyHallRooms);
  const [hallRoomModalOpen, setHallRoomModalOpen] = useState(false);
  const [editingHallRoom, setEditingHallRoom] = useState<HallRoom | null>(null);

  if (!checkModuleAccess('structure')) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Access Denied</h1></div>
      </div>
    );
  }

  const getTempleName = (id: string) => {
    const t = temples.find(t => t.id === id);
    if (t) return t.name;
    const ct = childTemples.find(t => t.id === id);
    return ct?.name || 'Unknown';
  };

  const handleSaveHallRoom = (data: Partial<HallRoom>) => {
    if (editingHallRoom) {
      setHallRooms(hallRooms.map(h => h.id === editingHallRoom.id ? { ...h, ...data } : h));
    } else {
      setHallRooms([...hallRooms, { ...data, id: `hall-${Date.now()}`, createdAt: new Date().toISOString() } as HallRoom]);
    }
    setEditingHallRoom(null);
    setHallRoomModalOpen(false);
  };

  const toggleHallRoomStatus = (id: string) => {
    setHallRooms(hallRooms.map(h => h.id === id ? { ...h, status: h.status === 'active' ? 'inactive' : 'active' } : h));
  };

  const hallRoomColumns = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown) => hallRoomTypeLabels[value as keyof typeof hallRoomTypeLabels] || String(value)
    },
    {
      key: 'zoneId',
      label: 'Temple',
      render: (value: unknown) => getTempleName(value as string)
    },
    { key: 'capacity', label: 'Capacity', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: HallRoom) => (
        <Switch
          checked={row.status === 'active'}
          onCheckedChange={() => toggleHallRoomStatus(row.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Halls & Rooms"
        description="Manage halls, rooms and temple spaces"
        actions={
          <Button onClick={() => { setEditingHallRoom(null); setHallRoomModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Hall / Room
          </Button>
        }
      />

      <div className="mt-6">
        <DataTable
          data={hallRooms}
          columns={hallRoomColumns}
          searchPlaceholder="Search halls & rooms..."
          defaultViewMode="grid"
          imageKey="image"
          onRowClick={(row) => navigate(`/temple/structure/halls/${row.id}`)}
          actions={(row) => (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setEditingHallRoom(row);
              setHallRoomModalOpen(true);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        />
      </div>

      <HallRoomModal
        open={hallRoomModalOpen}
        onOpenChange={setHallRoomModalOpen}
        hallRoom={editingHallRoom}
        temples={temples}
        childTemples={childTemples}
        onSave={handleSaveHallRoom}
      />
    </div>
  );
}
