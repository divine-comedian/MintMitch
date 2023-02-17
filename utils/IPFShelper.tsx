import { useTokenInfo } from './ContractHelper';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { create } from 'ipfs-http-client'

export const useParseIPFS = (tokenId: number) => {
  const [ipfsData, setIpfsData] = useState('')
  let tokenPriceHex: BigNumber | unknown = 0;
  let tokenURI: string = '';

  // get token info and URI
  const tokenInfo = useTokenInfo(tokenId);
  if (tokenInfo) {
    [tokenPriceHex, tokenURI] = tokenInfo as [BigNumber, string];
  }
    const tokenCID = tokenURI.replace("ipfs://", "")
  const ipfs = create({
    url: `${process.env.IPFS_GATEWAY}`
  });
  // console.log(process.env.IPFS_GATEWAY + tokenCID)
  const retrieveIpfsData = async (ipfsHash: string) => {
    try {
      const data = await ipfs.cat(ipfsHash);
      const dataJSON = JSON.parse(data.toString())
      //console.log("this is data", data)

      setIpfsData(data.toString());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect( () => {

     retrieveIpfsData(tokenCID);

  }, []);
  return ipfsData;
};
