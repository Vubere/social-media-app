import { currentUser } from "../profileComponents/Header";
import defaultAvatar from '../../assets/defaultAvatar.jpg'
import backArrow from '../../assets/backArrow.svg'

export default function ChatHeader({ receiver }: { receiver: currentUser }) {
  return (
    <section className="header">
      <section className="userDetails">
        <span className="receiverImage">
          <img src={receiver.avatarUrl!=''?receiver.avatarUrl:defaultAvatar} alt="receiver image" width="40px" height='40px' />
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