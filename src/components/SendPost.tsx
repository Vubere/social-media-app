import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { useState } from 'react'
import { setDoc, doc, increment } from 'firebase/firestore'
import { db } from '../main'

import Camera from "../assets/camera.svg"

export default function SendPost() {
  const [post, setPost] = useState('')
  const [file, setFile] = useState<any>()
  const disabled = post == '' && file == undefined

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const storage = getStorage();
    try {
      const { currentUser } = getAuth()
      if (currentUser != null) {
        if (disabled) return
        const date = Date.now()
        const filePath = `imageFolder/${currentUser.uid}/post/${date}`
        const storageRef = ref(storage, filePath)
        let path = ''
        if (file != undefined) {
          const res = await uploadBytes(storageRef, file)
          path = await getDownloadURL(res.ref)
        }
        const docRef = await doc(db, 'post', currentUser.uid)
        await setDoc(docRef, {
          [date]: {
            user: currentUser.uid,
            caption: post,
            imagePath: path,
            comments: [],
            likes: [],
            date: date,
            sender: currentUser.uid
          },
          postLength: increment(1)
        }, { merge: true })
        setPost('')

      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileChange = (e: React.FormEvent) => {
    let f: HTMLInputElement | null = document.querySelector('.file')
    if (f != null) {
      const fileList = f.files
      if (fileList != null) {
        const fileArr = Array.from(fileList)
        console.log(fileArr)
        setFile(fileList[0])
      }
    }
  }


  return (
    <div className='post'>
      <form onSubmit={(e) => handlePostSubmit(e)}>
        <textarea
          aria-label="what is on your mind?"
          placeholder="what is on your mind?"
          className='postInput' name='text'
          value={post}
          onChange={({ target }) => setPost(target.value)}
          autoComplete='off' />
        <div className="icons">
          <label htmlFor="file">
            <img src={Camera} alt=""  width='20px'
            height='20px'/>
            </label>
          <input type="file" name="file"
            className='file'
            id="file" multiple={true}
            onChange={(e) => handleFileChange(e)} />
          <div className='button'>

            <button type='submit'
              aria-label='submit post'
              className={!disabled ? 'blue' : ''}
              disabled={disabled}
            >post</button>

          </div>
        </div>
      </form>
    </div>
  )
}