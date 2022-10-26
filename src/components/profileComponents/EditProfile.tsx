import { useState } from 'react'

import { uploadBytes, ref, getStorage, getDownloadURL } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import {
  getAuth, reauthenticateWithCredential, updateProfile,
  EmailAuthProvider, updateEmail, updatePassword
} from 'firebase/auth'
import { db } from '../../main'

import avatar from "../../assets/defaultAvatar.jpg"

import camera from "../../assets/camera.svg"


export default function EditProfile() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [email, setEmail] = useState('')
  const [fullname, setFullname] = useState('')
  const [file, setFile] = useState<File>()
  const { currentUser } = getAuth()
  const disabledFile = file === undefined

  const [rePwd, setRePwd] = useState('')

  const handleFileChange = () => {
    let f: HTMLInputElement | null = document.querySelector('.imageUpload')
    if (f != null) {
      const fileList = f.files
      if (fileList != null) {
        setFile(fileList[0])
      }
    }
  }
  const updateAvatar = async (e: React.FormEvent) => {
    e.preventDefault()
    const storage = getStorage();
    try {
      if (file != undefined)
        if (!file.type.includes('image')) {
          throw 'You can only send images or videos.'
        }
      const { currentUser } = getAuth()
      if (currentUser != null) {
        if (disabledFile) return
        const date = Date.now()
        const filePath = `imageFolder/${currentUser.uid}/avatar/profile`
        const storageRef = ref(storage, filePath)
        let path = ''

        const res = await uploadBytes(storageRef, file)
        path = await getDownloadURL(res.ref)
        const docRef = doc(db, 'users', currentUser.uid)
        await setDoc(docRef, {
          avatarUrl: path
        }, { merge: true })
        updateProfile(currentUser, {
          photoURL: path
        })

      }
    } catch (error) {
      console.log(error)
    }
  }
  const editName = async (type: 'name' | 'fullname') => {
    const { currentUser } = getAuth()

    if (currentUser === null) return
    const docRef = doc(db, 'users', currentUser.uid)
    if (type === 'name') {
      await setDoc(docRef, {
        username: username
      }, { merge: true })
      updateProfile(currentUser, {
        displayName: username
      })
      setUsername('')
    } else {
      await setDoc(docRef, {
        fullName: fullname
      }, { merge: true })

      setFullname('')
    }
  }
  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { currentUser } = getAuth()
    if (currentUser !== null) {
      if (currentUser.email === null) return
      const credential = EmailAuthProvider.credential(currentUser.email, rePwd)
      try {
        const res = await reauthenticateWithCredential(currentUser, credential)
        setAuthenticated(true)
        setRePwd('')
      } catch (error) {
        console.log(error)
      }
    }
  }
  const changeEmailOrPassword = async (e: React.FormEvent, type: 'pwd' | 'email') => {
    const { currentUser } = getAuth()

    if (currentUser === null) return
    try {
      if (type == 'email') {
        await updateEmail(currentUser, email)
        const docRef = doc(db, 'users', currentUser.uid)
        await setDoc(docRef, {
          email: email
        }, {
          merge: true
        })
        setEmail('')
      } else {
        await updatePassword(currentUser, pwd)
        setPwd('')
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="editProfile">
        {!authenticated ?
          <div className="verifyPwd">
            <input type="password" id="confirmPwd"
              placeholder='re-enter password'
              value={rePwd}
              onChange={({ target }) => setRePwd(target.value)} />
            <button onClick={authenticate}>authenticate</button>
          </div>
          :
          <>
            <div className="profilePix" style={{
              'backgroundImage': currentUser != undefined ?
                currentUser.photoURL != null && currentUser.photoURL != '' ?
                  `url(${currentUser.photoURL})` : `url(${avatar})` : `url(${avatar})`,
              'backgroundSize': 'cover'
            }}>
              <label htmlFor="file">
                <img src={camera} alt="add" width='30px'/>
                <input type="file"
                  aria-label="input profile picture"
                  name="file"
                  id='file'
                  className="imageUpload"
                  placeholder=''
                  onChange={handleFileChange} />
              </label>
            </div>
            {file && <button onClick={updateAvatar}>change</button>}
            <div className="usernameChange">
              <label htmlFor="username">edit username:
                <input type="username" name="username"
                  aria-label='change username'
                  className='username'
                  placeholder='username'
                  value={username}
                  onChange={e => setUsername(e.target.value)} />
                <button type="submit"
                  className='editSubmitButton'
                  onClick={() => editName('name')}>change</button>
              </label>
            </div>
            <div className="changeFullname">
              <label htmlFor="fullname">
                edit fullname:
                <input type="full name" name="fullname"
                  aria-label='change fullname'
                  className='fullname'
                  placeholder='fullname'
                  value={fullname}
                  onChange={e => setFullname(e.target.value)} />
              </label>
              <button type="button"
                className='editSubmitButton'
                onClick={() => editName('fullname')}>change</button>
            </div>
            <div className="pwdChange">
              <label htmlFor="passworrd">edit username:
                <input type="password" name="password"
                  aria-label='change password'
                  className='pwd'
                  placeholder='change password'
                  value={pwd}
                  onChange={e => setPwd(e.target.value)} />
                <button type="submit"
                  className='editSubmitButton'
                  onClick={(e) => changeEmailOrPassword(e, 'pwd')}>change</button>
              </label>
            </div>
            <div className="changeEmail">
              <label htmlFor="email">
                edit fullname:
                <input type="email" name="email"
                  aria-label='change email'
                  className='email'
                  placeholder='change email'
                  value={email}
                  onChange={e => setEmail(e.target.value)} />
              </label>
              <button type="button"
                className='editSubmitButton'
                onClick={(e) => changeEmailOrPassword(e, 'email')}>change</button>
            </div>

          </>
        }
      </div>
    </>
  )
}