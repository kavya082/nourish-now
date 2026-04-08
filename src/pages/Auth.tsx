import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

type AuthMode = "signin" | "signup";
type RoleChoice = "donor" | "buyer";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState<RoleChoice>("buyer");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: roleChoice },
        },
      });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      toast({ title: "Account created! Welcome to ResQfood 🌱" });
      navigate("/");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Welcome back! 🎉" });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">
            {mode === "signin" ? "Welcome back" : "Join ResQfood"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to continue reducing food waste"
              : "Create an account to start saving meals"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoleChoice("buyer")}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      roleChoice === "buyer"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    🛒 Buy Food
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleChoice("donor")}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      roleChoice === "donor"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    🍲 Donate Food
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
