import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { QuickSwap } from '../target/types/quick_swap'

import {
  createNft,
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
  verifySizedCollectionItem,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createSignerFromKeypair,
  generateSigner,
  KeypairSigner,
  percentAmount,
  signerIdentity,
} from '@metaplex-foundation/umi'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { randomBytes } from 'crypto'

describe('QuickSwap', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const connection = provider.connection

  const program = anchor.workspace.QuickSwap as Program<QuickSwap>

  const programId = program.programId

  const tokenProgram = TOKEN_PROGRAM_ID

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

  // const [makerMintPk, takerMintPk, bidMintPk] = [makerMint, takerMint, bidMint].map((a)=> new PublicKey(a.publicKey.))
  //create nft creator wallet

  let makerCollection: KeypairSigner
  let makerMint: KeypairSigner
  let takerCollection: KeypairSigner
  let takerMint: KeypairSigner
  let bidCollection: KeypairSigner
  let bidMint: KeypairSigner

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

  // const [makerAtaMaker, makerAtaBidNft, bidAtaMakerNft, bidAtaBidNft] = [maker, bidder]
  //   .map((a) =>
  //     [makerMint, bidMint].map((b) =>
  //       getAssociatedTokenAddressSync(new anchor.web3.PublicKey(b.publicKey), a.publicKey, false, tokenProgram),
  //     ),
  //   )
  //   .flat()

  // const marketplacePdaAccount = PublicKey.findProgramAddressSync(
  //   [Buffer.from('quickswap'), admin.publicKey.toBuffer()],
  //   program.programId,
  // )[0]

  // const listingPdaAccount = PublicKey.findProgramAddressSync(
  //   [
  //     Buffer.from('listing'),
  //     maker.publicKey.toBuffer(),
  //     seed.toArrayLike(Buffer, 'le', 8),
  //     marketplacePdaAccount.toBuffer(),
  //   ],
  //   program.programId,
  // )[0]

  // const treasuryPdaAccount = PublicKey.findProgramAddressSync(
  //   [Buffer.from('treasury'), marketplacePdaAccount.toBuffer()],
  //   program.programId,
  // )[0]

  // const bidPdaAccount = PublicKey.findProgramAddressSync(
  //   [Buffer.from('bid'), bidder.publicKey.toBuffer(), listingPdaAccount.toBuffer()],
  //   program.programId,
  // )[0]

  // const makerVault = getAssociatedTokenAddressSync(
  //   new anchor.web3.PublicKey(makerMint.publicKey),
  //   listingPdaAccount,
  //   true,
  //   tokenProgram,
  // )

  // const makerSolVault = PublicKey.findProgramAddressSync(
  //   [Buffer.from('solvault'), listingPdaAccount.toBuffer()],
  //   program.programId,
  // )[0]

  // const bidVault = getAssociatedTokenAddressSync(
  //   new anchor.web3.PublicKey(bidMint.publicKey),
  //   bidPdaAccount,
  //   true,
  //   tokenProgram,
  // )
  // const bidSolVault = PublicKey.findProgramAddressSync(
  //   [Buffer.from('solanavault'), bidPdaAccount.toBuffer()],
  //   program.programId,
  // )[0]

  

  beforeAll(async () => {
    await airdrop(connection, new anchor.web3.PublicKey(creator.publicKey), 10).then(log)
  })

  it('Airdrop', async () => {
    // let lamports = await getMinimumBalanceForRentExemptMint(connection)
    const tx = new Transaction()

    tx.instructions = [
      ...[maker, taker, bidder].map((account) =>
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: account.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
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
      symbol: 'UA100',
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
    const collectionMasterEditionBid = findMasterEditionPda(umi, { mint: takerCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: nftMetadataBid,
      collectionAuthority: creator,
      collectionMint: bidCollection.publicKey,
      collection: collectionMetadataBid,
      collectionMasterEditionAccount: collectionMasterEditionBid,
    }).sendAndConfirm(umi)
    console.log('Bid Nft Verified')
  })
})
