import Link from "next/link";
import type { NewsItem, NewsBundle } from "@/lib/types";
import { TimeDisplay } from "@/components/TimeDisplay";
import { Favicon } from "@/components/Favicon";
import { extractDomain } from "@/lib/utils";

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

// Helper function to format summary text with bold first sentence and limited preview
function formatSummary(text: string, maxSentences: number = 2) {
  if (!text || typeof text !== 'string') return { preview: "No summary available.", hasMore: false };
  
  // Split into sentences (rough approximation)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= maxSentences) {
    return { preview: text, hasMore: false };
  }
  
  // Take first 2-3 sentences for preview
  const previewSentences = sentences.slice(0, maxSentences);
  const preview = previewSentences.join('. ') + '.';
  
  return { preview, hasMore: true };
}

// Helper function to make first sentence bold
function firstSentenceBold(text: string) {
  // Split by sentence enders
  const match = text.match(/([^.!?]+[.!?])\s*(.*)/);
  if (!match) return { first: text, rest: "" };
  return { first: match[1], rest: match[2] ?? "" };
}

// Helper function to extract key points from summary (simple implementation)
function extractKeyPoints(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  
  // Simple key point extraction - look for patterns like "key:", "important:", numbers, etc.
  const keyPoints: string[] = [];
  
  // Look for sentences with numbers or key phrases
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Look for patterns that might indicate key points
    if (
      /\d+/.test(trimmed) || // Contains numbers
      /(key|important|major|significant|notable)/i.test(trimmed) || // Contains key words
      trimmed.length > 50 && trimmed.length < 150 // Medium length sentences
    ) {
      if (keyPoints.length < 3) { // Limit to 3 key points
        keyPoints.push(trimmed);
      }
    }
  });
  
  return keyPoints.slice(0, 3); // Return max 3 key points
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
    const publishedAt = item.publishedAt || '';
    const domain = extractDomain(link);
    
    // Defensive: fallback chain for summary content
    let text = "No summary available.";
    if (item.summary && typeof item.summary === 'string' && item.summary.trim()) {
      text = item.summary.trim();
    } else if (item.description && typeof item.description === 'string' && item.description.trim()) {
      text = item.description.trim();
    }

    // Format summary for scannable display
    const { preview, hasMore } = formatSummary(text, 2);
    const { first, rest } = firstSentenceBold(preview);
    const keyPoints = extractKeyPoints(text);

    return (
      <article className="p-4 hover:bg-neutral-900/40 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-neutral-100 font-medium leading-snug flex-1">
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              {title}
            </a>
          </h3>
          {publishedAt && (
            <TimeDisplay iso={publishedAt} />
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <Favicon domain={domain} className="flex-shrink-0" />
          <p className="text-xs text-neutral-400">{source}</p>
        </div>
        
        <div className="mt-3 space-y-2">
          {/* First sentence in bold */}
          {first && (
            <p className="text-neutral-200 leading-relaxed">
              <strong className="font-semibold text-neutral-100">{first}</strong>
              {rest && <span className="text-neutral-300"> {rest}</span>}
            </p>
          )}
          
          {/* Key points list */}
          {keyPoints.length > 0 && (
            <ul className="mt-2 space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-neutral-300 flex items-start gap-2">
                  <span className="text-neutral-500 text-xs mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Read more link */}
          {hasMore && (
            <div className="mt-2">
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline inline-flex items-center gap-1"
              >
                Read more →
              </a>
            </div>
          )}
        </div>
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
