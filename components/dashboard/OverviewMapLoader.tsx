"use client";

import dynamic from "next/dynamic";
import type { OverviewMapProps } from "./OverviewMap";

const OverviewMap = dynamic(() => import("./OverviewMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
});

export function OverviewMapLoader(props: OverviewMapProps) {
  return <OverviewMap {...props} />;
}
