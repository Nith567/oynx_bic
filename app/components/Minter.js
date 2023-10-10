import { useState } from 'react';
import { ethers } from "ethers";
import { 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'
import abi from "../utils/abi.json"
import { BiconomySmartAccount, BiconomySmartAccountV2 } from "@biconomy/account"
import { useRouter } from 'next/router';

const AddressB = "0xA985B5B840De07B2180bc62a5bB386a4819B3f13"
const Minter = ({ smartAccount, address, provider,cid }) => {
  const [minted, setMinted] = useState(false)

  const handleMint = async () => {
    const contract = new ethers.Contract(
      AddressB,
      abi,
      provider,
    )
    try {
      const insertTx = await contract.populateTransaction.insertVal(cid);
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

  return (
    <>
      {address && <button onClick={handleMint}  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2">Add to TableLand</button>}
      <>
        {minted && <div>successfully Added, wait for confirmation</div>}
      </>
    </>
  )
}

export default Minter;
