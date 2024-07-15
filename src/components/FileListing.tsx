import { useEffect, useState } from 'react';
import buildLayout from '../utils/buildLayout';
import { Connection, PublicKey } from '@solana/web3.js';
import shortenAddress from '../utils/shortenAddress';
import getNetwork from '../utils/getNetwork';

const FileListing = ({
  files,
  programId,
  network,
  fields,
}: {
  files: any[];
  programId: string;
  network: string;
  fields: any;
}) => {
  const perPage = 10;
  const pages = Math.ceil(files.length / perPage);
  const [currentPage, setCurrentPage] = useState(0);
  const startIndex = currentPage * perPage;
  const endIndex =
    files.length > startIndex + perPage ? startIndex + perPage : files.length;
  const [isLoading, setIsLoading] = useState(false);
  const layout = buildLayout(fields);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [selectedFileAddress, setSelectedFileAddress] = useState<any>();
  useEffect(() => {
    setCurrentPage(0);
    setSelectedFile(undefined);
    setSelectedFileAddress(undefined);
  }, [files]);
  return (
    <div className='w-full'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full flex'>
          <div className='lg:w-1/3 md:w-1/3 sm:w-full'>
            {files.slice(startIndex, endIndex).map((f: any, i: any) => {
              return (
                <div
                  className={`cursor-pointer hover:bg-green-800 p-1 rounded-md ${
                    selectedFileAddress === f.pubkey.toBase58()
                      ? 'bg-green-500'
                      : ''
                  }`}
                  key={f.pubkey.toBase58()}
                  onClick={async () => {
                    const pubkey = f.pubkey.toBase58();
                    const connection = new Connection(
                      getNetwork(network),
                      'confirmed'
                    );
                    setIsLoading(true);
                    const info = await connection.getAccountInfo(
                      new PublicKey(pubkey)
                    );
                    if (info) {
                      const data = layout.decode(info.data);
                      setSelectedFile({
                        pubkey: f.pubkey,
                        data,
                      });
                      setSelectedFileAddress(f.pubkey.toBase58());
                    }
                    setIsLoading(false);
                  }}
                >
                  {startIndex + i + 1}. {shortenAddress(f.pubkey.toBase58())}
                </div>
              );
            })}
          </div>
          {selectedFile ? (
            <div className='flex lg:w-2/3 md:w-2/3 sm:w-full p-2 border-2 rounded-md'>
              <div>
                <div>{selectedFile.pubkey.toBase58()}</div>
                {Object.keys(selectedFile.data).map((name) => {
                  const obj = selectedFile.data[name];
                  let str = '';
                  if (obj.toBase58) {
                    str = obj.toBase58();
                  } else if (obj.toNumber) {
                    try {
                      str = obj.toNumber();
                    } catch (e) {
                      str = obj.toString();
                    }
                  } else {
                    str = obj.toString();
                  }
                  return (
                    <div className='my-2' key={name}>
                      <span className='mr-2 bg-green-800 p-1 rounded-md'>
                        {name}
                      </span>
                      : <span>{str}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div className='flex gap-2 items-center justify-center select-none py-2'>
        <div
          className='cursor-pointer hover:text-blue-500'
          onClick={() => {
            if (currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          Prev
        </div>
        <div>
          {currentPage + 1} / {pages}
        </div>
        <div
          className='cursor-pointer hover:text-blue-500'
          onClick={() => {
            if (files.length > (currentPage + 1) * perPage) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default FileListing;
