import {useState} from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import '../../styles/login.css'

export default function LoginPage(){
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const response = await axios.post("http://localhost:3000/login", {
            username: Username,
            password: Password,
        }); 
        if(response.data.success){

            localStorage.setItem("userRole", response.data.role);
            
            if(response.data.role === "admin"){
                navigate("/admin");
            }
            else if(response.data.role === "staff"){
                navigate("/staff");
            }
            else if(response.data.role === "resident"){
                navigate("/resident");
            }
            else{
                console.log("Invalid!");
            }
        }
    }
    return(
        <div className="login-container">
            <form className="login-card" onSubmit={handleLogin}>
                <h1>Login Page</h1>
                <input type="text" name="username" id="username" placeholder="Username" 
                value = {Username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" name="password" id="password" placeholder="Password" 
                value = {Password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}