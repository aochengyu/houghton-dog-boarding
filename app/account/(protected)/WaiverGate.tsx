"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function WaiverGate({ signed, children }: { signed: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!signed && !pathname.startsWith("/account/waiver")) {
      router.replace("/account/waiver");
    }
  }, [signed, pathname, router]);

  if (!signed && !pathname.startsWith("/account/waiver")) return null;
  return <>{children}</>;
}
