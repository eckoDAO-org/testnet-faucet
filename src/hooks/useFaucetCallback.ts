import { Token } from "@/utils/types";
import { useMemo } from "react";
import Pact from "pact-lang-api";
import { getFaucetPrivateKey, parseRes, submitSignedTxn } from "@/utils/kadenaHelper";
import { GAS_PAYER_ACCOUNT, GAS_PAYER_PUBLIC_KEY } from "@/constants/tokens";
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID, KADENA_TX_CONFIG, NODE_URL } from "@/constants/chainweb";
import _ from "lodash";

export default function useBridgeCallback(): {
  faucetToken:(account: string, publicKey: string, token: Token) => Promise<any | undefined>;
  genKeyPair:() => Promise<{publicKey: string, secretKey: string} | undefined>;
  pollRequest: (reqKeys: string) => Promise<any> | undefined;
} {
 
  return useMemo(() => {
    return {
        faucetToken: async (account: string, publicKey: string, token: Token) => {
            const pactCode = `(${token.module}.transfer-create (read-string 'from) (read-string 'to) (read-keyset 'toks) (read-decimal 'amount))`
            
            const capabilitiesWithKeypairs = [
              {keyPairs: {publicKey: GAS_PAYER_PUBLIC_KEY, secretKey: process.env.NEXT_PUBLIC_GAS_PAYER_PRIVATE_KEY as string}, cap: {name: "coin.GAS", args: []}},
              {keyPairs: {publicKey: token.faucetAccountPublicKey, secretKey:getFaucetPrivateKey(token.symbol)}, cap: {name: `${token.module}.TRANSFER`, args: [token.faucetAccount, account, token.faucetAmount]}}
            ]

            const envData = {
                from: token.faucetAccount,
                to: account,
                toks: {
                    keys: [publicKey],
                    pred: "keys-all"
                },
                amount: token.faucetAmount
            }

            const meta = Pact.lang.mkMeta(
              GAS_PAYER_ACCOUNT, 
              KADENA_CHAIN_ID,
              KADENA_TX_CONFIG.GAS_PRICE,
              KADENA_TX_CONFIG.GAS_LIMIT,
              Math.round(new Date().getTime() / 1000) - 10,
              KADENA_TX_CONFIG.TTL
          )
      
          const groupedBySigners = _.groupBy(capabilitiesWithKeypairs, (item)=>item.keyPairs.publicKey)
          const keyPairs = Object.keys(groupedBySigners).map(key=>({
            publicKey: groupedBySigners[key][0].keyPairs.publicKey, 
            secretKey: groupedBySigners[key][0].keyPairs.secretKey,
            clist:groupedBySigners[key].map(item => item.cap)}))

          const res = await submitSignedTxn({keyPairs, nonce:new Date().toISOString(), pactCode, envData, meta, networkId:KADENA_NETWORK_ID})
          
          return res;
        },
        genKeyPair: async () => {
            return Pact.crypto.genKeyPair();
        },
        pollRequest: async (reqKey: string) => {
          try {
            const result = await Pact.fetch.poll({requestKeys:[reqKey]}, NODE_URL)
          
            if(result[reqKey]){
              return result[reqKey].result
            }else {
              return undefined
            }
          } catch (error) {
            console.log("🚀 ~ file: useFaucetCallback.ts:66 ~ pollRequest: ~ error:", error)
            return undefined 
          }
        }
    };
  }, []);
}
