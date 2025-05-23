import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { QuickSwap } from '../target/types/quick_swap'

import {
  createNft,
  findMasterEditionPda,
  findMetadataPda,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  mplTokenMetadata,
  // setAndVerifySizedCollectionItem,
  verifySizedCollectionItem,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createSignerFromKeypair,
  generateSigner,
  KeypairSigner,
  Pda,
  percentAmount,
  signerIdentity,
} from '@metaplex-foundation/umi'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from '@solana/spl-token'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { randomBytes } from 'crypto'

describe('QuickSwap', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const connection = provider.connection

  const program = anchor.workspace.QuickSwap as Program<QuickSwap>

  // const programId = program.programId

  const tokenProgram = TOKEN_PROGRAM_ID

  const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID

  const metadataProgram = MPL_TOKEN_METADATA_PROGRAM_ID

  const umi = createUmi(provider.connection)

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash()

    await connection.confirmTransaction({ signature, ...block })
    return signature
  }

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`,
    )
    return signature
  }

  const airdrop = async (connection: Connection, pubkey: PublicKey, sol = 1) => {
    const sig = await connection.requestAirdrop(pubkey, sol * LAMPORTS_PER_SOL)
    await connection.confirmTransaction(sig, 'confirmed')
    console.log(`Airdropped ${sol} SOL to ${pubkey.toBase58()}`)
    return sig
  }

  const seed = new BN(randomBytes(8))

  const fee = 5
  const sol_demand = new BN(100000)
  let sol_deposit
  let collection_requested

  // const [makerMintPk, takerMintPk, bidMintPk] = [makerMint, takerMint, bidMint].map((a)=> new PublicKey(a.publicKey.))
  //create nft creator wallet

  let makerCollection: KeypairSigner
  let makerMint: KeypairSigner
  let takerCollection: KeypairSigner
  let takerMint: KeypairSigner
  let bidCollection: KeypairSigner
  let bidMint: KeypairSigner
  let marketplacePdaAccount: PublicKey
  let listingPdaAccount: PublicKey
  let treasuryPdaAccount: PublicKey
  let bidPdaAccount: PublicKey
  let makerAtaA: PublicKey
  let makerAtaB: PublicKey
  let takerAtaA: PublicKey
  let takerAtaB: PublicKey
  let bidderAtaBid: PublicKey
  let bidVault: PublicKey
  let bidSolVault: PublicKey
  let makerVault: PublicKey
  let makerSolVault: PublicKey

  const [maker, taker, admin, bidder] = Array.from({ length: 4 }, () => Keypair.generate())

  const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(admin.secretKey))
  const creator = createSignerFromKeypair(umi, creatorWallet)

  //use umi and mpltokenmetadata program
  umi.use(signerIdentity(creator))
  umi.use(mplTokenMetadata())

  // const [makerAtaMakerNft, makerAtaTakerNft, takerAtaMakerNft, takerAtaTakerNft] = [maker, taker]
  //   .map((a) =>
  //     [makerMint, takerMint].map((b) =>
  //       getAssociatedTokenAddressSync(new anchor.web3.PublicKey(b.publicKey), a.publicKey, false, tokenProgram),
  //     ),
  //   )
  //   .flat()

  

  beforeAll(async () => {
    await airdrop(connection, new anchor.web3.PublicKey(creator.publicKey), 10).then(log)
  })

  it('Airdrop', async () => {
    // let lamports = await getMinimumBalanceForRentExemptMint(connection)
    const tx = new Transaction()

    tx.instructions = [
      ...[maker, taker, bidder, admin].map((account) =>
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: account.publicKey,
          lamports: 100 * LAMPORTS_PER_SOL,
        }),
      ),
    ]

    await provider.sendAndConfirm(tx).then(log)
  })
  it('Create Collection NFTs', async () => {
    makerCollection = generateSigner(umi)
    await createNft(umi, {
      mint: makerCollection,
      name: 'Unbothered Apes',
      symbol: 'UA',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collectionDetails: {
        __kind: 'V1',
        size: 100,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Maker Collection NFT: ${makerCollection.publicKey.toString()}`)

    takerCollection = generateSigner(umi)
    await createNft(umi, {
      mint: takerCollection,
      name: 'Different Shades of Jeff',
      symbol: 'DSoJ',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collectionDetails: {
        __kind: 'V1',
        size: 100,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Taker Collection NFT: ${takerCollection.publicKey.toString()}`)

    bidCollection = generateSigner(umi)
    await createNft(umi, {
      mint: bidCollection,
      name: 'Friendly Faces',
      symbol: 'FF',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collectionDetails: {
        __kind: 'V1',
        size: 100,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Bidder Collection NFT: ${bidCollection.publicKey.toString()}`)
  }, 1000000)

  it('Mint NFTs', async () => {
    makerMint = generateSigner(umi)
    await createNft(umi, {
      mint: makerMint,
      name: 'Unbothered Ape 100',
      symbol: 'UA',
      uri: 'https://devnet.irys.xyz/4uk3PNx1RhxU82AEqvbgauELHBtooM9Ctc2aLtnwaSzW',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: makerCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Maker NFT: ${makerMint.publicKey.toString()}`)
    takerMint = generateSigner(umi)
    await createNft(umi, {
      mint: takerMint,
      name: 'Angry Jeff',
      symbol: 'DSoJ10',
      uri: 'https://devnet.irys.xyz/4uk3PNx1RhxU82AEqvbgauELHBtooM9Ctc2aLtnwaSzW',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: takerCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Taker NFT: ${takerMint.publicKey.toString()}`)

    bidMint = generateSigner(umi)
    await createNft(umi, {
      mint: bidMint,
      name: 'Friendly Face 15',
      symbol: 'FF15',
      uri: 'https://devnet.irys.xyz/4uk3PNx1RhxU82AEqvbgauELHBtooM9Ctc2aLtnwaSzW',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: bidCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created Bidder NFT: ${bidMint.publicKey.toString()}`)
  }, 1000000)

  it('Verify NFT', async () => {
    const nftMetadata = findMetadataPda(umi, { mint: makerMint.publicKey })
    const collectionMetadata = findMetadataPda(umi, { mint: makerCollection.publicKey })
    const collectionMasterEdition = findMasterEditionPda(umi, { mint: makerCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: nftMetadata,
      collectionAuthority: creator,
      collectionMint: makerCollection.publicKey,
      collection: collectionMetadata,
      collectionMasterEditionAccount: collectionMasterEdition,
    }).sendAndConfirm(umi)
    console.log('Maker Nft Verified')

    const nftMetadataTaker = findMetadataPda(umi, { mint: takerMint.publicKey })
    const collectionMetadataTaker = findMetadataPda(umi, { mint: takerCollection.publicKey })
    const collectionMasterEditionTaker = findMasterEditionPda(umi, { mint: takerCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: nftMetadataTaker,
      collectionAuthority: creator,
      collectionMint: takerCollection.publicKey,
      collection: collectionMetadataTaker,
      collectionMasterEditionAccount: collectionMasterEditionTaker,
    }).sendAndConfirm(umi)
    console.log('Taker Nft Verified')

    const nftMetadataBid = findMetadataPda(umi, { mint: bidMint.publicKey })
    const collectionMetadataBid = findMetadataPda(umi, { mint: bidCollection.publicKey })
    const collectionMasterEditionBid = findMasterEditionPda(umi, { mint: bidCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: nftMetadataBid,
      collectionAuthority: creator,
      collectionMint: bidCollection.publicKey,
      collection: collectionMetadataBid,
      collectionMasterEditionAccount: collectionMasterEditionBid,
    }).sendAndConfirm(umi)
    console.log('Bid Nft Verified')
  }, 10000000)

  it('Transfer NFTs', async () => {
    const mint1 = new anchor.web3.PublicKey(makerMint.publicKey)
    const to1 = maker.publicKey
    const from_ata1 = await getOrCreateAssociatedTokenAccount(connection, admin, mint1, admin.publicKey)
    const to_ata1 = await getOrCreateAssociatedTokenAccount(connection, admin, mint1, to1)
    await transfer(connection, admin, from_ata1.address, to_ata1.address, admin.publicKey, 1)
      .then(log)
      .then(() => console.log('nft sent to maker'))

    const mint2 = new anchor.web3.PublicKey(takerMint.publicKey)
    const to2 = taker.publicKey
    const from_ata2 = await getOrCreateAssociatedTokenAccount(connection, admin, mint2, admin.publicKey)
    const to_ata2 = await getOrCreateAssociatedTokenAccount(connection, admin, mint2, to2)
    await transfer(connection, admin, from_ata2.address, to_ata2.address, admin.publicKey, 1)
      .then(log)
      .then(() => console.log('nft sent to taker'))

    const mint3 = new anchor.web3.PublicKey(bidMint.publicKey)
    const to3 = bidder.publicKey
    const from_ata3 = await getOrCreateAssociatedTokenAccount(connection, admin, mint3, admin.publicKey)
    const to_ata3 = await getOrCreateAssociatedTokenAccount(connection, admin, mint3, to3)
    await transfer(connection, admin, from_ata3.address, to_ata3.address, admin.publicKey, 1)
      .then(log)
      .then(() => console.log('nft sent to bidder'))
  })

  it('Initialize Marketplace', async () => {
    marketplacePdaAccount = PublicKey.findProgramAddressSync(
      [Buffer.from('quickswap'), admin.publicKey.toBuffer()],
      program.programId,
    )[0]

    treasuryPdaAccount = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury'), marketplacePdaAccount.toBuffer()],
      program.programId,
    )[0]

    await airdrop(connection, treasuryPdaAccount, 10).then(log)

    await program.methods
      .initialize(fee)
      .accountsPartial({
        admin: admin.publicKey,
        marketplace: marketplacePdaAccount,
        treasury: treasuryPdaAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc()
      .then(confirm)
      .then(log)
  })

  it('List NFT', async () => {
    makerAtaA = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(makerMint.publicKey),
      maker.publicKey,
      false,
      tokenProgram,
    )

    listingPdaAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from('listing'),
        maker.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, 'le', 8),
        marketplacePdaAccount.toBuffer(),
      ],
      program.programId,
    )[0]
    makerVault = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(makerMint.publicKey),
      listingPdaAccount,
      true,
      tokenProgram,
    )
    makerSolVault = PublicKey.findProgramAddressSync(
      [Buffer.from('solvault'), listingPdaAccount.toBuffer()],
      program.programId,
    )[0]

    await airdrop(connection, makerSolVault, 1)

    sol_deposit = new BN(0)
    collection_requested = takerCollection.publicKey.toString()

    const [makerMetadata] = findMetadataPda(umi, { mint: makerMint.publicKey })
    const [makerMasterEdition] = findMasterEditionPda(umi, { mint: makerMint.publicKey })

    await program.methods
      .listing(seed, sol_deposit, sol_demand, collection_requested)
      .accountsPartial({
        maker: maker.publicKey,
        admin: admin.publicKey,
        marketplace: marketplacePdaAccount,
        listing: listingPdaAccount,
        makerMint: makerMint.publicKey,
        makerAtaA: makerAtaA,
        vault: makerVault,
        makerCollection: makerCollection.publicKey,
        solVault: makerSolVault,
        metadata: makerMetadata,
        masterEdition: makerMasterEdition,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: tokenProgram,
        associatedTokenProgram: associatedTokenProgram,
        metadataProgram: metadataProgram,
      })
      .signers([maker])
      .rpc()
      .then(confirm)
      .then(log)
  })

  xit('Take Barter NFT Trade', async () => {
    try {
      ;[makerAtaA, makerAtaB, takerAtaA, takerAtaB] = [maker, taker]
        .map((a) =>
          [makerMint, takerMint].map((b) =>
            getAssociatedTokenAddressSync(new anchor.web3.PublicKey(b.publicKey), a.publicKey, false, tokenProgram),
          ),
        )
        .flat()

      const [takerMetadata] = findMetadataPda(umi, { mint: takerMint.publicKey })

      await program.methods
        .takeListing()
        .accountsPartial({
          maker: maker.publicKey,
          taker: taker.publicKey,
          admin: admin.publicKey,
          takerAtaA: takerAtaA,
          takerAtaB: takerAtaB,
          makerAtaB: makerAtaB,
          takerCollection: takerCollection.publicKey,
          marketplace: marketplacePdaAccount,
          listing: listingPdaAccount,
          makerMint: makerMint.publicKey,
          takerMint: takerMint.publicKey,
          treasury: treasuryPdaAccount,
          vault: makerVault,
          solVault: makerSolVault,
          metadata: takerMetadata,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: tokenProgram,
          associatedTokenProgram: associatedTokenProgram,
          metadataProgram: metadataProgram,
        })
        .signers([taker])
        .rpc()
        .then(confirm)
        .then(log)
    } catch (e) {
      console.error('Transaction failed:', e)

      // If it's a SendTransactionError from Anchor
      if (e.logs) {
        console.log('Transaction logs:', e.logs)
      }

      throw e
    }
  })

  xit('Delist', async () => {
    try {
      await program.methods
        .delist()
        .accountsPartial({
          maker: maker.publicKey,
          admin: admin.publicKey,
          makerAtaA: makerAtaA,
          marketplace: marketplacePdaAccount,
          listing: listingPdaAccount,
          makerMint: makerMint.publicKey,
          vault: makerVault,
          solVault: makerSolVault,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: tokenProgram,
          associatedTokenProgram: associatedTokenProgram,
        })
        .signers([maker])
        .rpc()
        .then(confirm)
        .then(log)
    } catch (e) {
      console.error('Transaction failed:', e)

      // If it's a SendTransactionError from Anchor
      if (e.logs) {
        console.log('Transaction logs:', e.logs)
      }

      throw e
    }
  })

  it('Make Bid', async () => {
    bidPdaAccount = PublicKey.findProgramAddressSync(
      [Buffer.from('bid'), bidder.publicKey.toBuffer(), listingPdaAccount.toBuffer()],
      program.programId,
    )[0]

    bidderAtaBid = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(bidMint.publicKey),
      bidder.publicKey,
      true,
      tokenProgram,
    )
    bidVault = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(bidMint.publicKey),
      bidPdaAccount,
      true,
      tokenProgram,
    )
    bidSolVault = PublicKey.findProgramAddressSync(
      [Buffer.from('solanavault'), bidPdaAccount.toBuffer()],
      program.programId,
    )[0]

    await airdrop(connection, bidSolVault, 1)

    const [bidMetadata] = findMetadataPda(umi, { mint: bidMint.publicKey })

    const [bidEdition] = findMasterEditionPda(umi, { mint: bidMint.publicKey })

    sol_deposit = new BN(1000)
    const sol_demanded = new BN(0)

    await program.methods
      .createBid(sol_demanded, sol_deposit)
      .accountsPartial({
        maker: maker.publicKey,
        bidder: bidder.publicKey,
        admin: admin.publicKey,
        bidderAtaB: bidderAtaBid,
        bidCollection: bidCollection.publicKey,
        marketplace: marketplacePdaAccount,
        listing: listingPdaAccount,
        bidVault: bidVault,
        bidSolVault: bidSolVault,
        bid: bidPdaAccount,
        bidMint: bidMint.publicKey,
        metadata: bidMetadata,
        masterEdition: bidEdition,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: tokenProgram,
        associatedTokenProgram: associatedTokenProgram,
        metadataProgram: metadataProgram,
      })
      .signers([bidder])
      .rpc()
      .then(confirm)
      .then(log)
  })

  xit('Cancel Bid', async () => {
    await program.methods
      .cancelBid()
      .accountsPartial({
        maker: maker.publicKey,
        bidder: bidder.publicKey,
        admin: admin.publicKey,
        bidderAta: bidderAtaBid,
        makerMint: makerMint.publicKey,
        marketplace: marketplacePdaAccount,
        listing: listingPdaAccount,
        bidVault: bidVault,
        bidSolVault: bidSolVault,
        bid: bidPdaAccount,
        bidMint: bidMint.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: tokenProgram,
        associatedTokenProgram: associatedTokenProgram,
      })
      .signers([bidder])
      .rpc()
      .then(confirm)
      .then(log)
  })


  it('Accept Bid', async () => {
     
     const makerAtaBid = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(bidMint.publicKey),
      maker.publicKey,
      false,
      tokenProgram,
    )
    const bidAtaMaker = getAssociatedTokenAddressSync(
      new anchor.web3.PublicKey(makerMint.publicKey),
      bidder.publicKey,
      false,
      tokenProgram,
    )
      
      await program.methods
        .acceptBid()
        .accountsPartial({
          maker: maker.publicKey,
          bidder: bidder.publicKey,
          admin: admin.publicKey,
          makerAtaB:  makerAtaBid,
          bidderAtaA:bidAtaMaker,
          marketplace: marketplacePdaAccount,
          listing: listingPdaAccount,
          bidVault: bidVault,
          bidSolVault: bidSolVault,
          vault:makerVault,
          solVault:makerSolVault,
          bid: bidPdaAccount,
          bidMint: bidMint.publicKey,
          makerMint:makerMint.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: tokenProgram,
          associatedTokenProgram: associatedTokenProgram,
        })
        .signers([maker])
        .rpc()
        .then(confirm)
        .then(log)
  })
})
