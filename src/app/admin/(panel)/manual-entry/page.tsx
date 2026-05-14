import { ManualEntryForm } from "@/components/admin/manual-entry-form";

export const metadata = { title: "Manual Entry — Savana Admin" };

export default function ManualEntryPage() {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manual Entry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter a new booking on behalf of a walk-in or in-person customer. All fields will be stored in the database and reflected across Enquiries and Contacts.
          </p>
        </div>

        <ManualEntryForm />
      </div>
    </div>
  );
}
