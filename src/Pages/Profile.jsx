import {React,useEffect,useState} from 'react';
import Navbar from "../components/Navbar.jsx"
import Allfriends from "../components/Allfriends.jsx";
import Profileposts from '../components/Profileposts.jsx';
import Suggestions  from '../components/Suggestions.jsx';
import { auth, storage,db } from '../firebase.js';
import "./Profile.css";
import userImg from "../img/user.png"
import { getDoc,doc } from '@firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
function Profile() {
 const [userData, setuserData] = useState([]);
const [activeUser, setUser] = useState(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.uid);
        }})

    const getUserData = async ()=>{
        const snap = await getDoc(doc(db, "users", activeUser));
        if (snap) {
            setuserData(snap.data())
          }
    }

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            if (activeUser) {
                getUserData();
            }
        }
		return () => { isMounted = false };
    }, [activeUser])
    
    return (
        <>
        <Navbar/>
        <div className="project">
            <Suggestions id_name="hide1"/> 
            <Profileposts imag ={userImg} userData = {userData}/>
            <Allfriends id_name="hide2"/>
        </div>
        </>
    )
}

export default Profile;
