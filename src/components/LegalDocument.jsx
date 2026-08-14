/**
 * Renders pandoc-converted legal HTML (headings, ordered/unordered lists,
 * tables, bold) using the app's existing design tokens. No typography
 * plugin dependency — styling is applied via Tailwind arbitrary
 * descendant selectors.
 *
 * The HTML source is trusted: it's generated locally from our own
 * .docx files (see src/data/legal/), never from user input.
 */
export default function LegalDocument({ html }) {
  return (
    <div
      className="text-body-md text-on-surface-variant
        [&_p]:mb-3 [&_p]:leading-relaxed
        [&_strong]:text-on-surface [&_strong]:font-semibold
        [&_h1]:text-headline-md [&_h1]:font-headline-md [&_h1]:text-on-surface
        [&_h1]:mt-7 [&_h1]:mb-3 [&_h1]:pt-4 [&_h1]:border-t [&_h1]:border-outline-variant
        [&_h1:first-child]:mt-0 [&_h1:first-child]:pt-0 [&_h1:first-child]:border-t-0
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-3 [&_ol]:mb-3
        [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:mt-2 [&_ol_ol]:space-y-2
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-3
        [&_li]:leading-relaxed [&_li>p]:mb-1.5
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-label-sm
        [&_th]:border [&_th]:border-outline-variant [&_th]:p-2 [&_th]:bg-surface-container-high [&_th]:text-left [&_th]:text-on-surface
        [&_td]:border [&_td]:border-outline-variant [&_td]:p-2 [&_td]:align-top
        [&_a]:text-primary [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
