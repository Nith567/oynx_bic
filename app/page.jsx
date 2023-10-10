'use client'
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { Signer} from "ethers";
import React, { useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { toast } from "react-hot-toast";
import { Wallet, getDefaultProvider } from "ethers";
import Minter from "./components/Minter"
import DaoApp from "./dao/page";
import abi from '../app/contract/Starter.json'
const contractAddr='0xa985B5B840De07B2180bc62a5bB386a4819B3f13'
const contractAbi=abi;
import {
  ParticleAuthModule,
  ParticleProvider,
} from "@biconomy/particle-auth";
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

import { useRouter } from 'next/navigation'
function App() {

  const [address, setAddress] = useState("");
const [loading, setLoading] = useState(false);
const [smartAccount, setSmartAccount] = useState(null);
const [pic, setPic] = useState('');
const [provider, setProvider] = useState(null);

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
    nationalID:{pic},
    occupation: '',
    interests: '',
    bio: '',
    gender: '',
    walletAddress:address,
  });
  const router = useRouter();
  const {signer}=state
  const isDaoRoute = router.pathname === '/dao';

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "61c0272f-5724-4499-9726-d93e894a9449",
    clientKey: "cefY2VH21TZ1qjSeeLGXOkqheu6X7OYFmTGu4j6W",
    appId: "68c5e604-cb3b-461a-9bd3-8092f91bc7ce",
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });
 
const bundler= new Bundler({
  bundlerUrl:'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44', 
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress:DEFAULT_ENTRYPOINT_ADDRESS
})

const paymaster= new BiconomyPaymaster({
  paymasterUrl:'https://paymaster.biconomy.io/api/v1/80001/gJ_tspU1N.be8b30df-8913-41f8-bc23-a8d193e055c7'
})


const connect = async () => {
  try {
    setLoading(true)
    const userInfo = await particle.auth.login();
    console.log("Logged in user:", userInfo);
    const particleProvider = new ParticleProvider(particle.auth);
    console.log({particleProvider})
    const web3Provider = new ethers.providers.Web3Provider(
      particleProvider,
      "any"
    );

  setProvider(web3Provider)

    let my_module = await ECDSAOwnershipValidationModule.create({
    signer: web3Provider.getSigner(),
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: bundler, 
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: my_module,
      activeValidationModule: my_module
    })
    setAddress( await biconomySmartAccount.getAccountAddress())
    setSmartAccount(biconomySmartAccount)
    setLoading(false)
  } catch (error) {
    console.error(error);
  }
};
const logOut = () => {
  setAddress("");
  particle.auth.logout()
}



  const handleChange = (e) => {
    const { name, value,files,type } = e.target;
    const newValue = type === 'file' ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

 
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.stringify(formData);
      const apiKey ="20ede80a.68b6d041441c4d1e896b6e877751dbd2"; 
      const response = await lighthouse.uploadText(jsonData, apiKey);
      console.log('JSON Data Status:', response.data);
      SetCid(response.data.Hash)
      const jsonLink = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
      console.log('Visit the JSON data at:', jsonLink);
    } catch (error) {
      console.error('Error uploading JSON data to Lighthouse:', error);
    }
  };

const progressCallback = (progressData) => {
  let percentageDone =
    100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  console.log(percentageDone);
};

const uploadFile = async(file) =>{
  const output = await lighthouse.upload(file, "20ede80a.68b6d041441c4d1e896b6e877751dbd2", false, null, progressCallback);
  console.log('File', output);
setPic(output.data.Hash)

    console.log(' https://gateway.lighthouse.storage/ipfs/' + output.data.Hash+ "so the pic is " +pic);
}
 


  return (

    <div className="App absolute">
      <div>
       <div className='m-5 flex justify-center items-center'>
      <h2 className="text-2xl font-bold mb-2 text-center">Connect and Mint your AA powered NFT now {pic}</h2>
      {!loading && !address && <button onClick={connect} className='text-md p-2 m-2 bg-purple-700 rounded-lg'>Connect to Based Web3</button>}
      </div>
      {loading && <p>Loading Smart Account...</p>}
      {address && <h2>Smart Account: {address}</h2>}
      {smartAccount && provider && <Minter smartAccount={smartAccount} cid={cid} address={address} provider={provider} />}
      {      isDaoRoute && smartAccount && provider && <DaoApp smartAccount={smartAccount} address={address} provider={provider} />}
</div>
        <div className="text-center flex justify-center items-center mt-1 mb-4">
        <input onChange={e=>uploadFile(e.target.files)} type="file"  className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:border-blue-600" />
</div>

<div className="flex items-center justify-center ">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-3 pt-6 pb-4 mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile Information</h1>
        <div className="mb-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input-field"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
            required
          />
        </div>

        <div className="mb-4">
        <input
          type="text"
          name="nationalID"
          value={pic}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Occupation"
            className="input-field"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Interests"
            className="input-field"
          />
        </div>

        <div className="mb-4">
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="input-field"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="input-field"
          />
        </div>

        <div className="mb-4">
        <input
          type="text"
          name="walletAddress"
          value={address}
          onChange={handleChange}
          placeholder="Wallet Address"
        
        />
        </div>

        <button className="w-full p-2 bg-red-500 text-white rounded-md" type="submit">
          Submit
        </button>
      </form>
    </div>
<div>
</div>
      <div className="bg-purple-600 hover:bg-blue-600 text-white font-semibold w-24 h-9 px-3 py-2 rounded-md " onClick={logOut}> Logout</div>

    </div>

  );
}

export default App;
