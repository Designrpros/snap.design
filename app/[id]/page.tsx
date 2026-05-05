import { notFound } from "next/navigation";
import { getDesignById } from "@/data/designs";
import PreviewPanel from "@/components/detail/PreviewPanel";
import DocViewer from "@/components/detail/DocViewer";
import Badge from "@/components/ui/Badge";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
{/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-ppmondwest text-display leading-display tracking-heading text-dark-charcoal">
              {design.title}
            </h1>
            <p className="font-af text-subheading text-medium-gray mt-2 max-w-2xl">
              {design.description}
            </p>
          </div>
          <Badge>{design.category}</Badge>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="lg:sticky lg:top-28 self-start">
          <PreviewPanel design={design} />
        </div>
        <div>
          <DocViewer design={design} />
        </div>
      </div>
    </div>
  );
}
