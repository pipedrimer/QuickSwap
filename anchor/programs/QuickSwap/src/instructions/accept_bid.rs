use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{close_account, transfer_checked, CloseAccount, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{Bid, Listing, Marketplace};

#[derive(Accounts)]

pub struct AcceptBid<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    pub bidder: SystemAccount<'info>,

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

    #[account(mut,
    associated_token::mint= maker_mint,
    associated_token::authority= listing,
    associated_token::token_program = token_program)]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
    seeds = [b"solanavault", bid.key().as_ref()],
    bump
   )]
    pub bid_sol_vault: SystemAccount<'info>,

    #[account(
    seeds = [b"solvault", listing.key().as_ref()],
    bump
   )]
   pub sol_vault: SystemAccount<'info>,
    
    #[account(init_if_needed, 
            payer= maker, 
            associated_token::mint=maker_mint,
            associated_token::authority= bidder,
            associated_token::token_program= token_program)]
  pub bidder_ata_a: InterfaceAccount<'info, TokenAccount>,

   #[account(init_if_needed, 
            payer= maker, 
            associated_token::mint= bid_mint,
            associated_token::authority= maker,
            associated_token::token_program=token_program)]
  pub maker_ata_b: InterfaceAccount<'info, TokenAccount>,


    #[account(mut,
         close=maker, seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()], bump=listing.bump,)]
    pub listing: Account<'info, Listing>,

    #[account(mut,
              close=bidder,
              seeds=[b"bid", bidder.key().as_ref(), listing.key().as_ref()],bump=bid.bump,
              has_one=bidder,
              has_one=bid_mint

              )]
    pub bid: Account<'info, Bid>,

    #[account(seeds=[b"quick", admin.key().as_ref() ], bump= marketplace.bump)]
    pub marketplace: Account<'info, Marketplace>,
    #[account(seeds= [b"treasury", marketplace.key().as_ref()], bump= marketplace.treasury_bump)]

 pub treasury: SystemAccount<'info>,

  

    
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl <'info> AcceptBid <'info> {
   
    pub fn transfer_nfts(&mut self)->Result<()>{

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts= TransferChecked{
        from:self.vault.to_account_info(),
        to:self.bidder_ata_a.to_account_info(),
        mint:self.maker_mint.to_account_info(),
        authority:self.listing.to_account_info(),
    };

    let seed_bytes = self.listing.seed.to_le_bytes();

    let seeds = [b"listing", self.maker.to_account_info().key.as_ref(), seed_bytes.as_ref(), &self.marketplace.to_account_info().key.as_ref(), &[self.listing.bump]];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

      transfer_checked(cpi_ctx, 1, 0)?;



      let cpi_program = self.token_program.to_account_info();
      let cpi_accounts= TransferChecked{
        from:self.bid_vault.to_account_info(),
        to:self.maker_ata_b.to_account_info(),
        mint:self.bid_mint.to_account_info(),
        authority:self.bid.to_account_info(),
    };

    

    let seeds = [b"bid", self.bidder.to_account_info().key.as_ref(), &self.listing.to_account_info().key.as_ref(), &[self.bid.bump]];

    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

      transfer_checked(cpi_ctx, 1, 0)?;


      Ok(())
    }

    pub fn transfer_sol(&mut self)->Result<()>{

       if self.bid.sol_demand > 0 {
        if self.listing.sol_deposit > 0 {
            if self.bid.sol_demand > self.listing.sol_deposit {
                
                
                let amount_to_balance = self.bid.sol_demand
                    .checked_sub(self.listing.sol_deposit)
                    .unwrap();

                let cpi_program = self.system_program.to_account_info();

                let cpi_accounts = Transfer {
                    from: self.sol_vault.to_account_info(),
                    to: self.bidder.to_account_info(),
                };
                let seeds = [
                    b"solvault",
                    self.listing.to_account_info().key.as_ref(),
                    &[self.listing.solvault_bump],
                ];
                let signer_seeds = &[&seeds[..]];

                let cpi_ctx =
                    CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, signer_seeds);

                transfer(cpi_ctx, self.listing.sol_deposit)?;

                let cpi_accounts = Transfer {
                    from: self.maker.to_account_info(),
                    to: self.bidder.to_account_info(),
                };
                let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
                transfer(cpi_ctx, amount_to_balance)?;
            } else {
                // Fully from vault
                let cpi_program = self.system_program.to_account_info();
                let cpi_accounts = Transfer {
                    from: self.sol_vault.to_account_info(),
                    to: self.bidder.to_account_info(),
                };
                let seeds = [
                    b"solvault",
                    self.listing.to_account_info().key.as_ref(),
                    &[self.listing.solvault_bump],
                ];
                let signer_seeds = &[&seeds[..]];
                let cpi_ctx =
                    CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

                transfer(cpi_ctx, self.bid.sol_demand)?;
            }
        } else {
               let fee = (self.marketplace.taker_fee_bps as u64)
        .checked_mul(self.bid.sol_demand)
        .unwrap()
        .checked_div(10000_u64)
        .unwrap();


            let cpi_program = self.system_program.to_account_info();
            let cpi_accounts = Transfer {
                from: self.maker.to_account_info(),
                to: self.bidder.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            transfer(cpi_ctx, self.bid.sol_demand)?;

            let cpi_program = self.system_program.to_account_info();

     let cpi_accounts= Transfer {
         from:self.maker.to_account_info(),
         to:self.treasury.to_account_info(),
     };

     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts );
     transfer(cpi_ctx, fee)?;
        }
    }

    
       if self.bid.sol_deposit > 0{

        let fee = (self.marketplace.taker_fee_bps as u64)
        .checked_mul(self.bid.sol_deposit)
        .unwrap()
        .checked_div(10000_u64)
        .unwrap();

        let amount= (self.bid.sol_deposit).checked_sub(fee).unwrap();
         let cpi_program = self.system_program.to_account_info();
         let cpi_accounts = Transfer {
                from: self.bid_sol_vault.to_account_info(),
                to: self.maker.to_account_info(),
            };
       
       let seeds= [b"solanavault", self.bid.to_account_info().key.as_ref(), &[self.bid.sol_vault_bump]];

       let signer_seeds= &[&seeds[..]];

       let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

       transfer(cpi_ctx, amount)?;

    let cpi_program = self.system_program.to_account_info();

     let cpi_accounts= Transfer {
         from:self.bid_sol_vault.to_account_info(),
         to:self.treasury.to_account_info(),
     };

     let seeds= [b"solanavault", self.bid.to_account_info().key.as_ref(), &[self.bid.sol_vault_bump]];

    let signer_seeds= &[&seeds[..]];

     let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts , signer_seeds);
     transfer(cpi_ctx, fee)?;


           
    }


        Ok(())
    }
    
    pub fn close_vaults (&mut self)-> Result<()>{
          
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