import ShareButtons from "@/components/ShareButtons";

/**
 * PSEOShareSection — Social share buttons for pSEO blog-style pages.
 *
 * TRAFFIC SECRETS Sec 3: Every piece of content must have frictionless sharing.
 * This component adds Twitter, LinkedIn, Reddit, and Copy Link buttons
 * to pSEO-generated pages that currently have zero distribution mechanics.
 *
 * Usage: Import and add <PSEOShareSection title="Page Title" /> above the Footer
 * in any pSEO page template.
 */
export default function PSEOShareSection({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 border-t border-white/10">
      <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-3 text-center">
        Share this resource
      </p>
      <div className="flex justify-center">
        <ShareButtons title={title} />
      </div>
      <p className="text-white/30 text-xs mt-2 text-center">
        Sharing helps another corporate manager find their exit.
      </p>
    </div>
  );
}
