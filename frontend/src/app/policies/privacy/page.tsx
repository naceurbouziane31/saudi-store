import type { Metadata } from "next";

import { PolicyPageTemplate } from "@/components/templates/PolicyPageTemplate";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — النضارة",
  description: "كيف نجمع، نخزن، ونستخدم بياناتچ. وحقوقچ في حذفها.",
  alternates: { canonical: "/policies/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageTemplate
      title="سياسة الخصوصية"
      lead="خصوصيتچ مهمة لنا. هذا شو نجمع، ليش نجمعه، وشلون تتحكمين فيه."
    >
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">شو نجمع</h2>
      <ul className="list-disc ps-6 space-y-2 text-ink-700">
        <li>اسمچ الكامل (لتأكيد الطلب).</li>
        <li>رقم جوالچ (للتواصل وتأكيد العنوان).</li>
        <li>عنوانچ (يجمعه مندوب التوصيل بعد التأكيد بالتلفون).</li>
        <li>معلومات تقنية أساسية: عنوان IP، نوع المتصفح، الصفحة اللي جيتي منها (للأمان والتحليلات).</li>
        <li>كوكيز إعلانية (بعد موافقتچ) من Meta و TikTok و Snap لقياس فعالية الإعلانات.</li>
      </ul>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">ليش نجمعها</h2>
      <p>
        فقط لتنفيذ طلبچ، التواصل ويا چ، تحسين الخدمة، وقياس فعالية إعلاناتنا. ما نبيع
        بياناتچ لطرف ثالث.
      </p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">مدة الاحتفاظ</h2>
      <p>نحتفظ بمعلومات الطلب لمدة 24 شهر لأغراض المحاسبة والدعم.</p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">حقوقچ</h2>
      <ul className="list-disc ps-6 space-y-2 text-ink-700">
        <li>طلب نسخة من بياناتچ.</li>
        <li>طلب تصحيح أي معلومة غلط.</li>
        <li>طلب حذف بياناتچ (بعد إكمال الفواتير الجارية).</li>
      </ul>
      <p>
        لأي طلب يخص بياناتچ، راسلينا على{" "}
        <a className="text-brand underline" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
          {env.NEXT_PUBLIC_SUPPORT_EMAIL}
        </a>
        .
      </p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">الكوكيز</h2>
      <p>
        نستخدم كوكيز ضرورية لتشغيل الموقع، وكوكيز تحليلية وإعلانية (Meta Pixel، TikTok
        Pixel، Snap Pixel) فقط بعد موافقتچ من شريط الكوكيز.
      </p>
    </PolicyPageTemplate>
  );
}
