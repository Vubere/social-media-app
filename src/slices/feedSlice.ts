import { createSlice } from "@reduxjs/toolkit";

import { PostDetails } from "../components/FeedComponents/PostItem";

let feed:PostDetails[]|[] = []

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    feed
  },
  reducers:{
    setFeed(state, {payload}:{payload:PostDetails[]|[]}){
      state.feed = payload
    }
  }

})


export default feedSlice.reducer

export const {setFeed} = feedSlice.actions 