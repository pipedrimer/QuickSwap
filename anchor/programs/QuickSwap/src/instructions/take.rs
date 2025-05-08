use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};


use crate::state::{Listing,Marketplace};
#[derive(Accounts)]


pub struct Take<'info>{
  
  #[account(mut)]
  pub taker: Signer<'info>,

  pub maker:SystemAccount<'info>,

  pub admin: SystemAccount<'info>,
 
  #[account(address = listing.nft_mint)]
  pub maker_mint: InterfaceAccount<'info, Mint>,
  
  #[account()]
  pub taker_mint: InterfaceAccount<'info, Mint>,

  #[account(address= listing.collection_requested)]
  pub taker_collection: InterfaceAccount<'info, Mint>,

  #[account(
    seeds= [b"metadata", taker_mint.key().as_ref(), metadata_program.key().as_ref()],
    bump,

    seeds::program= metadata_program.key(),
    constraint= metadata.collection.as_ref().unwrap().key.as_ref() == taker_collection.key().as_ref(),
    constraint= metadata.collection.as_ref().unwrap().verified == true,

)]
   pub metadata: Account<'info, MetadataAccount>,

 
  #[account(init_if_needed, 
            payer=taker, 
            associated_token::mint=maker_mint,
            associated_token::authority= taker,
            associated_token::token_program= token_program)]
  pub taker_ata_a: InterfaceAccount<'info, TokenAccount>,

  #[account(init_if_needed, 
            payer= taker, 
            associated_token::mint= taker_mint,
            associated_token::authority= maker,
            associated_token::token_program=token_program)]
  pub maker_ata_b: InterfaceAccount<'info, TokenAccount>,

  #[account(mut,
            associated_token::mint= taker_mint,
            associated_token::authority= taker,
            associated_token::token_program= token_program)]
  pub taker_ata_b: InterfaceAccount<'info, TokenAccount>,

  #[account(
    seeds = [b"solvault", listing.key().as_ref()],
    bump
   )]
   pub sol_vault: SystemAccount<'info>,

   #[account(mut,
    associated_token::mint= maker_mint,
    associated_token::authority= listing,
    associated_token::token_program = token_program)]
    pub vault: InterfaceAccount<'info, TokenAccount>,



  #[account(mut, seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()], bump=listing.bump)]
  pub listing:Account<'info, Listing>,
 
  #[account(seeds=[b"quick", admin.key().as_ref() ], bump= marketplace.bump)]
  pub marketplace: Account<'info , Marketplace>,


  pub metadata_program: Program<'info, Metadata>,
  pub token_program : Interface<'info, TokenInterface>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>





}