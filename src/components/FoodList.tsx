import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import type { FoodItem } from "@/pages/Index";

interface FoodListProps {
  foods: FoodItem[];
  onPurchase: (id: string) => void;
  canPurchase: boolean;
}

const sourceEmoji: Record<string, string> = {
  hotel: "🏨",
  event: "🎪",
  function: "🎊",
  party: "🎉",
};

export const FoodList = ({ foods, onPurchase, canPurchase }: FoodListProps) => {
  const available = foods.filter((f) => !f.purchased);

  if (available.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">🍽️</p>
        <p className="font-medium">No food items available right now</p>
        <p className="text-sm">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {available.map((item) => (
        <Card key={item.id} className="animate-slide-up overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-heading font-semibold text-lg text-foreground">{item.food}</h3>
              <Badge variant="secondary" className="shrink-0 ml-2">
                {sourceEmoji[item.source]} {item.source}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Expires in {item.expiresIn}h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{item.nearbyNgo}</span>
              </div>
              <p>Qty: {item.quantity}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-lg text-primary">
                {item.price > 0 ? `₹${item.price}` : "Free"}
              </span>
              {canPurchase && (
                <Button size="sm" onClick={() => onPurchase(item.id)}>
                  Get This
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
