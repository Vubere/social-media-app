import {useState, useEffect} from 'react'

import ChatBody from "../components/chatComponents/Body"
import ChatHeader from "../components/chatComponents/Header"
import Input from "../components/chatComponents/Input"

import { getAuth } from "firebase/auth"
import { getUserById } from "../helpers/helpers"
import { currentUser } from '../components/profileComponents/Header'
import { useAppSelector } from '../app/hooks'


export default function ChatPage(){
  const [user, setUser] = useState<currentUser>()
  const {receiver} = useAppSelector<{receiver:currentUser|undefined}>(state=>state.chat)
  const {currentUser} = getAuth()
  
  useEffect(()=>{
    (async()=>{
      if(currentUser){
        const user = await getUserById(currentUser.uid)
        setUser(user)
      }
    })()
  },[currentUser])

  return (
  user!=undefined&&receiver!=undefined?
  
    <section className="chatPage">
      <ChatHeader receiver={receiver}/>
      <ChatBody user={user} receiver={receiver}/>
      <Input user={user} receiver={receiver}/>
    </section>:null
  )
}