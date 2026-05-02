import { LoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export const metadata = {
  title: "Manager Login — Savana Travel",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1C1917] flex flex-col">
      <header className="px-8 py-6 border-b border-white/10">
        <Link href="/" className="font-serif text-lg tracking-wide text-white/70 hover:text-white transition-colors">
          Savana
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B7E] mb-4">Manager Portal</p>
            <h1 className="font-serif font-light text-3xl text-white leading-tight">
              Sign in to your<br />dashboard.
            </h1>
          </div>

          <div className="border border-white/10 p-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
