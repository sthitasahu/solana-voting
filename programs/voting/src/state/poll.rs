use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Poll{
	pub id:u64,
	#[max_len(400)]
	pub description:String,
	pub start:u64,
	pub end:u64,
	pub candidates:u64,
}