'use client';

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const account = useAccount()
  const {connectAsync, connectors} = useConnect()
  const {disconnectAsync} = useDisconnect()
  const [disabled, setDisabled] = useState<boolean>()
  const router = useRouter()

  const handleConnect = async () => {
    setDisabled(true)
    if (account?.address) { 
      await disconnectAsync() 
      return
    }
    try {
      const data = await connectAsync({connector: connectors[0]})
      const address = data.accounts[0]
      const fundingRes = await fetch(`/fund/${address}`, {method: "POST"})
      const transactionHash = await fundingRes.json()
      const url = `https://sepolia.basescan.org/tx/${transactionHash}`
      router.replace(url)
    } catch (e) {
      setDisabled(false)
      console.warn(e)
      return
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <button onClick={handleConnect} disabled={disabled} className="bg-[#0052FF] px-12 py-3 rounded-md font-bold disabled:opacity-60">Connect</button>
      <div className="opacity-80 text-center mt-4">You will be redirect after connection. <br /> Refresh the redirected-to page after if the transaction does not show.</div>
    </div>
  );
}
