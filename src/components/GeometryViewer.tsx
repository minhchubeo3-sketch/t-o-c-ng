import React from "react";

interface GeometryViewerProps {
  type: "triangle" | "circle" | "graph" | "cube";
  params?: any;
}

export const GeometryViewer: React.FC<GeometryViewerProps> = ({ type, params }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex items-center justify-center my-4">
      {type === "triangle" && (
        <svg width="200" height="150" viewBox="0 0 200 150">
          <path d="M 100 20 L 180 130 L 20 130 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="95" y="15" className="text-xs fill-current">A</text>
          <text x="10" y="140" className="text-xs fill-current">B</text>
          <text x="185" y="140" className="text-xs fill-current">C</text>
        </svg>
      )}
      {type === "circle" && (
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="2" fill="currentColor" />
          <line x1="100" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4" />
          <text x="105" y="95" className="text-xs fill-current">O</text>
          <text x="140" y="95" className="text-xs fill-current">R</text>
        </svg>
      )}
      {type === "graph" && (
        <svg width="200" height="200" viewBox="0 0 200 200">
          <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="1" />
          <path d="M 20 180 Q 100 20 180 180" fill="none" stroke="blue" strokeWidth="2" />
          <text x="190" y="115" className="text-xs fill-current">x</text>
          <text x="110" y="10" className="text-xs fill-current">y</text>
        </svg>
      )}
      {type === "cube" && (
        <svg width="200" height="200" viewBox="0 0 200 200">
          <rect x="40" y="60" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="70" y="30" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
          <line x1="40" y1="60" x2="70" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="140" y1="60" x2="170" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="140" y1="160" x2="170" y2="130" stroke="currentColor" strokeWidth="2" />
          <line x1="40" y1="160" x2="70" y2="130" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      <div className="ml-4 text-sm text-zinc-500 italic">
        Hình minh họa trực quan
      </div>
    </div>
  );
};
