import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { QuickSwap } from '../target/types/QuickSwap'

describe('QuickSwap', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.QuickSwap as Program<QuickSwap>

  const QuickSwapKeypair = Keypair.generate()

  it('Initialize QuickSwap', async () => {
    await program.methods
      .initialize()
      .accounts({
        QuickSwap: QuickSwapKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([QuickSwapKeypair])
      .rpc()

    const currentCount = await program.account.QuickSwap.fetch(QuickSwapKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment QuickSwap', async () => {
    await program.methods.increment().accounts({ QuickSwap: QuickSwapKeypair.publicKey }).rpc()

    const currentCount = await program.account.QuickSwap.fetch(QuickSwapKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment QuickSwap Again', async () => {
    await program.methods.increment().accounts({ QuickSwap: QuickSwapKeypair.publicKey }).rpc()

    const currentCount = await program.account.QuickSwap.fetch(QuickSwapKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement QuickSwap', async () => {
    await program.methods.decrement().accounts({ QuickSwap: QuickSwapKeypair.publicKey }).rpc()

    const currentCount = await program.account.QuickSwap.fetch(QuickSwapKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set QuickSwap value', async () => {
    await program.methods.set(42).accounts({ QuickSwap: QuickSwapKeypair.publicKey }).rpc()

    const currentCount = await program.account.QuickSwap.fetch(QuickSwapKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the QuickSwap account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        QuickSwap: QuickSwapKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.QuickSwap.fetchNullable(QuickSwapKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
