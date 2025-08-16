use anchor_lang::prelude::*;

use crate::error::ErrorCode::*;
use crate::Candidate;
use crate::Registrations;

use crate::Poll;
use crate::constants::*;

#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct RegisterCandidate<'info>{
  #[account(mut)]
  pub user:Signer<'info>,
 
  #[account(
	mut,
	seeds=[{poll_id.to_le_bytes().as_ref()}],
	bump,
  )]
  pub poll:Account<'info,Poll>,
  
  #[account(mut,seeds=[b"registrations"],bump)]
  pub registrations:Account<'info,Registrations>,

  #[account(
	init,
	payer=user,
	space=ANCHOR_DISCRIMINATOR_SIZE+Candidate::INIT_SPACE,
	seeds=[
		poll_id.to_le_bytes().as_ref(),
		(registrations.count+1).to_le_bytes().as_ref()
	],
	bump
  )]
  pub candidate:Account<'info,Candidate>,

  pub system_program:Program<'info,System>

}

pub fn vote(ctx:Context<RegisterCandidate>,
	        poll_id:u64,
			name:String
			,
)->Result<()>

{	                
   let poll=&mut ctx.accounts.poll;
   let candidate=&mut ctx.accounts.candidate;
   let registrations=&mut ctx.accounts.registrations;
   //check if te poll exists
   if poll.id!=poll_id {
      return Err(PollDoesNotExist.into());
   }

   if candidate.has_registered{
	 return Err(CandidateAlreadyRegistered.into());
   }

   registrations.count+=1;
  
   
   candidate.poll_id=poll_id;
   candidate.cid=registrations.count;
   candidate.name=name;
   candidate.has_registered=true;
  
  poll.candidates+=1;
  
   Ok(())
}