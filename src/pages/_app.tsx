import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import TransactionProvider from '@/contexts/TransactionContext'
import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col`,
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <div className={style.wrapper}>
        <Header />
        <Component {...pageProps} />
      </div>
      <ToastContainer />
    </TransactionProvider>
  )
}
