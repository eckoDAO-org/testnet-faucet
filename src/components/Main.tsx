import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import TokenSelector from "./TokenSelector";
import { TOKENS } from "@/constants/tokens";
import useFaucetCallback from "@/hooks/useFaucetCallback";
import { toast } from "react-toastify";
import { useTransactionContext } from "@/contexts/TransactionContext";

Modal.setAppElement("#__next");

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-3`,
  faucetPropLabel: `px-2`,
  faucetPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  faucetPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169] w-full disabled:opacity-50 disabled:cursor-default`,
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

const Main = () => {
  const [openSelectorModal, setOpenSelectorModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(TOKENS.KDX);
  const [formData, setFormData] = useState({ account: "", publicKey: "" });
  const router = useRouter();
  const { faucetToken } = useFaucetCallback();
  const { addTransaction } = useTransactionContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    const { account, publicKey } = formData;

    if (!account || !publicKey) {
      toast.error("Please, fill the form");
      return;
    }

    setLoading(true);

    const txn = await faucetToken(account, publicKey, selectedToken);

    if (txn.hasError) {
      toast.error(txn.message || "Error");
      return;
    }

    toast.success(`Transaction submitted: ${txn.reqKey}`);
    if (addTransaction) {
      addTransaction(
        selectedToken,
        account,
        selectedToken.faucetAmount,
        new Date(),
        txn.reqKey
      );
    }

    setLoading(false);
  }, [formData, selectedToken, faucetToken, addTransaction]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    if (name === "account" && e.target.value.substring(0, 2) === "k:") {
      setFormData((prevState) => ({
        ...prevState,
        ["publicKey"]: e.target.value.substring(2),
      }));
    }
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  useEffect(() => {
    const { pubKey } = router.query;
    if (pubKey) {
      setFormData({ account: `k:${pubKey}`, publicKey: pubKey as string });
    }
  }, [router.query]);

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Devnet Faucet</div>
          <div
            className={style.currencySelector}
            onClick={() => setOpenSelectorModal(true)}
          >
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <Image
                  src={selectedToken.logo}
                  alt="logo"
                  height={20}
                  width={20}
                />
              </div>
              <div className={style.currencySelectorTicker}>
                {selectedToken.symbol}
              </div>
              <AiOutlineDown className={style.currencySelectorArrow} />
            </div>
          </div>
        </div>

        <div className={style.faucetPropLabel}>Account</div>
        <div className={style.faucetPropContainer}>
          <input
            type="text"
            className={style.faucetPropInput}
            placeholder="k:account"
            value={formData.account}
            onChange={(e) => handleChange(e, "account")}
          />
        </div>

        <div className={style.faucetPropLabel}>Public Key</div>
        <div className={style.faucetPropContainer}>
          <input
            type="text"
            className={style.faucetPropInput}
            placeholder="Public Key"
            value={formData.publicKey}
            onChange={(e) => handleChange(e, "publicKey")}
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          className={style.confirmButton}
          disabled={loading}
        >
          Confirm
        </button>
      </div>

      <Modal
        isOpen={openSelectorModal}
        onRequestClose={() => setOpenSelectorModal(false)}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
      >
        <TokenSelector
          onTokenSelected={setSelectedToken}
          setOpenSelectorModal={setOpenSelectorModal}
        />
      </Modal>
    </div>
  );
};

export default Main;
