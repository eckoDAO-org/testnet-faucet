import Pact from "pact-lang-api";
import _ from "lodash";
import { NODE_URL } from "@/constants/chainweb";

export const parseRes = async function (raw: any) {
  const rawRes = await raw;
  const res = await rawRes;
  return res;
};

export const submitSignedTxn = async (cmd: {}): Promise<
  | {
      status: string;
      message: string;
      reqKey?: string;
      result?: { status: string; data: string; error: string; message: string };
    }
  | undefined
> => {
  try {
    const localRes = await Pact.fetch.local(cmd, NODE_URL);
    const parsedLocalRes = await parseRes(localRes);

    if (parsedLocalRes?.result?.status === "success") {
      const response = Pact.fetch.send(cmd, NODE_URL);
      return parsedLocalRes;
    } else {
      return { ...parsedLocalRes?.result?.error, hasError: true };
    }
  } catch (e) {
    console.log(e);
    throw Error("Error");
  }
};

export const getFaucetPrivateKey = (tokenSymbol: string): string => {
  switch (tokenSymbol) {
    case "KDX":
      if (!process.env.NEXT_PUBLIC_KDX_FAUCET_PRIVATE_KEY)
        throw new Error("Misisng token env arg");
      return process.env.NEXT_PUBLIC_KDX_FAUCET_PRIVATE_KEY;
    case "KDA":
      if (!process.env.NEXT_PUBLIC_KDA_FAUCET_PRIVATE_KEY)
        throw new Error("Misisng token env arg");
      return process.env.NEXT_PUBLIC_KDA_FAUCET_PRIVATE_KEY;
    case "ABC":
      if (!process.env.NEXT_PUBLIC_ABC_FAUCET_PRIVATE_KEY)
        throw new Error("Misisng token env arg");
      return process.env.NEXT_PUBLIC_ABC_FAUCET_PRIVATE_KEY;
    default:
      throw new Error("Missing token env arg");
  }
};
