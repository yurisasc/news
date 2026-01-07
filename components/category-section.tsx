import { SourcesPopover } from "@/components/sources-popover";
import type { CategorySection as CategorySectionType } from "@/lib/types";

interface CategorySectionProps {
  section: CategorySectionType;
}

export function CategorySection({ section }: CategorySectionProps) {
  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 pb-4 border-b border-border">
        {section.title}
      </h2>

      <div className="space-y-10">
        {section.stories.map((story, index) => (
          <article key={index} className="group">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 leading-tight text-balance group-hover:text-primary transition-colors">
              {story.headline}
            </h3>

            <p className="text-base md:text-lg text-muted-foreground mb-3 leading-relaxed text-pretty">
              {story.summary}
            </p>

            {story.takeaways && story.takeaways.length > 0 && (
              <ul className="mb-4 space-y-2">
                {story.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex gap-3 text-base">
                    <span className="text-primary shrink-0">→</span>
                    <span className="text-muted-foreground leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            )}

            <SourcesPopover sources={story.sources} maxVisible={3} />
          </article>
        ))}
      </div>
    </section>
  );
}
