import { getAuth } from "firebase/auth"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import ChatSnippet from "../components/messagesComponents/ChatSnippet"
import { db } from "../main"

export default function Messages() {
  const [chats, setChats] = useState<any[]>([])
  const [notChatted, setNotChatted] = useState<any[]>([])
  const { currentUser } = getAuth()

  useEffect(() => {
    let unsub: any = () => { }
    (async () => {
      if (currentUser != null) {
        const docRef = doc(db, 'chats', currentUser.uid)
        unsub = onSnapshot(docRef, (doc) => {
          const h = doc.data()

          if (h != undefined) {
            const arr = Object.values(h)
            let temp = [...chats]
            for (let val of arr) {
              temp.push(val.pop())
            }
            setChats(temp)
          }
        })
      }
    })()
    return unsub
  }, [currentUser])

  return (
    <section className="messages">
      <header>
        <h3>Messages</h3>
      </header>
      <h4>Chats</h4>
      {chats.length > 0 ? (
        chats.sort((a, b) => b.time - a.time).map((details) =>
          <ChatSnippet key={details.time} details={details} />
        )
      )
        : <>you have no open chats...</>}
      <h4>You can chat with...</h4>
      {notChatted.length > 0 ? (
        <section className="toChat">
        </section>
      ) : <>follow people to see suggestions...</>}
    </section>
  )
}