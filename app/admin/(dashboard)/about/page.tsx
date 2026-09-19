import { getAboutPage } from "@/lib/data/site";
import AboutPageForm from "@/components/admin/forms/AboutPageForm";

export default async function AdminAboutPage() {
  const about = await getAboutPage();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        About Page
      </h1>
      <AboutPageForm initial={about} />
    </div>
  );
}
