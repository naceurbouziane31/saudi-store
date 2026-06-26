export interface Testimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  rating: number;
  quote: string;
  productSlug?: string;
  hasPhoto?: boolean;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "t1",
    name: "نورة",
    age: 28,
    city: "الفروانية",
    rating: 5,
    quote:
      "جربت علكات الكولاجين شهر كامل — شعري طاح أقل بكثير، وأظافري طولت. صار عندي روتين الصبح أنتظره.",
    productSlug: "nature-bounty-collagen-gummies",
    hasPhoto: true,
  },
  {
    id: "t2",
    name: "دانة",
    age: 32,
    city: "حولي",
    rating: 5,
    quote:
      "شامبو ساكورا غيّر شكل شعري. لمعان من أول مرة، ورائحة وايد ناعمة. أمي سألتني شو سويتي.",
    productSlug: "sakura-japanese-shampoo",
    hasPhoto: true,
  },
  {
    id: "t3",
    name: "شيخة",
    age: 24,
    city: "الكويت",
    rating: 5,
    quote:
      "ماسك الكولاجين الليلي صار جزء من نومي. صبح ألقى وجهي ممتلئ ومرتاح، حتى صاحباتي لاحظوا.",
    productSlug: "overnight-collagen-mask",
    hasPhoto: true,
  },
  {
    id: "t4",
    name: "ريم",
    age: 35,
    city: "السالمية",
    rating: 4,
    quote:
      "أخذت الباقة الكاملة قبل عرس أختي. بعد 3 أسابيع — بشرة مختلفة وشعر مختلف. يستاهل كل ريال.",
    hasPhoto: true,
  },
  {
    id: "t5",
    name: "منيرة",
    age: 41,
    city: "الأحمدي",
    rating: 5,
    quote:
      "بعد الولادة شعري طاح وايد. مع علكات نتشرز باونتي بدأ يرجع له شكله. صبر شهر — يجزيهم كل خير.",
    productSlug: "nature-bounty-collagen-gummies",
  },
  {
    id: "t6",
    name: "سارة",
    age: 27,
    city: "الجهراء",
    rating: 5,
    quote:
      "أحب إنه ندفع لما يوصل بس. ماكو ريسك. والمنتج جاني خلال يومين تقريباً. تعاملهم احترافي.",
    hasPhoto: true,
  },
  {
    id: "t7",
    name: "غدير",
    age: 30,
    city: "مبارك الكبير",
    rating: 5,
    quote:
      "بشرتي حساسة، خفت من الماسك بس طلع لطيف ومالاحظت أي تهيج. أوصي بيه لكل وحدة عندها نفس النوع.",
    productSlug: "overnight-collagen-mask",
  },
  {
    id: "t8",
    name: "العنود",
    age: 26,
    city: "الفنطاس",
    rating: 5,
    quote:
      "حبيت اللي قابلت من خدمة العملاء على الواتساب — جاوبوني خلال دقايق. مرتاحة من البراند بصراحة.",
  },
];
