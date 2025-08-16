#![allow(unexpected_cfgs)]
pub use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;



pub use constants::*;
pub use instructions::*;

pub use state::*;



declare_id!("6QonxkM67Mt2EFVQzz7J8biLagDdzy2YVBnkC2n36Sqj");


#[program]
pub mod voting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
       instructions::handler_initialize(ctx)
    }
    
    pub fn create_poll(ctx:Context<CreatePoll>,description:String,start:u64,end:u64)->Result<()>{
      instructions::handler_create_poll(ctx, description, start, end)  
    }

    

}
