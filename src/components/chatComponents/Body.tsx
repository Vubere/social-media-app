import { onSnapshot, doc, query, collection} from "firebase/firestore"
import {useState, useEffect} from "react"
import { db } from "../../main"
import { currentUser } from "../profileComponents/Header"
import Chatbubble from "./ChatBubble"


export default function ChatBody({user, receiver}:{user:currentUser, receiver:currentUser}){
  const [chatArray, setChatArray] = useState<any>([])

  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", user.userID), (chat)=>{
      const data = chat.data()
      if(data!=undefined){
        if(data[receiver.userID]==undefined) return
        setChatArray(data[receiver.userID])
      }
    })

    return unsub
  },[])
  return (
    <section className="body">
      {chatArray.length?chatArray.map((chat:any)=>
      <>
          <Chatbubble message={chat.message} time={chat.time} document={chat.document} person={chat.sender===user.userID?user:receiver}
            className={chat.sender === user.userID ? 'right': 'left'}/>
      </>
      ):<p>
        start a chat...
        </p>}
    </section>
  )
}