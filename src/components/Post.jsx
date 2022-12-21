import React, { useEffect, useState } from "react";
import { collection, doc, setDoc, updateDoc, getDocs, addDoc, Timestamp, query, where, getDoc } from "@firebase/firestore";
import { auth, db } from "../firebase";
import Comment from "./Comment.jsx";
import LazyLoad from 'react-lazyload';

import "./Post.css"
export default function Post({ postData, avatar, userData }) {
	const { url, createdAt, like, caption, pid } = postData;
	const [liked, setLiked] = useState("");
	const [comment, setComment] = useState("");
	const [postComments, setComments] = useState([]);
	const [likeCount, setLikeCount] = useState(like);
	const [postUserData,setPostUserData] = useState([]);

	const getPostUserData = async ()=>{
		const data = await getDoc(doc(db,"users",postData.uid));
		if(data.exists()){
			setPostUserData(data.data())
		}
	}


	const checkIfLiked = async () => {
		const likeRef = collection(db, "allposts", pid, "likedby");
		const q = query(likeRef, where("user", "==", auth.currentUser.uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			setLiked(doc.id)
		});
	}

	const getComments = async () => {
		const querySnapshot = await getDocs(collection(db, "allposts", pid, "comments"));
		querySnapshot.forEach((doc) => {
			setComments((prev) => {
				return [...prev, doc.data()]
			})
		});
	}

	const handleComment = (e) => {
		setComment(e.target.value);
	}

	const likeit = async (e) => {
		const pid = e.target.dataset.pid;
		const currentUser = auth.currentUser.uid;
		if (liked) {
			setDoc(doc(db, "allposts", pid, "likedby", currentUser), {
				user: null
			}).then(() => {
				updateDoc(doc(db, "allposts", pid), {
					like: likeCount - 1
				})
				setLikeCount(likeCount - 1)
			})


			setLiked("")
		} else {
			setDoc(doc(db, "allposts", pid, "likedby", currentUser), {
				user: currentUser
			}).then(() => {
				updateDoc(doc(db, "allposts", pid), {
					like: likeCount + 1
				})
				setLikeCount(likeCount + 1)
			});

			setLiked(currentUser)
		}
	}

	const saveComment = async (e) => {
		const pid = e.target.dataset.pid;
		if (comment) {
			let data = {
				comment: comment,
				user: auth.currentUser.uid,
				createdAt: Timestamp.fromDate(new Date())
			}
			addDoc(collection(db, "allposts", pid, "comments"), data).then(() => {
				setComments((prev) => {
					return [...prev, data]
				})
				setComment("")
			})
		}
	}

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			getPostUserData()
			setComments([])
			checkIfLiked()
			getComments()
		}
		return () => { isMounted = false };
	}, [])



	return (<>
		<div className="post_wrapper" data-pid={pid}>
			<div className="user_details">
				<div className="u_img"><LazyLoad><img src={postUserData.avatar ? postUserData.avatar : avatar} alt="logo" /></LazyLoad></div>
				<p>{postUserData.name} <br />
					<small>{createdAt.toDate().toLocaleString('en-US')}</small>
				</p>
			</div>
			{caption ? <div className="caption">
				{caption}
			</div> : null}
			{url ? <img src={url} alt="image" className="post_image" /> : null}
			<div className="post_details">
				<div className="like">
					{likeCount} {likeCount > 1 ? "likes" : "like"}
				</div>
				<div className="like">
					{postComments.length} {postComments.length > 1 ? "comments" : "comment"}
				</div>
			</div>
			<div className="post_action">
				<div className="likebtn" onClick={likeit} data-pid={pid}>
					{liked ? <i className="fas fa-heart" data-pid={pid}></i> : <i className="far fa-heart" data-pid={pid}></i>}
				</div>
				<div className="commentbtn">
					<input type="text" placeholder="Write a comment" id="commentbar" value={comment} onChange={handleComment} autoComplete="off" />
					<div data-pid={pid} onClick={saveComment} ><i data-pid={pid} className="fas fa-arrow-up" id="postcomment" style={{ color: comment ? "#2b2b2b" : "#c0c1c2" }}></i></div>
				</div>
			</div>
			{postComments.length > 0 ?
				<div className="commentbox">
					{postComments.map((val, i) => {
						return <Comment commentData={val} key={i} />
					})}
				</div> : null}
		</div>
	</>)
}
