'use client'
import React, { useState,useEffect } from 'react';
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { Signer} from "ethers";
import { 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'
import axios from 'axios';
import dao from "../utils/abi.json"
import { toast } from "react-hot-toast";
import { BiconomySmartAccount, BiconomySmartAccountV2 } from "@biconomy/account"
    const AddressB ='0x8d68EC7C3B0D43174E181113643203A7287D1fA0'
function DaoApp({ smartAccount, address, provider }) {
  const [minted, setMinted] = useState(false)
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
      const [amount, setAmount] = useState(0);

      const [info, setInfo] = useState([]);
      const [account, setAccount] = useState('None');

  const [proposalId, setProposalId] = useState(0); 

//for the vote:
const [proposal, setProposal] = useState(0);
const [voteChoice, setVoteChoice] = useState(true);

const [values, setValues] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20Intro_80001_7542&format=objects&unwrap=false&extract=false');
      setValues(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

const contributeMint = async () => {
  const contract = new ethers.Contract(
    AddressB,
     dao,
    provider,
  )
  try {
    const insertTx = await contract.populateTransaction.contribute({ value: ethers.utils.parseEther('0.02') });
    console.log(insertTx.data);
    const tx1 = {
      to: AddressB,
      data: insertTx.data,
    };

    let userOp = await smartAccount.buildUserOp([tx1]);
    console.log({ userOp })
    const biconomyPaymaster = smartAccount.paymaster;
    let paymasterServiceData = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0'
      },
    };
    console.log("hai 2");
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
      userOp,
      paymasterServiceData
    );
    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    const userOpResponse = await smartAccount.sendUserOp(userOp);
    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    setMinted(true)
    console.log("txHash", receipt.transactionHash);
  } catch (err) {
    console.error(err);
    console.log(err)
  }
}


const proposeMint = async () => {
  const contract = new ethers.Contract(
    AddressB,
     dao,
    provider,
  )
  try {
    const insertTx = await contract.populateTransaction.createProposal(title, description, beneficiaryAddress, amount);
    console.log(insertTx.data);
    const tx1 = {
      to: AddressB,
      data: insertTx.data,
    };
    let userOp = await smartAccount.buildUserOp([tx1]);
    console.log({ userOp })
    const biconomyPaymaster = smartAccount.paymaster;
    let paymasterServiceData = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0'
      },
    };
    console.log("hai 2");
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
      userOp,
      paymasterServiceData
    );
    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    const userOpResponse = await smartAccount.sendUserOp(userOp);
    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    setMinted(true)
    console.log("txHash", receipt.transactionHash);
  } catch (err) {
    console.error(err);
    console.log(err)
  }
}



const voteMint= async (proposalId, choosen) => {
  const contract = new ethers.Contract(
    AddressB,
     dao,
    provider,
  )
  try {
    const insertTx = await contract.populateTransaction.performVote(proposal, choosen)
    console.log(insertTx.data);
    const tx1 = {
      to: AddressB,
      data: insertTx.data,
    };
    let userOp = await smartAccount.buildUserOp([tx1]);
    console.log({ userOp })
    const biconomyPaymaster = smartAccount.paymaster;
    let paymasterServiceData = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0'
      },
    };
    console.log("hai 2");
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
      userOp,
      paymasterServiceData
    );
    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    const userOpResponse = await smartAccount.sendUserOp(userOp);
    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    setMinted(true)
    console.log("txHash", receipt.transactionHash);
  } catch (err) {
    console.error(err);
    console.log(err)
  }
}

const payBeneficiaryMint= async (proposalId) => {
  const contract = new ethers.Contract(
    AddressB,
     dao,
    provider,
  )
  try {
    const insertTx = await contract.populateTransaction.payBeneficiary(proposalId)
    console.log(insertTx.data);
    const tx1 = {
      to: AddressB,
      data: insertTx.data,
    };
    let userOp = await smartAccount.buildUserOp([tx1]);
    console.log({ userOp })
    const biconomyPaymaster = smartAccount.paymaster;
    let paymasterServiceData = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0'
      },
    };
    console.log("hai 2");
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
      userOp,
      paymasterServiceData
    );
    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    const userOpResponse = await smartAccount.sendUserOp(userOp);
    console.log("userOpHash", userOpResponse);
    const { receipt } = await userOpResponse.wait(1);
    setMinted(true)
    console.log("txHash", receipt.transactionHash);
  } catch (err) {
    console.error(err);
    console.log(err)
  }
}
 const handlePayBeneficiarymint = () => {
    const { contract } = state;
    // Call the payBeneficiary function with the proposalId
    if (proposalId) {
      payBeneficiaryMint(proposalId);
      // Optionally, you can reset the proposalId state to clear the input field
      setProposalId('');
    }
  };

  const fetchPropMint= async()=> {
    const contract = new ethers.Contract(
      AddressB,
       dao,
      provider,
    )
    try {
      const insertTx = await contract.populateTransaction.getProposals()
      console.log(insertTx.data);
      const tx1 = {
        to: AddressB,
        data: insertTx.data,
      };
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp })
      const biconomyPaymaster = smartAccount.paymaster;
      let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
      };
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
        userOp,
        paymasterServiceData
      );
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      setMinted(true)
      console.log("txHash", receipt.transactionHash);
      if (insertTx.data) {
        // If proposals is not undefined, set it to the state
        setInfo(insertTx.data);

        console.log('successfully fetched'+info);
      } 
    } catch (err) {
      console.error(err);
      console.log(err)
    }
  }
  return (
    <>
      <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Values:</h1>
      <ul>
        {values.map((item) => (
          <li key={item.id} className="mb-2 bg-gray-100 p-2 rounded-md">{item.val}</li>
        ))}
      </ul>
    </div>
    <div className="bg-gray-100 p-6">
  
      <button
            className="p-2 bg-zinc-400 hover:bg-zinc-700 text-white font-semibold rounded text-center text-3xl m-3"
            onClick={contributeMint()}
          >
            Contribute
          </button>
      <div className="bg-slate-200 rounded p-4">
        <div className="mb-4">
          <label className="text-lg font-semibold">
            Title:
          </label>
          <input
            className="border p-2 w-full"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold">
            Description:
          </label>
          <input
            className="border p-2 w-full"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold">
            Beneficiary Address:
          </label>
          <input
            className="border p-2 w-full"
            type="text"
            value={beneficiaryAddress}
            onChange={(e) => setBeneficiaryAddress(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold">
            Amount:
          </label>
          <input
            className="border p-2 w-full"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={proposeMint()}
        >
          Create Proposal
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold mb-2">
          Vote on Proposal
        </h3>
        <div className="mb-2">
          <label className="text-lg font-semibold">
            Proposal ID:
          </label>
          <input
            className="border p-2 w-full"
            type="number"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold">
            Vote:
          </label>
          <select
            className="border p-2 w-full"
            value={voteChoice}
            onChange={(e) => setVoteChoice(e.target.value === 'true')}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          onClick={voteMint()}
        >
          Vote
        </button>
      </div>
  
      <div className="mt-4">
        <label className="text-lg font-semibold" htmlFor="proposalId">
          Proposal ID:
        </label>
        <input
          className="border p-2 w-full"
          type="number"
          id="proposalId"
          name="proposalId"
          placeholder="Enter Proposal ID"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2"
          onClick={handlePayBeneficiarymint}
        >
          Pay Beneficiary
        </button>
      </div>
    </div>
  
    <div className="bg-gray-200 p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Proposals
      </h2>
      <button className="bg-purple-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md "onClick={fetchPropMint}>Fetch Proposals</button>
      <div className="grid grid-cols-2 gap-1">
      <div className="overflow-x-auto flex justify-center">
  <div className="overflow-x-auto">
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Paid</th>
          <th className="px-4 py-2">Passed</th>
          <th className="px-4 py-2">Proposer</th>
          <th className="px-4 py-2">Upvotes</th>
          <th className="px-4 py-2">Downvotes</th>
          <th className="px-4 py-2">Beneficiary</th>
          <th className="px-4 py-2">Executor</th>
          <th className="px-4 py-2">Duration</th>
        </tr>
      </thead>
      <tbody>
        {info?.map((proposal) => (
          <tr key={proposal.id}>
            <td className="border px-4 py-2">{proposal?.id.toString()}</td>
            <td className="border px-4 py-2">{proposal.amount.toString()} wei</td>
            <td className="border px-4 py-2">{proposal.title.toString()}</td>
            <td className="border px-4 py-2">{proposal.description}</td>
            <td className="border px-4 py-2">{proposal.amount.toString()} wei</td>
            <td className="border px-4 py-2">{proposal.proposer.toString().substring(0, 9)}</td>
            <td className="border px-4 py-2">{proposal.upvotes.toString()}</td>
            <td className="border px-4 py-2">{proposal.downvotes.toString()}</td>
            <td className="border px-4 py-2">{proposal.beneficiary.toString()}</td>
            <td className="border px-4 py-2">{proposal.amount.toString()} wei</td>
            <td className="border px-4 py-2">{proposal.executor.toString()}</td>
            <td className="border px-4 py-2">{proposal.duration.toString()} seconds</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
</div>

  </div>
</>

  )
}

export default DaoApp;
