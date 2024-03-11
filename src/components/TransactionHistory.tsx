import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import { Token } from "@/utils/types";
import { useTransactionContext } from "@/contexts/TransactionContext";
import Link from "next/link";

const style = {
  wrapper: `h-full text-white select-none h-full w-screen flex-1 pt-14 flex items-end justify-end pb-12 overflow-hidden px-8`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
};

const TransactionHistory = () => {
  const { transactions } = useTransactionContext();

  return (
    <div className={style.wrapper}>
      <div>
        {transactions &&
          transactions?.map((transaction, index) => (
            <div className={style.txHistoryItem} key={index}>
              <div className={style.txDetails}>
                <Image
                  src={transaction.token.logo}
                  height={20}
                  width={15}
                  alt="token-logo"
                />
                {transaction.amount} Ξ sent to{" "}
                <span className={style.toAddress}>
                  {transaction.to.substring(0, 6)}...
                </span>
              </div>{" "}
              on{" "}
              <div className={style.txTimestamp}>
                {new Date(transaction.timestamp).toLocaleString("en-US", {
                  timeZone: "UTC",
                  hour12: true,
                  timeStyle: "short",
                  dateStyle: "long",
                })}
              </div>
              <div className={style.etherscanLink}>
                <Link
                  href={{
                    pathname: "/txstatus",
                    query: { reqKey: transaction.txId },
                  }}
                  className={style.etherscanLink}
                >
                  View Status
                  <FiArrowUpRight />
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
