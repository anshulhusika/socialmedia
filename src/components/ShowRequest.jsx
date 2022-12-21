import React,{ useEffect,useState } from 'react'
import user from "../img/user.png";
import "./ShowRequest.css";
import { collection, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc } from "@firebase/firestore";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function ShowRequest({reqData}) {
    const [data,setData] = useState([]);
    const [reqState,setReqState] = useState("")
    const getData = async ()=>{
        const docSnap = await getDoc(doc(db,"users",reqData.uid))
        if (docSnap.exists()) {
            setData(docSnap.data())
          }
    }
    const confirmReq = async ()=>{
        setDoc(doc(db,"friends",reqData.uid,"friendlist",auth.currentUser.uid),{
            friends:true
        });
        setDoc(doc(db,"friends",auth.currentUser.uid,"friendlist",reqData.uid),{
            friends:true
        });
        deleteDoc(doc(db,"friends",auth.currentUser.uid,"received",reqData.uid))
        deleteDoc(doc(db,"friends",reqData.uid,"sent",auth.currentUser.uid))
        setReqState("Request Confirmed")
    }
    const removeReq = async ()=>{
        await deleteDoc(doc(db,"friends",reqData.uid,"sent",auth.currentUser.uid))
        await deleteDoc(doc(db,"friends",auth.currentUser.uid,"received",reqData.uid))
        setReqState("Request Removed")
    }
    useEffect(()=>{
        let isMounted = true;
		if (isMounted) {
            getData()
		}
		return () => { isMounted = false };
    },[])

    return (

        <>
            <div className="user_request" data-uid={data.uid}>
                <div className="user_info">
                    <div className="user_img">
                        <img src={data.avatar?data.avatar:user} alt="user image" />
                    </div>
                    <div className="username">
                    {data.name}
                    </div>
                </div>
                     {reqState?reqState:
                    <div className="actionbtns">
                            <button id="addfriend" onClick={confirmReq}>Confirm</button>
                            <button id="remove" onClick={removeReq}>Remove</button>
                    </div>
                        }
            </div>

        </>
    )
}

export default ShowRequest
{/* <button id="addfriend" onClick={confirmReq}>Confirm</button>
                        <button id="remove" onClick={removeReq}>Remove</button> */}