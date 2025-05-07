use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bid{
pub authority: Pubkey,
#[max_len(100)]
pub bid_mint: Vec<Pubkey>,
pub expiry_time:i64,
pub sol_deposit:u64,
pub sol_demand:u64,
pub bump:u8

}