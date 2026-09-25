import ToolsAdminClient from "../tools/ToolsAdminClient";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Tools — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function ToolsAdminPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">Penetration Testing Tools</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Manage the tools directory shown at <code>/tools</code>. Add, edit, or remove entries.
        </p>
        <ToolsAdminClient />
      </div>
    </main>
  );
}