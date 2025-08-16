use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Voter{
	pub candidate_id:u64,
	pub poll_id:u64,
	pub has_voted:bool,
}