const getNetwork = (network: string): string => {
  let rs = '';
  switch (network) {
    case 'devnet':
      rs = import.meta.env.VITE_APP_DEVNET || '';
      break;
    case 'mainnet':
      rs = import.meta.env.VITE_APP_MAINNET || '';
      break;
  }
  return rs;
};

export default getNetwork;
