import AdminNav from "@/components/admin/AdminNav";
import CvesClient from "../cves/CvesAdminClient";

export const metadata = {
  title: "CVEs — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function CvesAdminPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">CVE Database</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Saves go live on <code className="font-mono text-xs">/cves</code> immediately — no
          review queue, same as Tools.
        </p>
        <CvesClient />
      </div>
    </main>
  );
}