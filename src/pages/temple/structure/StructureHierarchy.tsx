import { useState, useMemo, useCallback } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';
import {
  Building2,
  Home,
  Sparkles,
  MapPin,
  DoorOpen,
  Monitor,
  ArrowLeft,
  Download,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  dummyTemples,
  dummyChildTemples,
  dummySacreds,
  dummyZones,
  dummyHallRooms,
  dummyCounters,
} from '@/data/temple-structure-data';

// --- Types ---
type NodeType = 'Temple' | 'Child Temple' | 'Sacred' | 'Zone' | 'Hall' | 'Room' | 'Counter';

interface GraphNodeData {
  label: string;
  type: NodeType;
  status: 'active' | 'inactive';
  image?: string;
  capacity?: number;
}

// --- Custom Node Component ---
const CustomNode = ({ data }: { data: GraphNodeData }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'Temple': return <Building2 className="h-4 w-4" />;
      case 'Child Temple': return <Home className="h-4 w-4" />;
      case 'Sacred': return <Sparkles className="h-4 w-4" />;
      case 'Zone': return <MapPin className="h-4 w-4" />;
      case 'Hall': case 'Room': return <DoorOpen className="h-4 w-4" />;
      case 'Counter': return <Monitor className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (data.type) {
      case 'Temple': return 'border-orange-500 bg-orange-50/90 dark:bg-orange-950/90';
      case 'Child Temple': return 'border-amber-500 bg-amber-50/90 dark:bg-amber-950/90';
      case 'Sacred': return 'border-purple-500 bg-purple-50/90 dark:bg-purple-950/90';
      case 'Zone': return 'border-blue-500 bg-blue-50/90 dark:bg-blue-950/90';
      case 'Hall': case 'Room': return 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/90';
      case 'Counter': return 'border-slate-500 bg-slate-50/90 dark:bg-slate-950/90';
      default: return 'border-border';
    }
  };

  return (
    <div className="relative font-sans">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-3 !h-3" />

      <Card className={cn("w-64 border-l-4 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl", getColor())}>
        <div className="h-28 w-full bg-muted overflow-hidden relative">
          {data.image ? (
            <img
              src={data.image}
              alt={data.label}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              {getIcon()}
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge variant={data.status === 'active' ? 'success' : 'neutral'} className="shadow-sm backdrop-blur-md bg-background/80">
              {data.status}
            </StatusBadge>
          </div>
        </div>
        <div className="p-3 bg-background/95 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("p-1.5 rounded-full bg-background shadow-sm", getColor().split(' ')[0].replace('border-', 'text-'))}>
              {getIcon()}
            </span>
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{data.type}</span>
          </div>
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-2 min-h-[2.5em]" title={data.label}>{data.label}</h3>

          {data.capacity && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
              <Users className="h-3 w-3" />
              <span>Capacity: {data.capacity}</span>
            </div>
          )}
        </div>
      </Card>

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Layout Logic ---
const NODE_WIDTH = 280;
const NODE_HEIGHT = 220;

interface SimpleNode {
  id: string;
  children: SimpleNode[];
  data: GraphNodeData;
}

function buildTreeData(): SimpleNode[] {
  return dummyTemples.map(temple => {
    const children: SimpleNode[] = [];

    // 1. Child Temples
    const templeChildTemples = dummyChildTemples
      .filter(ct => ct.parentTempleId === temple.id)
      .map(ct => ({
        id: ct.id,
        data: { label: ct.name, type: 'Child Temple' as NodeType, status: ct.status, image: ct.image },
        children: [
          ...dummySacreds.filter(s => s.associatedTempleId === ct.id && s.associatedTempleType === 'child_temple').map(s => ({
            id: s.id,
            data: { label: s.name, type: (s.sacredType === 'deity' ? 'Sacred' : 'Sacred') as NodeType, status: s.status, image: s.image },
            children: []
          })),
          ...dummyZones.filter(z => z.associatedTempleId === ct.id && z.associatedTempleType === 'child_temple').map(z => ({
            id: z.id,
            data: { label: z.name, type: 'Zone' as NodeType, status: z.status, capacity: z.capacity, image: z.image },
            children: dummyHallRooms.filter(hr => hr.zoneId === z.id).map(hr => ({
              id: hr.id,
              data: { label: hr.name, type: (hr.type.includes('hall') ? 'Hall' : 'Room') as NodeType, status: hr.status, capacity: hr.capacity, image: hr.image },
              children: dummyCounters.filter(c => c.hallRoomId === hr.id).map(c => ({
                id: c.id,
                data: { label: c.name, type: 'Counter' as NodeType, status: c.status, image: c.image },
                children: []
              }))
            }))
          }))
        ]
      }));
    children.push(...templeChildTemples);

    // 2. Direct Sacreds
    const templeSacreds = dummySacreds
      .filter(s => s.associatedTempleId === temple.id && s.associatedTempleType === 'temple')
      .map(s => ({
        id: s.id,
        data: { label: s.name, type: (s.sacredType === 'deity' ? 'Sacred' : 'Sacred') as NodeType, status: s.status, image: s.image },
        children: []
      }));
    children.push(...templeSacreds);

    // 3. Direct Zones
    const templeZones = dummyZones
      .filter(z => z.associatedTempleId === temple.id && z.associatedTempleType === 'temple')
      .map(z => ({
        id: z.id,
        data: { label: z.name, type: 'Zone' as NodeType, status: z.status, capacity: z.capacity, image: z.image },
        children: dummyHallRooms.filter(hr => hr.zoneId === z.id).map(hr => ({
          id: hr.id,
          data: { label: hr.name, type: (hr.type.includes('hall') ? 'Hall' : 'Room') as NodeType, status: hr.status, capacity: hr.capacity, image: hr.image },
          children: dummyCounters.filter(c => c.hallRoomId === hr.id).map(c => ({
            id: c.id,
            data: { label: c.name, type: 'Counter' as NodeType, status: c.status, image: c.image },
            children: []
          }))
        }))
      }));
    children.push(...templeZones);

    return {
      id: temple.id,
      data: { label: temple.name, type: 'Temple' as NodeType, status: temple.status, image: temple.image },
      children
    };
  });
}

// Recursive layout function
const layoutNodes = (node: SimpleNode, x: number, y: number, nodes: Node[], edges: Edge[]) => {
  const currentNode: Node = {
    id: node.id,
    type: 'custom',
    data: node.data,
    position: { x, y },
  };
  nodes.push(currentNode);

  if (!node.children || node.children.length === 0) {
    return NODE_WIDTH + 40; // Return width of this subtree (leaf) plus padding
  }

  let childrenWidth = 0;

  node.children.forEach((child) => {
    const childWidth = layoutNodes(child, x + childrenWidth, y + NODE_HEIGHT + 80, nodes, edges);

    // Create edge
    edges.push({
      id: `${node.id}-${child.id}`,
      source: node.id,
      target: child.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
    });

    childrenWidth += childWidth;
  });

  // Re-center parent node over its children
  // The layout logic above places children starting at 'x'.
  // We want to center the parent relative to the total width of children
  // center = x + (childrenWidth / 2)
  // then subtract half the node width to find left position
  const centerX = x + (childrenWidth / 2) - (NODE_WIDTH / 2);
  currentNode.position.x = centerX;

  return childrenWidth; // Return total width consumed by this subtree
};


export default function StructureHierarchy() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useMemo(() => {
    const treeData = buildTreeData();
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    let startX = 0;
    treeData.forEach(root => {
      const width = layoutNodes(root, startX, 0, newNodes, newEdges);
      startX += width + 200; // Spacing between main temples
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  if (!checkModuleAccess('structure')) {
    return (
      <div>
        <div className="mb-6"><h1 className="text-2xl font-bold">Access Denied</h1></div>
      </div>
    );
  }

  const handleExport = () => {
    // Export logic
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temple-graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4 border-b bg-background z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/structure')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <PageHeader
                title="Structure Graph"
                description="Interactive node-based hierarchy view"
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Graph
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} size={1} color="#94a3b8" className="opacity-20" />
            <Controls className="bg-white dark:bg-slate-900 border-border p-1 rounded-lg shadow-md" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
