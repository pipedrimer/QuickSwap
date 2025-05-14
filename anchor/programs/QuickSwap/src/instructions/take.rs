use anchor_lang::{prelude::*,system_program::{Transfer,transfer}};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{  Metadata, MetadataAccount},
    token::{close_account, transfer_checked, CloseAccount, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};


use crate::state::{Listing,Marketplace};
use crate::error::ListError;

#[derive(Accounts)]


pub struct Take<'info>{
  
  #[account(mut)]
  pub taker: Signer<'info>,

  pub maker:SystemAccount<'info>,

   pub admin: SystemAccount<'info>,
 
  #[account(address = listing.maker_mint)]
  pub maker_mint: InterfaceAccount<'info, Mint>,
 
  pub taker_mint: InterfaceAccount<'info, Mint>,

  #[account(address = listing.collection_requested)]
  pub taker_collection: InterfaceAccount<'info, Mint>,

 

#[account( seeds= [b"treasury", marketplace.key().as_ref()], bump= marketplace.treasury_bump)]

 pub treasury: SystemAccount<'info>,

 
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

  #[account(mut,
    seeds = [b"solvault", listing.key().as_ref()],
    bump=listing.solvault_bump
   )]
   pub sol_vault: SystemAccount<'info>,

   #[account(mut,
    associated_token::mint= maker_mint,
    associated_token::authority= listing,
    associated_token::token_program = token_program)]
   
   pub vault: InterfaceAccount<'info, TokenAccount>,


  #[account(mut, close=maker, seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()], bump=listing.bump,
                has_one=maker_mint,
                has_one=maker,
            )]
  pub listing:Account<'info, Listing>,
 
  #[account(seeds=[b"quickswap", admin.key().as_ref()], bump= marketplace.bump)]
  pub marketplace: Account<'info , Marketplace>,

   #[account(
    seeds= [b"metadata", metadata_program.key().as_ref(), taker_mint.key().as_ref() ],
    bump,

    seeds::program= metadata_program.key(),
    
)]
  pub metadata: Account<'info, MetadataAccount>,

  pub metadata_program: Program<'info, Metadata>,
  pub token_program : Interface<'info, TokenInterface>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub system_program: Program<'info, System>, 





}

impl <'info> Take <'info>{

    pub fn transfer_nft(&mut self )-> Result<()>{

        require!(
    self.metadata.collection.as_ref().map(|c| c.verified).unwrap_or(false),
    ListError::UnverifiedCollection
);

require!(
    self.metadata.collection.as_ref().map(|c| c.key == self.taker_collection.key()).unwrap_or(false),
    ListError::InvalidCollection
);
      
    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts= TransferChecked{
        from:self.taker_ata_b.to_account_info(),
        to:self.maker_ata_b.to_account_info(),
        mint:self.taker_mint.to_account_info(),
        authority:self.taker.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    transfer_checked(cpi_ctx, 1, 0)?;
     Ok(())
        
    }

    pub fn release_listing(&mut self) ->Result<()>{
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts= TransferChecked{
        from:self.vault.to_account_info(),
        to:self.taker_ata_a.to_account_info(),
        mint:self.maker_mint.to_account_info(),
        authority:self.listing.to_account_info(),
    };

    let seed_bytes = self.listing.seed.to_le_bytes();

    let seeds = [b"listing", self.maker.to_account_info().key.as_ref(), seed_bytes.as_ref(), &self.marketplace.to_account_info().key.as_ref(), &[self.listing.bump]];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

      transfer_checked(cpi_ctx, 1, 0)?;

      Ok(())

    }
 
  pub fn transfer_sol(&mut self)-> Result<()>{

    let mut fee_transferred = false;

    if self.listing.sol_demand > 0 {
    let fee = (self.marketplace.taker_fee_bps as u64)
        .checked_mul(self.listing.sol_demand)
        .unwrap()
        .checked_div(10000_u64)
        .unwrap();

    let amount= (self.listing.sol_demand).checked_sub(fee).unwrap();
    
    let cpi_program = self.system_program.to_account_info();
    
    
    let cpi_accounts=  Transfer {
        from:self.taker.to_account_info(),
        to:self.maker.to_account_info(),
        
    };

     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts );

     transfer(cpi_ctx, amount)?;

     let cpi_program = self.system_program.to_account_info();

     let cpi_accounts= Transfer {
         from:self.taker.to_account_info(),
         to:self.treasury.to_account_info(),
     };

     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts );
     transfer(cpi_ctx, fee)?;
 
    fee_transferred= true;



    }

    if self.listing.sol_deposit> 0{

    let balance= self.sol_vault.lamports();

    let fee = balance - self.listing.sol_deposit;
    
    let cpi_program = self.system_program.to_account_info();
    
    
    let cpi_accounts=  Transfer {
        from:self.sol_vault.to_account_info(),
        to:self.taker.to_account_info(),
        
    };

    let seeds= [b"solvault", self.listing.to_account_info().key.as_ref(), &[self.listing.solvault_bump]];

    let signer_seeds= &[&seeds[..]];
     

     let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

     transfer(cpi_ctx, self.listing.sol_deposit)?;

     let cpi_program = self.system_program.to_account_info();

     let cpi_accounts= Transfer {
         from:self.sol_vault.to_account_info(),
         to:self.treasury.to_account_info(),
     };

     let seeds= [b"solvault", self.listing.to_account_info().key.as_ref(), &[self.listing.solvault_bump]];

    let signer_seeds= &[&seeds[..]];

     let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts , signer_seeds);
     transfer(cpi_ctx, fee)?;

    fee_transferred =true;

    }

    if !fee_transferred 
    {
    pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

    let fee = LAMPORTS_PER_SOL/100;

    let cpi_program = self.system_program.to_account_info();

     let cpi_accounts= Transfer {
         from:self.taker.to_account_info(),
         to:self.treasury.to_account_info(),
     };

     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts );
     transfer(cpi_ctx, fee)?;
    }

    Ok(())
  }

  pub fn close_account(&mut self)-> Result<()>{

    let cpi_program = self.token_program.to_account_info();
    let cpi_accounts= CloseAccount{
        account:self.vault.to_account_info(),
        destination:self.maker.to_account_info(),
        authority:self.listing.to_account_info()

    };

    let seed_bytes = self.listing.seed.to_le_bytes();

    let seeds = [b"listing", self.maker.to_account_info().key.as_ref(), seed_bytes.as_ref(), &self.marketplace.to_account_info().key.as_ref(), &[self.listing.bump]];

    let signer_seeds = &[&seeds[..]];


    let ctx_cpi = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    close_account(ctx_cpi)?;
    

    Ok(())
}

}