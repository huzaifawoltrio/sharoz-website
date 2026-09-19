/**
 * Seeds the database with the first admin account and generic,
 * admin-editable starter content so the site isn't empty on first run.
 *
 * Usage: npm run seed  (reads .env.local / .env via dotenv)
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../lib/models/Admin";
import SiteSettings from "../lib/models/SiteSettings";
import HomePage from "../lib/models/HomePage";
import AboutPage from "../lib/models/AboutPage";
import Category from "../lib/models/Category";
import Artwork from "../lib/models/Artwork";
import Post from "../lib/models/Post";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local first.");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  // --- Admin account -------------------------------------------------
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-me-now";
  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, name: "Admin" },
    { upsert: true }
  );
  console.log(`Admin account ready: ${email}`);

  // --- Site settings ---------------------------------------------------
  await SiteSettings.findOneAndUpdate(
    {},
    {
      siteName: "Alder & Ash Studio",
      tagline: "Paintings and stories from the road less traveled",
      contactEmail: email,
      socials: [
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "youtube", url: "https://youtube.com" },
      ],
      footerNote: "",
    },
    { upsert: true }
  );
  console.log("Site settings seeded.");

  // --- Categories -------------------------------------------------------
  const [landscapes, portraits, roadTrips] = await Promise.all([
    Category.findOneAndUpdate(
      { type: "painting", slug: "landscapes" },
      { type: "painting", name: "Landscapes", slug: "landscapes" },
      { upsert: true, returnDocument: 'after' }
    ),
    Category.findOneAndUpdate(
      { type: "painting", slug: "portraits" },
      { type: "painting", name: "Portraits", slug: "portraits" },
      { upsert: true, returnDocument: 'after' }
    ),
    Category.findOneAndUpdate(
      { type: "journey", slug: "road-trips" },
      { type: "journey", name: "Road Trips", slug: "road-trips" },
      { upsert: true, returnDocument: 'after' }
    ),
  ]);
  console.log("Categories seeded.");

  // --- Homepage ---------------------------------------------------------
  await HomePage.findOneAndUpdate(
    {},
    {
      hero: {
        left: { image: { url: "", publicId: "" }, label: "Paintings", href: "/paintings" },
        right: { image: { url: "", publicId: "" }, label: "Journeys", href: "/journeys" },
      },
      taglineHeading: [
        "A traveling painter, storyteller,",
        "and collector of quiet landscapes",
        "from the open road",
      ],
      taglineCta: { label: "Get in Touch", href: "/contact" },
      banner: {
        image: { url: "", publicId: "" },
        heading: "The Long Way Home",
        subheading: "Notes and paintings from years spent chasing the horizon.",
        ctaLabel: "Read the Journeys",
        ctaHref: "/journeys",
      },
      tilesSection: {
        heading: "Art. Adventure. Inspiration.",
        tiles: [
          { image: { url: "", publicId: "" }, label: "Fine Art", href: "/paintings" },
          { image: { url: "", publicId: "" }, label: "On the Road", href: "/journeys" },
          { image: { url: "", publicId: "" }, label: "From the Studio", href: "/blog" },
        ],
      },
    },
    { upsert: true }
  );
  console.log("Homepage seeded.");

  // --- About --------------------------------------------------------------
  await AboutPage.findOneAndUpdate(
    {},
    {
      heading: "About",
      bodyHtml:
        "<p>Welcome — this is placeholder biography copy seeded automatically. Edit this page from the admin dashboard to tell your own story: where you paint, what you paint, and what draws you back to the road.</p>",
      portrait: { url: "", publicId: "" },
      gallery: [],
    },
    { upsert: true }
  );
  console.log("About page seeded.");

  // --- Sample artwork -------------------------------------------------------
  await Artwork.findOneAndUpdate(
    { slug: "quiet-coastline" },
    {
      title: "Quiet Coastline",
      slug: "quiet-coastline",
      images: [],
      descriptionHtml:
        "<p>A sample artwork seeded automatically. Edit or delete it from the admin Artworks page.</p>",
      medium: "Oil on canvas",
      dimensions: "24 x 36 in",
      year: new Date().getFullYear(),
      categoryRefs: [landscapes._id],
      original: { forSale: true, price: 1200, sold: false },
      prints: [
        { size: "8x10", price: 45, stock: 25 },
        { size: "16x20", price: 95, stock: 10 },
      ],
      tags: ["seascape", "coast"],
      status: "published",
    },
    { upsert: true }
  );
  console.log("Sample artwork seeded.");
  void portraits;

  // --- Sample journey post --------------------------------------------------
  await Post.findOneAndUpdate(
    { type: "journey", slug: "first-mile" },
    {
      type: "journey",
      title: "The First Mile",
      slug: "first-mile",
      coverImage: { url: "", publicId: "" },
      excerpt: "Where every long journey begins — a sample post seeded automatically.",
      bodyHtml:
        "<p>This is a sample journey post. Edit or delete it from the admin Journeys page.</p>",
      categoryRef: roadTrips._id,
      status: "published",
      publishedAt: new Date(),
    },
    { upsert: true }
  );
  console.log("Sample journey post seeded.");

  console.log("\nSeed complete. Log in at /admin/login with:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
