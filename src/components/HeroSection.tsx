import { Leaf } from "lucide-react";

interface HeroSectionProps {
  availableCount: number;
}

export const HeroSection = ({ availableCount }: HeroSectionProps) => (
  <section className="relative overflow-hidden bg-primary py-16 px-4 text-primary-foreground">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 text-6xl">🍎</div>
      <div className="absolute top-20 right-20 text-5xl">🥦</div>
      <div className="absolute bottom-10 left-1/3 text-4xl">🍞</div>
    </div>
    <div className="relative max-w-3xl mx-auto text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium mb-6">
        <Leaf className="h-4 w-4" />
        <span>{availableCount} items available now</span>
      </div>
      <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
        Rescue Food, Feed Communities
      </h1>
      <p className="text-lg opacity-90 max-w-xl mx-auto">
        Connect surplus food from hotels, events, and parties with people who need it most — at minimal cost.
      </p>
    </div>
  </section>
);
