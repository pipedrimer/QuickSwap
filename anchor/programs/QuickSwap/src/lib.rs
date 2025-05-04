#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

pub mod error;

pub mod instructions;
pub use instructions::*;

pub mod state;
pub use state::*;




#[program]
pub mod quick_swap {
    

    use super::*;

    pub fn initialize(ctx:Context<InitializeMarket>, fee:u8)-> Result<()> {
     ctx.accounts.initmarket(fee, &ctx.bumps)?;
     Ok(())
    }

    pub fn listing(ctx:Context<List>, seed:u64, sol_deposit:u64, sol_demand:u64, collection_requested: Vec<Pubkey>,bumps: ListBumps) -> Result<()>{
       ctx.accounts.create_listing( &ctx.remaining_accounts, seed, collection_requested, sol_deposit, sol_demand, &bumps)?;
      Ok(())
    }
  }