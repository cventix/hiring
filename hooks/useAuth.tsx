import { useEffect, useState } from 'react';
import { getAccount, IAccount } from '../services/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState<IAccount | null>(null);
  const getAccountHandler = async () => {
    try {
      const account = await getAccount();
      setAccount(account);
      setIsLoggedIn(true);
    } catch (error: any) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAccountHandler();
  }, []);

  return { isLoading, isLoggedIn, account };
};
