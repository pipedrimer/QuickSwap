#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;


pub mod error;
pub mod instructions;
use instructions::*;
pub mod state;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");




#[program]
pub mod quick_swap {
    

    use super::*;

    pub fn initialize(ctx:Context<InitializeMarket>, fee:u8)-> Result<()> {
     ctx.accounts.initmarket(fee, &ctx.bumps)?;
     Ok(())
    }

    pub fn listing(ctx:Context<List>, seed:u64, sol_deposit:u64, sol_demand:u64, collection_requested: String) -> Result<()>{
       create_listing(ctx, seed, collection_requested, sol_deposit, sol_demand,)?;
      Ok(())
   
    }

    pub fn take_listing(ctx:Context<Take>) -> Result<()>{
      ctx.accounts.transfer_nft()?;
      ctx.accounts.release_listing()?;
      ctx.accounts.transfer_sol()?;
      ctx.accounts.close_account()?;

      Ok(())
    }
  }