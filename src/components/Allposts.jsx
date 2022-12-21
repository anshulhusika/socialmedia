import {React, useEffect, useState }from 'react'
import CreatePost from "./CreatePost.jsx";
import Post from "./Post.jsx";
import { collection, getDocs} from '@firebase/firestore';
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";

function Profileposts({imag,userData}) {
    const [posts, setPosts] = useState([]);
    const [activeUser, setUser] = useState(null);
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.uid);
        }})

    const getPosts = async () =>{
        const docRef = collection(db, "allposts");;
        const docSnap = await getDocs(docRef);
        if (docSnap) {
            docSnap.forEach((doc) => {
                setPosts((prev)=>{
                    return [...prev ,doc.data()]
                })
              });  
          }
    }

    useEffect(()=>{
		let isMounted = true;
		if (isMounted) {
			setPosts([])
			if (activeUser){
			   getPosts();
			}
		}
		return () => { isMounted = false };

    },[activeUser])

    return (
        <>
            <div className="allposts_wrapper">
                <CreatePost userData = {userData}/>
                {
                    posts.map((val,i)=>{
                        return <Post postData={val} key = {i} avatar = {imag} userData={userData}/>
                    })
                }
            </div>
        </>
    )
}

export default Profileposts;
