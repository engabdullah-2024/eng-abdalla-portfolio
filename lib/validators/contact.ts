import { z } from "zod";

// ---- constants to avoid "magic numbers"
const NAME_MAX = 120 as const;
const EMAIL_MAX = 254 as const;
const MESSAGE_MIN = 10 as const;
const MESSAGE_MAX = 5000 as const;

// Narrow tuple
export const serviceKinds = [
  "Web Design",
  "Web Development",
  "Graphic Design",
  "Web Hosting",
] as const;

export type ServiceKind = (typeof serviceKinds)[number];

// Schema
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(NAME_MAX, `Name must be ≤ ${NAME_MAX} characters`),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(EMAIL_MAX, `Email must be ≤ ${EMAIL_MAX} characters`),

  // ✅ FIX: use z.union with literals instead of z.enum(serviceKinds)
  service: z.union(
    serviceKinds.map((s) => z.literal(s)) as [z.ZodLiteral<ServiceKind>, ...z.ZodLiteral<ServiceKind>[]],
  ),

  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Message must be at least ${MESSAGE_MIN} characters`)
    .max(MESSAGE_MAX, `Message must be ≤ ${MESSAGE_MAX} characters`),

  // Honeypot
  website: z.string().trim().optional(),
});

// Inferred type
export type ContactInput = z.infer<typeof contactSchema>;
