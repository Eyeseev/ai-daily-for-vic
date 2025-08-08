"use client";

import { useEffect, useState } from "react";
import { fromNow } from "@/lib/time";

interface TimeDisplayProps {
  iso: string;
  className?: string;
}

export function TimeDisplay({ iso, className = "text-xs text-neutral-500 whitespace-nowrap" }: TimeDisplayProps) {
  const [timeAgo, setTimeAgo] = useState(fromNow(iso));

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setTimeAgo(fromNow(iso));
    }, 60000);

    return () => clearInterval(interval);
  }, [iso]);

  return <span className={className}>{timeAgo}</span>;
}
