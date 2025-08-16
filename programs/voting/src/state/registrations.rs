use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Registrations{
	pub count:u64,
}