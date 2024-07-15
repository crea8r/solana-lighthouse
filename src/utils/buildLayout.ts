import * as borsh from '@coral-xyz/borsh';

const buildLayout = (fields: any) => {
  const structItems: any[] = [];
  fields.forEach((field: any) => {
    structItems.push(getBorsh(field.type, field.name));
  });
  return borsh.struct(structItems);
};
const getBorsh = (type: string, name: string) => {
  switch (type) {
    case 'u8':
      return borsh.u8(name);
    case 'u16':
      return borsh.u16(name);
    case 'u32':
      return borsh.u32(name);
    case 'u64':
      return borsh.u64(name);
    case 'bool':
      return borsh.bool(name);
    case 'string':
      return borsh.str(name);
    case 'pubkey':
      return borsh.publicKey(name);
    // TODO: Add more types, especially structs
  }
};
export default buildLayout;
