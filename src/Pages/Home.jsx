import { React, useEffect, useState } from 'react'
import Allposts from "../components/Allposts.jsx";
import Navbar from "../components/Navbar.jsx";
import Allfriends from "../components/Allfriends";
import Suggestions from '../components/Suggestions.jsx';
import { auth, storage, db } from '../firebase.js';
import userImg from "../img/user.png"
import { getDoc, doc } from '@firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

function Home() {
    const [userData, setuserData] = useState([]);
    const [activeUser, setUser] = useState(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user.uid);
        }
    })

    const getUserData = async () => {
        const snap = await getDoc(doc(db, "users", activeUser));
        if (snap) {
            setuserData(snap.data())
        }
    }

    useEffect(() => {
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
        <Navbar />
        <div className="project">
            <Suggestions id_name="hide1" />
            <Allposts imag={userImg} userData={userData} />
            <Allfriends  id_name="hide2"/>
        </div>
    </>
)
}

export default Home
