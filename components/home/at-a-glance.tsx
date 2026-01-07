import { ExternalLink } from "lucide-react";
import { forwardRef } from "react";
import type { AtAGlanceItem } from "@/lib/types";
import { SourcesPopover } from "../shared/sources-popover";

interface AtAGlanceProps {
  items: AtAGlanceItem[];
}

export const AtAGlance = forwardRef<HTMLElement, AtAGlanceProps>(({ items }, ref) => {
  return (
    <section ref={ref} id="at-a-glance" className="border-b border-border py-8">
      <h2 className="text-base font-semibold tracking-wide uppercase mb-6 text-muted-foreground">
        At a Glance
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-primary font-bold shrink-0 text-base">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="space-y-1">
              <p className="text-base leading-relaxed text-foreground">{item.update}</p>
              {item.sources?.length ? (
                <SourcesPopover
                  sources={item.sources}
                  triggerLabel={`${item.sources.length} source${
                    item.sources.length > 1 ? "s" : ""
                  }`}
                  maxVisible={0}
                />
              ) : (
                <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  No sources
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

AtAGlance.displayName = "AtAGlance";
