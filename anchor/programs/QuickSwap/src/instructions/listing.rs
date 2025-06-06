use std::str::FromStr;

use anchor_lang::{prelude::*,system_program::{transfer, Transfer}};

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{ Listing, Marketplace };
use crate::error::ListError;
#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct List<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    pub admin: SystemAccount<'info>,
    
    #[account(seeds=[b"quickswap", admin.key().as_ref()], bump= marketplace.bump)]
    pub marketplace: Account<'info, Marketplace>,

    #[account(init,
              payer=maker,
              seeds=[b"listing", maker.key().as_ref(), seed.to_le_bytes().as_ref(),marketplace.key().as_ref()],
              bump,
              space= 8 + Listing::INIT_SPACE,
            )]
    pub listing: Account <'info, Listing>,
    
    pub maker_mint:InterfaceAccount<'info, Mint>,
    
    #[account(mut,associated_token::mint=maker_mint,
                  associated_token::authority=maker,
                  associated_token::token_program=token_program,)]
    pub maker_ata_a:InterfaceAccount<'info, TokenAccount>,

    #[account(init,
        payer= maker,
        associated_token::mint= maker_mint,
        associated_token::authority= listing,
        associated_token::token_program = token_program)]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    

    pub maker_collection: InterfaceAccount< 'info, Mint>,
    
    #[account(
        seeds = [b"solvault", listing.key().as_ref()],
        bump
    )]
    pub sol_vault: SystemAccount<'info>,

    
    #[account(
        seeds= [b"metadata", metadata_program.key().as_ref(), maker_mint.key().as_ref() ],
        bump,

        seeds::program= metadata_program.key(),
        constraint= metadata.collection.as_ref().unwrap().key.as_ref() ==maker_collection.key().as_ref() @ListError::InvalidCollection,
        constraint= metadata.collection.as_ref().unwrap().verified == true @ListError::UnverifiedCollection, 

    )]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(
        seeds=[b"metadata",
        metadata_program.key().as_ref(),
        maker_mint.key().as_ref(),  
        b"edition"],
        seeds::program = metadata_program.key(),
        bump,


    )]
    pub master_edition: Account<'info, MasterEditionAccount>,

    pub metadata_program: Program<'info, Metadata>,
    pub token_program : Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,



}


pub fn create_listing(ctx:Context<List>,
        seed: u64,
        collection_requested: String,
        sol_deposit: u64,
        sol_demand: u64,
    ) -> Result<()> {
       
        let listing = &mut ctx.accounts.listing;

        listing.maker = ctx.accounts.maker.key();
        listing.seed = seed;
        listing.sol_deposit= sol_deposit;
        listing.sol_demand = sol_demand;
        listing.bump= ctx.bumps.listing;
        listing.collection_requested= Pubkey::from_str(&collection_requested).unwrap();
        listing.maker_mint= ctx.accounts.maker_mint.key();
        listing.solvault_bump= ctx.bumps.sol_vault;
        

    
           
    
          
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.maker_ata_a.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.maker.to_account_info(),
                    mint:ctx.accounts.maker_mint.to_account_info(),
                },
            );
            
            

            transfer_checked(cpi_ctx, 1, 0)?;
           


           
    

        if sol_deposit> 0 {

            let fee = (ctx.accounts.marketplace.taker_fee_bps as u64)
        .checked_mul(sol_deposit)
        .unwrap()
        .checked_div(10000_u64)
        .unwrap();

        let amount= (sol_deposit).checked_add(fee).unwrap();
           

        
        
        let cpi_program = ctx.accounts.system_program.to_account_info();

        let cpi_accounts = Transfer{
            from: ctx.accounts.maker.to_account_info(),
            to: ctx.accounts.sol_vault.to_account_info(),

           };

        let  cpi_ctx= CpiContext::new(cpi_program, cpi_accounts);

        transfer( cpi_ctx, amount)?;
          
        }
    
        Ok(())
    }



