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
            {user ? 
                <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
            :
                <div id="header-btn-wrapper">
                    <Link to="/register" id="signin-btn-wrapper" className="btn btn-light">
                        Register
                    </Link>
                    <Link to="/signin" id="signin-btn-wrapper" className="btn btn-outline-info">
                        SignIn
                    </Link>
                </div>
            }
        </div>
    </header>
    )
}

export default Header