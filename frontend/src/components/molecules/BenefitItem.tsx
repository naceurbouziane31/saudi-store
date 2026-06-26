import { Sparkles } from "lucide-react";

interface BenefitItemProps {
  text: string;
  icon?: React.ReactNode;
}

export const BenefitItem = ({ text, icon }: BenefitItemProps) => (
  <li className="flex items-start gap-3 bg-white rounded-lg border border-ink-300/30 p-4">
    <span className="shrink-0 size-9 rounded-full bg-cream text-brand flex items-center justify-center">
      {icon ?? <Sparkles size={18} />}
    </span>
    <span className="text-sm text-ink-700 leading-relaxed">{text}</span>
  </li>
);
