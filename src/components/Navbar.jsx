import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useHistory } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import userImg from "../img/user.png";
import "./Navbar.css";
import { auth, db } from '../firebase';
import { doc, updateDoc, getDocs, collection, setDoc, orderBy, query, startAt, endAt,limit } from "firebase/firestore";
import { toast } from 'react-toastify';
function Navbar() {
    const history = useHistory();
    const [searchResult, setResult] = useState([]);

    async function logOut() {
        const res = window.confirm("Do you want to log out ?")
        if (res) {
            const uid = auth.currentUser.uid
            updateDoc(doc(db, "users", uid), {
                online: false
            }).then(() => {
                signOut(auth)
                history.replace("/login");
            }
            );
        }
    }

    const doSearch = async () => {
        var search = document.getElementById("search").value;
        if(search){
            search = search.toLowerCase()
            setResult([])
            const q = query(collection(db, "users"), orderBy("name"), startAt(search), endAt(search + "\uf8ff"),limit(10)
            )
            const uset = await getDocs(q)
            uset.forEach((docs) => {
                if (docs.data().uid != auth.currentUser.uid) {
                    setResult((prev) => {
                        return [...prev, docs.data()]
                    })
                }
            })
            document.getElementById("searchresult").style.display = "block";
        }
    }

    const close = () => {
        setResult([])
        document.getElementById("searchresult").style.display = "none";
    }


    const sendRequest = async (e) => {
        const uid = e.target.dataset.uid;
        const sendReqRef = doc(db, "friends", auth.currentUser.uid, "sent", uid);
        const receiveRef = doc(db, "friends", uid, "received", auth.currentUser.uid);
        try{setDoc(sendReqRef, {
                uid: uid,
                sent: true
            })
            setDoc(receiveRef,{
                uid: auth.currentUser.uid,
                received: true
            }).then(()=>{
                toast.success("Request Sent")
            })
        }
            catch{
                toast.error("Some Error occured")
            }
        }

    return (

        <>
            <nav id="navbar">
                <div className="pages">
                    <ul>
                        <li><NavLink to="/home" activeClassName="active"><i className="fas fa-home"></i></NavLink></li>
                        <li><NavLink to="/profile" activeClassName="active"><i className="fas fa-user-tie"></i></NavLink></li>
                        <li><NavLink to="/messages" activeClassName="active"><i className="fas fa-comments"></i></NavLink></li>
                        <li className="to_friends_page"><NavLink to="/friends" activeClassName="active"><i className="fas fa-user-friends" id="friends"></i></NavLink></li> 
                        <li onClick={logOut}><i className="fas fa-sign-out-alt"></i></li>
                    </ul>
                </div>
                <div className="logo">
                    <span>Soci</span>Allies
                </div>
                <div className="search">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search a user"
                    />
                    <i onClick={doSearch} className="fas fa-search"></i>
                </div>
            </nav>
            <div id="searchresult" >
                <div className="close" onClick={close}><i className="fas fa-window-close"></i></div>
                {searchResult.length == 0 ? "No Result Found" : null}
                {searchResult.map((val) => {
                    return <div className="user" key={val.uid}>
                        <img src={val.avatar?val.avatar:userImg} alt="user image" style={{ width: "50px", height: "50px" }} />
                        <div className="name">{val.name}</div>
                        <button data-uid={val.uid} onClick={sendRequest}>Add to friends</button>
                    </div>
                })}
            </div>
        </>
    )
}

export default Navbar;
