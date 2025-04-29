use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Listing{

    pub maker:Pubkey,
    pub seed: u64,
    pub nft_mint: Vec<Pubkey>,
    pub collection_requested: Vec<Pubkey>,
    pub sol_offered:u64,
    pub sol_demanded:u64,
    pub bump:u8


}