import { useEffect, useState } from "react"

import loading from "../assets/loading.svg"

export default function Loading(){
  const [tookTooLong, setTookToolong] = useState(false)
  

  useEffect(()=>{
    if(!tookTooLong){
      setTimeout(()=>{
        setTookToolong(true)
      }, 6000)
    }
  },[])
  return (
    <>
      {!tookTooLong ? (
        <div className="loadingComponent">
          <img width='40px' src={loading} alt="" />
        </div>
      ) : (
        <div className="loadingTookTooLong">
          Loading took too long, check your internet and try again
          <button onClick={() => window.location.replace(window.location.origin+window.location.pathname)}>retry</button>
        </div>
      )}
    </>
  );
}