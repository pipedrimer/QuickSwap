use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{Listing,Marketplace};
#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct Listing<'info>{
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account]
    pub admin: SystemAccount <'info>,
    
    #[account(seeds=[b"quick", admin.key().as_ref() ], bump= marketplace.bump)]
    pub marketplace: Account<'info>,

    #[account(init,
              payer=maker,
              seeds=[b"listing", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
              bump,
              space= 8 + Listing::INIT_SPACE,
            )]
    pub listing: Account <'info, Listing>,
    
    pub nft_mint:InterfaceAccount<'info, Mint>,









}