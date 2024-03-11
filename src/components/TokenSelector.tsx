import Image from "next/image";
import { Token } from "@/utils/types";
import { TOKENS } from "@/constants/tokens";

type Props = {
    onTokenSelected: (selectedToken: Token) => void;
    setOpenSelectorModal: (open: boolean) => void;
 }

const style = {
  wrapper: `text-white h-72 w-96 rounded-xl bg-[#191B1F] flex flex-col p-4 items-center justify-center`,
  title: `font-semibold text-xl mb-12`,
  currencySelector: `flex`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
}

const TokenSelector = ({onTokenSelected, setOpenSelectorModal}: Props) => {

    const handleSelectedToken = (selectedToken: Token) => {
        onTokenSelected(selectedToken)
        setOpenSelectorModal(false);
    }
    
  return (
    <div className={style.wrapper}>
      <div className={style.title}>Select Token</div>
      <div className="flex flex-col gap-8">
        {Object.keys(TOKENS).map(key => (
            <div key={key.toLowerCase()} className={style.currencySelector} onClick={()=> handleSelectedToken(TOKENS[key])}>
                <div className={style.currencySelectorContent}>
                    <div className={style.currencySelectorIcon}>
                    <Image src={TOKENS[key].logo} alt='kdx logo' height={30} width={30} />
                    </div>
                    <div className={style.currencySelectorTicker}>{TOKENS[key].symbol}</div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default TokenSelector