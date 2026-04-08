import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SourceType } from "@/pages/Index";

interface AddFoodFormProps {
  onAdd: (item: {
    food: string;
    source: SourceType;
    quantity: string;
    expiresIn: number;
    nearbyNgo: string;
    price: number;
  }) => void;
}

export const AddFoodForm = ({ onAdd }: AddFoodFormProps) => {
  const [food, setFood] = useState("");
  const [source, setSource] = useState<SourceType>("hotel");
  const [quantity, setQuantity] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [nearbyNgo, setNearbyNgo] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      food,
      source,
      quantity,
      expiresIn: parseInt(expiresIn),
      nearbyNgo,
      price: parseFloat(price) || 0,
    });
    setFood("");
    setQuantity("");
    setExpiresIn("");
    setNearbyNgo("");
    setPrice("");
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-heading text-xl">🍲 Add Surplus Food</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="food">Food Item</Label>
            <Input id="food" value={food} onChange={(e) => setFood(e.target.value)} placeholder="e.g. Rice & Curry" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v as SourceType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="function">Function</SelectItem>
                <SelectItem value="party">Party</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 50 plates" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires">Expires In (hours)</Label>
            <Input id="expires" type="number" value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)} placeholder="e.g. 4" required min={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ngo">Nearby NGO</Label>
            <Input id="ngo" value={nearbyNgo} onChange={(e) => setNearbyNgo(e.target.value)} placeholder="e.g. Food Bank India" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" min={0} step="0.01" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">Add Food Item</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
