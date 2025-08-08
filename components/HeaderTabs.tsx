"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderTabs({ activeView }: { activeView: string }) {
  const pathname = usePathname();
  const makeHref = (view: "headlines" | "summary") =>
    `${pathname}?view=${view}`;

  const tab = (label: string, view: "headlines" | "summary") => (
    <Link
      href={makeHref(view)}
      className={[
        "rounded-full px-3 py-1 text-sm border",
        activeView === view ? "bg-neutral-800 border-neutral-700" : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
      ].join(" ")}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex gap-2 mb-6">
      {tab("Headlines", "headlines")}
      {tab("Summaries", "summary")}
    </div>
  );
}
