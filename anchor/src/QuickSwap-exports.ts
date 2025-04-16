// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import QuickSwapIDL from '../target/idl/QuickSwap.json'
import type { QuickSwap } from '../target/types/QuickSwap'

// Re-export the generated IDL and type
export { QuickSwap, QuickSwapIDL }

// The programId is imported from the program IDL.
export const QUICK_SWAP_PROGRAM_ID = new PublicKey(QuickSwapIDL.address)

// This is a helper function to get the QuickSwap Anchor program.
export function getQuickSwapProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...QuickSwapIDL, address: address ? address.toBase58() : QuickSwapIDL.address } as QuickSwap, provider)
}

// This is a helper function to get the program ID for the QuickSwap program depending on the cluster.
export function getQuickSwapProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the QuickSwap program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return QUICK_SWAP_PROGRAM_ID
  }
}
