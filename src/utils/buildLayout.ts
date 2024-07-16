import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js';
import { IdlCoder } from './idl';

const buildLayout = (fields: any) => {
  const structItems: any[] = [];
  fields.forEach((field: any) => {
    structItems.push(getBorsh(field.type, field.name));
  });
  return borsh.struct(structItems);
};
// const getBorsh = (type: any, name: string) => {
//   if (typeof type === 'object') {
//     if (type.vec) {
//       switch (type.vec) {
//         case 'pubkey':
//           return borsh.vec(borsh.publicKey(undefined), name);
//         case 'u8':
//           return borsh.vecU8(name);
//         case 'u16':
//           return borsh.vec(borsh.u16, name);
//         case 'u32':
//           return borsh.vec(borsh.u32, name);
//         case 'u64':
//           return borsh.vec(borsh.u64(undefined), name);
//         case 'bool':
//           return borsh.vec(borsh.bool(undefined), name);
//         case 'string':
//           return borsh.vec(borsh.str(undefined), name);
//       }
//     }
//   }
//   switch (type) {
//     case 'u8':
//       return borsh.u8(name);
//     case 'i8':
//       return borsh.i8(name);
//     case 'u16':
//       return borsh.u16(name);
//     case 'i16':
//       return borsh.i16(name);
//     case 'u32':
//       return borsh.u32(name);
//     case 'i32':
//       return borsh.i32(name);
//     case 'u64':
//       return borsh.u64(name);
//     case 'i64':
//       return borsh.i64(name);
//     case 'bool':
//       return borsh.bool(name);
//     case 'string':
//       return borsh.str(name);
//     case 'pubkey':
//       return borsh.publicKey(name);

//     // TODO: Add more types, especially structs
//   }
// };

const getBorsh = (type: any, name: string) => {
  return IdlCoder.fieldLayout({
    name,
    type,
  });
};
export default buildLayout;
