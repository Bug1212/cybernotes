import CvesAdminClient from "../cves/CvesAdminClient";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "CVEs / CWE — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function CvesAdminPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">CVE / CWE Database</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Manage vulnerability entries shown at <code>/cves</code>. Each entry can carry a CWE
          classification (e.g. <code>CWE-79</code>) alongside its CVE ID.
        </p>
        <CvesAdminClient />
      </div>
    </main>
  );
}