import useFaucetCallback from '@/hooks/useFaucetCallback';
import { shortenAddress } from '@/utils/string-utils';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';

const style = {
    wrapper: `w-screen flex items-center justify-center mt-14`,
    content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
    formHeader: `px-2 flex items-center justify-between font-semibold text-xl mb-3`,
    generatePropLabel: `px-2`,
    generatePropContainer: `bg-[#20242A] mb-3 mt-1 rounded-2xl p-6 text-2xl  border border-[#20242A] hover:border-[#41444F] flex justify-between`,
    generatePropOutput: `bg-transparent placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
    currencySelector: `flex w-1/4`,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    currencySelectorTicker: `mx-2`,
    currencySelectorArrow: `text-lg`,
    confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169] w-full`,
  }

const GenKeyPair = () => {
    const router = useRouter()
    const {genKeyPair} = useFaucetCallback()
    const [generatedKeyPairs, setGeneratedKeypairs] = useState<{publicKey:string, secretKey:string, kAccount: string} | undefined>()

    const onSubmit = useCallback(async()=>{
      const result = await genKeyPair();
      if(!result){
        return;
      }
      setGeneratedKeypairs({...result, kAccount: `k:${result.publicKey}`});
    }, [genKeyPair])

    const onDownload = () => {
        if(generatedKeyPairs){
            const fileData = JSON.stringify(generatedKeyPairs);
            const blob = new Blob([fileData], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "keyPairs.txt";
            link.href = url;
            link.click();
        }
    }

    const onFaucet = () => {
        if(generatedKeyPairs){
            router.push({pathname:'/', query:{pubKey: generatedKeyPairs.publicKey}})
        }
        
    }

    const onReset = () => {
        setGeneratedKeypairs(undefined)
    }

    const onCopy = (e:any) => {
        toast.success("Copied Successfully")
    }

    const buttonRender = () => {
        if(!generatedKeyPairs){
            return (
          <button className={style.confirmButton} onClick={() => onSubmit()}>
            Go
          </button>
          )
        } else {
            return (
            <>
                <button className={style.confirmButton} onClick={() => onDownload()}>
                    Download
                </button>
                <button className={style.confirmButton} onClick={() => onFaucet()}>
                    Faucet
                </button>
                <button className={style.confirmButton} onClick={() => onReset()}>
                    Reset
                </button> 
            </>       
          )
        }
    }
  
    return (
        <div className={style.wrapper}>
        <div className={style.content}>
          <div className={style.formHeader}>
            <div>Generate Key Pair</div>
          </div>

          {generatedKeyPairs && (
            <>
            <div className={style.generatePropLabel}>k:account</div>
            <div className={style.generatePropContainer}>
              <div className='select-text'>{shortenAddress(generatedKeyPairs.kAccount)}</div>
              <CopyToClipboard
                onCopy={onCopy}
                options={{message: 'Whoa!'}}
                text={generatedKeyPairs.kAccount}>
                    <div className='cursor-pointer'>
                        <FiCopy />
                    </div>
             </CopyToClipboard>
            </div>
  
            <div className={style.generatePropLabel}>Public Key</div>
            <div className={style.generatePropContainer}>
            <div className='select-text'>{shortenAddress(generatedKeyPairs.publicKey)}</div>
            <CopyToClipboard
                onCopy={onCopy}
                options={{message: 'Whoa!'}}
                text={generatedKeyPairs.publicKey}>
                    <div className='cursor-pointer'>
                        <FiCopy />
                    </div>
             </CopyToClipboard>
            </div>
  
            <div className={style.generatePropLabel}>Private Key</div>
            <div className={style.generatePropContainer}>
            <div className='select-text'>***************************</div>
            <CopyToClipboard
                onCopy={onCopy}
                options={{message: 'Whoa!'}}
                text={generatedKeyPairs.secretKey}>
                    <div className='cursor-pointer'>
                        <FiCopy />
                    </div>
             </CopyToClipboard>
            </div>
            </>
          )}

          <div className='flex flex-col md:flex-row justify-between gap-8'>
            {buttonRender()}
          </div>
          
        </div>
      </div>
    )
}

export default GenKeyPair;