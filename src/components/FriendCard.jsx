import { getDoc, doc, deleteDoc } from '@firebase/firestore';
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import userImg from "../img/user.png";
import "./FriendCard.css"
import { db, auth } from "../firebase";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FriendCard({ val }) {
    const [user, setUser] = useState([])
    const getData = async () => {
        const data = await getDoc(doc(db, "users", val))
        if (data.exists()) {
            setUser(data.data())
        }
    }
    const unfriend = () => {
        const res = window.confirm("Delete from friends")
        if (res) {
            
            deleteDoc(doc(db, "friends", auth.currentUser.uid, "friendlist", val)).then(() => {
                deleteDoc(doc(db, "friends",val, "friendlist", auth.currentUser.uid)).then(()=>{
                    toast.success("Friend Deleted")
                })
            }).catch(()=>{
                toast.success("Error Occured !! Please Refresh")
            })
        }
    }
    const toMessage = ()=>{

    }
    useEffect(() => {
        let isMounted = true;
		if (isMounted) {
            setUser([])
            getData()
		}
		return () => { isMounted = false };
    }, [])
    return (
        <>
            <div className="friendCard">
                <div  className="friend_detail">
                    <div className="prof_image">
                        <img src={user.avatar ? user.avatar : userImg} alt="user img" />
                    </div>
                    <div className="frnd_name">
                        {user.name}
                    </div>
                </div>
                <div className="btns">
                    <button onClick={unfriend} className="unfriend">Unfriend</button>
                    <button className="to_message"><NavLink to="/messages">Message</NavLink></button>
                </div>
            </div>
        </>
    )
}

export default FriendCard;
