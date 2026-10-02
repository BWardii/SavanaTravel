import { notFound } from "next/navigation";
import { isSeason } from "@/lib/season";
import { ManualEntryForm } from "@/components/admin/manual-entry-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  return { title: `Manual Entry ${season} — Savana Admin` };
}

export default async function ManualEntryPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: raw } = await params;
  if (!isSeason(raw)) notFound();

  return (
    <div className="flex-1 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manual Entry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter a new booking on behalf of a walk-in or in-person customer. This record is saved to the{" "}
            <span className="font-semibold">{raw}</span> season only.
          </p>
        </div>
        <ManualEntryForm />
      </div>
    </div>
  );
}
