const axios = require('axios');
import { useTokenInfo } from './ContractHelper';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
 

export const useParseIpfsData = (tokenId: number) => {
        let [ipfsData, setIpfsData] = useState({})
        let tokenPriceHex: BigNumber | unknown = 0;
        let tokenURI: string = '';

        // get token info and URI
        const tokenInfo = useTokenInfo(tokenId);
        if (tokenInfo) {
          [tokenPriceHex, tokenURI] = tokenInfo as [BigNumber, string];
        }
          const tokenCID = tokenURI.replace("ipfs://", "")
          
       const retrieveIpfsData = async () => {
         try {
             axios({
                 method: 'get',
                 baseURL: `${process.env.IPFS_GATEWAY}`,
                 url: `${tokenCID}`
                 
             }).then( function (response: any) {
                let metaData = {
                  name: response.data.name,
                  description: response.data.description,
                  image: response.data.image
                }
                 setIpfsData(metaData)
             })
          } catch (error) {
            console.error(error);
          }
        };
        useEffect( () => {
      
           retrieveIpfsData();
      
        }, []);
        return ipfsData;
      };

      export const useParseIpfsImage = (tokenId: number) => {
        let [ipfsImage, setIpfsImage] = useState('')
        let tokenPriceHex: BigNumber | unknown = 0;
        let tokenURI: string = '';

        // get token info and URI
        const tokenInfo = useTokenInfo(tokenId);
        if (tokenInfo) {
          [tokenPriceHex, tokenURI] = tokenInfo as [BigNumber, string];
        }
          const tokenCID = tokenURI.replace("ipfs://", "")
          
       const retrieveIpfsData = async () => {
         try {
             axios({
                 method: 'get',
                 baseURL: `${process.env.IPFS_GATEWAY}`,
                 url: `${tokenCID}`
                 
             }).then( function (response: any) {
                const imgHash = (response.data.image).replace("ipfs://", "")
                try {
                  axios({
                    method: 'get',
                    baseURL: `${process.env.IPFS_GATEWAY}`,
                    url: `${imgHash}`,
                    responseType: 'arraybuffer'
                    
                  }).then( function(response: any) {
                    const imageBuffer = Buffer.from(response.data, 'binary')
                    const imageSrc = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
                    
                    setIpfsImage(imageSrc);
                   
                  }) 
                } catch (error) {
                  console.error(error);
                }
             })
          } catch (error) {
            console.error(error);
          }
        };
        useEffect( () => {
      
           retrieveIpfsData();
      
        }, []);
        return ipfsImage;
      };


