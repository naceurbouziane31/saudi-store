import type { Metadata } from "next";

import { PolicyPageTemplate } from "@/components/templates/PolicyPageTemplate";

export const metadata: Metadata = {
  title: "الشروط والأحكام — النضارة",
  description: "شروط استخدام موقع النضارة وطلب المنتجات منه.",
  alternates: { canonical: "/policies/terms" },
};

export default function TermsPolicyPage() {
  return (
    <PolicyPageTemplate
      title="الشروط والأحكام"
      lead="شروط استخدام موقع النضارة وطلب المنتجات منه."
    >
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">1. عن الموقع</h2>
      <p>
        موقع النضارة (alnadara.shop) يقدم مجموعة من منتجات العناية بالبشرة والشعر لعميلاتنا
        في الكويت. كل المنتجات مستوردة من شركاء معتمدين.
      </p>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">2. الطلبات والدفع</h2>
      <ul className="list-disc ps-6 space-y-2 text-ink-700">
        <li>كل الطلبات نظام الدفع عند الاستلام (COD) كاش.</li>
        <li>الأسعار بالدينار الكويتي (KWD) وتشمل الشحن المجاني.</li>
        <li>نحتفظ بحق رفض أو إلغاء أي طلب مشبوه قبل التأكيد.</li>
      </ul>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">3. التوصيل</h2>
      <p>
        راجعي{" "}
        <a className="text-brand underline" href="/policies/shipping">
          سياسة التوصيل
        </a>{" "}
        لتفاصيل المناطق والوقت المتوقع.
      </p>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">4. الإرجاع</h2>
      <p>
        راجعي{" "}
        <a className="text-brand underline" href="/policies/returns">
          سياسة الإرجاع
        </a>
        .
      </p>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">5. ادعاءات المنتج</h2>
      <p>
        المنتجات وصفية وليست بديلاً عن استشارة طبية. النتايج تختلف من شخص لآخر. لا نقدم أي
        ادعاء علاجي.
      </p>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">6. الملكية الفكرية</h2>
      <p>
        كل العلامات التجارية، النصوص، والصور على هذا الموقع ملكية النضارة أو الشركاء
        المرخصين. ممنوع النسخ بدون إذن.
      </p>

      <h2 className="font-display font-bold text-h2 mt-6 mb-3">7. التواصل</h2>
      <p>
        لأي استفسار قانوني أو شكوى، تواصلي ويانا على{" "}
        <a className="text-brand underline" href="/contact">
          صفحة التواصل
        </a>
        .
      </p>
    </PolicyPageTemplate>
  );
}
