import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import * as simpleIcons from "simple-icons";

// One YAML file per project in src/content/projects/, with its images in a
// folder of the same name next to it. The file name is the URL slug.
const projects = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** Position on the home list, lowest first. */
      order: z.number().int(),
      year: z.number().int(),
      /** One word, shown as a chip. "live" gets the pulsing dot. */
      status: z.enum(["live", "beta", "building", "shelved"]),
      logo: image(),
      /** Tilt in degrees the logo leans to on hover. */
      angle: z.number().min(-12).max(12),
      /** The home row and the line under the page title: plain, lowercase, no slogans. */
      description: z.string().max(70),
      /** Where it runs, as people would say it: "windows", "web and android". */
      platforms: z.string(),
      license: z.string().optional(),
      summary: z.string(),
      /** The first link is the main action and renders as a button, so name the action: "try the demo". */
      links: z.array(z.object({ label: z.string(), href: z.url() })).min(1),
      /** Up to three real, checkable numbers. Leave it out rather than invent one. */
      numbers: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
      previews: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            title: z.string(),
            caption: z.string(),
            /** Phone-shaped shots render narrower in the strip. */
            mobile: z.boolean().default(false),
          }),
        )
        .min(1),
      features: z.array(z.object({ title: z.string(), body: z.string() })).min(2).max(4),
      story: z.array(z.string()).min(1).max(3),
      stack: z
        .array(
          z.object({
            name: z.string(),
            /** simple-icons export key, e.g. "siConvex". Omit when it has no logo. */
            icon: z
              .string()
              .refine((key) => key in simpleIcons, "not a simple-icons export; check the name or leave icon out")
              .optional(),
            why: z.string(),
          }),
        )
        .min(1),
      architecture: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    }),
});

export const collections = { projects };
