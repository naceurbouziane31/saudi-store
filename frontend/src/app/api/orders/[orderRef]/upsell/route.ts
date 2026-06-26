import { NextResponse } from "next/server";
import { z } from "zod";

import { backendIsConfigured, callBackend } from "@/lib/api/backend";
import { simulateAddUpsell } from "@/lib/orderSimulator";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  sku: z.string().regex(/^UPS-9-[A-Z]{3}$/),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderRef: string }> },
): Promise<NextResponse> {
  const { orderRef } = await params;
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
      { error: { code: "VALIDATION", message: "Invalid SKU" } },
      { status: 422 },
    );
  }

  if (backendIsConfigured()) {
    const resp = await callBackend(`/v1/orders/${encodeURIComponent(orderRef)}/upsell`, {
      method: "POST",
      body: parsed.data,
    }).catch(() => null);
    if (resp) {
      const data = await resp.json().catch(() => ({}));
      return NextResponse.json(data, { status: resp.status });
    }
  }

  const result = simulateAddUpsell(orderRef, parsed.data.sku);
  if ("error" in result) {
    const status = result.error === "NOT_FOUND" ? 404 : 409;
    return NextResponse.json(
      { error: { code: result.error, message: result.error } },
      { status },
    );
  }
  return NextResponse.json(
    {
      order_ref: result.order_ref,
      upsell_added: true,
      upsell_total_kwd: result.upsell_total_kwd,
      grand_total_kwd: result.grand_total_kwd,
    },
    { status: 200 },
  );
}
