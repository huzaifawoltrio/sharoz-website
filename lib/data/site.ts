import dbConnect from "@/lib/db";
import SiteSettings from "@/lib/models/SiteSettings";
import HomePage from "@/lib/models/HomePage";
import AboutPage from "@/lib/models/AboutPage";
import Category from "@/lib/models/Category";
import { getSingleton } from "@/lib/utils/singleton";
import { serialize } from "./serialize";
import type {
  CategoryLean,
  SiteSettingsLean,
  HomePageLean,
  AboutPageLean,
} from "@/lib/types";

export async function getSiteSettings() {
  await dbConnect();
  const doc = await getSingleton(SiteSettings);
  return serialize<SiteSettingsLean>(
    doc ?? {
      siteName: "Untitled Studio",
      tagline: "",
      logo: { url: "", publicId: "" },
      favicon: { url: "", publicId: "" },
      contactEmail: "",
      socials: [],
      footerNote: "",
    }
  );
}

export async function getHomePage() {
  await dbConnect();
  const doc = await getSingleton(HomePage);
  return serialize<HomePageLean>(
    doc ?? {
      hero: {
        left: { image: { url: "", publicId: "" }, label: "Paintings", href: "/paintings" },
        right: { image: { url: "", publicId: "" }, label: "Journeys", href: "/journeys" },
      },
      taglineHeading: [],
      taglineCta: { label: "Get in Touch", href: "/contact" },
      banner: { image: { url: "", publicId: "" }, heading: "", subheading: "", ctaLabel: "", ctaHref: "/" },
      tilesSection: { heading: "", tiles: [] },
    }
  );
}

export async function getAboutPage() {
  await dbConnect();
  const doc = await getSingleton(AboutPage);
  return serialize<AboutPageLean>(
    doc ?? {
      heading: "About",
      bodyHtml: "",
      portrait: { url: "", publicId: "" },
      gallery: [],
    }
  );
}

export async function getCategories(type?: "journey" | "painting") {
  await dbConnect();
  const query = type ? { type } : {};
  const docs = await Category.find(query).sort({ name: 1 }).lean();
  return serialize<CategoryLean[]>(docs);
}
