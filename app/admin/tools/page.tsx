import AdminNav from "../../../components/admin/AdminNav";
import ToolsClient from "../tools/ToolsAdminClient";

export const metadata = {
  title: "Tools — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function ToolsAdminPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">Tools Directory</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Reconnaissance, pentesting, forensics, SOC — every category from the original spec.
          Anything saved here is live on <code className="font-mono text-xs">/tools</code> immediately,
          no review queue (unlike AI-generated articles, these are hand-entered by you).
        </p>
        <ToolsClient />
      </div>
    </main>
  );
}