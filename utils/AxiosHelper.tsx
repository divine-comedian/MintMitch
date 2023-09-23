const axios = require('axios');
import {  MintingContractProps } from './ContractHelper';
import MintingContractJSON from '../artifacts/contracts/MitchMinterSupplyUpgradeable.sol/MitchMinter.json'
import { constants } from './constants';
import { readContract } from '@wagmi/core';
import { nftData } from '../pages/store';

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

export const getIpfsData = async (tokenId: number, contractProps: MintingContractProps): Promise<nftData> => {
  try {
    const tokenInfo = await readContract({
      address: `0x${contractProps.address}`,
      abi: MintingContractJSON.abi,
      functionName: 'getTokenInfo',
      args: [tokenId],
      chainId: contractProps.chainId
    });
    const [tokenPrice , tokenURI] = tokenInfo as [bigint, string];
    const tokenCID = tokenURI.replace("ipfs://", "");
    const response = await getDataFromGateways(tokenCID);
    console.log('token Price is getipfs data', tokenPrice)
    const metaData = {
      name: response.data.name,
      description: response.data.description,
      image: response.data.image,
      tokenId: tokenId,
      tokenPrice: tokenPrice
    };

    return metaData;

  } catch (error) {
    console.error(error);
    throw error; // You can choose to rethrow the error or handle it here
  }
};



// export const useParseIpfsData = (tokenId: number, contractProps: MintingContractProps) => {
//   const debouncedContractProps = useDebounce(contractProps, 500);
//   const [ipfsData, setIpfsData] = useState({
//     name: 'Loading...',
//     description: 'Loading...',
//   });
//   const {data: tokenInfo, isSuccess: isTokenInfoSuccess, isError: isTokenInfoError, error: tokenInfoError } = useContractRead({
//     address: `0x${debouncedContractProps.address}`,
//     abi: MintingContractJSON.abi,
//     functionName: 'getTokenInfo',
//     args: [tokenId],
//     chainId: debouncedContractProps.chainId
// });
// const retrieveIpfsData = useCallback(async () => {
//   if (isTokenInfoSuccess && tokenInfo) {
//     const [, tokenURI] = tokenInfo as [string, string]
//       const tokenCID = tokenURI.replace("ipfs://", "");
//       try {
//         const response = await getDataFromGateways(tokenCID);
//         const metaData = {
//           name: response.data.name,
//           description: response.data.description,
//           image: response.data.image,
//         };
//         setIpfsData(metaData);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (isTokenInfoError) {
//       console.log(tokenInfoError)
//     }
//   }, [isTokenInfoSuccess, isTokenInfoError, tokenInfo]);
  
//   useEffect(() => {
//     retrieveIpfsData();
//   }, [retrieveIpfsData]);
  
//   return ipfsData;
// };

export const getIpfsImage = async (ipfsHash: string) => {
  const tokenCID = ipfsHash.replace("ipfs://", "");
  let imageResponse: any
  for (const gateway of ipfsGateways) {
    try {
      const response = await axios.get(`${gateway}/${tokenCID}`, { responseType: 'arraybuffer' }, { timeout: 5000 });
      imageResponse = await response;
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
      return imageSrc
    } catch (error) {
      console.error(`Failed to fetch from ${gateway}`, error);
    }
  }
  };


// export const useParseIpfsImage = (tokenId: number, contractProps: MintingContractProps) => {
//   const debouncedContractProps = useDebounce(contractProps, 200);
//   const [ipfsImage, setIpfsImage] = useState('');
//   const {data: tokenInfo, isSuccess: isTokenInfoSuccess, isError: isTokenInfoError, error: tokenInfoError } = useContractRead({
//     address: `0x${debouncedContractProps.address}`,
//     abi: MintingContractJSON.abi,
//     functionName: 'getTokenInfo',
//     args: [tokenId],
//     chainId: debouncedContractProps.chainId
// });
    
   
//     // const IPFS_GATEWAYS = process.env.IPFS_GATEWAYS!.split(',');


//   const getImageFromGateways = async (cid: string, gateways: string[]) => {
//     for (const gateway of gateways) {
//       try {
//         const response = await axios.get(`${gateway}/${cid}`, { responseType: 'arraybuffer' }, { timeout: 5000 });
//         return response;
//       } catch (error) {
//         console.error(`Failed to fetch from ${gateway}`, error);
//       }
//     }
//     throw new Error(`Failed to fetch data from all gateways for CID: ${cid}`);
//   };

//   const retrieveIpfsData = useCallback(async () => {
//     if (isTokenInfoSuccess && tokenInfo) {
//       const [, tokenURI] = tokenInfo as [string, string]
//       const tokenCID = tokenURI.replace("ipfs://", "");
//       try {
//         const response = await getDataFromGateways(tokenCID);
//         const imgHash = response.data.image.replace("ipfs://", "");
//         const imageResponse = await getImageFromGateways(imgHash, ipfsGateways);
//         const imageBuffer = Buffer.from(imageResponse.data, 'binary');
//         const imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
//         setIpfsImage(imageSrc);
//       } catch (error) {
//         console.error(error);
//       }
//     } else if (isTokenInfoError) {
//       console.log(tokenInfoError)
//     }
//   }, [ipfsGateways, isTokenInfoSuccess, isTokenInfoError]);

//   useEffect(() => {
//     retrieveIpfsData();
//   }, [retrieveIpfsData]);

//   return ipfsImage;
// };




