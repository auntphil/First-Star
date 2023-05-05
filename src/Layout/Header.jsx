import { Link, useNavigate  } from "react-router-dom"
import { logoutUser } from "../utils/appwrite"

const Header = (props) => {    
    const { user, setUser } = props
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        .then( response => {
            setUser(null)
            navigate('/')
        })
        .catch( error => {
            console.log(error)
        })
    }

    return(
    <header className="App-header">
        <div className='title'>
            <a href='/' className="boringLink white">
                First Star
            </a>
        </div>
        <div id="userHeader">
        <span id="user">{user?user.name:''}</span>
            {user ? <button onClick={handleLogout}>Logout</button> : <Link to="/signin" >Sign In</Link>}
        </div>
    </header>
    )
}

export default Header