import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Fetch initial state once
    NetInfo.fetch().then(state => setIsConnected(state.isConnected));

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected };
}