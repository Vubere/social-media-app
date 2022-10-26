
import {createSlice} from '@reduxjs/toolkit'

import { User } from 'firebase/auth'

import {SliceCaseReducers} from '@reduxjs/toolkit'

import { currentUser } from '../components/profileComponents/Header'

type userType = {
  user: currentUser|null
}

const userSlice = createSlice<userType,SliceCaseReducers<userType>, string>({
  name: 'user',
  initialState: {
    user: null
  },
  reducers:{
    updateUser(state, {payload}:any){
      state.user = payload
    },
    removeUser(state){
      state.user = null
    }
  }
})

export default userSlice.reducer
export const {updateUser, removeUser} = userSlice.actions