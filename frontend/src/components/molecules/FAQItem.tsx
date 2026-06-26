"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

interface FAQItemProps {
  value: string;
  question: string;
  answer: string;
  className?: string;
}

export const FAQItem = ({ value, question, answer, className }: FAQItemProps) => (
  <Accordion.Item
    value={value}
    className={cn(
      "border border-ink-300/40 rounded-lg bg-white overflow-hidden",
      className,
    )}
  >
    <Accordion.Header>
      <Accordion.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-4 px-4 py-4 text-start",
          "text-base font-bold text-ink-700 hover:bg-cream/60 transition-colors",
        )}
      >
        <span>{question}</span>
        <ChevronDown
          size={20}
          className="text-brand transition-transform duration-base group-data-[state=open]:rotate-180 shrink-0"
        />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out">
      <div className="px-4 pb-4 text-sm text-ink-700 leading-relaxed">{answer}</div>
    </Accordion.Content>
  </Accordion.Item>
);
