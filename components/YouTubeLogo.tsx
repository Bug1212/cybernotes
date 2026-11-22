"use client";

import { useState } from "react";

// Shows the OFFICIAL YouTube logo if you've added it at /public/youtube/youtube-logo.png
// (download from YouTube's brand resources — do not redraw or recolour it). Until then it falls back
// to the plain word "YouTube" so nothing breaks.
export default function YouTubeLogo({ className = "h-6" }: { className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <span className="font-semibold">YouTube</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/youtube/youtube-logo.png" alt="YouTube" className={`inline-block w-auto ${className}`} onError={() => setOk(false)} />;
}