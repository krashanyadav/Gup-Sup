import Navbar from "../components/Navbar"
import ChatPage from "./ChatPage"
// import "../styles/home.css"
import {useState} from "react"
import AddContactModal from "../components/addContactModel"

function Home(){


return(
    <div>
        <Navbar/>
        <ChatPage/>
    </div>
)

}

export default Home