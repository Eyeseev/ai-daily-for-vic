"use client";

import { useState, useEffect } from "react";

interface FaviconProps {
  domain: string;
  className?: string;
  size?: number;
}

export function Favicon({ domain, className = "", size = 16 }: FaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!domain) return;

    // Try to get favicon from the domain
    const getFavicon = async () => {
      try {
        // First try the standard favicon path
        const standardUrl = `https://${domain}/favicon.ico`;
        const response = await fetch(standardUrl, { method: 'HEAD' });
        
        if (response.ok) {
          setFaviconUrl(standardUrl);
          return;
        }

        // If that fails, try Google's favicon service
        const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
        setFaviconUrl(googleUrl);
      } catch (err) {
        // If all else fails, use Google's service as fallback
        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
        setFaviconUrl(fallbackUrl);
      }
    };

    getFavicon();
  }, [domain, size]);

  if (error || !faviconUrl) {
    // Fallback: show a generic icon
    return (
      <div 
        className={`bg-neutral-600 rounded-sm flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="text-neutral-400"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt={`${domain} favicon`}
      className={`w-4 h-4 rounded-sm object-contain filter dark:brightness-75 dark:contrast-125 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
}
