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
              seeds=[b"listing", maker.key().as_ref(), seed.to_le_bytes().as_ref(),marketplace.key().as_ref()],
              bump,
              space= 8 + Listing::INIT_SPACE,
            )]
    pub listing: Account <'info, Listing>,
    
    pub nft_mint:InterfaceAccount<'info, Mint>,
    
    #[account(mut,associated_token::mint= nft_mint,
              associated_token::authority= maker,
            associated_token::token_program=token_program,)]
    pub maker_ata:InterfaceAccount<'info, TokenAccount>,

    #[account(init,
        payer= maker,
        associated_token::mint= maker_mint,
        associated_token::authority= listing,
        associated_token::token_program = token_program)]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub collection_mint: InterfaceAccount< 'info, Mint>,

    #[account(
        seeds= [b"metadata", maker_mint.key().as_ref(), metadata_program.key().as_ref()],
        bump,

        seeds::program= metadata_program.key(),
        constraint= metadata.collection.as_ref().unwrap().key.as_ref() ==collection_mint.key().as_ref(),
        constraint= metadata.collection.as_ref().unwrap().verified == true,

    )]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(
        seeds=[b"metadata",
        maker_mint.key().as_ref(), 
        metadata_program.key().as_ref(),
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

impl <'info> Listing <'info> {

    pub fn create_listing(
        ctx: Context<Listing>,
        seed: u64,
        collection_requested: Vec<Pubkey>,
        sol_offered: u64,
        sol_demanded: u64,
    ) -> Result<()> {
       

        let listing = &mut ctx.accounts.listing;
        listing.maker = ctx.accounts.maker.key();
        listing.seed = seed;
        listing.sol_offered = sol_offered;
        listing.sol_demanded = sol_demanded;
        listing.bump = *ctx.bumps.get("listing").unwrap();
        listing.collection_requested = collections_requested.clone();
        listing.nft_mint = vec![];


        let remaining = &ctx.remaining_accounts;
        require!(remaining.len() % 5 == 0, ListingError::InvalidNFTAccountLayout);
        let nft_count = remaining.len() / 5;
        require!(nft_count <= 3, ListingError::TooManyNFTs);
    
        for i in 0..nft_count {
            let mint_info = &remaining[i * 5];
            let maker_ata_info = &remaining[i * 5 + 1];
            let vault_ata_info = &remaining[i * 5 + 2];
            let metadata_info = &remaining[i * 5 + 3];
            let _edition_info = &remaining[i * 5 + 4];
    
            let mint = Mint::try_from(mint_info)?;
            require!(mint.decimals == 0, ListingError::InvalidMintDecimals);
    
            let maker_ata = TokenAccount::try_from(maker_ata_info)?;
            require_keys_eq!(maker_ata.owner, ctx.accounts.maker.key(), ListingError::InvalidATAOwner);
            require_keys_eq!(maker_ata.mint, mint_info.key(), ListingError::InvalidATAMint);
    
            let vault = TokenAccount::try_from(vault_ata_info)?;
            require_keys_eq!(vault.owner, ctx.accounts.listing.key(), ListingError::InvalidVaultOwner);
            require_keys_eq!(vault.mint, mint_info.key(), ListingError::InvalidVaultMint);
    
            let metadata = MetadataAccount::try_from(metadata_info)?;
            let collection = metadata.collection.ok_or(ListingError::MissingCollection)?;
            require!(collection.verified, ListingError::UnverifiedCollection);
    
            require!(
                collections_requested.contains(&collection.key),
                ListingError::WrongCollection
            );
    
            // Transfer NFT
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: maker_ata_info.to_account_info(),
                    to: vault_ata_info.to_account_info(),
                    authority: ctx.accounts.maker.to_account_info(),
                },
            );
    
            transfer_checked(cpi_ctx, 1, 0)?;
            listing.nft_mint.push(mint_info.key());
        }
    
        Ok(())
    }
}
    
//         let remaining = &ctx.remaining_accounts;
//         require!(remaining.len() % 5 == 0, ListingError::InvalidRemainingAccounts);
//         require!(remaining.len() <= 15, ListingError::TooManyNFTs); // 3 NFTs max
    
//         let mut nft_mints: Vec<Pubkey> = Vec::new();
    
//         for (i, chunk) in remaining.chunks(5).enumerate() {
//             let mint_info = &chunk[0];
//             let maker_ata_info = &chunk[1];
//             let vault_info = &chunk[2];
//             let metadata_info = &chunk[3];
//             let edition_info = &chunk[4];
    
//             let mint: Account<Mint> = Account::try_from(mint_info)?;
//             let maker_ata: Account<TokenAccount> = Account::try_from(maker_ata_info)?;
//             let vault_ata: Account<TokenAccount> = Account::try_from(vault_info)?;
//             let metadata = MetadataAccount::try_from(metadata_info)?;
//             let _edition = MasterEditionAccount::try_from(edition_info)?;
    
//             // Check collection is verified
//             let collection = metadata.collection.as_ref().ok_or(ListingError::MissingCollection)?;
//             require!(collection.verified, ListingError::UnverifiedCollection);
    
//             // Confirm ATA is for correct mint + maker
//             require!(maker_ata.mint == *mint_info.key, ListingError::InvalidATA);
//             require!(maker_ata.owner == ctx.accounts.maker.key(), ListingError::InvalidATAOwner);
    
//             // Confirm vault is ATA for mint + listing PDA
//             let expected_vault = get_associated_token_address(&listing.key(), &mint.key());
//             require!(&expected_vault == vault_info.key, ListingError::InvalidVaultATA);
    
//             // Transfer NFT from maker to vault
//             transfer_checked(
//                 CpiContext::new(
//                     ctx.accounts.token_program.to_account_info(),
//                     TransferChecked {
//                         from: maker_ata.to_account_info(),
//                         to: vault_ata.to_account_info(),
//                         authority: ctx.accounts.maker.to_account_info(),
//                         mint: mint.to_account_info(),
//                     },
//                 ),
//                 1, // always 1 for NFTs
//                 mint.decimals,
//             )?;
    
//             nft_mints.push(*mint_info.key);
//         }
    
//         listing.nft_mint = nft_mints;
//         Ok(())
//     }
// }