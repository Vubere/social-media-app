import { currentUser } from "../profileComponents/Header";
import defaultAvatar from '../../assets/defaultAvatar.jpg'
import backArrow from '../../assets/backArrow.svg'
import Avatar from "../Avatar";

export default function ChatHeader({ receiver }: { receiver: currentUser }) {
  return (
    <section className="header">
      <section className="userDetails">
        <span className="receiverImage"> 
          <Avatar id={receiver.userID}/>
        </span>
        <span className="receiverName">
          <p className="name">
            {receiver.username}
          </p>
        </span>
      </section>
      <span className="back">
        <img src={backArrow} alt="" height="25px" width="40px"/>
      </span>
    </section>
  )
}