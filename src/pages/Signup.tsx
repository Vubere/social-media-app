import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { addDoc, collection, setDoc, doc} from 'firebase/firestore'

import * as routes from '../constants/routes'

import { db } from '../main'

import { useAppDispatch } from '../app/hooks'

import { doesUserNameExist } from '../helpers/helpers'

function Signup() {
  const [email, setEmail] = useState('')
  const [fullName, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  
  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault()
    try{
      const userExist = await doesUserNameExist(username)

      const auth = getAuth()
      if(!userExist){
        const userCredential = await createUserWithEmailAndPassword(auth, email, pwd)
        
        if(auth.currentUser!==null)
          updateProfile(auth.currentUser,{
            displayName: username,
            photoURL: ''
          })
          const docRef = await doc(db, 'users', userCredential.user.uid)
         await setDoc(docRef, {
            fullName,
            userID: userCredential.user.uid,
            email,
            avatarUrl:"",
            username,
            followers: [],
            following: [],
            likes: [],
            messages: [],
            dateCreated: Date.now()
          })
          navigate(routes.login)
      }else throw({message: 'username is taken'})
    }
    catch(err:any){
      setError(err.message)
      setEmail('')
      setFullname('')
      setUsername('')
      setPwd('')
      setConfirmPwd('')
    }
    
  }
  return (
    <div className="login">
      <h1><img src="./src/assets/instalogo.png" alt="instagram logo" /></h1>
      <form onSubmit={async(e)=>handleLogin(e)} className='login'>
        {error&&<div className='err'>{error}</div>}
        <input type="email" name="email"
          id="email" aria-label="enter your email"
          placeholder="enter email" value={email}
          onChange={({ target }) => setEmail(target.value)} />
          <input type="fullname" name="fullname"
            id="fullname" aria-label="enter your full name"
            placeholder="enter full name" value={fullName}
            onChange={({ target }) => setFullname(target.value)} />
        <input type="username" name="username"
          id="username" aria-label="enter your username"
          placeholder="enter username" value={username}
          onChange={({ target }) => setUsername(target.value)} />
        <input type="password" name="password"
          id="password" aria-label="enter password"
          placeholder="enter password" value={pwd}
          onChange={({ target }) => setPwd(target.value)} />
        <input type="password" name="password"
          id="confirmpassword" aria-label="confirm password"
          placeholder="confirm password" value={confirmPwd}
          onChange={({ target }) => setConfirmPwd(target.value)} />
        <button type="submit" value="Sign up" className="submit">sign up</button>
      </form>
      <p>don't have an account? <Link to={routes.login}>log in</Link></p>
    </div>)
}
export default Signup