import "./Comment.css";
import { doc, getDoc } from "@firebase/firestore";
import {db} from "../firebase";
import { useEffect, useState } from "react";
import imag from "../img/user.png"
const Comment = ({commentData}) => {

    const [user,setUser] = useState([])
    const getUserData = async ()=>{

        const data = await getDoc(doc(db,"users",commentData.user))
        if (data.exists()){
            setUser(data.data())
        }
    }
    useEffect(()=>{
        let isMounted = true;
		if (isMounted) {
            getUserData()
		}
		return () => { isMounted = false };
    },[])

    return (
        <div className="thecomment">
            <div className="userImg">
                <img src={user.avatar?user.avatar:imag} alt="user image" />
            </div>
            <div className="userInfo">
                <div className="userName">
                    {user?user.name:"userName"}
                </div>
                <div className="userComment">
                    {commentData.comment}
                </div>
            </div>
        </div>

    )
}

export default Comment

