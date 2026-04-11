import React from "react";

export const chapterMarkdownComponents = {
  h2: ({ children }) => (
    <h2 className="mb-3 text-lg font-bold md:text-xl">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold md:text-lg">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-6 md:text-base">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-6 md:text-base">
      {children}
    </ul>
  ),
  code: ({ children }) => (
    <code className="rounded bg-orange-100 px-1.5 py-0.5 font-mono text-xs text-orange-950 md:text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-lg border border-orange-100 bg-orange-50 p-3">
      {children}
    </pre>
  ),
};
