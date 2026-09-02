import type Stripe from "stripe";

const OWNED_PRODUCT_IDS = new Set([
  "prod_UBq5XD865QrF4e",
  "prod_UwAkYNaooSKPFc",
  "prod_UsdZ2wQbECjvAz",
  "prod_UsdZkrdfusA5lA",
  "prod_UsdZwRHdYoaqz0",
  "prod_UCD8gdYfteS4WH",
  "prod_UCD81vmIYZvdLw",
  "prod_UCD8w27P7Hi3Oj",
]);

const OWNED_PRICE_IDS = new Set([
  "price_1TDSPLCwGoUDklReUFuepC1B",
  "price_1TwIP7CwGoUDklRe46yWBXPZ",
  "price_1U3kCuCwGoUDklRel1O7JYdq",
  "price_1TssJ1CwGoUDklRezd1Jqftu",
  "price_1TssJ0CwGoUDklRegxn0GSsZ",
  "price_1U3kCtCwGoUDklRebjB5KOUv",
  "price_1U3kCsCwGoUDklRebikikiEk",
  "price_1TssJ0CwGoUDklRePDdyKpmX",
  "price_1TDoi7CwGoUDklReYJ038AD4",
  "price_1TDoi6CwGoUDklRe4vHGpfvc",
  "price_1TDoi5CwGoUDklReombytqpf",
]);

const OWNED_PAYMENT_LINK_IDS = new Set(["plink_1TwIP7CwGoUDklRe5Y0faAyw"]);

export type StripeResourceLine = {
  price?:
    string | { id?: string; product?: string | { id?: string } | null } | null;
  pricing?: {
    price_details?: { price?: string | null; product?: string | null } | null;
  } | null;
};

export type StripeResourceCollection = {
  data?: StripeResourceLine[];
  has_more?: boolean;
};

function isOwnedLine(line: StripeResourceLine): boolean {
  const price = line.price;
  if (price) {
    if (typeof price === "string") return OWNED_PRICE_IDS.has(price);
    const product = price.product;
    const productId = typeof product === "string" ? product : product?.id;
    return (
      OWNED_PRICE_IDS.has(price.id ?? "") ||
      OWNED_PRODUCT_IDS.has(productId ?? "")
    );
  }

  const priceDetails = line.pricing?.price_details;
  return Boolean(
    priceDetails &&
    (OWNED_PRICE_IDS.has(priceDetails.price ?? "") ||
      OWNED_PRODUCT_IDS.has(priceDetails.product ?? "")),
  );
}

export function hasCompleteOwnedStripeResources(
  collection?: StripeResourceCollection | null,
): boolean {
  if (!collection) return false;
  const lines = collection.data ?? [];
  return !collection.has_more && lines.length > 0 && lines.every(isOwnedLine);
}

export async function isOwnedInvisibleExitCheckoutSession(
  session: Stripe.Checkout.Session,
  listLineItems?: (sessionId: string) => Promise<StripeResourceCollection>,
): Promise<boolean> {
  const paymentLink =
    typeof session.payment_link === "string"
      ? session.payment_link
      : session.payment_link?.id;
  if (paymentLink) return OWNED_PAYMENT_LINK_IDS.has(paymentLink);

  const expandedLineItems = (
    session as Stripe.Checkout.Session & {
      line_items?: StripeResourceCollection;
    }
  ).line_items;
  if (expandedLineItems)
    return hasCompleteOwnedStripeResources(expandedLineItems);
  if (!listLineItems) return false;

  return hasCompleteOwnedStripeResources(await listLineItems(session.id));
}
