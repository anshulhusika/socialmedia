import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, addDoc, getDoc, getDocs, where, query, DocumentReference } from "@firebase/firestore";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import ShowUser from './ShowUser';
import "./Suggestions.css"
import ShowRequest from './ShowRequest';
function Suggestions({ id_name }) {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeUser, setUser] = useState(null);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user.uid);
        }
    })

    const getUsers = async () => {
        const q = query(collection(db, "friends", activeUser, "received"), where("received", "==", true))
        const userQuery = query(collection(db, "users"), where("uid", "!=", activeUser))
        const docSnap = await getDocs(userQuery);
        const reqSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            setUsers((prev) => {
                return [...prev, doc.data()]
            })
        })
        reqSnap.forEach((doc) => {
            setRequests((prev) => {
                return [...prev, doc.data()]
            })
        })

    }

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            setUsers([])
            setRequests([])
            if (activeUser) {
                getUsers();
            }
        }
        return () => { isMounted = false };
    }, [activeUser])

    return (
        <>
            <div className="friend_suggestions" id={id_name}>
                {requests.length > 0 ? <h3>Requests Received</h3> : null}
                {

                    requests.map((val, i) => {
                        return <ShowRequest reqData={val} key={i} />
                    })
                }
                <h3>Add Friends</h3>
                {
                    users.map((val, i) => {
                        return <ShowUser usersData={val} key={i} />
                    })
                }


            </div>

        </>
    )
}

export default Suggestions
