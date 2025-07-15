import * as React from "react";
import { cn } from "@/lib/utils";

interface UnderlineInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: boolean;
}

function UnderlineInput({
  className,
  label,
  error,
  ...props
}: UnderlineInputProps) {
  return (
    <div className={cn(className)}>
      {label && (
        <label className="block text-sm text-gray-500 mb-1">{label}</label>
      )}
      <input
        className={cn(
          "w-full bg-transparent border-b-2 border-gray-300 pb-1 text-sm focus:outline-none focus:border-gray-600 transition-colors",
          error && "border-red-500 focus:border-red-500"
        )}
        {...props}
      />
    </div>
  );
}

export { UnderlineInput };
