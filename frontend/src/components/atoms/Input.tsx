import { forwardRef } from "react";

import { cn } from "@/lib/cn";

type State = "default" | "error" | "success";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  state?: State;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const stateBorder: Record<State, string> = {
  default: "border-ink-300 focus-within:border-brand",
  error: "border-danger focus-within:border-danger",
  success: "border-success focus-within:border-success",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { state = "default", prefix, suffix, className, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "flex items-center bg-white rounded-md border transition-colors duration-base",
        "h-12 ps-3 pe-3 text-base",
        stateBorder[state],
        className,
      )}
    >
      {prefix && <span className="me-2 text-ink-500 shrink-0">{prefix}</span>}
      <input
        ref={ref}
        className="w-full bg-transparent outline-none placeholder:text-ink-300 text-ink-900"
        {...rest}
      />
      {suffix && <span className="ms-2 shrink-0">{suffix}</span>}
    </div>
  );
});
