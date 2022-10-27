import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import { getUserById } from "../../helpers/helpers"
import { currentUser } from "../profileComponents/Header"

import * as routes from "../../constants/routes"
import { useAppDispatch } from "../../app/hooks"
import { setReceiver } from "../../slices/chatSlice"
import { formatDistance, subDays } from "date-fns"

export default function ChatSnippet({ details }: { details: snippetDetails }) {
  const [chattingWith, setChattingWith] = useState<currentUser>()
  const dispatch = useAppDispatch()


  useEffect(() => {
    (async () => {
      const name = await getUserById(details.chattingWith)
      setChattingWith(name)
    })()
  }, [details])

  return (
    chattingWith != undefined ?
      <Link to={`${routes.chats}/${chattingWith.username}`} onClick={() => {
        dispatch(setReceiver(chattingWith))
      }}>
        <section className="chatSnippet">
          <div className="avatar">
            <img src={chattingWith.avatarUrl} width="40px" alt="avatar" />
          </div>
          <div className="rest">
            <div className="name">
              <p>@{chattingWith.username}</p>
            </div>
            <div className="message">
              <p>{details.message.slice(0, 22)}...</p>
              <p className="time">{formatDistance(subDays(Number(details.time), 0), new Date())} ago</p>
            </div>
          </div>
        </section>
      </Link>
      : <></>
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