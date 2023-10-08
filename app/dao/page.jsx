'use client'
import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { Signer} from "ethers";
import React, { useState,useEffect } from 'react';
// import abi from '../app/contract/Starter.json'
import abi from '../contract/Dao.json'
import lighthouse from '@lighthouse-web3/sdk';
import { toast } from "react-hot-toast";
import { Wallet, getDefaultProvider } from "ethers";
import { generate } from "@lighthouse-web3/kavach";
import { getAuthMessage, saveShards, shardKey, recoverKe,AuthMessage, getJWT} from "@lighthouse-web3/kavach";
const contractAbi=abi.abi;
const contractAddr='0x89626F743cF65FEDe76Ea0EaA2AA2cd28656F973'

function App() {
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
      });
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

    const createProposal = async () => {
        const { contract } = state;
        try {
          const tx = await contract.createProposal(title, description, beneficiaryAddress, amount);
          await tx.wait();
          console.log('Proposal created successfully');
        } catch (error) {
          console.error('Error creating proposal:', error);
        }
      };
    
  const performVote = async (proposalId, choosen) => {
    const { contract } = state;
    try {
      const tx = await contract?.performVote(proposal, choosen);
      await tx.wait();
      console.log('Vote submitted successfully');
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

 
  const payBeneficiary = async (proposalId) => {
    const { contract } = state;
    try {
      // Call the payBeneficiary function on your contract
      const tx = await contract?.payBeneficiary(proposalId);
      await tx.wait();
      console.log('Payment to beneficiary successful');
      // You may want to update your UI or state variables after a successful payment
    } catch (error) {
      console.error('Error paying beneficiary:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  const handlePayBeneficiary = () => {
    const { contract } = state;
    // Call the payBeneficiary function with the proposalId
    if (proposalId) {
      payBeneficiary(proposalId);
      // Optionally, you can reset the proposalId state to clear the input field
      setProposalId('');
    }
  };

  const contribute = async () => {
    const { contract } = state;
    try {

      // Call the contribute function on your contract
      const tx = await contract.contribute({ value: ethers.utils.parseEther('8') });
      await tx.wait();
      console.log('Contribution successful');
      // You may want to update your UI or state variables after a successful contribution
    } catch (error) {
      console.error('Error contributing:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleVote = async () => {
    // // Validate that proposalId is a valid number and voteChoice is a boolean
    if (!proposal || isNaN(proposal)) {
      alert('Please enter a valid proposal ID (a number).');
      return;
    }

    // Convert the voteChoice boolean to a string ('true' or 'false')
    const choosen = voteChoice.toString();

    // Call the performVote function with proposalId and choosen
    await performVote(proposalId, choosen);

    // Clear the form fields after voting
    setProposal('');
    setVoteChoice(true); // Reset to "Yes" as the default choice
  };


  const fetchProp = async () => {
    const { contract } = state;
    // try {
    //   // Call the contribute function on your contract
    //   const props = await contract?.getProposals();
    //   setInfo(props);
    //   console.log('list successful');
    //   // You may want to update your UI or state variables after a successful contribution
    // } catch (error) {
    //   console.error('Error contributing:', error);
    //   // Handle the error (e.g., show an error message to the user)
    // }
    try {
        // Call the getProposals function on your contract
        const proposals = await contract?.getProposals();
    
        if (proposals) {
          // If proposals is not undefined, set it to the state
          setInfo(proposals);

          console.log('List successful'+info);
        } else {
          // Handle the case where proposals is undefined
          console.error('No proposals found');
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
        // Handle the error (e.g., show an error message to the user)
      }
  };

    async function run() {
        const { contract } = state;
        try {
          await contract?.insertVal('mumbaitetn');
          console.log('finished insertval');
      } catch (error) {
        toast.error("Error in sending request which is: "+error)
          console.error('Error sending request:', error);
      } }
      
  return (
    <>
    <div className="bg-gray-100 p-6">
      <div className="mb-4">
        {account !== 'None' ? (
          <p className="text-lg font-semibold">
            Connected Account: {account}
          </p>
        ) : (
          <button
            className="p-2 bg-zinc-300 hover:bg-zinc-400 text-white font-semibold rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <button
            className="p-2 bg-zinc-400 hover:bg-zinc-700 text-white font-semibold rounded text-center text-3xl m-3"
            onClick={contribute}
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
          onClick={createProposal}
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
          onClick={handleVote}
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
          onClick={handlePayBeneficiary}
        >
          Pay Beneficiary
        </button>
      </div>
    </div>
  
    <div className="bg-gray-200 p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Proposals
      </h2>
      <button onClick={fetchProp}>Fetch Proposals</button>
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

      {/* <div className="grid grid-cols-2 gap-1">
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
        <td className="border px-4 py-2">{proposal.proposer.toString().substring(0,9)}</td>
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

    </div> */}
  </div>
</>

  )
}

export default App;