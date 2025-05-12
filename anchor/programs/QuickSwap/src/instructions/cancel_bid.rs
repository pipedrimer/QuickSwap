
use anchor_lang::{
    prelude::*, system_program::{transfer, Transfer}
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{close_account, transfer_checked, CloseAccount, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{Bid, Listing, Marketplace};

#[derive(Accounts)]

pub struct CancelBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
  
    pub maker: SystemAccount<'info>,

     pub admin: SystemAccount<'info>,

       #[account(address = bid.bid_mint)]
    pub bid_mint: InterfaceAccount<'info, Mint>,

     #[account(address = listing.maker_mint)]
    pub maker_mint: InterfaceAccount<'info, Mint>,

    #[account(mut,
        associated_token::mint= bid_mint,
        associated_token::authority= bid,
        associated_token::token_program= token_program,

    )]
    pub bid_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
    seeds = [b"solanavault", bid.key().as_ref()],
    bump
   )]
    pub bid_sol_vault: SystemAccount<'info>,

    
    #[account(init_if_needed, 
            payer= bidder, 
            associated_token::mint=bid_mint,
            associated_token::authority= bidder,
            associated_token::token_program= token_program)]
  pub bidder_ata: InterfaceAccount<'info, TokenAccount>,

  
    #[account(seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()], bump=listing.bump,)]
    pub listing: Account<'info, Listing>,

    #[account(mut,
              close=bidder,
              seeds=[b"bid", bidder.key().as_ref(), listing.key().as_ref()],bump=bid.bump
              )]
    pub bid: Account<'info, Bid>,

    #[account(seeds=[b"quickswap" , admin.key().as_ref()], bump= marketplace.bump)]
    pub marketplace: Account<'info, Marketplace>,
   
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl <'info> CancelBid <'info>{


    pub fn transfer_nft(&mut self)->Result<()>{
        
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.bid_vault.to_account_info(),
            to: self.bidder_ata.to_account_info(),
            mint: self.bid_mint.to_account_info(),
            authority: self.bidder.to_account_info(),
        };
         let seeds = [b"bid", self.bidder.to_account_info().key.as_ref(), &self.listing.to_account_info().key.as_ref(), &[self.bid.bump]];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

      transfer_checked(cpi_ctx, 1, 0)?;


        Ok(())
    
}

    pub fn transfer_sol(&mut self)->Result<()>{
       

       if self.bid.sol_deposit > 0 {

        let deposit = self.bid.sol_deposit;
        let cpi_program = self.system_program.to_account_info();
        
        let cpi_account = Transfer{
            from: self.bid_sol_vault.to_account_info(),
            to:self.bidder.to_account_info()
        };

        let seeds= [b"solanavault", self.bid.to_account_info().key.as_ref(), &[self.bid.sol_vault_bump]];

       let signer_seeds= &[&seeds[..]];

       let cpi_ctx=CpiContext::new_with_signer(cpi_program, cpi_account, signer_seeds);

       transfer(cpi_ctx, deposit)?;

    }

        Ok(())
}


    pub fn close_account(&mut self)->Result<()>{


    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts= CloseAccount{
        account:self.bid_vault.to_account_info(),
        destination:self.bidder.to_account_info(),
        authority:self.bid.to_account_info()

    };

    let seeds = [b"bid", self.bidder.to_account_info().key.as_ref(), &self.listing.to_account_info().key.as_ref(), &[self.bid.bump]];

    let signer_seeds = &[&seeds[..]];


    let ctx_cpi = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    close_account(ctx_cpi)?;
    
        Ok(())
    }
}