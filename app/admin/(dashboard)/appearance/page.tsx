import { getSiteSettings } from "@/lib/data/site";
import ThemeForm from "@/components/admin/forms/ThemeForm";

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Appearance
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        Choose a color palette and fonts for the public site. This admin
        portal always keeps its own look, regardless of what you pick here.
      </p>
      <ThemeForm initial={settings.theme} />
    </div>
  );
}
