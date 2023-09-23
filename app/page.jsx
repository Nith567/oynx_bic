'use client'
import { Database } from "@tableland/sdk";
import { Signer} from "ethers";
import React, { useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { Wallet, getDefaultProvider } from "ethers";
import { providers } from 'ethers';


function App() {
  const[cid,SetCid]=useState("");
  const [account, setAccount] = useState('None');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profilePic: "",
    nationalID: '',
    occupation: '',
    relevantDocument: '',
    interests: '',
    bio: '',
    gender: '',
    walletAddress: '',
  });
  const wallet = new Wallet('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
  const provider = getDefaultProvider("http://127.0.0.1:8545");
  const signer = wallet.connect(provider);
  const db = new Database({ signer });
  let tableName;
  const prefix= "cost";
  async function storeUserData(ethereumAddress, cid) {
    try {
      // if (!isTableCreated) {
      // const { meta: create } = await db
      // .prepare(`CREATE TABLE "${prefix}" (ethereumAddress text, cid text);`)
      // .run();
      // tableName = create.txn.name; // Assign the value to 'tableName'
      // isTableCreated = true; 
      // console.log(`Table "${tableName}" created.`);
      // }
      // const { name } = create.txn;   
      const { meta: insert } = await db
      .prepare(`INSERT INTO "cost_31337_46"  (ethereumAddress,cid ) VALUES (?, ?);`)
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
          type="file" // Use type="file" for file uploads
          name="profilePic"
          onChange={handleChange}
          accept="image/*" // Specify the accepted file types (images in this case)
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
    </div>
  );
}

export default App;
