import { Token } from "@/utils/types";
import kdxLogo from "@/assets/kdx-crypto.svg";

export const GAS_PAYER_PUBLIC_KEY =
  "ae4a8b6f0d2758c2d8a1ccf82acb97fd64b5bfe365a3b593c545b86038caee45";
export const GAS_PAYER_ACCOUNT =
  "k:ae4a8b6f0d2758c2d8a1ccf82acb97fd64b5bfe365a3b593c545b86038caee45";

export const TOKENS: { [key: string]: Token } = {
  KDX: {
    name: "Kaddex",
    symbol: "KDX",
    module: "n_dd05101ff4df21179bfc038a912fc88c38d777a1.kdx",
    logo: kdxLogo,
    faucetAccount: "kdx-faucet",
    faucetAccountPublicKey:
      "ae4a8b6f0d2758c2d8a1ccf82acb97fd64b5bfe365a3b593c545b86038caee45",
    faucetAmount: 50.0,
  },
  ABC: {
    name: "ABC",
    symbol: "ABC",
    module: "n_3b878bdca18974c33dec88e791dd974107edc861.abc1",
    logo: kdxLogo,
    faucetAccount:
      "k:791cccb30c2d59489d3354022f2eb2d30d66db21e2ab745755da2912348c23d7",
    faucetAccountPublicKey:
      "791cccb30c2d59489d3354022f2eb2d30d66db21e2ab745755da2912348c23d7",
    faucetAmount: 50.0,
  },
};
