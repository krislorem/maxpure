import { useState, useEffect } from "react";

export type Anchor = {
  value: string;
  suffix: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

export const useAnchor = (markdown: string): Anchor[] => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  useEffect(() => {
    if (!markdown) {
      setAnchors([]);
      return;
    }

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(markdown.matchAll(headingRegex));
    const countMap: Record<string, number> = {};

    const parsedAnchors = matches.map((match) => {
      const level = match[1].length as Anchor["level"];
      const rawValue = match[2].trim();

      const cleanValue = rawValue.replace(/(\*{1,2}|_{1,2})(.*?)\1/g, "$2");

      const currentCount = countMap[cleanValue] || 0;
      countMap[cleanValue] = currentCount + 1;

      let finalValue = cleanValue;
      if (currentCount > 0) {
        const suffix = "-".repeat(currentCount);
        finalValue = `${cleanValue}${suffix}`;
      }

      return { value: cleanValue, suffix: finalValue, level };
    });

    setAnchors(parsedAnchors);
  }, [markdown]);

  return anchors;
};
