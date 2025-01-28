import { NextResponse } from 'next/server';
import { Address, createWalletClient, Hex, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains';

export async function POST(req: Request, {params}: { params: {address: string} }) {
  try {
    const recipient = params.address as Address
    const privateKey = process.env.PRIVATE_KEY
    const account = privateKeyToAccount(privateKey as Hex)
    const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http()
      })

    // await new Promise(resolve => setTimeout(resolve, 2500));
    // const transactionHash = "0x"
    const transactionHash = await walletClient.sendTransaction({to: recipient, value: parseUnits('0.002', 18)})
    console.log({transactionHash})


    return NextResponse.json(transactionHash, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request', message: (error as Error).message }, { status: 400 });
  }
}
