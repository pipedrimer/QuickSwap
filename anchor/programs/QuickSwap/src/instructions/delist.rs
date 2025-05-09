use anchor_lang::{prelude::*,system_program::{transfer, Transfer}};

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{ Listing, Marketplace };
use crate::error::ListError;
#[derive(Accounts)]

pub struct Delist<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    
    pub admin: SystemAccount <'info>,
    
    #[account(seeds=[b"quick", admin.key().as_ref() ], bump= marketplace.bump)]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut, 
              close= maker,
              seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()],
              bump=listing.bump,
              has_one=maker,
              has_one= maker_mint
              
            )]
    pub listing: Account <'info, Listing>,
    
    pub maker_mint:InterfaceAccount<'info, Mint>,
    
    #[account(mut,associated_token::mint=maker_mint,
                  associated_token::authority=maker,
                  associated_token::token_program=token_program,)]
    pub maker_ata:InterfaceAccount<'info, TokenAccount>,

    #[account(mut,
        associated_token::mint= maker_mint,
        associated_token::authority= listing,
        associated_token::token_program = token_program)]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    
    
    #[account(
        seeds = [b"solvault", listing.key().as_ref()],
        bump
    )]
    pub sol_vault: SystemAccount<'info>,


    pub token_program : Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,



}

impl <'info> Delist<'info> {
    
    pub fn withdraw_nft(&mut self)->Result<()>{

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked{
            from:self.vault.to_account_info(),
            to:self.maker_ata.to_account_info(),
            mint:self.maker_mint.to_account_info(),
            authority:self.listing.to_account_info()
        };

    let seed_bytes = self.listing.seed.to_le_bytes();

    let seeds = [b"listing", self.maker.to_account_info().key.as_ref(), seed_bytes.as_ref(), &self.marketplace.to_account_info().key.as_ref(), &[self.listing.bump]];

    let signer_seeds = &[&seeds[..]];


    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

      transfer_checked(cpi_ctx, 1, 0)?;

      Ok(())
    }
 
  pub fn withdraw_sol(&mut self)->Result<()>{

      let cpi_program = self.system_program.to_account_info();
      let cpi_accounts= Transfer{
        from:self.sol_vault.to_account_info(),
        to:self.maker.to_account_info()
      };
      
      let seeds= [b"solvault", self.listing.to_account_info().key.as_ref(), &[self.listing.solvault_bump]];

      let signer_seeds= &[&seeds[..]];

      let balance = self.sol_vault.lamports();

      let cpi_ctx= CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);


      transfer(cpi_ctx, balance)?;
      Ok(())
  }

  pub fn close_listing(&mut self)->Result<()>{

    
  }

}
