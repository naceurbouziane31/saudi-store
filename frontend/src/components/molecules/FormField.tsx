import { forwardRef } from "react";

import { Input } from "@/components/atoms/Input";
import { cn } from "@/lib/cn";

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label: string;
  helper?: string;
  error?: string;
  successMessage?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, helper, error, successMessage, prefix, suffix, required, id, className, ...rest },
  ref,
) {
  const inputId = id ?? `field-${rest.name ?? Math.random().toString(36).slice(2)}`;
  const state = error ? "error" : successMessage ? "success" : "default";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-bold text-ink-700">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <Input id={inputId} ref={ref} state={state} prefix={prefix} suffix={suffix} {...rest} />
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : successMessage ? (
        <p className="text-sm text-success">{successMessage}</p>
      ) : helper ? (
        <p className="text-sm text-ink-500">{helper}</p>
      ) : null}
    </div>
  );
});
