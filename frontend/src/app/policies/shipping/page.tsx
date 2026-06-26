import type { Metadata } from "next";

import { PolicyPageTemplate } from "@/components/templates/PolicyPageTemplate";

export const metadata: Metadata = {
  title: "سياسة التوصيل — النضارة",
  description: "تفاصيل التوصيل في الكويت — التغطية، المدة، وتفاصيل التواصل قبل التوصيل.",
  alternates: { canonical: "/policies/shipping" },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPageTemplate
      title="التوصيل"
      lead="نوصل لكل محافظات الكويت خلال 24-48 ساعة من تأكيد الطلب. التوصيل مجاني على كل الطلبات."
    >
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">المناطق المغطاة</h2>
      <p>
        نوصل لكل محافظات الكويت — العاصمة، حولي، الفروانية، الأحمدي، مبارك الكبير، الجهراء.
      </p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">الوقت المتوقع</h2>
      <p>
        نتواصل بيا بالتلفون أولاً للتأكيد. بعد التأكيد، يوصل لچ الطلب خلال 24-48 ساعة، حسب
        منطقة السكن.
      </p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">كلفة التوصيل</h2>
      <p>التوصيل مجاني على كل الطلبات داخل الكويت.</p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">الدفع</h2>
      <p>
        نظام الدفع عند الاستلام (COD). تدفعين كاش لمندوب التوصيل لما يوصلچ الطلب. ما نطلب
        فيزا، ما نطلب تحويل بنكي.
      </p>
      <h2 className="font-display font-bold text-h2 mt-6 mb-3">تتبع الطلب</h2>
      <p>
        بمجرد ما يطلع طلبچ من المخزن، نرسل لچ رسالة واتساب فيها رقم المندوب والوقت المتوقع.
      </p>
    </PolicyPageTemplate>
  );
}
