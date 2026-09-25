// import ReviewClient from "./ReviewClient";
// import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Review Queue — CyberNotes Admin",
//   robots: { index: false, follow: false },
// };

// export default function ReviewPage() {
//   return (
//     <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
//       <div className="mx-auto max-w-3xl">
//         <h1 className="font-serif text-3xl text-ink">Review Queue</h1>
//         <p className="mt-2 text-sm text-ink-soft">
//           AI-generated drafts waiting for a human before they publish. Nothing here goes live
//           without an explicit Approve + Publish.
//         </p>
//         <ReviewClient />
//       </div>
//     </main>
//   );
// }
import ReviewClient from "./ReviewClient";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Review Queue — CyberNotes Admin",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <AdminNav />
        <h1 className="font-serif text-3xl text-ink">Review Queue</h1>
        <p className="mt-2 text-sm text-ink-soft">
          AI-generated drafts waiting for a human before they publish. Nothing here goes live
          without an explicit Approve + Publish.
        </p>
        <ReviewClient />
      </div>
    </main>
  );
}