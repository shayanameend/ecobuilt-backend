import { Tier } from "@prisma/client";

import { env } from "~/lib/env";

const TierConstraints = {
  FREE: {},
  PRO: {},
  ENTERPRISE: {},
};

const PriceIdToTierMap = {
  [env.STRIPE_PRO_PRICE_ID]: Tier.PRO,
  [env.STRIPE_ENTERPRISE_PRICE_ID]: Tier.ENTERPRISE,
};

const TierToPriceIdMap = {
  [Tier.PRO]: env.STRIPE_PRO_PRICE_ID,
  [Tier.ENTERPRISE]: env.STRIPE_ENTERPRISE_PRICE_ID,
};

export { TierConstraints, PriceIdToTierMap, TierToPriceIdMap };
