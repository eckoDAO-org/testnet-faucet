import { Token } from '@/utils/types';
import React, { createContext, useContext, useState } from 'react';

export interface TransactionContextType {
    status: 'idle' | 'loading' | 'succeeded' | 'rejected';
    errorMessage: string | undefined;
    transactions: {token:Token, to:string, amount:number, timestamp:Date, txId:string}[] | undefined;
    addTransaction?: (token:Token, to:string, amount:number, timestamp:Date, txId:string) => void;
    updateStatus?: (status: 'idle' | 'loading' | 'succeeded' | 'rejected') => void;
    updateErrorMessage?: (message: string) => void;
}

const initialState: TransactionContextType = {
    status: 'idle',
    errorMessage: undefined,
    transactions: undefined
}

export const TransactionContext = createContext<TransactionContextType>(initialState);

export const useTransactionContext = () => useContext(TransactionContext);

const TransactionProvider = ({ children }: {children:any}) => {
    const [status, setStatus] = useState(initialState.status);
    const [errorMessage, setErrorMessage] = useState(initialState.errorMessage);
    const [transactions, setTransactions] = useState(initialState.transactions);

    const updateStatus = (status: 'idle' | 'loading' | 'succeeded' | 'rejected') => {
        setStatus(status);
    };

    const updateErrorMessage = (message: string) => {
        setErrorMessage(message);
    };

    const addTransaction = (token:Token, to:string, amount:number, timestamp:Date, txId:string) => {
        if(transactions){
            setTransactions([...transactions, {token, to, amount, timestamp, txId}])
        }else {
            setTransactions([{token, to, amount, timestamp, txId}])
        }
        
    };
    return <TransactionContext.Provider value={{ status, errorMessage, transactions, addTransaction, updateStatus, updateErrorMessage }}>{children}</TransactionContext.Provider>; 
  };
  

export default TransactionProvider;