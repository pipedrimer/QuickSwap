use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Listing{

    pub maker:Pubkey,
    pub seed: u64,
    #[max_len(100)]
    pub nft_mint: Vec<Pubkey>,
    #[max_len(100)]
    pub collection_requested: Vec<Pubkey>,
    pub sol_offered:u64,
    pub sol_demanded:u64,
    pub bump:u8


}