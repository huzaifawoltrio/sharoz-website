import { z } from "zod";
import { imageRefSchema } from "./shared";

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Enter a valid URL"),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  tagline: z.string().default(""),
  logo: imageRefSchema,
  favicon: imageRefSchema,
  contactEmail: z.string().email("Enter a valid email").or(z.literal("")),
  socials: z.array(socialLinkSchema).default([]),
  footerNote: z.string().default(""),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
