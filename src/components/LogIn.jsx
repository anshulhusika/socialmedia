import React from "react";
import { NavLink , useHistory} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore"; 
import {db} from "../firebase.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "./Logo.jsx"

export default function LogIn() {
  const history = useHistory();
  function signInWithEmailPassword() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid
        updateDoc(doc(db,"users",uid), {
            online:true
          });
        history.replace("/home")
      })
      .catch((error) => {
        let text = error.message
        toast.error(`${text.slice(9)}`)
      });
    }  
  return (<>
  <Logo />
      <div className="signup">
        <form >
          <h3>Log in to your account</h3>
          <div className="inputDetails" >
            <input type="email" name="email" id="email" placeholder="Enter your email" />
            <input type="password" name="password" id="password" className="pass" placeholder="Enter your Password"></input>
            <button type="button" className="signinbtn" onClick={signInWithEmailPassword}>Log In</button>
          </div>
          <div className="switch">
            <NavLink to="/signup">Create an account ?</NavLink>
          </div>
        </form>
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
  </>)
}

