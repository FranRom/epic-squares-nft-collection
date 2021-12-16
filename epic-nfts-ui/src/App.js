import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = "fran4tic";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/squarenft-xkggkhplwi";
const TOTAL_MINT_COUNT = 1000;

const CONTRACT_ADDRESS = "0x84a2cD0F1CB26F8C1725Db49769Fba62e43a5301";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalNumberOfNFTs, setTotalNumberOfNFTs] = useState("");
  const [uiMessage, setUiMessage] = useState(null);
  const [mintMessage, setMintMessage] = useState(null);

  useEffect(() => {
    isRightChainId();
  }, [currentAccount]);

  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalNFTsMinted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    //  Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    //  User can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const isRightChainId = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return false;
    }

    return true;
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      //  Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        // This will essentially "capture" our event when our contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(`NFT mined from ${from} with ID: ${tokenId.toNumber()}`);
          setMintMessage(
            `NFT was sent to your wallet. It can take a while to show up on OpenSea. Link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        const canMint = await isRightChainId();

        if (canMint) {
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.makeAnEpicNFT();

          setUiMessage("Mining...please wait...");
          console.log("Mining...please wait.");
          await nftTxn.wait();

          setUiMessage(`tx: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
          );
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalNFTsMinted = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        const totalNumberOfNFTs =
          await connectedContract.getTotalNFTsMintedSoFar();

        setTotalNumberOfNFTs(totalNumberOfNFTs);
      } else {
        console.log("We are not able to get total NFTs minted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      Mint NFT
    </button>
  );

  const renderCollectionButton = () => (
    <a
      className="footer-text"
      href={OPENSEA_LINK}
      target="_blank"
      rel="noreferrer"
    >
      🌊 View Collection on OpenSea
    </a>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Epic Squares NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your Square NFT today.
          </p>
          <p className="text">
            {`Total NFTs Minted: ${totalNumberOfNFTs} of ${TOTAL_MINT_COUNT}`}
          </p>

          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintButton()}
          <div>{renderCollectionButton()}</div>

          <div>{uiMessage && <p className="green-text">{uiMessage}</p>}</div>
          <div>
            {mintMessage && <p className="green-text">{mintMessage}</p>}
          </div>
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with love by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
