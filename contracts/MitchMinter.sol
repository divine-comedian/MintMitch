// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract MitchMinter is ERC1155Burnable, Ownable, ERC1155URIStorage {
    using SafeERC20 for IERC20;

    error NoTokenExists(uint256 tokenId);

    event Mint(address recipient, uint256 tokenId, uint256 amount, uint256 totalPrice);
    event MintBatch(address recipient, uint256 totalAmounts, uint256 finalPrice);

    IERC20 public paymentToken;
    string baseURI;
    uint256 defaultPrice;
    uint96 uniqueTokens = 0;

    mapping(uint256 => uint256) public tokenPrice;

    constructor(string memory _baseURI, IERC20 _paymentToken, uint256 _defaultPrice) ERC1155(_baseURI) {
        baseURI = _baseURI;
        paymentToken = _paymentToken;
        defaultPrice = _defaultPrice;
    }

    function mint(address account, uint256 id, uint256 amount) external {
        uint256 totalPrice;
        uint256 unitPrice;

        if (id > uniqueTokens) {
            revert NoTokenExists(id);
        }

        if (msg.sender != owner()) {
            tokenPrice[id] == 0 ? unitPrice = defaultPrice : unitPrice = tokenPrice[id];
            totalPrice = unitPrice * amount;
            paymentToken.safeTransferFrom(msg.sender, address(this), totalPrice);
            emit Mint(account, id, amount, totalPrice);
        }

        _mint(account, id, amount, '');
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts) external {
        uint256 finalPrice;
        uint256 totalAmount;
        if (msg.sender != owner()) {
            for (uint256 i = 0; i < ids.length;) {
                if (ids[i] > uniqueTokens) {
                    revert NoTokenExists(ids[i]);
                }
                uint256 unitPrice;
                tokenPrice[ids[i]] == 0 ? unitPrice = defaultPrice : unitPrice = tokenPrice[ids[i]];
                finalPrice += unitPrice * amounts[i];
                totalAmount += amounts[i];
                unchecked {
                    i++;
                }
            }
            paymentToken.safeTransferFrom(msg.sender, address(this), finalPrice);
            emit MintBatch(to, totalAmount, finalPrice);
        }
        _mintBatch(to, ids, amounts, '');
    }

    function uri(uint256 tokenId) public view virtual override (ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function setTokenPrice(uint256 tokenId, uint256 price) external onlyOwner {
        require(price != 0, 'cannot set price to 0');
        tokenPrice[tokenId] = price;
    }

    function setDefaultPrice(uint256 price) external onlyOwner {
        defaultPrice = price;
    }

    function resetTokenPrice(uint256 tokenId) external onlyOwner {
        tokenPrice[tokenId] = 0;
    }

    function changePaymentToken(address newPaymentToken) external onlyOwner {
        uint256 paymentTokenBalance = paymentToken.balanceOf(address(this));
        if (paymentTokenBalance > 0) {
            paymentToken.safeTransfer(owner(), paymentTokenBalance);
        }
        paymentToken = IERC20(newPaymentToken);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) external onlyOwner {
        _setURI(tokenId, tokenURI);
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        _setBaseURI(_baseURI);
    }

    function addToken(string memory tokenURI) external onlyOwner {
        uniqueTokens++;
        _setURI(uniqueTokens, tokenURI);
    }

    function withdraw() external onlyOwner {
        uint256 paymentTokenBalance = paymentToken.balanceOf(address(this));
        if (paymentTokenBalance > 0) {
            paymentToken.safeTransfer(owner(), paymentTokenBalance);
        }
    }

    function getTokenInfo(uint tokenId) external view returns (uint256 price, string memory tokenURI) {
            tokenPrice[tokenId] == 0 ? price = defaultPrice : price = tokenPrice[tokenId];
            tokenURI = uri(tokenId);
    }

    function getBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }

    function getUniqueTokens() external view returns (uint96) { 
        return uniqueTokens;
    }
}
