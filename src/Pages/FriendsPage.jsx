import React from 'react'
import Suggestions from "../components/Suggestions";
import Allfriends from "../components/Allfriends";
import Navbar from "../components/Navbar";
function FriendsPage() {
    const toggle = (e)=>{
        const target = e.target.id;
        const offtarget = document.getElementById(target).dataset.opposite
        document.getElementById(target).classList.add("active_toggle")
        document.getElementById(offtarget).classList.remove("active_toggle")
        if(target ==="myfriends"){
            document.getElementById("show1").style.display = "inline";
            document.getElementById("show2").style.display = "none"
        }
        else{
            document.getElementById("show1").style.display = "none";
            document.getElementById("show2").style.display = "inline"
        }

    }
    return (
        <>
            <Navbar />
            <div className="friends_page_wrapper">
                <div className="toggle_friends">
                    <span onClick={toggle} className="active_toggle" id="myfriends" data-opposite = "addfriends">My friends</span>
                    <span onClick={toggle} id="addfriends" data-opposite = "myfriends">Add Friends</span>
                </div>
                <Allfriends id_name="show1" />
                <Suggestions id_name="show2" />

            </div>
        </>
    )
}

export default FriendsPage;
