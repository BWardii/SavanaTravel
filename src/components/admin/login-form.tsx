"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginData) {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error("Authentication failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-white/60 text-xs tracking-wide">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="admin@savanatravel.com"
            className="pl-9 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/30 focus:ring-white/5"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400/80">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-white/60 text-xs tracking-wide"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className="pl-9 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-white/30 focus:ring-white/5"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400/80">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-white hover:bg-white/90 text-[#1C1917] text-white font-medium mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
