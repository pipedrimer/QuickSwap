import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
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
  keypairIdentity,
  percentAmount,
} from '@metaplex-foundation/umi'
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { randomBytes } from 'crypto'

describe('QuickSwap', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const connection = provider.connection

  const program = anchor.workspace.QuickSwap as Program<QuickSwap>

  const programId = program.programId

  const tokenProgram = TOKEN_2022_PROGRAM_ID

  const payer = provider.wallet as NodeWallet

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

  const seed = new BN(randomBytes(8))



  // const [makerMintPk, takerMintPk, bidMintPk] = [makerMint, takerMint, bidMint].map((a)=> new PublicKey(a.publicKey.))
  //create nft creator wallet
  const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(payer.payer.secretKey))
  const creator = createSignerFromKeypair(umi, creatorWallet)
  //use umi and mpltokenmetadata program
  umi.use(keypairIdentity(creator))
  umi.use(mplTokenMetadata())

    const [maker, taker, admin, bidder] = Array.from({ length: 4 }, () => Keypair.generate())
  const [makerMint, takerMint, bidMint, makerCollection, takerCollection, bidCollection] = Array.from(
    { length: 6 },
    () => generateSigner(umi),
  )


  const [makerAtaMakerNft, makerAtaTakerNft, takerAtaMakerNft, takerAtaTakerNft] = [maker, taker]
    .map((a) =>
      [makerMint, takerMint].map((b) => getAssociatedTokenAddressSync( new anchor.web3.PublicKey(b.publicKey), a.publicKey, false, tokenProgram)),
    )
    .flat()

  const [makerAtaMaker, makerAtaBidNft, bidAtaMakerNft, bidAtaBidNft] = [maker, bidder]
    .map((a) =>
      [makerMint, bidMint].map((b) => getAssociatedTokenAddressSync( new anchor.web3.PublicKey(b.publicKey), a.publicKey, false, tokenProgram)),
    )
    .flat()
  

  const marketplacePdaAccount = PublicKey.findProgramAddressSync(
    [Buffer.from('quickswap'), admin.publicKey.toBuffer()],
    program.programId,
  )[0];

  const listingPdaAccount = PublicKey.findProgramAddressSync([Buffer.from('listing'), maker.publicKey.toBuffer(),seed.toArrayLike(Buffer, "le", 8), marketplacePdaAccount.toBuffer()], program.programId)[0]

  const treasuryPdaAccount = PublicKey.findProgramAddressSync([Buffer.from('treasury'), marketplacePdaAccount.toBuffer()], program.programId)[0];

  const bidPdaAccount = PublicKey.findProgramAddressSync([Buffer.from('bid'), bidder.publicKey.toBuffer(),listingPdaAccount.toBuffer()],program.programId)[0];

  const makerVault = getAssociatedTokenAddressSync( new anchor.web3.PublicKey(makerMint.publicKey), listingPdaAccount, true, tokenProgram);

  const makerSolVault= PublicKey.findProgramAddressSync([Buffer.from('solvault'), listingPdaAccount.toBuffer()], program.programId)[0];

  const bidVault = getAssociatedTokenAddressSync( new anchor.web3.PublicKey(bidMint.publicKey), bidPdaAccount, true, tokenProgram);
  const bidSolVault= PublicKey.findProgramAddressSync([Buffer.from('solanavault'), bidPdaAccount.toBuffer()], program.programId)[0];


  // const accounts ={
  //   maker:maker.publicKey,
  //   taker:taker.publicKey,
  //   admin:admin.publicKey,
  //   bidder:bidder.publicKey,
  //   makerMint:makerMint.publicKey,
  //   takerMint:takerMint.publicKey,
  //   bidMint:bidMint.publicKey,
  //   makerAtaMakerNft,
  //   makerAtaTakerNft,
  //   makerAtaBidNft,
  //   takerAtaMakerNft,
  //   takerAtaTakerNft,
  //   bidAtaMakerNft,
  //   bidAtaBidNft,
  //   marketplacePdaAccount,
  //   listingPdaAccount,
  //   treasuryPdaAccount,
  //   makerVault,
  //   makerSolVault,
  //   bidVault,
  //   bidSolVault
    
  // }

  it('Create Collection NFTs', async () => {
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
    console.log(`Created Collection NFT: ${makerCollection.publicKey.toString()}`)

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
    console.log(`Created Collection NFT: ${takerCollection.publicKey.toString()}`)

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
    console.log(`Created Collection NFT: ${bidCollection.publicKey.toString()}`)
    
    
  })

  it('Mint NFTs', async () => {
    await createNft(umi, {
      mint: makerMint,
      name: 'Unbothered Ape 100',
      symbol: 'UA100',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: makerCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created NFT: ${makerMint.publicKey.toString()}`)

    await createNft(umi, {
      mint: takerMint,
      name: 'Angry Jeff',
      symbol: 'DSoJ10',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: takerCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created NFT: ${takerMint.publicKey.toString()}`)

    await createNft(umi, {
      mint: bidMint,
      name: 'Friendly Face 15',
      symbol: 'FF15',
      uri: '',
      sellerFeeBasisPoints: percentAmount(3),
      creators: null,
      collection: {
        verified: false,
        key: bidCollection.publicKey,
      },
    }).sendAndConfirm(umi)
    console.log(`Created NFT: ${bidMint.publicKey.toString()}`)
  })

  it('Verify NFT', async () => {
    const makerMetadata = findMetadataPda(umi, { mint: makerMint.publicKey })
    const makerCollectionMetadata = findMetadataPda(umi, { mint: makerCollection.publicKey })
    const makerMasterEdition = findMasterEditionPda(umi, { mint: makerCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: makerMetadata,
      collectionAuthority: creator,
      collectionMint: makerCollection.publicKey,
      collection: makerCollectionMetadata,
      collectionMasterEditionAccount: makerMasterEdition,
    }).sendAndConfirm(umi)
    console.log('Nft Verified')

    const takerMetadata = findMetadataPda(umi, { mint: takerMint.publicKey })
    const takerCollectionMetadata = findMetadataPda(umi, { mint: takerCollection.publicKey })
    const takerMasterEdition = findMasterEditionPda(umi, { mint: takerCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: takerMetadata,
      collectionAuthority: creator,
      collectionMint: takerCollection.publicKey,
      collection: takerCollectionMetadata,
      collectionMasterEditionAccount: takerMasterEdition,
    }).sendAndConfirm(umi)
    console.log('Nft Verified')

    const bidMetadata = findMetadataPda(umi, { mint: bidMint.publicKey })
    const bidCollectionMetadata = findMetadataPda(umi, { mint: bidCollection.publicKey })
    const bidMasterEdition = findMasterEditionPda(umi, { mint: bidCollection.publicKey })

    await verifySizedCollectionItem(umi, {
      metadata: bidMetadata,
      collectionAuthority: creator,
      collectionMint: bidCollection.publicKey,
      collection: bidCollectionMetadata,
      collectionMasterEditionAccount: bidMasterEdition,
    }).sendAndConfirm(umi)
    console.log('Nft Verified')
  })

  
})
