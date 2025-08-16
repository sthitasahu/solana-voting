use anchor_lang::prelude::*;
use crate::constants::*;
use crate::Counter;
use crate::Registrations;

#[derive(Accounts)]
pub struct Initialize<'info>{
    
    #[account(mut)]
    pub user:Signer<'info>,
    #[account(
        init,
        payer=user,
        space=ANCHOR_DISCRIMINATOR_SIZE+Counter::INIT_SPACE,
        seeds=[b"counter"],
        bump
    )]
    pub counter:Account<'info,Counter>,
    #[account(
        init,
        payer=user,
        space=ANCHOR_DISCRIMINATOR_SIZE+Registrations::INIT_SPACE,
        seeds=[b"registrations"],
        bump
    )]
    pub registrations:Account<'info,Registrations>,
    pub system_program:Program<'info,System>

}

pub fn handler_initialize(ctx:Context<Initialize>)->Result<()>{
   let counter=&mut ctx.accounts.counter;
   let registrations=&mut ctx.accounts.registrations;

   counter.count=0;
   registrations.count=0;
   Ok(()) 
}
