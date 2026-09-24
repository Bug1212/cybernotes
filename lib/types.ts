export type Clearance = "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
export type ArticleStatus = "draft" | "in_review" | "approved" | "published" | "rejected";

export interface Topic {
  slug: string;
  title: string;
  description: string;
  clearance: Clearance;
  sortOrder: number;
}

export interface Article {
  id: string;
  caseNumber: string | null;
  slug: string;
  title: string;
  topicSlug: string;
  clearance: Clearance;
  summary: string;
  body: string; // markdown
  status: ArticleStatus;
  isAiGenerated: boolean;
  primarySources: { title: string; url: string }[];
  publishedAt: string | null;
}

export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  supportedOs: string[];
  installation: string | null; // markdown
  basicUsage: string | null; // markdown
  commonCommands: string | null; // markdown
  officialDocsUrl: string | null;
  learningResources: { title: string; url: string }[];
  defensiveNotes: string | null;
}

export interface CVE {
  cveId: string; // e.g. CVE-2024-12345
  slug: string; // e.g. cve-2024-12345
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
  cvssScore: number | null;
  affectedSoftware: string | null;
  affectedVersions: string | null;
  vulnerabilityType: string | null;
  cwe: string | null;
  publishedDate: string | null;
  updatedDate: string | null;
  technicalExplanation: string | null; // markdown
  attackScenario: string | null; // markdown, defender-oriented
  detectionMethods: string | null; // markdown
  mitigation: string | null; // markdown
  patchedVersion: string | null;
  references: { title: string; url: string }[]; // maps to DB column source_references
  relatedCves: string[];
}
