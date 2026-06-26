from __future__ import annotations

from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Product, ProductVariant

# Source of truth mirrored from docs/05-products.md and the frontend catalog.
PRODUCTS: list[dict[str, Any]] = [
    {
        "slug": "nature-bounty-collagen-gummies",
        "sku_prefix": "GUM",
        "title_ar": "علكات كولاجين نتشرز باونتي",
        "subtitle_ar": "نضارة بشرة، قوة شعر، صلابة أظافر — بعلكة وحدة باليوم.",
        "short_description_ar": (
            "علكات كولاجين أمريكية من نتشرز باونتي — تحفّز إنتاج الكولاجين الطبيعي، "
            "تقوي الشعر والأظافر، وتعطي بشرتچ نضارة تشوفينها بأسبوعين."
        ),
        "origin_country": "US",
        "order": 1,
        "benefits_ar": [
            "تحفّز إنتاج الكولاجين الطبيعي بجسمچ",
            "تقلل ظهور الخطوط الدقيقة وتحسن المرونة",
            "تقوي بصيلات الشعر وتقلل التساقط",
            "تخلي أظافرچ تطول بدون كسر",
            "خالية من الجلوتين، بدون ألوان صناعية",
            "سهلة الاستخدام — علكتين بس باليوم",
        ],
        "ingredients_ar": [
            {"name": "كولاجين النوع I و III", "role": "بناء وتجديد البشرة", "country": "US"},
            {"name": "فيتامين C", "role": "يساعد على امتصاص الكولاجين", "country": "US"},
            {"name": "بيوتين", "role": "لصحة الشعر والأظافر", "country": "US"},
        ],
        "usage_ar": "تناولي علكتين باليوم، صباحاً مع وجبة الفطور.",
        "who_is_for_ar": "نساء 22+ يبغين دعم نضارة البشرة، تقوية الشعر، وتطويل الأظافر.",
        "who_is_not_for_ar": "الحوامل أو المرضعات بدون استشارة الطبيبة، والأطفال تحت 18 سنة.",
        "variants": [
            {
                "sku": "GUM-1",
                "bundle_size": 1,
                "label_ar": "1 قطعة",
                "price_kwd": "19.000",
                "compare_at_price_kwd": None,
            },
            {
                "sku": "GUM-2",
                "bundle_size": 2,
                "label_ar": "2 قطعة",
                "price_kwd": "29.000",
                "compare_at_price_kwd": "38.000",
            },
            {
                "sku": "GUM-3",
                "bundle_size": 3,
                "label_ar": "3 قطع",
                "price_kwd": "39.000",
                "compare_at_price_kwd": "57.000",
            },
            {
                "sku": "UPS-9-GUM",
                "bundle_size": 1,
                "label_ar": "علكات كولاجين (عرض حصري)",
                "price_kwd": "9.000",
                "compare_at_price_kwd": "19.000",
                "is_upsell_offer": True,
            },
        ],
    },
    {
        "slug": "sakura-japanese-shampoo",
        "sku_prefix": "SHA",
        "title_ar": "شامبو ساكورا الياباني",
        "subtitle_ar": "شعرچ يستاهل لمسة يابانية — لمعان، تغذية، ورائحة تدوم.",
        "short_description_ar": (
            "شامبو ساكورا الياباني الفاخر يغذي شعرچ من الجذور حتى الأطراف، يعطيه لمعان "
            "طبيعي ورائحة ناعمة تدوم لأيام."
        ),
        "origin_country": "JP",
        "order": 2,
        "benefits_ar": [
            "يغذي فروة الرأس بمستخلصات زهر الكرز الياباني",
            "يعطي شعرچ لمعان حقيقي من أول استخدام",
            "يقلل التقصف ويقوي الأطراف",
            "مناسب لجميع أنواع الشعر — دهني، جاف، مصبوغ",
            "رائحة ناعمة تدوم طول اليوم",
            "خالٍ من السلفات القاسية والبارابين",
        ],
        "ingredients_ar": [
            {
                "name": "مستخلص زهر الكرز (Sakura)",
                "role": "يحفز تجديد خلايا فروة الرأس",
                "country": "JP",
            },
            {"name": "زيت الكاميليا الياباني", "role": "ترطيب عميق بدون ثقل", "country": "JP"},
            {"name": "بانثينول (Pro-Vit B5)", "role": "تقوية بنية الشعر"},
        ],
        "usage_ar": "ضعي كمية بحجم العملة على شعر مبلل، دلكي فروة الرأس دقيقة، اشطفي. 3 مرات بالأسبوع.",
        "who_is_for_ar": "كل امرأة تبغي شعر صحي ولامع، خاصة الشعر المتعب من الحرارة أو الصبغة.",
        "who_is_not_for_ar": "اللي عندهن حساسية معروفة من مستخلصات زهر الكرز.",
        "variants": [
            {"sku": "SHA-1", "bundle_size": 1, "label_ar": "1 قطعة", "price_kwd": "19.000"},
            {
                "sku": "SHA-2",
                "bundle_size": 2,
                "label_ar": "2 قطعة",
                "price_kwd": "29.000",
                "compare_at_price_kwd": "38.000",
            },
            {
                "sku": "SHA-3",
                "bundle_size": 3,
                "label_ar": "3 قطع",
                "price_kwd": "39.000",
                "compare_at_price_kwd": "57.000",
            },
            {
                "sku": "UPS-9-SHA",
                "bundle_size": 1,
                "label_ar": "شامبو ساكورا (عرض حصري)",
                "price_kwd": "9.000",
                "compare_at_price_kwd": "19.000",
                "is_upsell_offer": True,
            },
        ],
    },
    {
        "slug": "overnight-collagen-mask",
        "sku_prefix": "MAS",
        "title_ar": "ماسك الكولاجين الليلي",
        "subtitle_ar": "بشرة جديدة كل صباح — وانتي نايمة.",
        "short_description_ar": (
            "ماسك الكولاجين الليلي يشتغل وانتي نايمة — يعمق الترطيب، يشد البشرة، "
            "ويعطيچ نضارة تشوفينها بالمراية أول ما تصحين."
        ),
        "origin_country": "JP",
        "order": 3,
        "benefits_ar": [
            "ترطيب عميق طول 8 ساعات وانتي نايمة",
            "يحفز إنتاج الكولاجين الطبيعي بالبشرة",
            "يقلل ظهور المسامات والخطوط الدقيقة",
            "يوحد لون البشرة ويعطيها إشراقة",
            "خفيف، ما ينسد، مناسب لكل أنواع البشرة",
            "ما يحتاج شطف — يمتص بالليل",
        ],
        "ingredients_ar": [
            {"name": "كولاجين بحري", "role": "بناء وتجديد طبقات البشرة", "country": "JP"},
            {"name": "حمض الهيالورونيك", "role": "ترطيب يدوم 8 ساعات"},
            {"name": "نياسيناميد", "role": "توحيد لون البشرة"},
        ],
        "usage_ar": "بعد التونر، ضعي طبقة خفيفة قبل النوم. اشطفي بالماء الفاتر صباحاً. 3 مرات بالأسبوع.",
        "who_is_for_ar": "البشرة المتعبة، الجافة، أو اللي بدت تظهر فيها علامات تعب.",
        "who_is_not_for_ar": "اللي عندهن حساسية من المنتجات البحرية.",
        "variants": [
            {"sku": "MAS-1", "bundle_size": 1, "label_ar": "1 قطعة", "price_kwd": "19.000"},
            {
                "sku": "MAS-2",
                "bundle_size": 2,
                "label_ar": "2 قطعة",
                "price_kwd": "29.000",
                "compare_at_price_kwd": "38.000",
            },
            {
                "sku": "MAS-3",
                "bundle_size": 3,
                "label_ar": "3 قطع",
                "price_kwd": "39.000",
                "compare_at_price_kwd": "57.000",
            },
            {
                "sku": "UPS-9-MAS",
                "bundle_size": 1,
                "label_ar": "ماسك الكولاجين (عرض حصري)",
                "price_kwd": "9.000",
                "compare_at_price_kwd": "19.000",
                "is_upsell_offer": True,
            },
        ],
    },
]


async def seed_catalog(session: AsyncSession) -> tuple[int, int]:
    """Idempotently insert the 3 products + their variants.

    Returns (products_added, variants_added).
    """
    products_added = 0
    variants_added = 0

    existing_slugs = set((await session.scalars(select(Product.slug))).all())
    existing_skus = set((await session.scalars(select(ProductVariant.sku))).all())

    for spec in PRODUCTS:
        slug = spec["slug"]
        if slug not in existing_slugs:
            product = Product(
                slug=slug,
                sku_prefix=spec["sku_prefix"],
                title_ar=spec["title_ar"],
                subtitle_ar=spec.get("subtitle_ar"),
                short_description_ar=spec.get("short_description_ar"),
                origin_country=spec.get("origin_country"),
                order=spec.get("order", 0),
                ingredients_ar=spec.get("ingredients_ar", []),
                benefits_ar=spec.get("benefits_ar", []),
                usage_ar=spec.get("usage_ar"),
                who_is_for_ar=spec.get("who_is_for_ar"),
                who_is_not_for_ar=spec.get("who_is_not_for_ar"),
                is_active=True,
            )
            session.add(product)
            await session.flush()
            products_added += 1
        else:
            existing_product = await session.scalar(select(Product).where(Product.slug == slug))
            if existing_product is None:
                continue
            product = existing_product

        for vspec in spec["variants"]:
            if vspec["sku"] in existing_skus:
                continue
            variant = ProductVariant(
                product_id=product.id,
                sku=vspec["sku"],
                bundle_size=vspec["bundle_size"],
                label_ar=vspec["label_ar"],
                price_kwd=Decimal(vspec["price_kwd"]),
                compare_at_price_kwd=(
                    Decimal(vspec["compare_at_price_kwd"])
                    if vspec.get("compare_at_price_kwd")
                    else None
                ),
                is_upsell_offer=bool(vspec.get("is_upsell_offer", False)),
                is_active=True,
            )
            session.add(variant)
            variants_added += 1
            existing_skus.add(vspec["sku"])

    await session.commit()
    return products_added, variants_added
