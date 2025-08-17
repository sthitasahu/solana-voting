import { Candidate,Poll,GlobalState} from "@/app/utils/interface"
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setCandidates: (state: GlobalState, action: PayloadAction<Candidate[]>) => {
    state.candidates = action.payload
  },
  setPoll: (state: GlobalState, action: PayloadAction<Poll>) => {
    state.poll = action.payload
  },
  setRegModal: (state: GlobalState, action: PayloadAction<string>) => {
    state.regModal = action.payload
  },
}