import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-ppmondwest text-display leading-display tracking-heading text-dark-charcoal">
        Page not found
      </h1>
      <p className="font-af text-subheading text-medium-gray mt-4 max-w-md">
        The design you&apos;re looking for doesn&apos;t exist. Browse the
        gallery to discover beautiful design systems.
      </p>
      <div className="mt-8">
        <Button variant="solid" size="lg" href="/">
          Back to Gallery
        </Button>
      </div>
    </div>
  );
}
