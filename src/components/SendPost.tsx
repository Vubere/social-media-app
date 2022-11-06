import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { useRef, useState } from 'react'
import { setDoc, doc, increment, arrayRemove, arrayUnion } from 'firebase/firestore'
import { db } from '../main'

import Camera from "../assets/camera.svg"
import close from "../assets/close.svg"


export default function SendPost() {
  const [post, setPost] = useState('')
  const [file, setFile] = useState<any>()
  const fileRef = useRef<any>()
  const imageRef = useRef<any>()
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
        const itemId = currentUser.uid + '' + date
        const postRef = doc(db, 'post', itemId)
        const userRef = doc(db, 'users', currentUser.uid)
        await setDoc(postRef, {
          user: currentUser.uid,
          caption: post,
          imagePath: path,
          comments: [],
          likes: [],
          date: date,
          sender: currentUser.uid,
        })
        await setDoc(userRef, {
          posts: arrayUnion(itemId),
          postLength: increment(1)
        }, { merge: true })
        setPost('')
        setFile(undefined)

      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileChange = (e: any) => {
    let f: HTMLInputElement | null = document.querySelector('.file')
    if (f != null) {
      const fileList = f.files
      if (fileList != null) {
        if (fileList[0]) {
          const fileArr = Array.from(fileList)
          setFile(fileList[0])
          const reader = new FileReader()
          reader.onload = (e) => {
            imageRef.current.src = e.target?.result
          }
          reader.readAsDataURL(fileList[0])
        }
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
            <img src={Camera} alt="" width='20px'
              height='20px' />
          </label>
          <input type="file" name="file"
          ref={fileRef}
            className='file'
            id="file" multiple={true}
            onChange={(e) => handleFileChange(e)} />
          <div className='button'>

            <button type='submit'
            id=''
              aria-label='submit post'
              className={!disabled ? 'blue' : ''}
              disabled={disabled}
            >post</button>

          </div>
        </div>
        {file != undefined &&
          <div className="imagePreview">
            <img src={close}  alt='close' className="x" onClick={() => { 
              if(fileRef){
                fileRef.current.value = null
              }
              setFile(undefined) }}/>
            <img ref={imageRef} alt="imagePreview" src="#" className='preview' />
          </div>
        }
      </form>
    </div>
  )
}