use anchor_lang::prelude::*;

#[account]
pub struct Voter{
	pub id:u64,
	pub poll_id:u64,
	pub has_voted:bool,
}