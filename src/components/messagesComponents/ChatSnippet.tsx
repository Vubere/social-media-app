import {useEffect, useState} from "react"
import {Link} from 'react-router-dom'

import { getUserById } from "../../helpers/helpers"
import { currentUser } from "../profileComponents/Header"

import * as routes from "../../constants/routes"
import { useAppDispatch } from "../../app/hooks"
import { setReceiver } from "../../slices/chatSlice"

export default function ChatSnippet({details}:{details:snippetDetails}){
  const [chattingWith, setChattingWith] = useState<currentUser>()
  const dispatch = useAppDispatch()


  useEffect(()=>{
    (async()=>{
      const name  = await getUserById(details.chattingWith)
      setChattingWith(name)
    })()
  },[details])

  return (
    chattingWith!=undefined?
    <Link to={`${routes.chats}/${chattingWith.username}`} onClick={()=>{
      dispatch(setReceiver(chattingWith))
    }}>
        <section className="chatSnippet">
          <div className="avatar">
            <img src={chattingWith.avatarUrl} width="40px" alt="avatar" />
          </div>
          <div className="name">
            <p>{chattingWith.username}</p>
          </div>
          <div className="message">
            <p>{details.message}</p>
          </div>
        </section>
    </Link>
    :<></>
  )
}
type snippetDetails = {
  message: string,
  document: string,
  time: number,
  type: string,
  sender: string,
  chattingWith: string
}