import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, addDoc, Timestamp } from "@firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL,deleteObject, ref, uploadBytes } from "@firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ProfileCard.css";
function ProfileCard({img,userData}) { 
    const [cimg,setcimg] = useState("");

    const changeName = async()=>{
       const newname =  prompt("Enter new name");
       if(newname){
           updateDoc(doc(db,"users",auth.currentUser.uid),{
               name:newname
           }).then(()=>{
                toast.success("Name Changed Succesfully")
           })
       }

    }
    const changeProfile =  async ()=>{
        if(cimg){
            toast.info("Uploading")
            var path = null;
            const uid = auth.currentUser.uid;
            path = `${new Date().getTime()}-${cimg.name}`;
            const imgRef = ref(storage, `avatars/${path}`);
            
            const snapshot =  await uploadBytes(imgRef, cimg);
            
            var url =  await getDownloadURL(ref(storage, `${snapshot.ref.fullPath}`))
            
            updateDoc(doc(db,"users",uid), {
                    avatar:url,
                    path:snapshot.ref.fullPath
                }).then(() => {
                    document.getElementById("changeProfileImg").value = "";
                    url = null;
                    path = null;
                    toast.success("Profile Updated Sucessfully! Refresh to see changes")
                }).catch(() => {
                    toast.error("Some error occured")
                })
        }

    }

    const deleteImg = async ()=>{
        toast.info("Deleting !!")
        const {path,uid} = userData;
        const imgRef = ref(storage, path);
        deleteObject(imgRef).then(() => {
            setcimg("")
            updateDoc(doc(db,"users",uid), {
                avatar:"",
                path:""
            }).then(()=>{
                toast.success("Profile Picture Deleted! Refresh to see changes")
            })
          }).catch(() => {
            toast.error("Error Deleting Profile Picture")
          });

    }
    useEffect(()=>{
        let isMounted = true;
		if (isMounted) {
            changeProfile()
		}
		return () => { isMounted = false };
    },[cimg])

    return (
        <div className="user_profile">
            <div className="profile_name">
                {userData.name} 
                <i 
                onClick={changeName}
                className="fas fa-edit" 
                style={{marginLeft:"10px",fontSize:"16px",cursor:"pointer"}}
                ></i>
            </div>
            <div className="profile_img">
                <img src={userData.avatar? userData.avatar:img} alt="avatar" />
                <div className="changeimg">
                    <label htmlFor="changeProfileImg"><i className="fas fa-edit"></i></label>
                    <input type="file" accept="image/*" id="changeProfileImg" onChange={(e)=> setcimg(e.target.files[0])}/>
                    {userData.avatar?<i className="fas fa-trash" onClick={deleteImg}></i>:null}
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;
