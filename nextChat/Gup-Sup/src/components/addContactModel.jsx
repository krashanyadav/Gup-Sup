import { useState } from "react"
import { addContact } from "../services/contactService"
import "../styles/addContact.css"

function AddContactModal({close}){

const [email,setEmail] = useState("")
const [loading,setLoading] = useState(false)

const submit = async()=>{

if(!email) return

try{

setLoading(true)

await addContact({email})
alert("user added in your chats")
close()

}catch(err){

alert("User not found")

}

setLoading(false)

}

return(

<div className="modal-overlay">

<div className="modal">

<h3>Add Contact</h3>

<input
placeholder="Enter user email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<div className="modal-buttons">

<button onClick={close}>
Cancel
</button>

<button onClick={submit}>
{loading ? "Adding..." : "Add"}
</button>

</div>

</div>

</div>

)

}

export default AddContactModal