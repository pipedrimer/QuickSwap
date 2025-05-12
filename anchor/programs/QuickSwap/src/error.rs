use anchor_lang::error_code;

#[error_code]
pub enum ListError {
    #[msg("NFT mint must have 0 decimals.")]
    InvalidMintDecimals,
    #[msg("ATA owner is incorrect.")]
    InvalidATAOwner,
    #[msg("ATA mint is incorrect.")]
    InvalidATAMint,
    #[msg("Vault owner is not the listing PDA.")]
    InvalidVaultOwner,
    #[msg("Vault mint does not match.")]
    InvalidVaultMint,
    #[msg("NFT is missing a collection.")]
    MissingCollection,
    #[msg("NFT collection is not verified.")]
    UnverifiedCollection,
    #[msg("NFT does not match required layout.")]
    InvalidCollection,
    #[msg("NFT does not match the requested Collection")]
    TooManyNFTs,
    #[msg("Requested more than 3 collections.")]
    TooManyRequestedCollections,
    #[msg("NFT is from the wrong collection.")]
    WrongCollection,
}