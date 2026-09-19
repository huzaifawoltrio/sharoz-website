import Link from "next/link";
import ClearCartOnMount from "@/components/site/ClearCartOnMount";

export default async function ThankYouPage({
  searchParams,
}: PageProps<"/checkout/thank-you">) {
  const { order } = await searchParams;
  const orderId = typeof order === "string" ? order : null;

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <ClearCartOnMount />
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-800">
        Thank you for your inquiry
      </h1>
      <p className="mt-4 text-stone-600">
        We&apos;ve received your request and will be in touch shortly to arrange
        payment and shipping.
      </p>
      {orderId && (
        <p className="mt-4 text-xs text-stone-400">Reference: {orderId}</p>
      )}
      <Link
        href="/"
        className="mt-8 inline-block rounded bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
