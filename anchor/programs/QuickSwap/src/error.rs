use anchor_lang::prelude::*;

#[error_code]
pub enum ListErrorCode {
    #[msg("Insufficient funds to purchase asset")]
    InsufficientFunds,
    #[msg("Invalid operation!")]
    InvalidOperation,
    #[msg("The mint address provided does not match seller's provided mint address.")]
    PaymentMintAddressMismatch,
}