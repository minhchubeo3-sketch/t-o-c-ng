import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  content: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, block = false }) => {
  // Simple parser to find $...$ for inline math and $$...$$ for block math
  // However, for this app, we'll often pass raw LaTeX to specific components.
  
  if (block) {
    return <BlockMath math={content} />;
  }
  return <InlineMath math={content} />;
};

export const RichTextRenderer: React.FC<{ text: string }> = ({ text }) => {
  // Basic parser to render text with inline math $...$
  const parts = text.split(/(\$.*?\$)/g);
  
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <InlineMath key={i} math={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};
