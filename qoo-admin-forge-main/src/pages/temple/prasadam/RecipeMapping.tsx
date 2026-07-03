import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, BookOpen, Calculator, Minus } from "lucide-react";

const recipes = [
  {
    prasadam: "Laddu Prasadam", id: "PRS-001", ingredientCount: 8, batchSize: "1000 pcs",
    ingredients: [
      { name: "Besan (Gram Flour)", qty: "25 kg", unit: "kg", wastage: "5%" },
      { name: "Sugar", qty: "20 kg", unit: "kg", wastage: "2%" },
      { name: "Ghee", qty: "12 kg", unit: "kg", wastage: "3%" },
      { name: "Cashew Nuts", qty: "2 kg", unit: "kg", wastage: "1%" },
      { name: "Raisins", qty: "1.5 kg", unit: "kg", wastage: "1%" },
      { name: "Cardamom Powder", qty: "0.5 kg", unit: "kg", wastage: "2%" },
      { name: "Edible Camphor", qty: "0.05 kg", unit: "kg", wastage: "5%" },
      { name: "Saffron", qty: "0.01 kg", unit: "kg", wastage: "0%" },
    ],
  },
  {
    prasadam: "Pulihora", id: "PRS-002", ingredientCount: 10, batchSize: "1000 packets",
    ingredients: [
      { name: "Rice", qty: "50 kg", unit: "kg", wastage: "3%" },
      { name: "Tamarind Paste", qty: "5 kg", unit: "kg", wastage: "2%" },
      { name: "Groundnut Oil", qty: "4 kg", unit: "kg", wastage: "3%" },
      { name: "Peanuts", qty: "3 kg", unit: "kg", wastage: "2%" },
    ],
  },
  {
    prasadam: "Sweet Pongal", id: "PRS-003", ingredientCount: 7, batchSize: "1000 packets",
    ingredients: [
      { name: "Rice", qty: "30 kg", unit: "kg", wastage: "3%" },
      { name: "Moong Dal", qty: "15 kg", unit: "kg", wastage: "2%" },
      { name: "Jaggery", qty: "20 kg", unit: "kg", wastage: "3%" },
      { name: "Ghee", qty: "8 kg", unit: "kg", wastage: "3%" },
    ],
  },
];

const RecipeMapping = () => {
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [showCalc, setShowCalc] = useState(false);
  const [calcQty, setCalcQty] = useState("5000");
  const [showAdd, setShowAdd] = useState(false);
  const [newIngredients, setNewIngredients] = useState([{ name: "", qty: "", unit: "kg", wastage: "" }]);

  const filtered = recipes.filter(r => r.prasadam.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recipe & Ingredient Mapping</h2>
          <p className="text-sm text-muted-foreground mt-1">Define ingredient requirements per prasadam type</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCalc(true)}>
            <Calculator className="h-4 w-4 mr-1" /> Ingredient Calculator
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Recipe
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-4">
        {filtered.map(recipe => (
          <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecipe(recipe)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {recipe.prasadam}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{recipe.batchSize}</Badge>
                  <Badge variant="secondary" className="text-xs">{recipe.ingredientCount} ingredients</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead className="text-right">Qty per {recipe.batchSize}</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Wastage %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.ingredients.map(ing => (
                    <TableRow key={ing.name}>
                      <TableCell className="font-medium">{ing.name}</TableCell>
                      <TableCell className="text-right">{ing.qty}</TableCell>
                      <TableCell>{ing.unit}</TableCell>
                      <TableCell className="text-right">{ing.wastage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ingredient Calculator */}
      <Dialog open={showCalc} onOpenChange={setShowCalc}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Ingredient Calculator</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prasadam Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select prasadam" /></SelectTrigger>
                  <SelectContent>
                    {recipes.map(r => <SelectItem key={r.id} value={r.id}>{r.prasadam}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Production Quantity</Label>
                <Input type="number" value={calcQty} onChange={e => setCalcQty(e.target.value)} />
              </div>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">Estimated Ingredients for {Number(calcQty).toLocaleString()} units:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Besan (Gram Flour)</span><span className="font-mono">125 kg</span></div>
                  <div className="flex justify-between"><span>Sugar</span><span className="font-mono">100 kg</span></div>
                  <div className="flex justify-between"><span>Ghee</span><span className="font-mono">60 kg</span></div>
                  <div className="flex justify-between"><span>Cashew Nuts</span><span className="font-mono">10 kg</span></div>
                  <div className="flex justify-between"><span>Raisins</span><span className="font-mono">7.5 kg</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalc(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Recipe Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Recipe Mapping</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prasadam Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{recipes.map(r => <SelectItem key={r.id} value={r.id}>{r.prasadam}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Batch Size</Label><Input placeholder="e.g. 1000 pcs" /></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Ingredients</Label>
                <Button variant="ghost" size="sm" onClick={() => setNewIngredients([...newIngredients, { name: "", qty: "", unit: "kg", wastage: "" }])}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {newIngredients.map((ing, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                  <Input placeholder="Ingredient" className="col-span-2" />
                  <Input placeholder="Qty" />
                  <Input placeholder="Wastage %" />
                  <Button variant="ghost" size="icon" onClick={() => setNewIngredients(newIngredients.filter((_, j) => j !== i))}>
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => setShowAdd(false)}>Save Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeMapping;
