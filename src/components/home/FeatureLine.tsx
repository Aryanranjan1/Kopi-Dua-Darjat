"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureLineProps {
  feature: {
    icon: LucideIcon;
    title: string;
  };
  position: "topLeft" | "left" | "bottomLeft";
}

const positionClasses = {
  topLeft: {
    wrapper: "items-end",
    line: "w-16 h-16 border-b-2 border-r-2 border-dashed border-accent rounded-br-full",
    text: "text-right -mr-4",
  },
  left: {
    wrapper: "items-end",
    line: "w-24 h-0 border-b-2 border-dashed border-accent",
    text: "text-right",
  },
  bottomLeft: {
     wrapper: "items-end",
    line: "w-16 h-16 border-t-2 border-r-2 border-dashed border-accent rounded-tr-full",
    text: "text-right -mr-4",
  },
};

export function FeatureLine({ feature, position }: FeatureLineProps) {
  const { wrapper, line, text } = positionClasses[position];

  return (
    <div className={cn("flex flex-col gap-2", wrapper)}>
      <div className={line} />
      <div className={cn("flex items-center gap-2", text)}>
        <div>
          <h4 className="font-semibold text-sm">{feature.title}</h4>
        </div>
        <div className="bg-accent text-accent-foreground p-2 rounded-full">
          <feature.icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
