import AdminNav from "../../../components/admin/AdminNav";
import TopicsClient from "../topics/TopicsClient";

export const metadata = {
  title: "Topics — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function TopicsAdminPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">Topics</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Topic hubs group articles and appear on the home page and site nav. Deleting a topic
          doesn't delete its articles — they just lose their topic link.
        </p>
        <TopicsClient />
      </div>
    </main>
  );
}