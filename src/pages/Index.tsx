import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, LogOut, LogIn } from "lucide-react";
import { AddFoodForm } from "@/components/AddFoodForm";
import { FoodList } from "@/components/FoodList";
import { HeroSection } from "@/components/HeroSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type SourceType = "hotel" | "event" | "function" | "party";

export interface FoodItem {
  id: string;
  food: string;
  source: SourceType;
  quantity: string;
  expiresIn: number;
  nearbyNgo: string;
  price: number;
  purchased: boolean;
  addedAt: Date;
}

const Index = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, role, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ResQfood] Error fetching foods:", error);
      toast({ title: "Error loading food items", variant: "destructive" });
      return;
    }

    const mapped: FoodItem[] = (data || []).map((d) => ({
      id: d.id,
      food: d.food,
      source: d.source as SourceType,
      quantity: d.quantity,
      expiresIn: d.expires_in,
      nearbyNgo: d.nearby_ngo,
      price: d.price,
      purchased: d.purchased,
      addedAt: new Date(d.created_at),
    }));
    setFoods(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchFoods();

    const channel = supabase
      .channel("food_items_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "food_items" }, () => {
        fetchFoods();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addFood = async (item: Omit<FoodItem, "id" | "purchased" | "addedAt">) => {
    const { error } = await supabase.from("food_items").insert({
      food: item.food,
      source: item.source,
      quantity: item.quantity,
      expires_in: item.expiresIn,
      nearby_ngo: item.nearbyNgo,
      price: item.price,
    });

    if (error) {
      console.error("[ResQfood] Error adding food:", error);
      toast({ title: "Error adding food item", variant: "destructive" });
      return;
    }

    toast({ title: "Food item added successfully! 🎉" });
  };

  const purchaseFood = async (id: string) => {
    const { error } = await supabase
      .from("food_items")
      .update({ purchased: true })
      .eq("id", id);

    if (error) {
      console.error("[ResQfood] Error purchasing:", error);
      toast({ title: "Error purchasing item", variant: "destructive" });
      return;
    }

    toast({ title: "Item purchased successfully! 🙏" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground">ResQfood</span>
          </div>
          <div className="flex items-center gap-3">
            {user && role && (
              <Badge variant="secondary" className="capitalize">
                {role}
              </Badge>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="gap-1.5">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <HeroSection availableCount={foods.filter((f) => !f.purchased).length} />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {!user && (
          <div className="rounded-xl border bg-card p-6 text-center animate-fade-in">
            <p className="text-muted-foreground mb-3">Sign in to add or purchase food items</p>
            <Button onClick={() => navigate("/auth")}>Sign In / Sign Up</Button>
          </div>
        )}

        {user && role === "donor" && <AddFoodForm onAdd={addFood} />}

        <FoodList foods={foods} onPurchase={purchaseFood} canPurchase={!!user && role === "buyer"} />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>ResQfood — Reducing food waste, one meal at a time 🌱</p>
      </footer>
    </div>
  );
};

export default Index;
