import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type ModuleCardProps = {
  code: string;
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
};

export function ModuleCard({ code, title, description, href, Icon }: ModuleCardProps) {
  return (
    <Link className="module-card" href={href}>
      <Icon size={24} />
      <p className="eyebrow">{code}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}
