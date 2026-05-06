import { notFound } from "next/navigation";
import { getDesignById } from "@/data/designs";
import DetailTabs from "@/components/detail/DetailTabs";
import { Badge } from "@snap/shared";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const design = getDesignById(id);

  if (!design) {
    notFound();
  }

  return (
    <div className="bg-eggshell h-[calc(100vh-56px)] overflow-hidden">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-y-auto lg:overflow-hidden scrollbar-hide">
          {/* Left Column (Scrollable on LG) */}
          <div className="h-auto lg:h-full lg:overflow-y-auto no-scrollbar pt-8 pb-12 lg:pb-24 lg:pr-12">
            <div className="space-y-12">
              {/* Image Scrollview (Small) */}
              <div className="rounded-2xl overflow-hidden border border-chalk shadow-subtle-4 bg-powder max-h-[300px] overflow-y-auto no-scrollbar scroll-smooth">
                {design.screenshot && (
                  <img
                    src={design.screenshot}
                    alt={`Screenshot of ${design.title}`}
                    className="w-full h-auto"
                  />
                )}
              </div>

              {/* Title & Info */}
              <div>
                <h1 className="font-display text-[3.5rem] md:text-[4.5rem] leading-[1.1] text-obsidian mb-6">
                  {design.title}
                </h1>
                <p className="font-af text-[16px] leading-relaxed text-gravel max-w-xl">
                  {design.description}
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <Badge className="py-1 px-3 text-[12px]">{design.category}</Badge>
                  <a
                    href={design.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-obsidian hover:underline font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              </div>

              {/* Design Tokens (Preview) - ONLY ON LARGE SCREENS */}
              <div className="hidden lg:block pt-12 border-t border-chalk">
                <DetailTabs design={design} showOnly="preview" />
              </div>
            </div>
          </div>

          {/* Right Column (Scrollable Code Tabs + Preview on Small Screens) */}
          <div className="h-auto lg:h-full lg:overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-chalk lg:pl-12 pt-8 pb-24">
            <DetailTabs design={design} adaptive={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
