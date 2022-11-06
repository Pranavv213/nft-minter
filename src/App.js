import React, { useState } from "react";
import "./App.css";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import { contractABI, contractAddress } from "./contract";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);
function App() {
  const { isAuthenticated, logout, user } = useMoralis();

  const doLogout = () => {
    if (isAuthenticated) {
      logout();
      window.location.reload();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to save image to IPFS
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();
      // Generate metadata and save to IPFS
      const metadata = {
        name,
        description,
        image: file1url,
      };
      const file2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file2.saveIPFS();
      const metadataurl = file2.ipfs();
      // Interact with smart contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods
        .mint(metadataurl)
        .send({ from: user.get("ethAddress") });
      // Get token id
      const tokenId = response.events.Transfer.returnValues.tokenId;
      // Display alert
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      );
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  return (
    <div className="App">
      Logged in
      <div>
        {isAuthenticated && (
          <button
            onClick={doLogout}
            className="bg-yellow-300 px-8 py-5 rounded-xl text-lg animate-pulse"
          >
            Logout
          </button>
        )}
      </div>
      {isAuthenticated && (
        <div className="flex w-screen h-screen items-center justify-center">
          <form onSubmit={onSubmit}>
            <div>
              <input
                type="text"
                className="border-[1px] p-2 text-lg border-black w-full"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                className="border-[1px] p-2 text-lg border-black w-full"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <input
                type="file"
                className="border-[1px] p-2 text-lg border-black"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl animate-pulse"
            >
              Mint now!
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
