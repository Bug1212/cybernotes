import Link from "next/link";
import YouTubeLogo from "./YouTubeLogo";
import { youtubeConfig, YOUTUBE_TOS_URL, GOOGLE_PRIVACY_URL } from "@/lib/siteConfig";

// Homepage section: YouTube branding, a link to the channel, optional embedded videos, and the
// links YouTube's developer policies expect to be easy to find (our Privacy Policy, Google's
// Privacy Policy, YouTube's Terms of Service).
export default function YouTubeSection() {
  const { channelName, channelUrl, videoIds, apiClientName } = youtubeConfig;
  return (
    <section id="youtube" className="cn-sec border border-line bg-paper-dark rounded p-6 sm:p-8 my-10">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <YouTubeLogo />
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">Official channel</span>
      </div>
      <h2 className="text-2xl mb-2">Watch {channelName} on YouTube</h2>
      <p className="text-ink-soft max-w-xl mb-5">
        Short, daily cybersecurity lessons from the CyberNotes team. Our videos are uploaded to our own
        YouTube channel using YouTube API Services.
      </p>

      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded px-5 py-3 text-sm font-semibold text-white"
        style={{ background: "#FF0000" }}
      >
        ▶ Watch on YouTube
      </a>

      {videoIds.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {videoIds.map((id) => (
            <div key={id} className="aspect-video w-full overflow-hidden rounded bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video player"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 border-t border-line pt-4 text-xs text-ink-soft leading-relaxed">
        {apiClientName} uses YouTube API Services. By using features that connect to YouTube you agree to be
        bound by the{" "}
        <a href={YOUTUBE_TOS_URL} target="_blank" rel="noopener noreferrer" className="underline">YouTube Terms of Service</a>.
        Read our <Link href="/privacy-policy#youtube-api-services" className="underline">Privacy Policy</Link>{" "}
        and the{" "}
        <a href={GOOGLE_PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="underline">Google Privacy Policy</a>.
        YouTube is a trademark of Google LLC.
      </p>
    </section>
  );
}