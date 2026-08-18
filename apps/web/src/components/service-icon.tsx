import { Calendar, List, MapPin, type LucideIcon } from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  "booking-systems": Calendar,
  "local-search-and-maps": MapPin,
  "service-and-pricing-pages": List,
};

export function ServiceIcon({ className, slug }: { className?: string; slug: string }) {
  const Icon = serviceIcons[slug] ?? List;

  return <Icon aria-hidden="true" className={className} />;
}
