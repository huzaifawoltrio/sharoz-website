import { getSiteSettings } from "@/lib/data/site";
import SiteSettingsForm from "@/components/admin/forms/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-stone-800">
        Site Settings
      </h1>
      <SiteSettingsForm initial={settings} />
    </div>
  );
}
