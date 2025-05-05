use anchor_lang::prelude::*;

pub struct Bid{

pub authority:PubKey,
#[max_len(100)]
pub bid_mint: Vec<PubKey>,
pub expiry_time:i64,
pub sol_deposit:u64,
pub sol_demand:u64,
pub bump:u8

}