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
   
   pub fn register_candidate(ctx:Context<RegisterCandidate>,poll_id:u64,name:String)->Result<()>{
     instructions::register_candidate(ctx,poll_id,name)
   }

    pub fn give_vote(ctx:Context<Vote>,poll_id:u64,candidate_id:u64)->Result<()>{
        instructions::handler_vote(ctx,poll_id,candidate_id)
    }

    

}
