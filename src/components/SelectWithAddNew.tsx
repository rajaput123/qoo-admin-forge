import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SelectWithAddNewProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: string[];
  onAddNew: (value: string) => void;
  className?: string;
}

const SelectWithAddNew = ({ value, onValueChange, placeholder, options, onAddNew, className }: SelectWithAddNewProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newValue.trim()) {
      onAddNew(newValue.trim());
      onValueChange(newValue.trim());
      setNewValue("");
      setShowAdd(false);
    }
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        {!showAdd ? (
          <div className="px-2 py-1.5">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={(e) => { e.stopPropagation(); setShowAdd(true); }}>+ Add New</Button>
          </div>
        ) : (
          <div className="px-2 py-1.5 flex gap-1" onClick={e => e.stopPropagation()}>
            <Input className="h-7 text-xs" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="New item" onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); handleAdd(e as any); } }} />
            <Button size="sm" className="h-7 text-xs px-2" onClick={handleAdd}>Add</Button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectWithAddNew;