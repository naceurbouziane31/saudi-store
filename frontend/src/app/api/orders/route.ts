import { NextResponse } from "next/server";
import { z } from "zod";

import { backendIsConfigured, callBackend } from "@/lib/api/backend";
import { simulateCreateOrder } from "@/lib/orderSimulator";
import { isValidKuwaitPhone, normalizeKuwaitLocal } from "@/lib/phone";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().refine(isValidKuwaitPhone),
  }),
  items: z
    .array(
      z.object({
        sku: z.string().regex(/^([A-Z]{3}-[1-3]|UPS-9-[A-Z]{3})$/),
        qty: z.number().int().min(1).max(10),
      }),
    )
    .min(1),
  meta: z.record(z.any()).optional(),
  event_ids: z
    .object({
      meta: z.string().optional(),
      tiktok: z.string().optional(),
      snap: z.string().optional(),
    })
    .optional(),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: Request): Promise<NextResponse> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Body must be JSON." } },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "بيانات غير صحيحة", details: parsed.error.format() } },
      { status: 422 },
    );
  }
  const body = parsed.data;

  // Honeypot — silently accept without doing anything.
  if (body.honeypot && body.honeypot.length > 0) {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }

  const phoneLocal = normalizeKuwaitLocal(body.customer.phone);
  if (!phoneLocal) {
    return NextResponse.json(
      { error: { code: "PHONE_INVALID", message: "رقم جوال غير صحيح" } },
      { status: 422 },
    );
  }

  if (backendIsConfigured()) {
    const resp = await callBackend("/v1/orders", {
      method: "POST",
      body: {
        customer: { name: body.customer.name.trim(), phone: phoneLocal },
        items: body.items,
        meta: body.meta,
        event_ids: body.event_ids,
      },
      headers: {
        "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? "",
      },
    }).catch(() => null);
    if (resp && resp.ok) {
      const data = await resp.json();
      return NextResponse.json(data, { status: 200 });
    }
    if (resp && [422, 429].includes(resp.status)) {
      const data = await resp.json().catch(() => ({}));
      return NextResponse.json(data, { status: resp.status });
    }
    // Fall through to simulator if backend unreachable (dev convenience).
  }

  try {
    const order = simulateCreateOrder({
      customerName: body.customer.name.trim(),
      customerPhone: `+965${phoneLocal}`,
      itemSkus: body.items.map((i) => i.sku),
    });
    return NextResponse.json(order, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "تعذر إنشاء الطلب" } },
      { status: 500 },
    );
  }
}
