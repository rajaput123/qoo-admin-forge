import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export interface CustomField {
  name: string;
  value: string;
  type: "text" | "number" | "date" | "dropdown" | "file";
  options?: string[];
}

interface CustomFieldsSectionProps {
  fields: CustomField[];
  onFieldsChange: (fields: CustomField[]) => void;
  editable?: boolean;
}

const CustomFieldsSection = ({ fields, onFieldsChange, editable = true }: CustomFieldsSectionProps) => {
  const [localFields, setLocalFields] = useState<CustomField[]>(fields);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<CustomField["type"]>("text");

  const handleAddField = () => {
    if (!newFieldName) {
      toast.error("Field name is required");
      return;
    }

    const newField: CustomField = {
      name: newFieldName,
      value: "",
      type: newFieldType,
    };

    const updated = [...localFields, newField];
    setLocalFields(updated);
    onFieldsChange(updated);
    setNewFieldName("");
    setNewFieldType("text");
    setShowAddField(false);
    toast.success("Custom field added");
  };

  const handleRemoveField = (index: number) => {
    const updated = localFields.filter((_, i) => i !== index);
    setLocalFields(updated);
    onFieldsChange(updated);
    toast.success("Custom field removed");
  };

  const handleFieldValueChange = (index: number, value: string) => {
    const updated = [...localFields];
    updated[index].value = value;
    setLocalFields(updated);
    onFieldsChange(updated);
  };

  return (
    <div className="space-y-4">
      {localFields.length === 0 && !showAddField && (
        <div className="text-center text-muted-foreground py-4 text-sm">No custom fields added yet</div>
      )}

      {localFields.map((field, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1 space-y-1.5">
            <Label className="text-sm font-medium">{field.name}</Label>
            {field.type === "text" && (
              <Input
                value={field.value}
                onChange={(e) => handleFieldValueChange(index, e.target.value)}
                placeholder={`Enter ${field.name.toLowerCase()}`}
                readOnly={!editable}
              />
            )}
            {field.type === "number" && (
              <Input
                type="number"
                value={field.value}
                onChange={(e) => handleFieldValueChange(index, e.target.value)}
                placeholder="0"
                readOnly={!editable}
              />
            )}
            {field.type === "date" && (
              <Input
                type="date"
                value={field.value}
                onChange={(e) => handleFieldValueChange(index, e.target.value)}
                readOnly={!editable}
              />
            )}
            {field.type === "file" && (
              <div className="text-sm text-muted-foreground">{field.value || "No file uploaded"}</div>
            )}
          </div>
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveField(index)}
              className="mt-6 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {editable && (
        <>
          {showAddField && (
            <Card className="p-4 border-2 border-dashed">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Field Name</Label>
                  <Input
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g., CSR Grant Reference"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm">Field Type</Label>
                  <Select value={newFieldType} onValueChange={(v: any) => setNewFieldType(v)}>
                    <SelectTrigger className="mt-1.5 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddField} size="sm" className="flex-1">Add Field</Button>
                  <Button onClick={() => setShowAddField(false)} variant="outline" size="sm" className="flex-1">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {!showAddField && (
            <Button
              variant="outline"
              onClick={() => setShowAddField(true)}
              className="w-full gap-2 border-dashed"
            >
              <Plus className="h-4 w-4" />Add Custom Field
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CustomFieldsSection;
