import { useMemo, useState } from "react";
import { ChevronRight, Search, Shield, Check, Minus, Eye, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  permissionTree,
  featureIdsForModule,
  featureIdsForSubModule,
  type ModuleNode,
  type SubModuleNode,
} from "@/data/permission-tree";

export type ActionKey = "view" | "create" | "edit" | "delete";
export type FeaturePermissions = Partial<Record<ActionKey, boolean>>;
export type RoleFeaturePermissionMap = Record<string, FeaturePermissions>;

interface Props {
  permissions: RoleFeaturePermissionMap;
  onChange: (featureId: string, action: string, value: boolean) => void;
  onBulkChange: (featureIds: string[], action: string | "all", value: boolean) => void;
}

type RowState = "all" | "some" | "none";

const ACTION_META: { key: ActionKey; label: string; icon: typeof Eye }[] = [
  { key: "view", label: "View", icon: Eye },
  { key: "create", label: "Create", icon: Plus },
  { key: "edit", label: "Edit", icon: Pencil },
  { key: "delete", label: "Delete", icon: Trash2 },
];

const ACTIONS_GRID_WIDTH = "w-[260px]";

const isActionOn = (featureId: string, action: ActionKey, permissions: RoleFeaturePermissionMap): boolean =>
  !!permissions[featureId]?.[action];

const computeGroupActionState = (
  featureIds: string[],
  action: ActionKey,
  permissions: RoleFeaturePermissionMap,
): RowState => {
  if (featureIds.length === 0) return "none";
  let on = 0;
  for (const fid of featureIds) if (isActionOn(fid, action, permissions)) on++;
  if (on === 0) return "none";
  if (on === featureIds.length) return "all";
  return "some";
};

const TriCheckbox = ({
  state,
  onClick,
  label,
}: {
  state: RowState;
  onClick: () => void;
  label?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={cn(
      "h-5 w-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0",
      state === "all" && "bg-primary border-primary text-primary-foreground",
      state === "some" && "bg-primary/20 border-primary text-primary",
      state === "none" && "bg-background border-input hover:border-primary/60",
    )}
  >
    {state === "all" && <Check className="h-3.5 w-3.5" />}
    {state === "some" && <Minus className="h-3.5 w-3.5" />}
  </button>
);

const ActionsHeader = () => (
  <div className={cn("hidden md:grid grid-cols-4 gap-1", ACTIONS_GRID_WIDTH)}>
    {ACTION_META.map(({ key, label, icon: Icon }) => (
      <div
        key={key}
        className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide"
      >
        <Icon className="h-3 w-3" />
        {label}
      </div>
    ))}
  </div>
);

const FeatureRow = ({
  feature,
  permissions,
  onChange,
}: {
  feature: { id: string; name: string };
  permissions: RoleFeaturePermissionMap;
  onChange: Props["onChange"];
}) => (
  <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-2 pl-16 pr-4 hover:bg-muted/30 rounded-md">
    <div className="flex items-center gap-2 text-sm text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      {feature.name}
    </div>
    <div className={cn("grid grid-cols-4 gap-1", ACTIONS_GRID_WIDTH)}>
      {ACTION_META.map(({ key, label }) => (
        <div key={key} className="flex justify-center">
          <Checkbox
            checked={isActionOn(feature.id, key, permissions)}
            onCheckedChange={(v) => onChange(feature.id, key, !!v)}
            aria-label={`${label} ${feature.name}`}
          />
        </div>
      ))}
    </div>
  </div>
);

const SubModuleSection = ({
  subModule,
  permissions,
  onChange,
  onBulkChange,
  isOpen,
  onToggle,
}: {
  subModule: SubModuleNode;
  permissions: RoleFeaturePermissionMap;
  onChange: Props["onChange"];
  onBulkChange: Props["onBulkChange"];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const featureIds = subModule.features.map(f => f.id);
  return (
    <div className="border-l-2 border-border/60 ml-4">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-2 pl-6 pr-4 hover:bg-muted/40 rounded-md">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-sm font-medium text-foreground/90 text-left"
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform text-muted-foreground", isOpen && "rotate-90")} />
          {subModule.name}
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-1">{subModule.features.length}</Badge>
        </button>
        <div className={cn("grid grid-cols-4 gap-1", ACTIONS_GRID_WIDTH)}>
          {ACTION_META.map(({ key, label }) => {
            const state = computeGroupActionState(featureIds, key, permissions);
            return (
              <div key={key} className="flex justify-center">
                <TriCheckbox
                  state={state}
                  onClick={() => onBulkChange(featureIds, key, state !== "all")}
                  label={`Toggle ${label} for all in ${subModule.name}`}
                />
              </div>
            );
          })}
        </div>
      </div>
      {isOpen && (
        <div className="space-y-0.5 pb-1">
          {subModule.features.map(f => (
            <FeatureRow key={f.id} feature={f} permissions={permissions} onChange={onChange} />
          ))}
        </div>
      )}
    </div>
  );
};

const ModuleSection = ({
  module,
  permissions,
  onChange,
  onBulkChange,
  expanded,
  toggleModule,
  expandedSubs,
  toggleSub,
}: {
  module: ModuleNode;
  permissions: RoleFeaturePermissionMap;
  onChange: Props["onChange"];
  onBulkChange: Props["onBulkChange"];
  expanded: boolean;
  toggleModule: () => void;
  expandedSubs: Set<string>;
  toggleSub: (id: string) => void;
}) => {
  const featureIds = featureIdsForModule(module.id);
  const totalFeatures = featureIds.length;
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 px-4 bg-muted/30 hover:bg-muted/50 border-b">
        <button
          type="button"
          onClick={toggleModule}
          className="flex items-center gap-2 text-sm font-semibold text-foreground text-left"
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform text-muted-foreground", expanded && "rotate-90")} />
          <Shield className="h-4 w-4 text-primary" />
          {module.name}
          <Badge variant="secondary" className="text-[10px] h-5 px-2 ml-1 font-normal">
            {module.subModules.length} sub · {totalFeatures} features
          </Badge>
        </button>
        <div className={cn("grid grid-cols-4 gap-1", ACTIONS_GRID_WIDTH)}>
          {ACTION_META.map(({ key, label }) => {
            const state = computeGroupActionState(featureIds, key, permissions);
            return (
              <div key={key} className="flex justify-center">
                <TriCheckbox
                  state={state}
                  onClick={() => onBulkChange(featureIds, key, state !== "all")}
                  label={`Toggle ${label} for all in ${module.name}`}
                />
              </div>
            );
          })}
        </div>
      </div>
      {expanded && (
        <div className="py-2 space-y-1">
          {module.subModules.map(sm => (
            <SubModuleSection
              key={sm.id}
              subModule={sm}
              permissions={permissions}
              onChange={onChange}
              onBulkChange={onBulkChange}
              isOpen={expandedSubs.has(sm.id)}
              onToggle={() => toggleSub(sm.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PermissionMatrixHierarchical = ({ permissions, onChange, onBulkChange }: Props) => {
  const [search, setSearch] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([permissionTree[0]?.id]));
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());

  const filteredTree = useMemo(() => {
    if (!search.trim()) return permissionTree;
    const q = search.toLowerCase();
    return permissionTree
      .map(m => {
        const subs = m.subModules
          .map(s => {
            const features = s.features.filter(f => f.name.toLowerCase().includes(q));
            const subMatches = s.name.toLowerCase().includes(q);
            if (subMatches) return s;
            if (features.length) return { ...s, features };
            return null;
          })
          .filter(Boolean) as typeof m.subModules;
        const moduleMatches = m.name.toLowerCase().includes(q);
        if (moduleMatches) return m;
        if (subs.length) return { ...m, subModules: subs };
        return null;
      })
      .filter(Boolean) as ModuleNode[];
  }, [search]);

  const effectiveExpandedModules = useMemo(() => {
    if (!search.trim()) return expandedModules;
    return new Set(filteredTree.map(m => m.id));
  }, [search, filteredTree, expandedModules]);

  const effectiveExpandedSubs = useMemo(() => {
    if (!search.trim()) return expandedSubs;
    return new Set(filteredTree.flatMap(m => m.subModules.map(s => s.id)));
  }, [search, filteredTree, expandedSubs]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSub = (id: string) => {
    setExpandedSubs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedModules(new Set(permissionTree.map(m => m.id)));
    setExpandedSubs(new Set(permissionTree.flatMap(m => m.subModules.map(s => s.id))));
  };
  const collapseAll = () => {
    setExpandedModules(new Set());
    setExpandedSubs(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules, sub-modules, or features..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>Expand all</Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>Collapse all</Button>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 pb-2 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div>Module / Sub-module / Feature</div>
        <ActionsHeader />
      </div>

      {/* Tree */}
      <div className="space-y-3">
        {filteredTree.map(m => (
          <ModuleSection
            key={m.id}
            module={m}
            permissions={permissions}
            onChange={onChange}
            onBulkChange={onBulkChange}
            expanded={effectiveExpandedModules.has(m.id)}
            toggleModule={() => toggleModule(m.id)}
            expandedSubs={effectiveExpandedSubs}
            toggleSub={toggleSub}
          />
        ))}
        {filteredTree.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            No modules, sub-modules, or features match "{search}".
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-[4px] bg-primary border border-primary inline-flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </span>
          All features have this action
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-[4px] bg-primary/20 border border-primary inline-flex items-center justify-center">
            <Minus className="h-3 w-3 text-primary" />
          </span>
          Some features have this action
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-[4px] bg-background border border-input inline-flex items-center justify-center" />
          None
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrixHierarchical;

export { featureIdsForModule, featureIdsForSubModule };
