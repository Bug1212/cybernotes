import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// One markdown renderer for every article / tool / CVE body.
// remark-gfm adds tables, task lists and strikethrough (plain react-markdown
// silently prints tables as raw pipes). Tables are wrapped so wide ones scroll
// sideways on phones instead of breaking the page layout.
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node: _node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table {...props} />
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
