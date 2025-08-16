use anchor_lang::prelude::*;
use crate::error::ErrorCode::*;
use crate::Candidate;
use crate::Voter;
use crate::Poll;
use crate::constants::*;

#[derive(Accounts)]
#[instruction(poll_id:u64,candidate_id:u64)]
pub struct Vote<'info>{
  #[account(mut)]
  pub user:Signer<'info>,
  #[account(
	mut,
	seeds=[poll_id.to_le_bytes().as_ref()],
	bump
  )]
  pub poll:Account<'info,Poll>,

  #[account(
	mut,
	seeds=[poll_id.to_le_bytes().as_ref(),
	candidate_id.to_le_bytes().as_ref()],
	bump,
  )]
  pub candidate:Account<'info,Candidate>,
  
  #[account(
	init,
	payer=user,
	space=ANCHOR_DISCRIMINATOR_SIZE+Voter::INIT_SPACE,
	seeds=[b"voter",poll_id.to_le_bytes().as_ref(),user.key().as_ref()],
	bump
  )]
  pub voter:Account<'info,Voter>,
   
  pub system_program:Program<'info,System>
   

}

pub fn handler_vote(ctx:Context<Vote>,
	        poll_id:u64,
			candidate_id:u64,
)->Result<()>

{	                
  
  let poll=&mut ctx.accounts.poll;
  let candidate=&mut ctx.accounts.candidate;
  let voter=&mut ctx.accounts.voter;
  
  if !candidate.has_registered || candidate.poll_id !=poll_id {
	 return Err(CandidateAlreadyRegistered.into());
  }
   
   if voter.has_voted{
	 return Err(VoterAlreadyVoted.into());
   }

   let current_timestamp=Clock::get()?.unix_timestamp as u64;

   if current_timestamp < poll.start || current_timestamp > poll.end{
	 return Err(PollNotActive.into());
   }

   candidate.votes+=1;

   voter.has_voted=true;
   voter.candidate_id=candidate_id;
   voter.poll_id=poll_id;
   
   Ok(())
}