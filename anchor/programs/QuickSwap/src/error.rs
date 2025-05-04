use anchor_lang::error_code;

#[error_code]
pub enum ListError {
    #[msg("Insufficient funds to purchase asset")]
    InsufficientFunds,
    #[msg("Invalid operation!")]
    InvalidOperation,
    #[msg("The mint address provided does not match seller's provided mint address.")]
    PaymentMintAddressMismatch,
}