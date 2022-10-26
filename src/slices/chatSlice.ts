import {createSlice} from '@reduxjs/toolkit'

import { currentUser } from '../components/profileComponents/Header'

const receiver:currentUser|undefined = undefined

const chatSlice = createSlice({
  name: 'chat',
  initialState:{
    receiver,
  },
  reducers:{
    setReceiver(state:any,{payload}:{payload:currentUser}){
      state.receiver = payload
    }
  }
}) 

export default chatSlice.reducer
export const {setReceiver} = chatSlice.actions