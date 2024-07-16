import { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import getAnchorIDL from './utils/getAnchorIDL';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import getNetwork from './utils/getNetwork';
import getAccountInfo from './utils/getAccountInfo';
import FileListing from './components/FileListing';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [programId, setProgramId] = useState(
    'Pha5A3BB4xKRZDs8ycvukFUagaKvk3AQBaH3J5qwAok'
  );
  const [network, setNetwork] = useState('devnet');
  const [programInfo, setProgramInfo] = useState<any>();
  const [idl, setIdl] = useState<any>();
  const [accounts, setAccounts] = useState<any>();
  // selected accounts
  const [files, setFiles] = useState<any>();
  const [fields, setFields] = useState<any>();
  const [selectedFileType, setSelectedFileType] = useState<any>();
  let connection: Connection;
  useEffect(() => {
    const loadProgram = async () => {
      connection = new Connection(getNetwork(network), 'confirmed');
      try {
        const info = await getAccountInfo(connection, programId);
        console.log('programId: ', programId);
        setProgramInfo(info);
        if (info?.executable) {
          const idl = await getAnchorIDL(connection, programId);
          console.log(idl.data);
          setIdl(idl);
          const tmp: any[] = [];
          const _accounts = idl.data.accounts;
          for (var i = 0; i < _accounts.length; i++) {
            const a = _accounts[i];
            const name = a.name;
            const discriminator = a.discriminator;
            const aType = idl.data.types.find((t: any) => t.name === name);
            const fields = aType.type.fields;
            const files = await connection.getProgramAccounts(
              new PublicKey(programId),
              {
                dataSlice: { offset: 0, length: 0 },
                filters: [
                  {
                    memcmp: {
                      offset: 0,
                      bytes: discriminator,
                    },
                  },
                ],
              }
            );
            tmp.push({
              name,
              discriminator,
              fields,
              files,
            });
          }
          setAccounts(tmp);
          console.log('account set');
        }
      } catch (e) {
        console.log('Invalid programId ', e);
        setAccounts([]);
        setIdl(null);
        setFields([]);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    loadProgram();
  }, [programId, network]);

  return (
    <div className='flex flex-col h-screen w-full px-2'>
      <div className='mt-2 p-2'>
        <div className='flex w-full justify-between items-center mb-2 user-select-none'>
          <div className='text-xl mb-2'>💡 Solana Program State Explain</div>
          <select
            className='border border-gray-300 rounded-lg p-2'
            value={network}
            onChange={(e: any) => {
              setNetwork(e.target.value);
            }}
          >
            <option>devnet</option>
            <option>mainnet</option>
          </select>
        </div>

        <input
          type='text'
          className='border border-gray-300 rounded-lg p-2 w-full'
          placeholder='Input your programId here'
          value={programId}
          onChange={(e) => {
            setProgramId(e.target.value);
          }}
        />
      </div>
      {isLoading ? (
        <div className='m-2'>Loading...</div>
      ) : (
        <div className='mt-2 mx-2'>
          {programInfo ? (
            <div className='p-2 border border-gray-300 rounded-lg'>
              <div className='flex justify-between items-center'>
                {programInfo.executable ? (
                  <div className='text-lg'>
                    <span className='mr-2'>Program Info </span>
                    <span>✅</span>
                  </div>
                ) : (
                  <div className='text-lg'>
                    <span className='mr-2'>Data Info </span>
                    <span>❌</span>
                  </div>
                )}
              </div>
              <div className='mt-2'>
                <div className='text-sm text-gray-500'>
                  programId: {programId}
                </div>
                <div className='text-sm text-gray-500'>
                  Owner: {programInfo.owner.toBase58()}
                </div>
                <div className='text-sm text-gray-500'>
                  Lamports: {programInfo.lamports}
                </div>
              </div>
            </div>
          ) : (
            <div className='p-2 border border-gray-300 rounded-lg'>
              No program info
            </div>
          )}
        </div>
      )}
      {programInfo && programInfo.executable && idl && accounts ? (
        <div className='mt-2 mx-2 p-2 border border-gray-300 rounded-lg'>
          <div className='mb-2'>IDL PDA: {idl.address}</div>
          <div className='m-2 border border-gray-500 rounded-lg p-2'>
            <div className='text-lg'>Summary:</div>
            <div className='mt-2'>
              Instructions({idl.data.instructions.length}):{' '}
              {idl.data.instructions.map((i: any) => i.name).join(', ')}
            </div>
            <div className='mt-2'>
              Account Types({accounts.length}):{' '}
              <div>
                {accounts.map((a: any) => {
                  const name = a.name;
                  const fields = a.fields;
                  return (
                    <div key={name} className='my-3'>
                      <span className='border-solid border-2 border-green-800 p-1 mr-2 rounded-md'>
                        {name}
                      </span>
                      :
                      {fields.map((f: any) => (
                        <span
                          key={f.name}
                          className='
                            border-solid border-2 border-green-800 p-1 mr-2 rounded-md
                          '
                        >
                          {f.name} (<span className='italic'>{f.type}</span>){' '}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <JsonView src={idl.data} collapsed={true} />
        </div>
      ) : (
        <div className='mt-2 mx-2'>No IDL found</div>
      )}
      {programInfo && programInfo.executable && accounts && idl ? (
        <div className='m-2 p-2 border border-gray-300 rounded-lg'>
          <div className='text-lg'>File Listing</div>
          <div className='mt-2'>
            {accounts.map((a: any) => {
              return (
                <span
                  className={`mr-2 cursor-pointer hover:bg-green-500 p-1 rounded-md ${
                    a.name === selectedFileType
                      ? 'bg-green-500'
                      : 'bg-green-800 '
                  }`}
                  onClick={() => {
                    setFiles(a.files);
                    setFields(a.fields);
                    setSelectedFileType(a.name);
                  }}
                  key={a.name}
                >
                  {a.name}({a.files.length}){' '}
                </span>
              );
            })}
          </div>
          {files && files.length > 0 ? (
            <div className='mt-2'>
              <FileListing
                files={files}
                fields={fields}
                programId={programId}
                network={network}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
