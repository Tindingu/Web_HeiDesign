import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <Badge>{label}</Badge>
      <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
