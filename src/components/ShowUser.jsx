import React, { useState,useEffect } from 'react'
import user from "../img/user.png";
import "./ShowUser.css";
import { collection, doc, getDoc, setDoc, addDoc, Timestamp, updateDoc } from "@firebase/firestore";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
// import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";

function ShowUser({ usersData }) {
    const [reqSent, setReq] = useState(false);
    const [activeUser, setUser] = useState(null);
    const [isNotFriend,setNotFriend] = useState(false);
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.uid);
        }})

    const checkFriend = async ()=>{
            const friendSnap = await getDoc(doc(db,"friends",activeUser,"friendlist",usersData.uid))
            friendSnap.exists()?setNotFriend(false):setNotFriend(true)
        }

    const checkReq = async () => {
        const sendReqRef = doc(db, "friends", activeUser, "sent", usersData.uid);
        const docSnap = await getDoc(sendReqRef);

        if (docSnap.exists()) {
            docSnap.data().sent?setReq(true):setReq(false)
        } else {
            setReq(false)
        }
    }

    const sendRequest = async (e) => {
        const uid = e.target.dataset.uid;
        const sendReqRef = doc(db, "friends", activeUser, "sent", uid);
        const receiveRef = doc(db, "friends", uid, "received", activeUser);
            if (reqSent) {
                setDoc(sendReqRef, {
                    uid: uid,
                    sent: false
                }).then(()=>{
                    setReq(false)
                })
                setDoc(receiveRef,{
                    uid: activeUser,
                    received: false
                })
            } else {
                setDoc(sendReqRef, {
                    uid: uid,
                    sent: true
                }).then(()=>{
                    setReq(true)
                })
                setDoc(receiveRef,{
                    uid: activeUser,
                    received: true
                })
            }
    }
    useEffect(()=>{
        let isMounted = true;
		if (isMounted) {
            if(activeUser){
                checkReq();
                checkFriend()
            }
		}
		return () => { isMounted = false };
    },[activeUser])
    return (
        <>{isNotFriend?
            <div className="user_suggested" data-uid={usersData.uid}>
                <div className="user_info">
                    <img src={usersData.avatar ? usersData.avatar : user} alt="user image" />
                    <div className="username">
                        {usersData.name}
                    </div>
                </div>
                <div className="actionbtn" data-uid={usersData.uid} onClick={sendRequest}>
                    {reqSent ? "Cancel Request" : "Add Friend"}
                </div>
            </div>:null}
        </>
    )
}

export default ShowUser
