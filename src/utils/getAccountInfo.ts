import { Connection, PublicKey } from '@solana/web3.js';

const getAccountInfo = async (connection: Connection, programId: string) => {
  try {
    const p = new PublicKey(programId);
    const info = await connection.getAccountInfo(new PublicKey(programId));
    return info;
  } catch (e) {
    throw e;
  }
};

export default getAccountInfo;
