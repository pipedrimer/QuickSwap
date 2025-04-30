use anchor_lang::prelude::*;


use crate::state::initmarket; 


#[derive(Accounts)]

pub struct InitializeMarket <'info>{
 
 #[account(mut)]
 pub admin: Signer <'info>,
 
 #[account(init, payer=admin, seeds=[b"quick", admin.key().as_ref()], bump, space= 8 + Marketplace::INIT_SPACE)]

 pub marketplace: Account <'info, Marketplace>,

 #[account(seeds= [b"treasury", marketplace.key().as_ref], bump)]

 pub treasury: SystemAccount<'info>,

 pub system_program: Program <'info , System>

}

impl <'info> InitializeMarket  <'info> {

    pub fn initmarket(&mut self, fee:u8, bumps:&InitializeBumps)-> Result<()>{

        self.marketplace.set_inner(Marketplace{
            admin: self.admin.key(),
            bump: bumps.marketplace,
            treasury_bump:bumps.treasury,
            taker_fee_bps:fee,



        });

        Ok(())
    }
}
