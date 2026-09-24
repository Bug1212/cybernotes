import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CyberNotes — Cybersecurity, Plainly Explained",
  description:
    "Complex cybersecurity topics, taught simply. Learning paths, articles, OSINT, web security, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
