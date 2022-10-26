import { useState } from 'react'

import {Link, useNavigate} from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import * as routes from '../constants/routes'



function Login() {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [rem, setRem] = useState<boolean>(false)
  const disabled = email == '' || pwd.length < 6

  const navigate = useNavigate()

  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault()
    
    const auth = getAuth()
    try{
      if(disabled){
        throw 'login details incomplete'
      }
      await signInWithEmailAndPassword(auth, email, pwd)
      navigate(routes.dashboard)
    }catch(err:any){
      setError(err.message)
      setEmail('')
      setPwd('')
    }

  }
  return (
    <div className="login">
      <h1><img src="./src/assets/instalogo.png" alt="instagram logo" /></h1>
      <form onSubmit={handleLogin} className='login'>
        {error && <div className='err'>{error}</div>}
        <input type="email" name="email" 
        id="email" aria-label="enter your email" 
        placeholder="enter your email" value={email}
         onChange={({ target }) => setEmail(target.value)} />
        <input type="password" name="password" 
        id="password" aria-label="enter your password"
         placeholder="enter your password"  value={pwd} 
          onChange={({ target }) => setPwd(target.value)} /> 
        <button type="submit" value="Log in" className="submit" >login</button>
        <label htmlFor="check">remember me?</label>
        <input type="checkbox" name="check" 
        id="check" aria-label="remember login?"
         placeholder="enter your password"  value={`${rem}`} 
          onChange={() => setRem(!rem)} />
      </form>
      <p>don't have an account? <Link to={routes.signup}>sign up</Link></p>
    </div>)
}
export default Login