import useFaucetCallback from "@/hooks/useFaucetCallback";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

const style = {
  wrapper: `w-screen flex flex-col items-center justify-center mt-14 gap-8`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-3`,
  generatePropLabel: `px-2`,
  generatePropContainer: `bg-[#20242A] mb-3 mt-1 rounded-2xl p-6 text-xl  border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  generatePropOutput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-xl`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169] w-full disabled:opacity-50 disabled:cursor-default`,
  reqKeyInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-xl`,
};

const TransactionStatus = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ reqKey: "" });
  const { pollRequest } = useFaucetCallback();
  const [polling, setPolling] = useState<NodeJS.Timer>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string } | undefined>(
    undefined
  );

  useEffect(() => {
    const { reqKey } = router.query;
    if (reqKey) {
      setFormData({ reqKey: reqKey as string });
    }
  }, [router.query]);

  const handleSubmit = useCallback(async () => {
    if (formData.reqKey) {
      setLoading(true);
      const res = await pollRequest(formData.reqKey);
      if (res) {
        setResult(res);
        setLoading(false);
      } else {
        const intervalId = setInterval(async () => {
          const pollRes = await pollRequest(formData.reqKey);
          if (pollRes) {
            setResult(pollRes);
          }
        }, 5000);

        setPolling(intervalId);
      }
    }
  }, [formData.reqKey, pollRequest]);

  useEffect(() => {
    if (result && polling) {
      clearInterval(polling);
      setPolling(undefined);
      setLoading(false);
    }
  }, [result, polling]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Tx Status</div>
        </div>
        <div className={style.generatePropLabel}>Request Key</div>
        <div className={style.generatePropContainer}>
          {/* <div className="select-text">{formData.reqKey}</div> */}
          <input
            type="text"
            className={style.reqKeyInput}
            placeholder="Tx Id"
            value={formData.reqKey}
            onChange={(e) => handleChange(e, "reqKey")}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <button
            onClick={() => handleSubmit()}
            disabled={polling != undefined || loading}
            className={style.confirmButton}
          >
            {polling !== undefined || loading ? "Loading" : "Check"}
          </button>
        </div>
      </div>

      {(polling || loading) && (
        <div className={style.content}>
          <div className={style.formHeader}>
            <div>Tx Result</div>
          </div>
          <div className={style.generatePropLabel}>Loading...</div>
        </div>
      )}

      {result && !polling && !loading && (
        <div className={style.content}>
          <div className={style.formHeader}>
            <div>Tx Result</div>
          </div>
          <div className={style.generatePropLabel}>
            {result && result.status}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
