use anchor_lang::prelude::*

pub struct Bid{

pub authority:PubKey,
pub bid_mint: Vec<PubKey>,
pub expiry_time:i64,
pub sol_offered:u64,
pub sol_demanded:u64,
pub bump:u8
}