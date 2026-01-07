import { SourcesPopover } from "@/components/sources-popover";
import type { HeroSection as HeroSectionType } from "@/lib/types";

interface HeroSectionProps {
  data: HeroSectionType;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <article className="border-b border-border pb-6 mb-0">
      <div className="flex items-start gap-3 mb-6">
        <div className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold tracking-wide uppercase rounded">
          Breaking
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-balance">
        {data.headline}
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-4xl">
        {data.summary}
      </p>

      <div className="mb-8">
        <h2 className="text-sm font-semibold tracking-wide uppercase mb-4 text-muted-foreground">
          Key Takeaways
        </h2>
        <ul className="space-y-3">
          {data.takeaways.map((takeaway, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-primary font-bold shrink-0">•</span>
              <span className="text-foreground leading-relaxed">
                {takeaway}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 text-muted-foreground">
          Sources ({data.sources.length})
        </h3>
        <SourcesPopover sources={data.sources} maxVisible={4} />
      </div>
    </article>
  );
}
