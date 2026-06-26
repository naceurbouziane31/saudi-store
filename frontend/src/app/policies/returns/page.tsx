import type { Metadata } from "next";

import { PolicyPageTemplate } from "@/components/templates/PolicyPageTemplate";

export const metadata: Metadata = {
  title: "سياسة الإرجاع — النضارة",
  description: "ضمان الرضا — لو ما عجبچ المنتج، تواصلي ويانا على واتساب خلال 7 أيام ونرتب الإرجاع.",
  alternates: { canonical: "/policies/returns" },
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPageTemplate
      title="الإرجاع وضمان الرضا"
      lead="لو ما عجبچ المنتج — تواصلي ويانا على واتساب خلال 7 أيام من الاستلام ونرتب الإرجاع. بدون جدال، بدون أسئلة معقدة."
    >
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">الشروط</h2>
      <ul className="list-disc ps-6 space-y-2 text-ink-700">
        <li>تواصلي ويانا على واتساب خلال 7 أيام من تاريخ استلام الطلب.</li>
        <li>المنتج يكون مغلق وما تم استخدامه (للأسباب الصحية).</li>
        <li>المنتج بالعبوة الأصلية بدون تلف ظاهر.</li>
      </ul>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">شلون الإرجاع؟</h2>
      <ol className="list-decimal ps-6 space-y-2 text-ink-700">
        <li>كلمينا على واتساب وقولي رقم الطلب.</li>
        <li>نرتب لچ المندوب يجي يستلم المنتج من بيتچ.</li>
        <li>بعد ما نستلم المنتج، نرجع لچ المبلغ كاش أو نرسل لچ بديل، حسب رغبتچ.</li>
      </ol>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">حالات لا نقدر نرجعها</h2>
      <ul className="list-disc ps-6 space-y-2 text-ink-700">
        <li>المنتج مفتوح أو مستخدم (لأسباب صحية وسلامة المستخدم التالي).</li>
        <li>طلب الإرجاع بعد مرور 7 أيام من تاريخ الاستلام.</li>
      </ul>
    </PolicyPageTemplate>
  );
}
