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
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-foreground">
        Thank you for your inquiry
      </h1>
      <p className="mt-4 text-muted">
        We&apos;ve received your request and will be in touch shortly to arrange
        payment and shipping.
      </p>
      {orderId && (
        <p className="mt-4 text-xs text-muted">Reference: {orderId}</p>
      )}
      <Link
        href="/"
        className="mt-8 inline-block rounded bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90"
      >
        Back to Home
      </Link>
    </div>
  );
}
