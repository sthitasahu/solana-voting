import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from '../idl/voting.json'
import { Voting } from '../idl/voting'
import {
	PublicKey,
	Connection,
	SystemProgram,
	TransactionSignature,
	Transaction,
	VersionedTransaction
} from "@solana/web3.js"
import { Candidate, Poll } from '../utils/interface'
import { store } from '../store'
import { globalActions } from '../store/globalSlices'

interface ProgramAccount<T> {
  publicKey: PublicKey;
  account: T;
}

interface CandidateAccount {
  cid: BN;
  pollId: BN;
  name: string;
  votes: BN;
  hasRegistered: boolean;
}

interface PollAccount {
  id: BN;
  description: string;
  start: BN;
  end: BN;
  candidates: BN;
}

const Program_ID = new PublicKey(idl.address)
const RPC_URL = "https://api.devnet.solana.com"


export const getProvider = (
	publicKey: PublicKey | null,
	signTransaction: ((transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>) | undefined,
	sendTransaction: ((transaction: Transaction, connection: Connection) => Promise<TransactionSignature>) | undefined
): Program<Voting> | null => {
	if (!publicKey || !signTransaction) {
		console.error('Wallet not connected or missing signTransaction.')
		return null
	}

	const connection = new Connection(RPC_URL)
	const provider = new AnchorProvider(
		connection,
		{ publicKey, signTransaction, sendTransaction } as unknown as Wallet,
		{ commitment: 'processed' }
	)

	return new Program<Voting>(idl as Voting, provider)
}


export const getReadonlyProvider = (): Program<Voting> => {
	const connection = new Connection(RPC_URL, 'confirmed')
  
	// Use a dummy wallet for read-only operations
	const dummyWallet: Wallet = {
	  publicKey: PublicKey.default,
	  signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T) => {
		throw new Error('Read-only provider cannot sign transactions.')
	  },
	  signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]) => {
		throw new Error('Read-only provider cannot sign transactions.')
	  },
	  payer: {} as Wallet['payer'] // Dummy payer
	}
  
	const provider = new AnchorProvider(connection, dummyWallet, {
	  commitment: 'processed',
	})
  
	return new Program<Voting>(idl as Voting, provider)
  }
  
//get the counter pda 
export const getCounter = async (program: Program<Voting>): Promise<BN> => {
	try {

		const [counterPDA] = PublicKey.findProgramAddressSync(
			[Buffer.from("counter")],
			program.programId
		)

		const count = await program.account.counter.fetch(counterPDA);
		if (!count) {
			console.warn("No counter found,returning zero");
			return new BN(0);
		}
		return count.count;
	}
	catch (e) {
		console.error("Failed to retrieve counter: ", e);
		return new BN(-1);
	}
}


export const initialize = async (
	program: Program<Voting>,
	publicKey: PublicKey
): Promise<TransactionSignature> => {
	const [counterPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from('counter')],
		Program_ID
	)
	const [registrationsPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from('registrations')],
		Program_ID
	)

	const tx = await program.methods
		.initialize()
		.accountsPartial({
			user: publicKey,
			counter: counterPDA,
			registrations: registrationsPDA,
			systemProgram: SystemProgram.programId,
		})
		.rpc()

	const connection = new Connection(
		program.provider.connection.rpcEndpoint,
		'confirmed'
	)

	const blockhash = await connection.getLatestBlockhash();

	// Confirm the transaction using the latest blockhash and commitment
	const confirmation = await connection.confirmTransaction(
		{
			signature: tx,
			blockhash: blockhash.blockhash,
			lastValidBlockHeight: blockhash.lastValidBlockHeight
		},
		'confirmed'
	);

	if (confirmation.value.err) {
		console.error("Transaction failed: ", confirmation.value.err);
		throw new Error("Transaction failed");
	}

	return tx

}




export const createPoll = async (
	program: Program<Voting>,
	publicKey: PublicKey,
	nextCount: BN,
	description: string,
	start: number,
	end: number
): Promise<TransactionSignature> => {
	const [counterPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from('counter')],
		Program_ID
	)
	const [pollPDA] = PublicKey.findProgramAddressSync(
		[nextCount.toArrayLike(Buffer, 'le', 8)],
		Program_ID
	)

	const startBN = new BN(start)
	const endBN = new BN(end)

	const tx = await program.methods
		.createPoll(description, startBN, endBN)
		.accountsPartial({
			user: publicKey,
			counter: counterPDA,
			poll: pollPDA,
			systemProgram: SystemProgram.programId,
		})
		.rpc()

	const connection = new Connection(
		program.provider.connection.rpcEndpoint,
		'confirmed'
	)

	const blockhash = await connection.getLatestBlockhash();

	const confirmation = await connection.confirmTransaction(
		{
			signature: tx,
			blockhash: blockhash.blockhash,
			lastValidBlockHeight: blockhash.lastValidBlockHeight
		},
		'confirmed'
	);

	if (confirmation.value.err) {
		console.error("Transaction failed: ", confirmation.value.err);
		throw new Error("Transaction failed");
	}

	return tx
}


export const registerCandidate = async (
	program: Program<Voting>,
	publicKey: PublicKey,
	pollId: number,
	name: string
): Promise<TransactionSignature> => {

	const PID = new BN(pollId);

	const [pollPda] = PublicKey.findProgramAddressSync(
		[PID.toArrayLike(Buffer, 'le', 8)],
		Program_ID
	);

	const [registrationsPda] = PublicKey.findProgramAddressSync(
		[Buffer.from('registrations')],
		Program_ID
	)

	const regs = await program.account.registrations.fetch(registrationsPda);
	const CID = regs.count.add(new BN(1))

	const [candidatePda] = PublicKey.findProgramAddressSync(
		[PID.toArrayLike(Buffer, 'le', 8), CID.toArrayLike(Buffer, 'le', 8)],
		Program_ID
	)

	const tx = await program.methods
		.registerCandidate(PID, name)
		.accountsPartial({
			user: publicKey,
			poll: pollPda,
			registrations: registrationsPda,
			candidate: candidatePda,
			systemProgram: SystemProgram.programId,
		})
		.rpc()

	const connection = new Connection(
		program.provider.connection.rpcEndpoint,
		'confirmed'
	)

	const blockhash = await connection.getLatestBlockhash();

	const confirmation = await connection.confirmTransaction(
		{
			signature: tx,
			blockhash: blockhash.blockhash,
			lastValidBlockHeight: blockhash.lastValidBlockHeight
		},
		'confirmed'
	);

	if (confirmation.value.err) {
		console.error("Transaction failed: ", confirmation.value.err);
		throw new Error("Transaction failed");
	}

	return tx

}

export const vote = async (
	program: Program<Voting>,
	publicKey: PublicKey,
	pollId: number,
	candidateId: number
): Promise<TransactionSignature> => {
	const PID = new BN(pollId)
	const CID = new BN(candidateId)

	const [pollPda] = PublicKey.findProgramAddressSync(
		[PID.toArrayLike(Buffer, 'le', 8)],
		Program_ID
	)
	const [voterPDA] = PublicKey.findProgramAddressSync(
		[
			Buffer.from('voter'),
			PID.toArrayLike(Buffer, 'le', 8),
			publicKey.toBuffer(),
		],
		Program_ID
	)
	const [candidatePda] = PublicKey.findProgramAddressSync(
		[PID.toArrayLike(Buffer, 'le', 8), CID.toArrayLike(Buffer, 'le', 8)],
		Program_ID
	)

	const tx = await program.methods
		.giveVote(PID, CID)
		.accountsPartial({
			user: publicKey,
			poll: pollPda,
			candidate: candidatePda,
			voter: voterPDA,
			systemProgram: SystemProgram.programId
		})
		.rpc();
	const connection = new Connection(
		program.provider.connection.rpcEndpoint,
		'confirmed'
	)

	const blockhash = await connection.getLatestBlockhash();

	const confirmation = await connection.confirmTransaction(
		{
			signature: tx,
			blockhash: blockhash.blockhash,
			lastValidBlockHeight: blockhash.lastValidBlockHeight
		},
		'confirmed'
	);

	if (confirmation.value.err) {
		console.error("Transaction failed: ", confirmation.value.err);
		throw new Error("Transaction failed");
	}

	return tx
}


export const fetchAllPolls = async (
	program: Program<Voting>,
  ): Promise<Poll[]> => {
	const polls = await program.account.poll.all()
	return serializedPoll(polls)
  }
  
  export const fetchPollDetails = async (
	program: Program<Voting>,
	pollAddress: string
  ): Promise<Poll> => {
	const poll = await program.account.poll.fetch(pollAddress)
  
	const serialized: Poll = {
	  ...poll,
	  publicKey: pollAddress,
	  id: poll.id.toNumber(),
	  start: poll.start.toNumber() * 1000,
	  end: poll.end.toNumber() * 1000,
	  candidates: poll.candidates.toNumber(),
	}
  
	store.dispatch(globalActions.setPoll(serialized))
	return serialized
  }
  

const serializedPoll = (polls: ProgramAccount<PollAccount>[]): Poll[] =>
	polls.map((c) => ({
	  publicKey: c.publicKey.toBase58(),
	  id: c.account.id.toNumber(),
	  description: c.account.description,
	  start: c.account.start.toNumber() * 1000,
	  end: c.account.end.toNumber() * 1000,
	  candidates: c.account.candidates.toNumber(),
	}))

	export const fetchAllCandidates = async (
		program: Program<Voting>,
		pollAddress: string
	  ): Promise<Candidate[]> => {
		const pollData = await fetchPollDetails(program, pollAddress)
		if (!pollData) return []
	  
		const PID = new BN(pollData.id)
	  
		const candidateAccounts = await program.account.candidate.all()
		const candidates = candidateAccounts.filter((candidate: ProgramAccount<CandidateAccount>) => {
		  return candidate.account.pollId.eq(PID)
		})
	   
		store.dispatch(globalActions.setCandidates(serializedCandidates(candidates)))
		return serializedCandidates(candidates)
	  }
	  
	  const serializedCandidates = (candidates: ProgramAccount<CandidateAccount>[]): Candidate[] =>
		candidates.map((c) => ({
		  publicKey: c.publicKey.toBase58(),
		  cid: c.account.cid.toNumber(),
		  pollId: c.account.pollId.toNumber(),
		  votes: c.account.votes.toNumber(),
		  name: c.account.name,
		  hasRegistered: c.account.hasRegistered,
		}))
	  
	  export const hasUserVoted = async (
		program: Program<Voting>,
		publicKey: PublicKey,
		pollId: number
	  ): Promise<boolean> => {
		const PID = new BN(pollId)
	  
		const [voterPda] = PublicKey.findProgramAddressSync(
		  [
			Buffer.from('voter'),
			PID.toArrayLike(Buffer, 'le', 8),
			publicKey.toBuffer(),
		  ],
		  Program_ID
		)
	  
		try {
		  const voterAccount = await program.account.voter.fetchNullable(voterPda)
		  if (!voterAccount || !voterAccount.hasVoted) {
			return false // Default value if no account exists or hasn't voted
		  }
	  
		  return true
		} catch (error) {
		  console.error('Error fetching voter account:', error)
		  return false
		}
	  }