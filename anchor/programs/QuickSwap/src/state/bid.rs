use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bid {

pub bidder: Pubkey,
pub bid_mint: Pubkey,
pub sol_deposit:u64,
pub sol_demand:u64,
pub bump:u8,
pub sol_vault_bump:u8

}