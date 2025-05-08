use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Listing{

    pub maker:Pubkey,
    pub seed: u64,
    pub maker_mint:Pubkey,
    pub collection_requested: Pubkey,
    pub sol_deposit:u64,
    pub sol_demand:u64,
    pub bump:u8,
    


}