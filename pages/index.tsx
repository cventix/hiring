import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const { replace } = useRouter();
  useEffect(() => {
    replace('/dashboard');
  }, []);

  return null;
};

export default Index;
