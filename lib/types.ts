/** Plain, JSON-serializable shapes used across Server → Client boundaries. */

export type ImageRef = { url: string; publicId: string };

export type CategoryLean = {
  _id: string;
  type: "journey" | "painting";
  name: string;
  slug: string;
};

export type PrintVariant = { size: string; price: number; stock: number };

export type ArtworkLean = {
  _id: string;
  title: string;
  slug: string;
  images: ImageRef[];
  descriptionHtml: string;
  medium: string;
  dimensions: string;
  year: number | null;
  categoryRefs: string[];
  original: { forSale: boolean; price: number; sold: boolean };
  prints: PrintVariant[];
  tags: string[];
  status: "draft" | "published";
};

export type PostType = "journey" | "blog";

export type PostLean = {
  _id: string;
  type: PostType;
  title: string;
  slug: string;
  coverImage: ImageRef;
  excerpt: string;
  bodyHtml: string;
  categoryRef: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
};

export type SocialLink = { platform: string; url: string };

export type SiteSettingsLean = {
  siteName: string;
  tagline: string;
  logo: ImageRef;
  favicon: ImageRef;
  contactEmail: string;
  socials: SocialLink[];
  footerNote: string;
  theme: {
    paletteId: string;
    fonts: { display: string; body: string };
  };
};

export type HomePageLean = {
  hero: {
    left: { image: ImageRef; label: string; href: string };
    right: { image: ImageRef; label: string; href: string };
  };
  taglineHeading: string[];
  taglineCta: { label: string; href: string };
  banner: {
    image: ImageRef;
    heading: string;
    subheading: string;
    ctaLabel: string;
    ctaHref: string;
  };
  tilesSection: {
    heading: string;
    tiles: { image: ImageRef; label: string; href: string }[];
  };
};

export type AboutPageLean = {
  heading: string;
  bodyHtml: string;
  portrait: ImageRef;
  gallery: ImageRef[];
};

export type OrderItemLean = {
  artworkId: string;
  artworkTitle: string;
  artworkSlug: string;
  image: string;
  variant: { type: "original" } | { type: "print"; size: string };
  price: number;
  quantity: number;
};

export type OrderNoteLean = { text: string; createdAt: string };

export type OrderLean = {
  _id: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
  };
  items: OrderItemLean[];
  status: "new" | "contacted" | "confirmed" | "fulfilled" | "cancelled";
  notes: OrderNoteLean[];
  createdAt: string;
  updatedAt: string;
};

export type ContactMessageLean = {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};
