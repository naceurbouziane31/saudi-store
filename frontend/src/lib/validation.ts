import { z } from "zod";

import { isValidKuwaitPhone } from "./phone";

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم لازم يكون حرفين على الأقل")
    .max(80, "الاسم طويل وايد")
    .regex(/^[^\d]+$/, "الاسم بدون أرقام"),
  phone: z
    .string()
    .trim()
    .refine(isValidKuwaitPhone, {
      message: "الرقم لازم يكون كويتي يبدي بـ 5 / 6 / 9 — مثال 50001234",
    }),
  honeypot: z.string().max(0).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartItemSchema = z.object({
  sku: z.string().regex(/^[A-Z]{3}-[1-3]$/),
  qty: z.number().int().min(1).max(10),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
