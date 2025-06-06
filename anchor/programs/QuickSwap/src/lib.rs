#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
use instructions::*;
pub mod state;

declare_id!("G5HbQhYdUkEVRqCywp9te8EvNgLCb3Zj8LqnAUzX5rnK");

#[program]
pub mod quick_swap {

    use super::*;

    pub fn initialize(ctx: Context<InitializeMarket>, fee: u8) -> Result<()> {
        
        ctx.accounts.initmarket(fee, &ctx.bumps)?;
        Ok(())
    }

    pub fn listing(
        ctx: Context<List>,
        seed: u64,
        sol_deposit: u64,
        sol_demand: u64,
        collection_requested: String,
    ) -> Result<()> {
        create_listing(ctx, seed, collection_requested, sol_deposit, sol_demand)?;
        Ok(())
    }

    pub fn take_listing(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.transfer_nft()?;
        ctx.accounts.release_listing()?;
        ctx.accounts.transfer_sol()?;
        ctx.accounts.close_account()?;

        Ok(())
    }

    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        ctx.accounts.withdraw_nft()?;
        ctx.accounts.withdraw_sol()?;
        ctx.accounts.close_listing()?;

        Ok(())
    }

    pub fn create_bid(ctx: Context<PlaceBid>, sol_demand: u64, sol_deposit: u64)-> Result<()>{
          
          ctx.accounts.init_bid(sol_deposit, sol_demand, &ctx.bumps)?;
          ctx.accounts.transfer_nft()?;
          ctx.accounts.transfer_sol()?;


      Ok(())
  }

  pub fn accept_bid(ctx:Context<AcceptBid>)-> Result<()>{

     ctx.accounts.transfer_nfts()?;
     ctx.accounts.transfer_sol()?;
     ctx.accounts.close_vaults()?;
    
    Ok(())
  }

  pub fn cancel_bid(ctx:Context<CancelBid>)-> Result<()>{

     ctx.accounts.transfer_nft()?;
     ctx.accounts.transfer_sol()?;
     ctx.accounts.close_account()?;
    
    Ok(())
  }


}
