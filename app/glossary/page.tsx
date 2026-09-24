const terms = [
  { term: "CVE", definition: "A public ID number for a specific, known security vulnerability." },
  { term: "Zero-day", definition: "A vulnerability being exploited before the vendor has a fix for it." },
  { term: "Phishing", definition: "Tricking someone into handing over information or access by pretending to be trustworthy." },
  { term: "Firewall", definition: "A gatekeeper that decides which network traffic is allowed in or out." },
];

export default function Glossary() {
  return (
    <div>
      <h1 className="text-3xl mb-8">Glossary</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Plain-language definitions for terms you'll run into across CyberNotes.
      </p>
      {terms.map((t) => (
        <div key={t.term} className="border-t border-line py-5 first:border-t-0">
          <h2 className="font-mono text-lg mb-1">{t.term}</h2>
          <p className="text-ink-soft">{t.definition}</p>
        </div>
      ))}
    </div>
  );
}
