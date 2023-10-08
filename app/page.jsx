'use client'
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { Signer} from "ethers";
import React, { useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { toast } from "react-hot-toast";
import { Wallet, getDefaultProvider } from "ethers";
import { generate } from "@lighthouse-web3/kavach";
import { getAuthMessage, saveShards, shardKey, recoverKe,AuthMessage, getJWT} from "@lighthouse-web3/kavach";

   
console.log('-----------------VC Issuance---------------')
import abi from '../app/contract/Starter.json'
const contractAddr='0xa985B5B840De07B2180bc62a5bB386a4819B3f13'
const contractAbi=abi;
function App() {
  const[cid,SetCid]=useState("");
  const [account, setAccount] = useState('None');
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalID: '',
    occupation: '',
    relevantDocument: '',
    interests: '',
    bio: '',
    gender: '',
    walletAddress: '',
  });

  const {signer}=state

 
  async function storeUserData(ethereumAddress, cid) {
    try {
      const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new Wallet(privateKey);
      const provider = getDefaultProvider("http://127.0.0.1:8545");
      const signers = wallet.connect(provider);
      const db = new Database({signers} );
//       const prefix= "Filldb";
//       const { meta: create } = await db
//       .prepare(`CREATE TABLE "${prefix}" (ethereumAddress text primary key, cid text);`)
//       .run();
//       const {name} = create.txn // Assign the value to 'tableName'
// console.log(
//   "so inserted is "+name
// );
      // const { name } = create.txn;   
      const { meta: insert } = await db
      .prepare(`INSERT INTO "Filldb_31337_3"  (ethereumAddress,cid ) VALUES (?, ?);`)
      .bind(account, cid)
      .run();
    await insert.txn.wait();
      console.log(`Stored Ethereum address: ${ethereumAddress} with CID: ${cid} successfully.`);

 } 
    catch (error) {
      console.error("Error for  is:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value,files,type } = e.target;
    // setFormData({ ...formData, [name]: value });
    const newValue = type === 'file' ? files[0] : value;

    setFormData({ ...formData, [name]: newValue });
  };

 
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.stringify(formData);
      const apiKey ="f27b595e.d7d42cff4b1d4dcab8a5f891a35d986c"; 
      const response = await lighthouse.uploadText(jsonData, apiKey);
      console.log('JSON Data Status:', response.data);
      SetCid(response.data.Hash)
      const jsonLink = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
      console.log('Visit the JSON data at:', jsonLink);
    } catch (error) {
      console.error('Error uploading JSON data to Lighthouse:', error);
    }
  };

// const connectWallet = async () => {
//     try {
//         const { ethereum } = window;

//         if (ethereum) {
//             const accounts = await ethereum.request({
//                 method: 'eth_requestAccounts',
//             });
//             if (Array.isArray(accounts) && accounts.length > 0) {
//               window.ethereum.on('chainChanged', () => {
//                   window.location.reload();
//               });
//             }
//             window.ethereum.on('chainChanged', () => {
//                 window.location.reload();
//             });

//             window.ethereum.on('accountsChanged', () => {
//                 window.location.reload();
//             });

//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const address = await signer.getAddress(); // Wait for the address to be feteched
//             const contract = new ethers.Contract(contractAddr, contractAbi, signer);
//             setState( {provider, signer, contract} );
//             setAccount(accounts[0]); 
//         } 
//       }
//       else {
//             alert('Please install MetaMask');
//         }
//      catch (error) {
//         console.log("blast is " + error);
//     }
// };
const connectWallet = async () => {
  try {
      const { ethereum } = window;

      if (ethereum) {
          const accounts = await ethereum.request({
              method: 'eth_requestAccounts',
          });

          window.ethereum.on('chainChanged', () => {
              window.location.reload();
          });

          window.ethereum.on('accountsChanged', () => {
              window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const contract = new ethers.Contract(contractAddr, contractAbi, signer);
          setState( {provider, signer, contract} );
          setAccount(accounts[0]); 
      } else {
          alert('Please install MetaMask');
      }
  } catch (error) {
      console.log(error);
  }
};

const handleStoreUserData = async () => {
  try{ 
     await storeUserData(account, cid);
     console.log("successfully stored bitch");
  }
  catch(e){
    console.log(e.response)
  }
};


  const encryptionSignature = async() =>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return({
      signedMessage: signedMessage,
      publicKey: address
    });
  }


const uploadFileEncrypted = async(file) =>{

  const sig = await connectWallet();
  const response = await lighthouse.uploadEncrypted(
    file,
    "f27b595e.d7d42cff4b1d4dcab8a5f891a35d986c",
    sig.publicKey,
    sig.signedMessage,
    null,
    progressCallback
  );
   console.log(response.data);
   const {Hash}=response.data[0]
  /*
    output:
      data: [{
        Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
        Size: "318557",
        Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
      }]
    Note: Hash in response is CID.
  */
}


async function main() {



  // **cid key 
//   const knownKey =
//   "554f886019b74852ab679258eb3cddf72f12f84dd6a946f8afc4283e48cc9466";
//   const { isShardable, keyShards } = await shardKey(knownKey);
//   console.log(isShardable); // true
// console.log(keyShards.map(e=>e.key));
//   //recover keys from shards
//   const { masterKey } = await recoverKey(keyShards);
// console.log(masterKey,knownKey );
//   //check if the key recovered was recovered
//   console.log(masterKey === knownKey); //true


}


async function run() {
  const { contract } = state;
  try {
    await contract?.insertVal('mumbaitetn');
    console.log('finished insertval');
} catch (error) {
  toast.error("Error in sending request which is: "+error)
    console.error('Error sending request:', error);
}

      }

  return (
    <div className="App">
        <div className="text-center flex justify-center items-center mt-1 mb-4">
    <div>
      {account !== 'None' ? (
                <p>Connected Account: {account}</p>
            ) : (
                <button className="p-2 m-4 text-center bg-zinc-300" onClick={()=>connectWallet()}>Connect </button>
            )}
                </div>
</div>
<div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        
        <input
          type="text"
          name="nationalID"
          value={formData.nationalID}
          onChange={handleChange}
          placeholder="National ID"
        />

        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Occupation"
        />
        <input
          type="text"
          name="relevantDocument"
          value={formData.relevantDocument}
          onChange={handleChange}
          placeholder="Relevant Document"
        />
        <input
          type="text"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          placeholder="Interests"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender"
        />
        <input
          type="text"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={handleChange}
          placeholder="Wallet Address"
          required
        />
        <button type="submit">Submit</button>
      </form>
</div>
<div>
<button className="text-white p-5 m-4 bg-slate-600" onClick={handleStoreUserData}>submits</button>
</div>
<button className="text-white p-2 m-6 bg-cyan-600" onClick={()=>run()}>creates a smart contract table</button>
<button className="text-white p-2 m-6 bg-cyan-600" onClick={()=>main()}>SHARD</button>

 <input onChange={e=>uploadFileEncrypted(e.target.files)} type="file" />
    </div>

  );
}

export default App;
