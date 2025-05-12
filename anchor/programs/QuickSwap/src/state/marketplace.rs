use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Marketplace{

    pub admin: Pubkey,
 
    pub taker_fee_bps: u8,

    pub bump: u8,

    pub treasury_bump: u8,
}