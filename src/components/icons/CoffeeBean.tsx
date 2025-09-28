import { cn } from "@/lib/utils";

export function CoffeeBean({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-coffee-bean", className)}
      {...props}
    >
      <path d="M12.51 6.55A4.33 4.33 0 0 0 10 5.06a4.31 4.31 0 0 0-4.33 4.33c0 2.39 1.94 4.33 4.33 4.33h.05c2.39 0 4.33-1.94 4.33-4.33a4.31 4.31 0 0 0-1.49-3.23Z" />
      <path d="M18.94 13.06a4.31 4.31 0 0 0-4.33-4.33c-2.39 0-4.33 1.94-4.33 4.33v.05c0 2.39 1.94 4.33 4.33 4.33a4.31 4.31 0 0 0 3.23-1.49Z" />
      <path d="M5.06 10.28A4.31 4.31 0 0 0 6.55 14a4.33 4.33 0 0 0 4.33 2.84h.06a4.33 4.33 0 0 0 4.33-4.33V12.5a4.31 4.31 0 0 0-1.49-3.23" />
      <path d="M13.72 5.06A4.31 4.31 0 0 0 10.5 6.55a4.33 4.33 0 0 0-2.84 4.33v.06a4.33 4.33 0 0 0 4.33 4.33h.01a4.31 4.31 0 0 0 3.23-1.49" />
    </svg>
  );
}
