import { React, useEffect, useState } from "react";
import "./CreatePost.css";
import { doc, setDoc, Timestamp } from "@firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uid2 from "uid2";

function CreatePost({userData}) {
    const [caption, setCaption] = useState("");
    const [isImg, setImg] = useState("");
    const handleChange = (e) => {
        setCaption(e.target.value);
    }
    
    function handleImg() {
        let v = document.getElementById("postImg").value;
        setImg(v)
    }
    
    const post = async () => {
        document.getElementById("post_button").disabled = true;
        const img = document.getElementById("postImg").files[0];
        var path = null;
        const uid = auth.currentUser.uid;
        var url;
        
        
        try{
        if (img != undefined) {
            
            path = `${new Date().getTime()}-${img.name}`;
            const imgRef = ref(storage, `post/${uid}/${path}`);
            
            const snapshot =  await uploadBytes(imgRef, img);
            url =  await getDownloadURL(ref(storage, `${snapshot.ref.fullPath}`));
        }else{
            url = null;
        }
        
        const uidd = uid2(20);

            setDoc(doc(db,"allposts",uidd), {
                    caption: caption,
                    path: path,
                    url: url,
                    pid:uidd,
                    uid:uid,
                    like: 0,
                    avatar:userData.avatar,
                    createdAt: Timestamp.fromDate(new Date())
                }).then(() => {
                    setCaption("");
                    document.getElementById("postImg").value = "";
                    setImg("");
                    url = null;
                    toast.success("Posted Successfully")
                }).catch(() => {
                    toast.error("Some error occured");
                })
        }
        catch{
            toast.error("Some error occured");
        }
        
    }

    useEffect(() => {
        
        let isMounted = true;
		if (isMounted) {
			if (caption != "" || isImg != "") {
                document.getElementById("post_button").disabled = false
            }
            else {
                document.getElementById("post_button").disabled = true
            }
		}
		return () => { isMounted = false };
    }, [caption, isImg])

    return (
        <>
            <div className="createpost">
                <div className="post">
                    <p>Create a post</p>
                    <button id="post_button" onClick={post} >Post</button>
                </div>
                <input type="text" placeholder="Post a caption" id="postCap" onChange={handleChange} value={caption} />
                <input type="file" accept="image/*" id="postImg" onChange={handleImg} />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
            />
        </>
    )
}

export default CreatePost;

