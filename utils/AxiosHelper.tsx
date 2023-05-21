const axios = require('axios');
import { useTokenInfo, MintingContractProps } from './ContractHelper';
import { useEffect, useState, useCallback  } from 'react';
import { useDebounce } from 'usehooks-ts';
import MintingContractJSON from '../artifacts/contracts/MitchMinter.sol/MitchMinter.json'
import { useContractRead } from 'wagmi'; 
import { constants } from './constants';

const ipfsGateways = constants.IPFS_GATEWAYS!.split(',');

async function getDataFromGateways(path: any) {
  for (const gateway of ipfsGateways ) {
    try {
      const response = await axios.get(`${gateway}/${path}`, { timeout: 5000 }); // Set a timeout to prevent hanging requests
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.error(`Error with gateway ${gateway}:`, error);
    }
  }
  throw new Error('All gateways failed');
}


export const useParseIpfsData = (tokenId: number, contractProps: MintingContractProps) => {
  const debouncedContractProps = useDebounce(contractProps, 500);
  const [ipfsData, setIpfsData] = useState({
    name: 'Loading...',
    description: 'Loading...',
  });
  const {data: tokenInfo, isSuccess: isTokenInfoSuccess, isError: isTokenInfoError, error: tokenInfoError } = useContractRead({
    address: `0x${debouncedContractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'getTokenInfo',
    args: [tokenId],
    chainId: debouncedContractProps.chainId
});
const retrieveIpfsData = useCallback(async () => {
  if (isTokenInfoSuccess && tokenInfo) {
    const [tokenPriceHex, tokenURI] = tokenInfo as [string, string]
      const tokenCID = tokenURI.replace("ipfs://", "");
      try {
        const response = await getDataFromGateways(tokenCID);
        const metaData = {
          name: response.data.name,
          description: response.data.description,
          image: response.data.image,
        };
        setIpfsData(metaData);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isTokenInfoSuccess]);
  
  useEffect(() => {
    retrieveIpfsData();
  }, [retrieveIpfsData]);
  
  return ipfsData;
};


export const useParseIpfsImage = (tokenId: number, contractProps: MintingContractProps) => {
  const debouncedContractProps = useDebounce(contractProps, 500);
  const [ipfsImage, setIpfsImage] = useState('');
  const {data: tokenInfo, isSuccess: isTokenInfoSuccess, isError: isTokenInfoError, error: tokenInfoError } = useContractRead({
    address: `0x${debouncedContractProps.address}`,
    abi: MintingContractJSON.abi,
    functionName: 'getTokenInfo',
    args: [tokenId],
    chainId: debouncedContractProps.chainId
});
    
   
    // const IPFS_GATEWAYS = process.env.IPFS_GATEWAYS!.split(',');


  const getImageFromGateways = async (cid: string, gateways: string[]) => {
    for (const gateway of gateways) {
      try {
        const response = await axios.get(`${gateway}/${cid}`, { responseType: 'arraybuffer' }, { timeout: 5000 });
        return response;
      } catch (error) {
        console.error(`Failed to fetch from ${gateway}`, error);
      }
    }
    throw new Error(`Failed to fetch data from all gateways for CID: ${cid}`);
  };

  const retrieveIpfsData = useCallback(async () => {
    if (isTokenInfoSuccess && tokenInfo) {
      const [tokenPriceHex, tokenURI] = tokenInfo as [string, string]
      const tokenCID = tokenURI.replace("ipfs://", "");
      try {
        const response = await getDataFromGateways(tokenCID);
        const imgHash = response.data.image.replace("ipfs://", "");
        const imageResponse = await getImageFromGateways(imgHash, ipfsGateways);
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        const imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
        setIpfsImage(imageSrc);
      } catch (error) {
        console.error(error);
      }
    }
  }, [ipfsGateways, isTokenInfoSuccess]);

  useEffect(() => {
    retrieveIpfsData();
  }, [retrieveIpfsData]);

  return ipfsImage;
};




