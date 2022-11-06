import { arrayUnion, doc, increment, setDoc } from "firebase/firestore"
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage"
import { useState } from "react"
import { db } from "../../main"
import { currentUser } from "../profileComponents/Header"

import image from "../../assets/image.svg"


export default function Input({ user, receiver }: chatters) {
  const [file, setFile] = useState<File>()
  const [text, setText] = useState<string>('')

  const disabled = file === undefined && text === ''

  const handleFileChange = () => {
    let f: HTMLInputElement | null = document.querySelector('.chatFile')
    if (f != null) {
      const fileList = f.files
      if (fileList != null) {
        setFile(fileList[0])
        const n = fileList[0]
      }
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const docRefUser = doc(db, 'chats', user.userID)
    const docRefReceiver = doc(db, 'chats', receiver.userID)
    const messagePath = [user.userID, receiver.userID].sort((a: any, b: any) => a - b).join('')



    const date = Date.now()
    const filePath = `imageFolder/messages/${messagePath}/${date}`
    const storage = getStorage()
    const storageRef = ref(storage, filePath)
    let path = ''
    if (file != undefined) {
      const res = await uploadBytes(storageRef, file)
      path = await getDownloadURL(res.ref)
    }
    await setDoc(doc(db, 'users', receiver.userID), {
      unreadMessages: increment(1)
    }, {merge:true})
    await setDoc(docRefUser, {
      [receiver.userID]: arrayUnion({
        message: text,
        document: path,
        time: Date.now(),
        sender: user.userID,
        type: 'sent',
        chattingWith: receiver.userID,
        read: false
      })
    }, { merge: true })
    await setDoc(docRefReceiver, {
      [user.userID]: arrayUnion({
        message: text,
        document: path,
        time: Date.now(),
        sender: user.userID,
        type: 'received',
        chattingWith: user.userID,
        read: false
      })
    }, { merge: true })
    setText('')
  }

  return (
    <section className="input" >
      <form onSubmit={(e) => handleMessageSubmit(e)}>
        <label htmlFor="file" className="file">
          <img src={image} alt="" width='30px' />
          <input type="file" name="file" id="file"
            className="chatFile"
            onChange={handleFileChange} />
        </label>
        <input type="text" name="text" id="text"
          value={text}
          placeholder="Start a message"
          onChange={({ target }) => setText(target.value)} />
        <button type="submit"
          disabled={disabled}
          className={disabled?'disabled':'chat'}>
          send
        </button>
      </form>
    </section>
  )
}

type chatters = {
  user: currentUser;
  receiver: currentUser;
}