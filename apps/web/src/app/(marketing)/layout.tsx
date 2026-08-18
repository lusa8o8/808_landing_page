import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";

export default function MarketingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}
