import type { Metadata } from "next";
// @ts-ignore: Next.js provides CSS side-effect import handling.
import './globals.css';
// @ts-ignore: Next.js provides CSS side-effect import handling.
import './theme.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CyberNotes — Cybersecurity, Plainly Explained",
  description:
    "Complex cybersecurity topics, taught simply. Learning paths, articles, OSINT, web security, and more.",
};

// Runs before first paint: re-applies the visitor's saved Classic/Colorful choice.
const themeInit = `try{if(localStorage.getItem('cybernotes-theme')==='colorful'){document.documentElement.setAttribute('data-theme','colorful')}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the script below may set data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap"
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