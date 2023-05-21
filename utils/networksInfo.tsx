import { MintingContractProps } from "./ContractHelper";
import { constants } from "./constants";

export const goerliInfo: MintingContractProps = {
    address: constants.GOERLI_CONTRACT_ADDRESS ,
        chainId: 5,
        explorerLink: constants.GOERLI_ETHERSCAN_URL ,
        name: 'Goerli'
}

export const mumbaiInfo: MintingContractProps = {
    address: constants.MUMBAI_CONTRACT_ADDRESS ,
        chainId: 80001,
        explorerLink: constants.NEXT_PUBLIC_MUMBAI_URL ,
        name: 'Polygon Mumbai'
}

export const gnosisTestInfo: MintingContractProps = {
    address: constants.GNOSIS_TEST_CONTRACT_ADDRESS ,
        chainId: 100,
        explorerLink: constants.NEXT_PUBLIC_GNOSISSCAN_URL ,
        name: 'Gnosis Chain'
}
