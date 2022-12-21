import React from "react";
import {Switch, Route,useHistory } from "react-router-dom";
import "./index.css";
import Profile from "./Pages/Profile.jsx";
import Home from "./Pages/Home.jsx";
import SignUp from "./components/Signup";
import LogIn from "./components/LogIn";
import Messages from "./Pages/Messages";
import FriendsPage from "./Pages/FriendsPage";
import { auth } from './firebase.js';
import { onAuthStateChanged } from "firebase/auth";
export default function App() {
	const history = useHistory();
    onAuthStateChanged(auth, (user) => {
        if (! user) {
          history.replace("/login");
        }})

	return (<>
				<Switch>
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/login" component={LogIn} />
					<Route exact path="/signup" component={SignUp}/>
					<Route exact path="/messages" component={Messages}/>
					<Route exact path="/friends" component={FriendsPage}/>
					<Route path="/" component={Home} />
				</Switch>
	</>)
}
