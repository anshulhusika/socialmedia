import React from "react";
import { db } from "../firebase.js";
import { Link, useHistory } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Timestamp } from "@firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "./Logo.jsx"

const auth = getAuth();
export default function SignUp() {
  const history = useHistory();

  async function signUpWithEmailPassword() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const name = document.getElementById("name").value.toLowerCase();
    if (!email || !password || !name || !confirm){
      toast.error(`Please enter all fields`)
    }
    else if (confirm == password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          document.getElementById("confirm").value = "";
          setDoc(doc(db, "users", `${userCredential.user.uid}`), {
            name: name,
            email: email,
            avatar:"",
            path:"",
            uid: userCredential.user.uid,
            createdAt: Timestamp.fromDate(new Date()),
            online: true
          });
          history.replace("/home")
        })
        .catch((error) => {
          const text = error.message
          toast.error(`${text.slice(9)}`)
        });
    }
    else{
      toast.error(`Passwords do not match`)
    }
  }

  return <>
  <Logo/>
    <div className="signup">
      <form >
        <h3>Sign Up Here</h3>

        <div className="inputDetails" >
          <input type="text" name="name" id="name" placeholder="Full Name" />
          <input type="email" name="email" id="email" placeholder="Enter your email" />
          <input type="password" name="password" id="password" className="pass" placeholder="Enter your Password"></input>
          <input type="password" name="confirm" id="confirm" className="pass" placeholder="Confirm Password"></input>
          <button type="button" value="Submit" className="signupbtn" onClick={signUpWithEmailPassword}>Sign up</button>
        </div>
        <div className="switch">
          <Link to="/login">Already a user ?</Link>
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
      </form>
    </div>
  </>
}
