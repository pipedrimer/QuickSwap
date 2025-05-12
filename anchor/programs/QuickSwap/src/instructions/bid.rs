use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::state::{Bid, Listing, Marketplace};

#[derive(Accounts)]

pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    pub maker: SystemAccount<'info>,

     pub admin: SystemAccount<'info>,

    #[account(address = bid.bid_mint)]
    pub bid_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer= bidder,
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

    pub bid_collection: InterfaceAccount<'info, Mint>,

    #[account(mut,
            associated_token::mint= bid_mint,
            associated_token::authority= bidder,
            associated_token::token_program= token_program)]
    pub bidder_ata_b: InterfaceAccount<'info, TokenAccount>,

    #[account(mut, seeds=[b"listing", maker.key().as_ref(), listing.seed.to_le_bytes().as_ref(), marketplace.key().as_ref()], bump=listing.bump,)]
    pub listing: Account<'info, Listing>,

    #[account(init,
              payer=bidder,
              seeds=[b"bid", bidder.key().as_ref(), listing.key().as_ref()],bump,
              space= 8 + Bid::INIT_SPACE)]
    pub bid: Account<'info, Bid>,

    #[account(seeds=[b"quickswap", admin.key().as_ref()], bump= marketplace.bump)]
    pub marketplace: Account<'info, Marketplace>,

    #[account(
    seeds= [b"metadata", bid_mint.key().as_ref(), metadata_program.key().as_ref()],
    bump,

    seeds::program= metadata_program.key(),
    constraint= metadata.collection.as_ref().unwrap().key.as_ref() == bid_collection.key().as_ref(),
    constraint= metadata.collection.as_ref().unwrap().verified == true,
)]
    pub metadata: Account<'info, MetadataAccount>,

    #[account(
        seeds=[b"metadata",
        bid_mint.key().as_ref(), 
        metadata_program.key().as_ref(),
        b"edition"],
        seeds::program = metadata_program.key(),
        bump,


    )]
   pub master_edition: Account<'info, MasterEditionAccount>,

    pub metadata_program: Program<'info, Metadata>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> PlaceBid<'info> {
    pub fn init_bid(
        &mut self,
        sol_deposit: u64,
        sol_demand: u64,
        bumps: &PlaceBidBumps,
    ) -> Result<()> {
        self.bid.set_inner(Bid {
            bidder: self.bidder.key(),
            bid_mint: self.bid_mint.key(),
            sol_deposit,
            sol_demand,
            bump: bumps.bid,
            sol_vault_bump:bumps.bid_sol_vault
        });

        Ok(())
    }

    pub fn transfer_nft(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.bidder_ata_b.to_account_info(),
            to: self.bid_vault.to_account_info(),
            mint: self.bid_mint.to_account_info(),
            authority: self.bidder.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_ctx, 1, 0)?;

        Ok(())
    }

    pub fn transfer_sol(&mut self) -> Result<()> {
        if self.bid.sol_deposit > 0 {
            let cpi_program = self.system_program.to_account_info();

            let cpi_accounts = Transfer {
                from: self.bidder.to_account_info(),
                to: self.bid_sol_vault.to_account_info(),
            };

            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

            transfer(cpi_ctx, self.bid.sol_deposit)?;
        }

        Ok(())
    }
}
