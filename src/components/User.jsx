import React, { useEffect, useState } from "react";
import Img from "../img/user.png";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");
  const [isfriend, setFriend] = useState(false)
  const checkFriend = async () => {
    const friendSnap = await getDoc(doc(db, "friends", user1, "friendlist", user2))
    friendSnap.exists() ? setFriend(true) : setFriend(false)
  }
  useEffect(() => {
    checkFriend()
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>{isfriend?
    <div>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <div className="name_img">
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={user.avatar || Img} alt="avatar" className="avatar" />
                <h4>{user.name}</h4></div>
              <div
                className={`user_status ${user.online ? "online" : "offline"}`}
              ></div>
            </div>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {data.media?"image file":data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      <div className="sm_name"style={{ fontWeight:"600" }}>{user.name}</div>
      </div>
      </div>:null}
    </>

  );
};

export default User;
