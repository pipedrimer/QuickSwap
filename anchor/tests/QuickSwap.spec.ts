import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { QuickSwap } from '../target/types/quick_swap'
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';

describe('QuickSwap', () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const connection = provider.connection;

  const program = anchor.workspace.QuickSwap as Program<QuickSwap>

  const programId = program.programId;

  const tokenProgram = TOKEN_PROGRAM_ID;

  const confirm = async(signature: string): Promise<string> =>{
    const block = await connection.getLatestBlockhash();

    await connection.confirmTransaction({signature, ...block});
    return signature;
  }

  const log = async(signature:string): Promise<string> =>{
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  }



const seed = new BN(randomBytes(8));

  
const [maker, taker, admin, bidder] = Array.from({length:4}, () => Keypair.generate());

let marketplace;
let listing;
let treasury;
let maker_mint;
let taker_mint;
let maker_ata_a;
let maker_ata_b;
let taker_ata_a;
let taker_ata_b;
let vault;
let sol_vault;
let maker_collection;
let taker_collection;
let maker_metadata;
let taker_metadata;
let maker_master_edition;
let taker_master_edition;
let bid;
let bid_mint;
let bid_vault;
let bid_sol_vault;
let bid_collection;
let bidder_ata_a;
let bidder_ata_b;
let bid_metadata;
let bid_master_edition;
  
  const payer = provider.wallet as anchor.Wallet

  

  const QuickSwapKeypair = Keypair.generate()

  it('Initialize QuickSwap', async () => {
    
})
});