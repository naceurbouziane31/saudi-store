import type { Product } from "@/types/product";

export const PRODUCTS: readonly Product[] = [
  {
    slug: "nature-bounty-collagen-gummies",
    skuPrefix: "GUM",
    titleAr: "علكات كولاجين نتشرز باونتي",
    titleEn: "Nature's Bounty Collagen Gummies",
    subtitleAr:
      "نضارة بشرة، قوة شعر، صلابة أظافر — بعلكة وحدة باليوم.",
    shortDescriptionAr:
      "علكات كولاجين أمريكية من نتشرز باونتي — تحفّز إنتاج الكولاجين الطبيعي، تقوي الشعر والأظافر، وتعطي بشرتچ نضارة تشوفينها بأسبوعين.",
    originCountry: "US",
    originFlag: "🇺🇸",
    category: "Skin / Hair / Nails",
    benefitsAr: [
      "تحفّز إنتاج الكولاجين الطبيعي بجسمچ",
      "تقلل ظهور الخطوط الدقيقة وتحسن المرونة",
      "تقوي بصيلات الشعر وتقلل التساقط",
      "تخلي أظافرچ تطول بدون كسر",
      "خالية من الجلوتين، بدون ألوان صناعية",
      "سهلة الاستخدام — علكتين بس باليوم",
    ],
    ingredientsAr: [
      { name: "كولاجين النوع I و III", role: "بناء وتجديد البشرة", country: "US" },
      { name: "فيتامين C", role: "يساعد على امتصاص الكولاجين", country: "US" },
      { name: "بيوتين", role: "لصحة الشعر والأظافر", country: "US" },
      { name: "خالية من الجلوتين", role: "آمنة لمعظم الأنظمة الغذائية" },
    ],
    mechanismAr:
      "الكولاجين هو البروتين الأساسي للبشرة والشعر والأظافر. بعد عمر 25 ينقص إنتاجه بنسبة 1% كل سنة. علكات نتشرز باونتي تحتوي كولاجين النوع I و III المتحلل اللي ثبت علمياً يدعم تجديد البشرة وقوة الشعر، مع فيتامين C اللي يساعد الجسم يمتصه بكفاءة.",
    usageAr:
      "تناولي علكتين باليوم، صباحاً مع وجبة الفطور. النتايج الأولية تبدأ تظهر بعد 14 يوم من الاستخدام المنتظم.",
    whoIsForAr: [
      "نساء 22+ يبغين دعم نضارة البشرة",
      "اللي يلاحظن تساقط شعر بسيط",
      "اللي يبغين تطويل وتقوية الأظافر بطريقة آمنة",
      "اللي يبغين بديل سهل عن حبوب الفيتامينات",
    ],
    whoIsNotForAr: [
      "الحوامل أو المرضعات بدون استشارة الطبيبة",
      "الأطفال تحت 18 سنة",
    ],
    proofPoints: [
      "+2 مليون زجاجة تُباع سنوياً عالمياً",
      "براند أمريكي من 1971",
      "مصنوعة في منشأة معتمدة من FDA",
      "متوفرة بالصيدليات الأمريكية والعالمية",
    ],
    certifications: ["FDA Registered", "Gluten Free", "Non-GMO"],
    crossSellSlugs: ["sakura-japanese-shampoo", "overnight-collagen-mask"],
    upsellPartnerSlug: "overnight-collagen-mask",
    faqs: [
      { q: "متى أشوف نتايج؟", a: "أول النتايج عادة بأسبوعين، نتايج كاملة بعد 60 يوم." },
      { q: "هل آمنة؟", a: "نعم، مصنعة في منشأة معتمدة من FDA الأمريكية." },
      {
        q: "هل آخذها مع فيتامينات ثانية؟",
        a: "نعم، ما تتعارض مع المالتيفيتامين أو فيتامين د.",
      },
      { q: "هل فيها سكر؟", a: "كمية بسيطة لتحسين الطعم؛ مناسبة لمعظم الأنظمة." },
      {
        q: "هل تنفع بعد الولادة؟",
        a: "استشيري طبيبتچ خاصة لو مرضعة، عشان نتأكد إنها مناسبة لچ.",
      },
      {
        q: "چم زجاجة تكفي بالشهر؟",
        a: "زجاجة وحدة تكفي 30 يوم بمعدل علكتين باليوم.",
      },
    ],
    variants: [
      { sku: "GUM-1", bundleSize: 1, labelAr: "1 قطعة", priceKwd: 19, compareAtPriceKwd: null },
      { sku: "GUM-2", bundleSize: 2, labelAr: "2 قطعة", priceKwd: 29, compareAtPriceKwd: 38 },
      { sku: "GUM-3", bundleSize: 3, labelAr: "3 قطع", priceKwd: 39, compareAtPriceKwd: 57 },
    ],
    ratingValue: 4.8,
    reviewCount: 1250,
    imageSlots: [
      "/images/placeholders/gummies-1.svg",
      "/images/placeholders/gummies-2.svg",
      "/images/placeholders/gummies-3.svg",
      "/images/placeholders/gummies-4.svg",
    ],
  },
  {
    slug: "sakura-japanese-shampoo",
    skuPrefix: "SHA",
    titleAr: "شامبو ساكورا الياباني",
    titleEn: "Sakura Japanese Shampoo",
    subtitleAr: "شعرچ يستاهل لمسة يابانية — لمعان، تغذية، ورائحة تدوم.",
    shortDescriptionAr:
      "شامبو ساكورا الياباني الفاخر يغذي شعرچ من الجذور حتى الأطراف، يعطيه لمعان طبيعي ورائحة ناعمة تدوم لأيام.",
    originCountry: "JP",
    originFlag: "🇯🇵",
    category: "Hair Care",
    benefitsAr: [
      "يغذي فروة الرأس بمستخلصات زهر الكرز الياباني",
      "يعطي شعرچ لمعان حقيقي من أول استخدام",
      "يقلل التقصف ويقوي الأطراف",
      "مناسب لجميع أنواع الشعر — دهني، جاف، مصبوغ",
      "رائحة ناعمة تدوم طول اليوم",
      "خالٍ من السلفات القاسية والبارابين",
    ],
    ingredientsAr: [
      {
        name: "مستخلص زهر الكرز (Sakura)",
        role: "يحفز تجديد خلايا فروة الرأس",
        country: "JP",
      },
      {
        name: "زيت الكاميليا الياباني",
        role: "ترطيب عميق بدون ثقل",
        country: "JP",
      },
      { name: "بانثينول (Pro-Vit B5)", role: "تقوية بنية الشعر" },
      { name: "خالٍ من السلفات والبارابين", role: "حماية الشعر المصبوغ" },
    ],
    mechanismAr:
      "زهر الكرز غني بمضادات الأكسدة وحمض الإيلاجيك اللي يحفز تجديد خلايا فروة الرأس. الفورمولا اليابانية تجمع تنظيف لطيف وترطيب عميق بدون ما تترك شعرچ ثقيل أو دهني — تخليه ينفّس.",
    usageAr:
      "ضعي كمية بحجم العملة على شعر مبلل، دلكي فروة الرأس لمدة دقيقة، اشطفي جيداً. استخدمي 3 مرات بالأسبوع للنتايج الفضلى.",
    whoIsForAr: [
      "كل امرأة تبغي شعر صحي ولامع",
      "الشعر المتعب من الحرارة أو الصبغة",
      "اللي يبغين روتين شعر ياباني بسيط",
    ],
    whoIsNotForAr: [
      "اللي عندهن حساسية معروفة من مستخلصات زهر الكرز",
    ],
    proofPoints: [
      "اليابان رقم 1 عالمياً في فلسفة العناية بالشعر",
      "مصنوع في مصنع ياباني معتمد ISO",
      "خالٍ من السلفات والبارابين والسليكون الثقيل",
    ],
    certifications: ["Made in Japan", "Sulfate Free", "Paraben Free", "Dermatologically Tested"],
    crossSellSlugs: ["nature-bounty-collagen-gummies", "overnight-collagen-mask"],
    upsellPartnerSlug: "overnight-collagen-mask",
    faqs: [
      {
        q: "هل يطول الشعر؟",
        a: "يحسن صحة فروة الرأس وبالتالي ينمو شعرچ أقوى وأطول طبيعياً.",
      },
      {
        q: "مناسب للشعر المصبوغ؟",
        a: "نعم، خالٍ من السلفات اللي تسرّع بهتان اللون.",
      },
      { q: "چم مرة استخدمه؟", a: "3 مرات بالأسبوع كحد أقصى للنتايج المتوازنة." },
      { q: "هل ينفع للأطفال؟", a: "للبالغين فقط." },
      { q: "هل يترك دهون؟", a: "لا، خفيف وما يثقل الشعر." },
      {
        q: "متى أشوف الفرق؟",
        a: "اللمعان من أول مرة، الترطيب والقوة خلال أسبوعين.",
      },
    ],
    variants: [
      { sku: "SHA-1", bundleSize: 1, labelAr: "1 قطعة", priceKwd: 19, compareAtPriceKwd: null },
      { sku: "SHA-2", bundleSize: 2, labelAr: "2 قطعة", priceKwd: 29, compareAtPriceKwd: 38 },
      { sku: "SHA-3", bundleSize: 3, labelAr: "3 قطع", priceKwd: 39, compareAtPriceKwd: 57 },
    ],
    ratingValue: 4.9,
    reviewCount: 980,
    imageSlots: [
      "/images/placeholders/shampoo-1.svg",
      "/images/placeholders/shampoo-2.svg",
      "/images/placeholders/shampoo-3.svg",
      "/images/placeholders/shampoo-4.svg",
    ],
  },
  {
    slug: "overnight-collagen-mask",
    skuPrefix: "MAS",
    titleAr: "ماسك الكولاجين الليلي",
    titleEn: "Overnight Collagen Mask",
    subtitleAr: "بشرة جديدة كل صباح — وانتي نايمة.",
    shortDescriptionAr:
      "ماسك الكولاجين الليلي يشتغل وانتي نايمة — يعمق الترطيب، يشد البشرة، ويعطيچ نضارة تشوفينها بالمراية أول ما تصحين.",
    originCountry: "KR",
    originFlag: "🇯🇵",
    category: "Skincare",
    benefitsAr: [
      "ترطيب عميق طول 8 ساعات وانتي نايمة",
      "يحفز إنتاج الكولاجين الطبيعي بالبشرة",
      "يقلل ظهور المسامات والخطوط الدقيقة",
      "يوحد لون البشرة ويعطيها إشراقة",
      "خفيف، ما ينسد، مناسب لكل أنواع البشرة",
      "ما يحتاج شطف — يمتص بالليل",
    ],
    ingredientsAr: [
      { name: "كولاجين بحري", role: "بناء وتجديد طبقات البشرة", country: "JP" },
      { name: "حمض الهيالورونيك", role: "ترطيب يدوم 8 ساعات" },
      { name: "نياسيناميد", role: "توحيد لون البشرة" },
      { name: "خالٍ من العطور القوية", role: "آمن للبشرة الحساسة" },
    ],
    mechanismAr:
      "الكولاجين البحري والببتيدات تنفذ بعمق الطبقات السطحية وتحفز الخلايا لإنتاج كولاجين جديد طبيعياً. حمض الهيالورونيك يحبس الرطوبة طول 8 ساعات بدون إزعاج، فتصحين على بشرة ممتلئة ومضيئة.",
    usageAr:
      "بعد غسل الوجه ووضع التونر، ضعي طبقة خفيفة على البشرة قبل النوم. اتركيها طول الليل، اشطفي بالماء الفاتر صباحاً. استخدمي 3 مرات بالأسبوع.",
    whoIsForAr: [
      "البشرة المتعبة، الجافة، أو الباهتة",
      "اللي بدت تظهر فيها علامات تعب وخطوط دقيقة",
      "اللي يبغين نضارة سريعة قبل مناسبة",
    ],
    whoIsNotForAr: [
      "اللي عندهن حساسية من المنتجات البحرية",
    ],
    proofPoints: [
      "87% من المستخدمات لاحظن نضارة أوضح بعد أسبوعين",
      "خالٍ من البارابين والكحول والصبغات",
      "تم اختباره من قبل أطباء الجلدية",
    ],
    certifications: ["Paraben Free", "Alcohol Free", "Dermatologically Tested"],
    crossSellSlugs: ["nature-bounty-collagen-gummies", "sakura-japanese-shampoo"],
    upsellPartnerSlug: "nature-bounty-collagen-gummies",
    faqs: [
      {
        q: "أحس وجهي دهني، ينفع؟",
        a: "نعم، الفورمولا خفيفة وما تسد المسامات.",
      },
      { q: "أستخدمه يومياً؟", a: "3 مرات بالأسبوع أفضل، عشان ما تتعب البشرة." },
      {
        q: "متى أشوف الفرق؟",
        a: "نضارة من أول استخدام، نتايج كاملة بعد 4 أسابيع.",
      },
      {
        q: "أحطه قبل أو بعد السيروم؟",
        a: "بعد السيروم، وآخر خطوة قبل النوم.",
      },
      { q: "ينفع وانا حامل؟", a: "استشيري طبيبتچ قبل البدء." },
      {
        q: "أقدر أحطه على الرقبة؟",
        a: "نعم، يفضل توسيع التطبيق ليشمل الرقبة.",
      },
    ],
    variants: [
      { sku: "MAS-1", bundleSize: 1, labelAr: "1 قطعة", priceKwd: 19, compareAtPriceKwd: null },
      { sku: "MAS-2", bundleSize: 2, labelAr: "2 قطعة", priceKwd: 29, compareAtPriceKwd: 38 },
      { sku: "MAS-3", bundleSize: 3, labelAr: "3 قطع", priceKwd: 39, compareAtPriceKwd: 57 },
    ],
    ratingValue: 4.8,
    reviewCount: 712,
    imageSlots: [
      "/images/placeholders/mask-1.svg",
      "/images/placeholders/mask-2.svg",
      "/images/placeholders/mask-3.svg",
      "/images/placeholders/mask-4.svg",
    ],
  },
];

export const PRODUCT_BY_SLUG: ReadonlyMap<string, Product> = new Map(
  PRODUCTS.map((p) => [p.slug, p]),
);

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCT_BY_SLUG.get(slug);

export const getCrossSells = (currentSlugs: readonly string[]): Product[] =>
  PRODUCTS.filter((p) => !currentSlugs.includes(p.slug));

export const getUpsellFor = (
  currentSlugs: readonly string[],
): { product: Product; sku: string; priceKwd: number; compareAtKwd: number } | null => {
  // Priority: Gummies → Shampoo → Mask, choose first NOT in cart.
  const priority = [
    "nature-bounty-collagen-gummies",
    "sakura-japanese-shampoo",
    "overnight-collagen-mask",
  ];
  const targetSlug = priority.find((s) => !currentSlugs.includes(s));
  if (!targetSlug) return null;
  const product = PRODUCT_BY_SLUG.get(targetSlug);
  if (!product) return null;
  return {
    product,
    sku: `UPS-9-${product.skuPrefix}`,
    priceKwd: 9,
    compareAtKwd: 19,
  };
};
