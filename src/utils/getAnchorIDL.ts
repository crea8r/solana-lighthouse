import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { decodeIdlAccount } from './idlType';
import { inflate } from 'pako';
import sha256 from 'fast-sha256';

// const base = (await PublicKey.findProgramAddress([], programId))[0];
// PublicKey.createWithSeed(base, 'anchor:idl', programId);

const getAnchorIDL = async (connection: Connection, programId: string) => {
  const pg = new PublicKey(programId);
  const base = PublicKey.findProgramAddressSync([], pg)[0];
  const buffer = Buffer.concat([
    base.toBuffer(),
    Buffer.from('anchor:idl'),
    pg.toBuffer(),
  ]);
  const idlPubK = new PublicKey(sha256(buffer));
  console.log('idlPubK: ', idlPubK.toBase58());
  const accountInfo = await connection.getAccountInfo(idlPubK);
  if (!accountInfo) {
    console.log(idlPubK.toBase58(), ': IDL not found');
    throw new Error(idlPubK.toBase58() + ': IDL not found');
  }
  // console.log('idl: ', idlPubK.toBase58());
  // console.log('accountInfo: ', accountInfo);
  // console.log('accountInfo.data: ', accountInfo.data);
  // console.log(accountInfo.data.subarray(8));
  let idlAccount = decodeIdlAccount(accountInfo.data.subarray(8));
  const inflatedIdl = inflate(idlAccount.data);
  const str = new TextDecoder('utf-8').decode(inflatedIdl);
  return {
    address: idlPubK.toBase58(),
    ...accountInfo,
    data: JSON.parse(str),
  };
};
export default getAnchorIDL;
