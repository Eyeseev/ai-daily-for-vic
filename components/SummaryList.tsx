import Link from "next/link";
import type { NewsItem, NewsBundle } from "@/lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">{title}</h2>
      <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden">
        {children}
      </div>
    </section>
  );
}

export default function SummaryList({ items }: { items: NewsBundle }) {
  // Defensive: ensure items exist and have the expected structure
  const morning = items?.am || [];
  const evening = items?.pm || [];

  const Row = ({ item }: { item: NewsItem }) => {
    // Defensive: handle missing or malformed item data
    if (!item || typeof item !== 'object') {
      return (
        <article className="p-4 hover:bg-neutral-900/40 transition-colors">
          <p className="text-neutral-400 text-sm">Invalid article data</p>
        </article>
      );
    }

    // Defensive: ensure we have at least a title and link
    const title = item.title || 'Untitled Article';
    const link = item.link || '#';
    const source = item.source || 'Unknown Source';
    
    // Defensive: fallback chain for summary content
    let text = "No summary available.";
    if (item.summary && typeof item.summary === 'string' && item.summary.trim()) {
      text = item.summary.trim();
    } else if (item.description && typeof item.description === 'string' && item.description.trim()) {
      text = item.description.trim();
    }

    return (
      <article className="p-4 hover:bg-neutral-900/40 transition-colors">
        <h3 className="text-neutral-100 font-medium leading-snug">
          <Link href={link} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-neutral-400">{source}</p>
        <p className="mt-3 text-neutral-200 leading-relaxed line-clamp-4">{text}</p>
      </article>
    );
  };

  const renderGroup = (group: NewsItem[]) => {
    // Defensive: ensure group is an array
    if (!Array.isArray(group) || group.length === 0) {
      return <div className="p-4 text-neutral-400">No summaries found.</div>;
    }

    return group.map((item, index) => (
      <Row key={`${item?.source || 'unknown'}-${item?.link || index}`} item={item} />
    ));
  };

  return (
    <>
      <Section title="Morning Edition (7:30 AM ET)">
        {renderGroup(morning)}
      </Section>
      <Section title="Evening Edition (7:30 PM ET)">
        {renderGroup(evening)}
      </Section>
    </>
  );
}
